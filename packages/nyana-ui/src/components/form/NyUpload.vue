<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import type { NyUploadFile } from './uploadTypes'

const props = withDefaults(
  defineProps<{
    accept?: string
    multiple?: boolean
    maxCount?: number
    maxSize?: number
    drag?: boolean
    disabled?: boolean
    hint?: string
    listType?: 'text' | 'picture'
  }>(),
  {
    accept: undefined,
    multiple: true,
    maxCount: 5,
    maxSize: 5,
    drag: false,
    disabled: false,
    hint: '',
    listType: 'text',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: NyUploadFile[]): void
  (event: 'select', payload: File[]): void
  (event: 'remove', payload: NyUploadFile): void
  (event: 'exceed', payload: { type: 'count' | 'size'; files: File[] }): void
}>()

const files = defineModel<NyUploadFile[]>('files', { default: () => [] })

const inputRef = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

const maxSizeBytes = computed(() => props.maxSize * 1024 * 1024)

const entryKeys = new WeakMap<NyUploadFile, number>()
let entrySeed = 0

const previewUrls = new Set<string>()

const tips = computed(() => {
  const parts: string[] = []

  if (props.accept) {
    parts.push(`支持 ${props.accept}`)
  }

  parts.push(`单个不超过 ${props.maxSize} MB`)

  if (props.multiple) {
    parts.push(`最多 ${props.maxCount} 个`)
  }

  return parts.join(' · ')
})

function fileKey(file: NyUploadFile) {
  const existed = entryKeys.get(file)

  if (existed !== undefined) {
    return existed
  }

  entrySeed += 1
  entryKeys.set(file, entrySeed)

  return entrySeed
}

function isImage(file: NyUploadFile) {
  return file.type.startsWith('image/')
}

function formatSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function matchAccept(file: File) {
  if (!props.accept) {
    return true
  }

  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  return props.accept.split(',').some((item) => {
    const rule = item.trim().toLowerCase()

    if (!rule) {
      return false
    }

    if (rule.startsWith('.')) {
      return name.endsWith(rule)
    }

    if (rule.endsWith('/*')) {
      return type.startsWith(rule.slice(0, -1))
    }

    return type === rule
  })
}

function createPreview(file: File) {
  if (props.listType !== 'picture' || !file.type.startsWith('image/')) {
    return undefined
  }

  const url = URL.createObjectURL(file)

  previewUrls.add(url)

  return url
}

function releasePreview(file: NyUploadFile) {
  if (!file.url || !previewUrls.has(file.url)) {
    return
  }

  URL.revokeObjectURL(file.url)
  previewUrls.delete(file.url)
}

function toEntry(file: File, status: NyUploadFile['status'], message?: string, url?: string) {
  const entry: NyUploadFile = { name: file.name, size: file.size, type: file.type, status }

  if (message) {
    entry.message = message
  }

  if (url) {
    entry.url = url
  }

  return entry
}

function addFiles(list: File[]) {
  if (props.disabled || !list.length) {
    return
  }

  const picked = props.multiple ? list : list.slice(0, 1)
  const added: NyUploadFile[] = []
  const accepted: File[] = []
  const overflow: File[] = []
  const oversize: File[] = []

  picked.forEach((file) => {
    if (files.value.length + added.length >= props.maxCount) {
      overflow.push(file)
      return
    }

    accepted.push(file)

    if (file.size > maxSizeBytes.value) {
      oversize.push(file)
      added.push(toEntry(file, 'error', `文件大小超过 ${props.maxSize} MB`))
      return
    }

    if (!matchAccept(file)) {
      added.push(toEntry(file, 'error', `文件类型不支持, 只接受 ${props.accept}`))
      return
    }

    added.push(toEntry(file, 'success', undefined, createPreview(file)))
  })

  if (added.length) {
    const next = [...files.value, ...added]

    files.value = next
    emit('select', accepted)
    emit('change', next)
  }

  if (oversize.length) {
    emit('exceed', { type: 'size', files: oversize })
  }

  if (overflow.length) {
    emit('exceed', { type: 'count', files: overflow })
  }
}

function removeEntry(file: NyUploadFile) {
  const next = files.value.filter((item) => item !== file)

  files.value = next
  releasePreview(file)
  emit('remove', file)
  emit('change', next)
}

function clear() {
  files.value.forEach(releasePreview)

  files.value = []
  emit('change', files.value)
}

function open() {
  if (props.disabled) {
    return
  }

  inputRef.value?.click()
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement

  addFiles(Array.from(target.files ?? []))

  target.value = ''
}

function onDragOver(event: DragEvent) {
  if (props.disabled) {
    return
  }

  event.preventDefault()
  dragging.value = true
}

function onDragLeave(event: DragEvent) {
  const target = event.currentTarget as HTMLElement | null
  const related = event.relatedTarget as Node | null

  if (target && related && target.contains(related)) {
    return
  }

  dragging.value = false
}

