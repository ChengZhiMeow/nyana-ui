<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'
import NyColorPanel from './NyColorPanel.vue'
import NyInputShell from '../input/NyInputShell.vue'

import { usePopup } from '../../composables/usePopup'
import { nyPalette } from '../../palette'
import { colorBrightness, isHexColor, normalizeHex } from '../../utils/color'
import type { NyPlacement, NySize, NyVariant } from '../../types'

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
const paletteOpen = ref(false)

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
let copyTimer = 0

const panelId = useId()

const ringVisible = computed(() => focused.value || visible.value)

const locked = computed(() => props.disabled || props.readonly)

const hexInvalid = computed(() => {
  const text = draft.value.trim()

  return text.length > 0 && !isHexColor(text)
})

const swatchStyle = computed(() => ({ background: model.value || 'transparent' }))

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
    paletteOpen.value = false
    return
  }

  draft.value = model.value
  copied.value = false
  paletteOpen.value = false
})

function isCurrent(color: string) {
  return model.value.trim().toLowerCase() === color.trim().toLowerCase()
}

function checkColor(color: string) {
  if (!isHexColor(color)) {
    return 'var(--ny-text-invert)'
  }

  return colorBrightness(color) > 150 ? 'var(--ny-text-strong)' : 'var(--ny-text-invert)'
}

function focus() {
  triggerRef.value?.focus()
}

function open() {
  if (locked.value || visible.value) {
    return
  }

  visible.value = true
}

function close(refocus = false) {
  if (!visible.value) {
    return
  }

  visible.value = false
  paletteOpen.value = false

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

function togglePalette() {
  if (locked.value) {
    return
  }

  paletteOpen.value = !paletteOpen.value
}

function pickPreset(color: string) {
  applyColor(color)
  close(true)
}

function onHexInput(event: Event) {
  const target = event.target as HTMLInputElement

  draft.value = target.value

  if (isHexColor(target.value)) {
    applyColor(normalizeHex(target.value) ?? target.value)
  }
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
  if (locked.value) {
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
          <NyInputShell
            :size="size"
            :variant="variant"
            :disabled="disabled"
            :readonly="readonly"
            :invalid="hexInvalid"
            :focused="paletteOpen"
          >
            <template #prefix>
              <button
                class="ny-color-picker__swatch-button"
                type="button"
                :style="swatchStyle"
                :disabled="locked"
                aria-haspopup="dialog"
                aria-label="打开调色盘"
                :aria-expanded="paletteOpen"
                @click="togglePalette"
              />
            </template>

            <input
              v-if="showInput"
              class="ny-shell__control"
              type="text"
              spellcheck="false"
              autocomplete="off"
              placeholder="#5bcffa"
              :value="draft"
              aria-label="hex 色值"
              :aria-invalid="hexInvalid || undefined"
              @input="onHexInput"
            />
          </NyInputShell>

          <div v-if="paletteOpen" class="ny-pop ny-color-picker__palette">
            <NyColorPanel
              :model-value="model"
              :disabled="disabled"
              :readonly="readonly"
              @change="applyColor"
            />
          </div>
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
