<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch, type CSSProperties } from 'vue'

import NyIcon from '../icon/NyIcon.vue'
import NyInputShell from '../input/NyInputShell.vue'

import { usePopup } from '../../composables/usePopup'
import type { NySize, NyVariant } from '../../types'

const props = withDefaults(
  defineProps<{
    options: { value: string; label: string; icon?: string }[]
    rows?: number
    autosize?: boolean
    prefix?: string
    placeholder?: string
    size?: NySize
    variant?: NyVariant
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    filterable?: boolean
    maxLength?: number
    showCount?: boolean
    emptyText?: string
  }>(),
  {
    rows: 3,
    autosize: false,
    prefix: '@',
    placeholder: '',
    size: 'md',
    variant: 'outline',
    disabled: false,
    readonly: false,
    invalid: false,
    filterable: true,
    maxLength: undefined,
    showCount: false,
    emptyText: '无匹配成员',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string): void
  (event: 'select', payload: { value: string; label: string }): void
  (event: 'search', payload: string): void
}>()

const model = defineModel<string>({ default: '' })

const panelOpen = ref(false)
const focused = ref(false)
const keyword = ref('')
const mentionStart = ref(0)
const activeIndex = ref(-1)

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const panelId = useId()

const maxRows = 8

const ringVisible = computed(() => focused.value || panelOpen.value)

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const mentionPattern = computed(() => new RegExp(`${escapeRegExp(props.prefix)}([^${escapeRegExp(props.prefix)}\\s]*)$`))

const visibleOptions = computed(() => {
  const text = props.filterable ? keyword.value.trim().toLowerCase() : ''

  if (!text) {
    return props.options
  }

  return props.options.filter(
    (option) =>
      option.label.toLowerCase().includes(text) || option.value.toLowerCase().includes(text),
  )
})

const countText = computed(() => (props.maxLength ? `${model.value.length} / ${props.maxLength}` : `${model.value.length}`))

const { style } = usePopup({
  open: panelOpen,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => 'bottom-start',
  offset: () => 6,
  matchWidth: () => false,
  onOutside: () => closePanel(),
  onEscape: () => closePanel(),
})

function firstEnabledIndex() {
  return visibleOptions.value.length ? 0 : -1
}

function openPanel() {
  if (props.disabled || props.readonly) {
    return
  }

  panelOpen.value = true
  activeIndex.value = firstEnabledIndex()
}

function closePanel() {
  if (!panelOpen.value) {
    return
  }

  panelOpen.value = false
  keyword.value = ''
  activeIndex.value = -1
}

function syncMention() {
  const textarea = textareaRef.value

  if (!textarea || props.disabled || props.readonly) {
    closePanel()
    return
  }

  const caret = textarea.selectionStart ?? 0
  const before = textarea.value.slice(0, caret)
  const match = before.match(mentionPattern.value)

  if (!match) {
    closePanel()
    return
  }

  keyword.value = match[1]
  mentionStart.value = before.length - match[0].length
  openPanel()
}

function move(step: 1 | -1) {
  const total = visibleOptions.value.length

  if (!total) {
    return
  }

  const from = activeIndex.value < 0 ? (step === 1 ? -1 : 0) : activeIndex.value

  activeIndex.value = (from + step + total) % total
}

async function scrollActiveIntoView() {
  await nextTick()
  panelRef.value?.querySelector<HTMLElement>('.is-active')?.scrollIntoView({ block: 'nearest' })
}

watch(activeIndex, () => {
  scrollActiveIntoView()
})

function insert(option: { value: string; label: string }) {
  const textarea = textareaRef.value

  if (!textarea) {
    return
  }

  const current = textarea.value
  const caret = textarea.selectionStart ?? current.length
  const inserted = `${props.prefix}${option.label} `
  const next = current.slice(0, mentionStart.value) + inserted + current.slice(caret)

  model.value = next
  emit('change', next)
  emit('select', { value: option.value, label: option.label })
  closePanel()

  nextTick(() => {
    const position = mentionStart.value + inserted.length

    textarea.focus()
    textarea.setSelectionRange(position, position)
    resizeToContent()
  })
}

