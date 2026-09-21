<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import { usePopup } from '../../composables/usePopup'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    max?: number
    placeholder?: string
    maxlength?: number
    disabled?: boolean
    size?: NySize
    invalid?: boolean
    suggest?: string[] | ((keyword: string) => string[] | Promise<string[]>)
    debounce?: number
  }>(),
  {
    max: 8,
    placeholder: '',
    maxlength: 20,
    disabled: false,
    size: 'md',
    invalid: false,
    debounce: 180,
  },
)

const model = defineModel<string[]>({ default: () => [] })

const emit = defineEmits<{
  (event: 'add', value: string): void
  (event: 'remove', value: string): void
  (event: 'change', value: string[]): void
}>()

const shellRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const draft = ref('')
const focused = ref(false)
const open = ref(false)
const candidates = ref<string[]>([])
const activeIndex = ref(-1)

let timer: ReturnType<typeof setTimeout> | null = null

const { style } = usePopup({
  open,
  trigger: shellRef,
  panel: panelRef,
  placement: () => 'bottom-start',
  matchWidth: () => true,
  onOutside: () => close(),
  onEscape: () => close(),
})

const reachedMax = computed(() => model.value.length >= props.max)

const classes = computed(() => [
  `ny-tag-input--${props.size}`,
  {
    'is-focused': focused.value,
    'is-disabled': props.disabled,
    'is-invalid': props.invalid,
    'is-full': reachedMax.value,
  },
])

function close() {
  open.value = false
  activeIndex.value = -1
}

function commit(next: string[]) {
  model.value = next
  emit('change', next)
}

function add(raw: string) {
  const value = raw.trim()

  if (!value || props.disabled || reachedMax.value) {
    close()

    return
  }

  draft.value = ''

  if (model.value.includes(value)) {
    close()

    return
  }

  commit([...model.value, value])
  emit('add', value)
  close()
}

function removeAt(index: number) {
  if (props.disabled) {
    return
  }

  const value = model.value[index]

  if (value === undefined) {
    return
  }

  commit(model.value.filter((_, position) => position !== index))
  emit('remove', value)
}

function onBackspace() {
  if (draft.value || model.value.length === 0) {
    return
  }

  removeAt(model.value.length - 1)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()

    const picked = candidates.value[activeIndex.value]

    add(picked ?? draft.value)

    return
  }

  if (event.key === 'Backspace') {
    onBackspace()

    return
  }

  if (event.key === 'Escape') {
    close()

    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (!open.value || candidates.value.length === 0) {
      return
    }

    event.preventDefault()

    const step = event.key === 'ArrowDown' ? 1 : -1
    const count = candidates.value.length

    activeIndex.value = (activeIndex.value + step + count) % count

    return
  }

  if (event.key === ',') {
    event.preventDefault()
    add(draft.value)
  }
}

async function resolveSuggest(keyword: string): Promise<string[]> {
  const source = props.suggest

  if (!source) {
    return []
  }

  const list = typeof source === 'function' ? await source(keyword) : source
  const used = new Set(model.value)

  return list.filter((item) => !used.has(item) && item !== keyword).slice(0, 10)
}

function loadSuggestions() {
  if (timer !== null) {
    clearTimeout(timer)
  }

  if (!props.suggest || reachedMax.value) {
    close()

    return
  }

  timer = setTimeout(async () => {
    timer = null

    const list = await resolveSuggest(draft.value.trim())

    candidates.value = list
    activeIndex.value = -1
    open.value = list.length > 0
  }, props.debounce)
}

watch(draft, loadSuggestions)

function pick(value: string) {
  draft.value = value
  add(value)
  nextTick(() => inputRef.value?.focus())
}

function onBlur() {
  focused.value = false

  setTimeout(() => {
    if (!inputRef.value || document.activeElement !== inputRef.value) {
      close()
    }
  }, 120)
}

onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer)
  }
})

