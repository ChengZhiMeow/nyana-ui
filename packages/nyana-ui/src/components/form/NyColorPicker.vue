<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'
import NyInputShell from './NyInputShell.vue'

import { usePopup } from '../../composables/usePopup'
import { nyPalette } from '../../palette'
import type { NyPlacement, NySize, NyVariant } from '../../types'

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

const props = withDefaults(
  defineProps<{
    presets?: string[]
    size?: NySize
    variant?: NyVariant
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    clearable?: boolean
    placement?: NyPlacement
    showInput?: boolean
    format?: 'hex'
    emptyText?: string
  }>(),
  {
    presets: () => nyPalette.map((color) => color.value),
    size: 'md',
    variant: 'outline',
    disabled: false,
    readonly: false,
    invalid: false,
    clearable: true,
    placement: 'bottom-start',
    showInput: true,
    format: 'hex',
    emptyText: '未选择',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string): void
  (event: 'clear'): void
}>()

const model = defineModel<string>({ default: '' })

const visible = ref(false)
const focused = ref(false)
const draft = ref('')
const copied = ref(false)

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
let copyTimer = 0

const panelId = useId()

const ringVisible = computed(() => focused.value || visible.value)

const hexInvalid = computed(() => {
  const text = draft.value.trim()

  return text.length > 0 && !HEX_PATTERN.test(text)
})

const nativeValue = computed(() => {
  const text = model.value.trim()

  if (!HEX_PATTERN.test(text)) {
    return '#000000'
  }

  const hex = text.replace('#', '').toLowerCase()

  return `#${hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex}`
})

const { style } = usePopup({
  open: visible,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  offset: () => 6,
  matchWidth: () => false,
  onOutside: () => close(),
  onEscape: () => close(true),
})

watch(visible, (opened) => {
  if (!opened) {
    return
  }

  draft.value = model.value
  copied.value = false
})

function isCurrent(color: string) {
  return model.value.trim().toLowerCase() === color.trim().toLowerCase()
}

function checkColor(color: string) {
  const hex = color.replace('#', '')
  const full = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex

  if (full.length !== 6) {
    return 'var(--ny-text-invert)'
  }

  const red = Number.parseInt(full.slice(0, 2), 16)
  const green = Number.parseInt(full.slice(2, 4), 16)
  const blue = Number.parseInt(full.slice(4, 6), 16)
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000

  return brightness > 150 ? 'var(--ny-text-strong)' : 'var(--ny-text-invert)'
}

function focus() {
  triggerRef.value?.focus()
}

function open() {
  if (props.disabled || props.readonly || visible.value) {
    return
  }

  visible.value = true
}

function close(refocus = false) {
  if (!visible.value) {
    return
  }

  visible.value = false

  if (refocus) {
    focus()
  }
}

function applyColor(next: string) {
  const value = next.trim()

  if (!value || value === model.value) {
    return
  }

  model.value = value
  draft.value = value
  emit('change', value)
}

function pickPreset(color: string) {
  applyColor(color)
  close(true)
}

function onHexInput(event: Event) {
  const target = event.target as HTMLInputElement

  draft.value = target.value

  const value = target.value.trim()

  if (HEX_PATTERN.test(value)) {
    applyColor(`#${value.replace('#', '')}`)
  }
}

function onNativeChange(event: Event) {
  const target = event.target as HTMLInputElement

  applyColor(target.value)
}

async function copyColor() {
  if (!model.value || !navigator.clipboard) {
    return
  }

  await navigator.clipboard.writeText(model.value)
  copied.value = true
  window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => (copied.value = false), 1600)
}

function clear() {
  if (!model.value) {
    return
  }

  model.value = ''
  draft.value = ''
  emit('change', '')
  emit('clear')
}

function onTriggerMousedown(event: MouseEvent) {
  const target = event.target as Element | null

  if (target?.closest('.ny-shell__clear')) {
    event.preventDefault()
  }
}

function onTriggerClick(event: MouseEvent) {
  const target = event.target as Element | null

  if (target?.closest('.ny-shell__clear')) {
    return
  }

  if (visible.value) {
    close(true)
    return
  }

  open()
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) {
    return
  }

  if (event.key === 'Escape') {
    if (visible.value) {
      event.preventDefault()
      close(true)
    }
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()

    if (visible.value) {
      close(true)
      return
    }

    open()
  }
}

onBeforeUnmount(() => {
  window.clearTimeout(copyTimer)
})

defineExpose({ focus, open, close, clear })
</script>