function resizeToContent() {
  const element = textareaRef.value

  if (!element || !props.autosize) {
    return
  }

  const styles = window.getComputedStyle(element)
  const lineHeight = Number.parseFloat(styles.lineHeight) || 21
  const padding =
    Number.parseFloat(styles.paddingTop) +
    Number.parseFloat(styles.paddingBottom) +
    Number.parseFloat(styles.borderTopWidth) +
    Number.parseFloat(styles.borderBottomWidth)

  const min = props.rows * lineHeight + padding
  const max = maxRows * lineHeight + padding

  element.style.height = 'auto'
  element.style.height = `${Math.min(Math.max(element.scrollHeight, min), max)}px`
  element.style.overflowY = element.scrollHeight > max ? 'auto' : 'hidden'
}

const textareaStyle = computed<CSSProperties>(() => ({
  resize: props.autosize ? 'none' : 'vertical',
  lineHeight: '1.6',
}))

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const next = props.maxLength === undefined ? target.value : target.value.slice(0, props.maxLength)

  if (next !== target.value) {
    target.value = next
  }

  model.value = next
  emit('change', next)

  syncMention()

  if (panelOpen.value) {
    emit('search', keyword.value)
  }

  resizeToContent()
}

function onKeydown(event: KeyboardEvent) {
  if (!panelOpen.value) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    move(event.key === 'ArrowDown' ? 1 : -1)
    return
  }

  if (event.key === 'Enter' || event.key === 'Tab') {
    const option = visibleOptions.value[activeIndex.value]

    if (option) {
      event.preventDefault()
      insert(option)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      closePanel()
    }
  }
}

function onFocus() {
  focused.value = true
}

function onBlur() {
  focused.value = false
  closePanel()
}

function focus() {
  textareaRef.value?.focus()
}

function blur() {
  textareaRef.value?.blur()
}

onMounted(resizeToContent)

watch(
  () => model.value,
  () => {
    nextTick(resizeToContent)
  },
)

defineExpose({ focus, blur, textareaRef })
</script>

<template>
  <div
    ref="triggerRef"
    class="ny-mentions"
    :class="[`ny-mentions--${size}`, { 'is-open': panelOpen, 'is-disabled': disabled }]"
  >
    <NyInputShell
      :size="size"
      :variant="variant"
      :disabled="disabled"
      :readonly="readonly"
      :invalid="invalid"
      :focused="ringVisible"
      multiline
    >
      <textarea
        ref="textareaRef"
        class="ny-shell__control"
        :style="textareaStyle"
        :value="model"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :aria-expanded="panelOpen"
        :aria-controls="panelOpen ? panelId : undefined"
        :aria-invalid="invalid || undefined"
        @input="onInput"
        @keydown="onKeydown"
        @click="syncMention"
        @focus="onFocus"
        @blur="onBlur"
      />
    </NyInputShell>

    <span v-if="showCount" class="ny-mentions__count">{{ countText }}</span>
  </div>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="panelOpen"
        :id="panelId"
        ref="panelRef"
        class="ny-pop ny-mentions__panel"
        :style="style"
        role="listbox"
        @mousedown.prevent
      >
        <ul v-if="visibleOptions.length" class="ny-mentions__list ny-scroll">
          <li
            v-for="(option, index) in visibleOptions"
            :key="option.value"
            class="ny-mentions__option"
            :class="{ 'is-active': index === activeIndex }"
            role="option"
            :aria-selected="index === activeIndex"
            @click="insert(option)"
            @mouseenter="activeIndex = index"
          >
            <span class="ny-mentions__avatar">
              <NyIcon :name="option.icon || 'user'" :size="14" />
            </span>

            <span class="ny-mentions__option-label">{{ option.label }}</span>
            <span class="ny-mentions__option-value">{{ prefix }}{{ option.label }}</span>
          </li>
        </ul>

        <div v-else class="ny-mentions__empty">{{ emptyText }}</div>
      </div>
    </transition>
  </Teleport>
</template>