defineExpose({
  focus: () => inputRef.value?.focus(),
})
</script>

<template>
  <div ref="shellRef" class="ny-tag-input" :class="classes" @click="inputRef?.focus()">
    <span v-for="(tag, index) in model" :key="tag" class="ny-tag-input__tag">
      <span class="ny-tag-input__tag-text">{{ tag }}</span>

      <button
        class="ny-tag-input__remove"
        type="button"
        :disabled="disabled"
        :aria-label="`移除 ${tag}`"
        @click.stop="removeAt(index)"
      >
        <NyIcon name="close" :size="11" />
      </button>
    </span>

    <input
      ref="inputRef"
      v-model="draft"
      class="ny-tag-input__input"
      type="text"
      :placeholder="model.length === 0 ? placeholder : ''"
      :maxlength="maxlength"
      :disabled="disabled"
      :aria-label="placeholder || '标签输入'"
      @keydown="onKeydown"
      @focus="focused = true; loadSuggestions()"
      @blur="onBlur"
    />
  </div>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div v-if="open" ref="panelRef" class="ny-pop ny-tag-input__panel" :style="style">
        <p class="ny-tag-input__panel-title">候选标签</p>

        <button
          v-for="(item, index) in candidates"
          :key="item"
          class="ny-tag-input__option"
          :class="{ 'is-active': index === activeIndex }"
          type="button"
          @mousedown.prevent
          @click="pick(item)"
        >
          {{ item }}
        </button>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-tag-input {
  --ny-tag-input-height: var(--ny-control-height-md);

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: var(--ny-tag-input-height);
  padding: 4px 8px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface);
  cursor: text;
  transition:
    border-color var(--ny-transition-fast),
    box-shadow var(--ny-transition-fast);

  &.is-focused {
    border-color: var(--ny-primary);
    box-shadow: var(--ny-shadow-focus);
  }

  &.is-invalid {
    border-color: var(--ny-danger);
  }

  &.is-disabled {
    background: var(--ny-surface-2);
    cursor: not-allowed;
  }
}

.ny-tag-input--sm {
  --ny-tag-input-height: var(--ny-control-height-sm);
}

.ny-tag-input--lg {
  --ny-tag-input-height: var(--ny-control-height-lg);
}

.ny-tag-input__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px 2px 8px;
  border-radius: var(--ny-radius-sm);
  background: var(--ny-primary-soft);
  color: var(--ny-primary-text);
  font-size: var(--ny-font-size-sm);
  line-height: 1.4;
}

.ny-tag-input--sm .ny-tag-input__tag {
  font-size: var(--ny-font-size-xs);
}

.ny-tag-input__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background var(--ny-transition-fast);

  &:hover:not(:disabled) {
    background: var(--ny-primary-ring);
  }

  &:disabled {
    cursor: not-allowed;
  }
}

.ny-tag-input__input {
  flex: 1;
  min-width: 80px;
  height: calc(var(--ny-tag-input-height) - 12px);
  padding: 0 2px;
  border: 0;
  background: transparent;
  color: var(--ny-text);
  font-family: var(--ny-font-family);
  font-size: var(--ny-font-size-md);
  outline: none;

  &::placeholder {
    color: var(--ny-text-muted);
  }

  &:disabled {
    cursor: not-allowed;
  }
}

.ny-tag-input__panel {
  z-index: var(--ny-z-popup);
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 240px;
  overflow-y: auto;
  padding: var(--ny-space-1);
}

.ny-tag-input__panel-title {
  margin: 0;
  padding: 4px 8px;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
}

.ny-tag-input__option {
  padding: 6px 8px;
  border: 0;
  border-radius: var(--ny-radius-xs);
  background: transparent;
  color: var(--ny-text);
  font-family: var(--ny-font-family);
  font-size: var(--ny-font-size-sm);
  text-align: left;
  cursor: pointer;

  &:hover,
  &.is-active {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
  }
}
</style>
