<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import NyField from './NyField.vue'
import NyIcon from '../basic/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    count?: number
    allowHalf?: boolean
    disabled?: boolean
    readonly?: boolean
    size?: NySize
    color?: string
    voidColor?: string
    clearable?: boolean
    showText?: boolean
    texts?: string[]
    label?: string
    hint?: string
  }>(),
  {
    count: 5,
    allowHalf: false,
    disabled: false,
    readonly: false,
    size: 'md',
    color: '',
    voidColor: '',
    clearable: false,
    showText: false,
    texts: () => [],
    label: '',
    hint: '',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: number): void
}>()

const model = defineModel<number>()

const preview = ref<number | null>(null)
const messageId = `${useId()}-msg`

const rating = computed(() => model.value ?? 0)
const stepValue = computed(() => (props.allowHalf ? 0.5 : 1))
const iconSize = computed(() => (props.size === 'lg' ? 24 : props.size === 'sm' ? 16 : 20))

const displayValue = computed(() => {
  const raw = preview.value ?? rating.value

  return props.allowHalf ? raw : Math.round(raw)
})

const colorStyle = computed(() => ({
  '--ny-rate-color': props.color || 'var(--ny-primary)',
  '--ny-rate-void-color': props.voidColor || 'var(--ny-text-muted)',
}))

const text = computed(() => {
  if (!props.showText) {
    return ''
  }

  const value = displayValue.value

  return props.texts[Math.ceil(value) - 1] ?? (value ? String(value) : '')
})

function setValue(next: number, allowClear: boolean) {
  const clamped = Math.min(props.count, Math.max(0, next))
  const value = allowClear && clamped === rating.value ? 0 : clamped

  preview.value = null

  if (value === rating.value) {
    return
  }

  model.value = value
  emit('change', value)
}

function valueFromEvent(event: MouseEvent, index: number) {
  const el = event.currentTarget

  if (!props.allowHalf || !(el instanceof HTMLElement)) {
    return index
  }

  const rect = el.getBoundingClientRect()

  return event.clientX - rect.left < rect.width / 2 ? index - 0.5 : index
}

function onPointerMove(event: PointerEvent, index: number) {
  if (props.disabled || props.readonly) {
    return
  }

  preview.value = valueFromEvent(event, index)
}

function onPointerLeave() {
  preview.value = null
}

function onClick(event: MouseEvent, index: number) {
  if (props.disabled || props.readonly) {
    return
  }

  setValue(valueFromEvent(event, index), props.clearable)
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) {
    return
  }

  const current = rating.value
  let next: number | null = null

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = current + stepValue.value
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      next = current - stepValue.value
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = props.count
      break
    default:
      next = /^[1-9]$/.test(event.key) ? Number(event.key) : null
      break
  }

  if (next === null) {
    return
  }

  event.preventDefault()
  setValue(next, false)
}

function fillWidth(index: number) {
  const diff = displayValue.value - (index - 1)

  if (diff >= 1) {
    return '100%'
  }

  return diff >= 0.5 && props.allowHalf ? '50%' : '0%'
}
</script>

<template>
  <NyField :label="label" :hint="hint" :message-id="messageId">
    <span
      class="ny-rate"
      :class="[
        `ny-rate--${size}`,
        { 'is-disabled': disabled, 'is-readonly': readonly },
      ]"
      :style="colorStyle"
      role="slider"
      :tabindex="disabled ? -1 : 0"
      :aria-valuemin="0"
      :aria-valuemax="count"
      :aria-valuenow="rating"
      :aria-disabled="disabled || undefined"
      :aria-readonly="readonly || undefined"
      :aria-label="label || '评分'"
      :aria-describedby="hint ? messageId : undefined"
      @pointerleave="onPointerLeave"
      @keydown="onKeydown"
    >
      <span
        v-for="index in count"
        :key="index"
        class="ny-rate__item"
        :style="{ width: `${iconSize}px`, height: `${iconSize}px` }"
        @pointermove="onPointerMove($event, index)"
        @click="onClick($event, index)"
      >
        <span class="ny-rate__layer ny-rate__layer--void">
          <NyIcon name="star" :size="iconSize" :stroke-width="1.6" />
        </span>

        <span
          class="ny-rate__layer ny-rate__layer--full"
          :style="{ width: fillWidth(index) }"
          aria-hidden="true"
        >
          <NyIcon name="star" :size="iconSize" :stroke-width="1.6" />
        </span>
      </span>

      <span v-if="text" class="ny-rate__text">{{ text }}</span>
    </span>
  </NyField>
</template>

<style scoped lang="scss">
.ny-rate {
  display: inline-flex;
  align-items: center;
  gap: var(--ny-space-1);
  outline: none;
  cursor: pointer;

  &:focus-visible {
    border-radius: var(--ny-radius-xs);
    box-shadow: var(--ny-shadow-focus);
  }
}

.ny-rate__item {
  position: relative;
  display: inline-block;
  flex: none;
}

.ny-rate__layer {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  height: 100%;
  transition: color var(--ny-transition-fast);
}

.ny-rate__layer--void {
  width: 100%;
  color: var(--ny-rate-void-color);
}

.ny-rate__layer--full {
  color: var(--ny-rate-color);
  overflow: hidden;

  :deep(path) {
    fill: currentColor;
  }
}

.ny-rate__text {
  margin-left: var(--ny-space-1);
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
}

.ny-rate.is-disabled,
.ny-rate.is-readonly {
  cursor: default;
}

.ny-rate.is-disabled {
  opacity: 0.6;
}
</style>