<template>
  <div
    ref="triggerRef"
    class="ny-color-picker"
    :class="[`ny-color-picker--${size}`, { 'is-open': visible, 'is-disabled': disabled, 'is-invalid': invalid }]"
    role="button"
    aria-haspopup="dialog"
    :tabindex="disabled ? -1 : 0"
    :aria-expanded="visible"
    :aria-controls="visible ? panelId : undefined"
    :aria-disabled="disabled || undefined"
    :aria-invalid="invalid || undefined"
    @mousedown="onTriggerMousedown"
    @click="onTriggerClick"
    @keydown="onTriggerKeydown"
    @focus="focused = true"
    @blur="focused = false"
  >
    <NyInputShell
      :size="size"
      :variant="variant"
      :disabled="disabled"
      :readonly="readonly"
      :invalid="invalid"
      :focused="ringVisible"
      :clearable="clearable"
      :has-value="!!model"
      @clear="clear"
    >
      <template #prefix>
        <span class="ny-color-picker__swatch" :style="{ background: model || 'transparent' }" />
      </template>

      <span class="ny-color-picker__value" :class="{ 'is-empty': !model }">
        {{ model || emptyText }}
      </span>

      <template #suffix>
        <NyIcon class="ny-color-picker__arrow" :class="{ 'is-open': visible }" name="chevron-down" :size="14" />
      </template>
    </NyInputShell>
  </div>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div v-if="visible" :id="panelId" ref="panelRef" class="ny-pop ny-color-picker__panel" :style="style">
        <div class="ny-color-picker__presets">
          <button
            v-for="preset in presets"
            :key="preset"
            class="ny-color-picker__preset"
            :class="{ 'is-current': isCurrent(preset) }"
            type="button"
            :title="preset"
            :style="{ background: preset }"
            @click="pickPreset(preset)"
          >
            <NyIcon
              v-if="isCurrent(preset)"
              name="check"
              :size="13"
              :style="{ color: checkColor(preset) }"
            />
          </button>
        </div>

        <div class="ny-color-picker__row">
          <input
            class="ny-color-picker__native"
            type="color"
            :value="nativeValue"
            :disabled="disabled"
            aria-label="取色器"
            @input="onNativeChange"
          />

          <input
            v-if="showInput"
            class="ny-color-picker__hex"
            :class="{ 'is-invalid': hexInvalid }"
            type="text"
            spellcheck="false"
            autocomplete="off"
            placeholder="#5bcffa"
            :value="draft"
            aria-label="hex 色值"
            :aria-invalid="hexInvalid || undefined"
            @input="onHexInput"
          />
        </div>

        <div class="ny-color-picker__foot">
          <span class="ny-color-picker__current">{{ model || emptyText }}</span>

          <button
            class="ny-color-picker__copy"
            type="button"
            :disabled="!model"
            @click="copyColor"
          >
            <NyIcon :name="copied ? 'check' : 'copy'" :size="13" />
            {{ copied ? '已复制' : '复制色值' }}
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-color-picker {
  display: block;
  width: 100%;
  cursor: pointer;
}

.ny-color-picker[tabindex]:focus-visible {
  outline: none;
  box-shadow: none;
}

.ny-color-picker.is-disabled {
  cursor: not-allowed;
}

.ny-color-picker__swatch {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-xs);
}

.ny-color-picker__value {
  flex: 1;
  min-width: 0;
  font-family: var(--ny-font-family-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.is-empty {
    color: var(--ny-text-muted);
    font-family: var(--ny-font-family);
  }
}

.ny-color-picker__arrow {
  color: var(--ny-text-muted);
  transition: transform var(--ny-transition-fast);
}

.ny-color-picker__arrow.is-open {
  transform: rotate(180deg);
}

.ny-color-picker__panel {
  position: fixed;
  z-index: var(--ny-z-popup);
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 236px;
  padding: 12px;
}

.ny-color-picker__presets {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
}

.ny-color-picker__preset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-xs);
  cursor: pointer;
  transition: transform var(--ny-transition-fast);

  &:hover {
    transform: scale(1.08);
  }

  &.is-current {
    box-shadow: 0 0 0 2px var(--ny-surface), 0 0 0 3px var(--ny-primary);
  }
}

.ny-color-picker__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ny-color-picker__native {
  flex: none;
  width: 34px;
  height: 28px;
  padding: 2px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-xs);
  background: var(--ny-surface);
  cursor: pointer;
}

.ny-color-picker__hex {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-xs);
  background: var(--ny-surface);
  color: var(--ny-text);
  font-family: var(--ny-font-family-mono);
  font-size: var(--ny-font-size-sm);
  outline: none;
  transition: border-color var(--ny-transition-fast);

  &::placeholder {
    color: var(--ny-text-muted);
  }

  &:focus {
    border-color: var(--ny-primary);
  }

  &.is-invalid {
    border-color: var(--ny-danger);
  }
}

.ny-color-picker__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 2px;
  border-top: 1px solid var(--ny-border-soft);
}

.ny-color-picker__current {
  padding-top: 6px;
  color: var(--ny-text-sub);
  font-family: var(--ny-font-family-mono);
  font-size: var(--ny-font-size-xs);
}

.ny-color-picker__copy {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  padding: 3px 8px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-xs);
  background: var(--ny-surface);
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-xs);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover:not(:disabled) {
    border-color: var(--ny-primary);
    color: var(--ny-primary-text);
  }

  &:disabled {
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}
</style>