function onDrop(event: DragEvent) {
  if (props.disabled) {
    return
  }

  event.preventDefault()
  dragging.value = false
  addFiles(Array.from(event.dataTransfer?.files ?? []))
}

onBeforeUnmount(() => {
  previewUrls.forEach((url) => URL.revokeObjectURL(url))
  previewUrls.clear()
})

defineExpose({ clear, open })
</script>

<template>
  <div class="ny-upload" :class="[`ny-upload--${listType}`, { 'is-disabled': disabled }]">
    <div
      v-if="drag"
      class="ny-upload__drop"
      :class="{ 'is-dragging': dragging, 'is-disabled': disabled }"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled || undefined"
      :aria-label="hint || '点击或拖拽文件到此处'"
      @click="open"
      @keydown.enter.prevent="open"
      @keydown.space.prevent="open"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <NyIcon class="ny-upload__drop-icon" name="upload" :size="26" />
      <span class="ny-upload__drop-text">{{ hint || '点击或拖拽文件到此处' }}</span>
      <span class="ny-upload__drop-tip">{{ tips }}</span>
    </div>

    <button v-else class="ny-upload__trigger" type="button" :disabled="disabled" @click="open">
      <NyIcon name="upload" :size="15" />
      <span>{{ hint || '选择文件' }}</span>
    </button>

    <input
      ref="inputRef"
      class="ny-sr-only"
      type="file"
      tabindex="-1"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onInputChange"
    />

    <ul v-if="files.length" class="ny-upload__list">
      <li v-for="file in files" :key="fileKey(file)" class="ny-upload__item" :class="`is-${file.status}`">
        <span v-if="listType === 'picture'" class="ny-upload__thumb">
          <img v-if="file.url && isImage(file)" :src="file.url" :alt="file.name" />
          <NyIcon v-else name="file" :size="18" />
        </span>

        <span class="ny-upload__info">
          <span class="ny-upload__name" :title="file.name">{{ file.name }}</span>

          <span class="ny-upload__meta">
            <span>{{ formatSize(file.size) }}</span>
            <span v-if="file.message" class="ny-upload__message">{{ file.message }}</span>
          </span>
        </span>

        <NyIcon v-if="file.status === 'success'" class="ny-upload__state" name="check-circle" :size="15" />
        <NyIcon v-else-if="file.status === 'error'" class="ny-upload__state" name="close-circle" :size="15" />

        <button
          class="ny-upload__remove"
          type="button"
          :title="`移除 ${file.name}`"
          :aria-label="`移除 ${file.name}`"
          @click="removeEntry(file)"
        >
          <NyIcon name="close" :size="13" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.ny-upload {
  display: flex;
  flex-direction: column;
  gap: var(--ny-space-3);
  width: 100%;
}

.ny-upload__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  height: var(--ny-control-height-md);
  padding: 0 16px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface);
  color: var(--ny-text);
  font-size: var(--ny-font-size-md);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover:not(:disabled) {
    border-color: var(--ny-primary);
    color: var(--ny-primary-text);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &:disabled {
    background: var(--ny-surface-2);
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}

.ny-upload__drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ny-space-2);
  padding: var(--ny-space-6) var(--ny-space-4);
  border: 1px dashed var(--ny-border-strong);
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface-2);
  color: var(--ny-text-sub);
  text-align: center;
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover:not(.is-disabled),
  &.is-dragging {
    border-color: var(--ny-primary);
    background: var(--ny-primary-soft);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--ny-primary);
    box-shadow: var(--ny-shadow-focus);
  }

  &.is-disabled {
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}

.ny-upload__drop-icon {
  color: var(--ny-primary);
}

.ny-upload__drop-text {
  color: var(--ny-text);
  font-size: var(--ny-font-size-md);
}

.ny-upload__drop-tip {
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
}

.ny-upload__list {
  display: flex;
  flex-direction: column;
  gap: var(--ny-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ny-upload__item {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  padding: var(--ny-space-2) var(--ny-space-3);
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface);
  transition: border-color var(--ny-transition-fast);

  &:hover {
    border-color: var(--ny-border-strong);
  }

  &.is-error {
    border-color: var(--ny-danger-soft);
  }
}

.ny-upload__thumb {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--ny-radius-xs);
  background: var(--ny-surface-3);
  color: var(--ny-text-muted);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.ny-upload__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ny-upload__name {
  color: var(--ny-text);
  font-size: var(--ny-font-size-md);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ny-upload__meta {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
}

.ny-upload__message {
  color: var(--ny-danger-text);
}

.ny-upload__state {
  flex: none;
  color: var(--ny-success);
}

.ny-upload__item.is-error .ny-upload__state {
  color: var(--ny-danger);
}

.ny-upload__remove {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: var(--ny-radius-xs);
  background: transparent;
  color: var(--ny-text-muted);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover {
    background: var(--ny-danger-soft);
    color: var(--ny-danger);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }
}
</style>
