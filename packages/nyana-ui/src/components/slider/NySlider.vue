<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from 'vue'

import NyField from '../field/NyField.vue'

import type { ComponentPublicInstance } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    range?: boolean
    disabled?: boolean
    vertical?: boolean
    showTooltip?: boolean
    marks?: Record<number, string>
    showInput?: boolean
    label?: string
    hint?: string
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    range: false,
    disabled: false,
    vertical: false,
    showTooltip: true,
    marks: () => ({}),
    showInput: false,
    label: '',
    hint: '',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: number | [number, number]): void
}>()

const model = defineModel<number | [number, number]>()

const trackRef = ref<HTMLElement | null>(null)
const handleRefs = ref<(HTMLElement | null)[]>([])
const dragging = ref<number | null>(null)
const hovered = ref<number | null>(null)
const messageId = `${useId()}-msg`

const stepValue = computed(() => (props.step > 0 ? props.step : 1))
const span = computed(() => (props.max > props.min ? props.max - props.min : 1))

function clamp(value: number) {
  const aligned = Math.round((value - props.min) / stepValue.value) * stepValue.value + props.min
  const fixed = Number(aligned.toFixed(6))

  return Math.min(props.max, Math.max(props.min, fixed))
}

function normalize(value: number | undefined, fallback: number) {
  return typeof value === 'number' && !Number.isNaN(value) ? clamp(value) : clamp(fallback)
}

const values = computed<[number, number]>(() => {
  const current = model.value

  if (props.range) {
    const pair = Array.isArray(current) ? current : []
    return [normalize(pair[0], props.min), normalize(pair[1], props.max)]
  }

  const single = normalize(typeof current === 'number' ? current : props.min, props.min)

  return [single, single]
})

const handleValues = computed(() => (props.range ? values.value : [values.value[0]]))

const markList = computed(() =>
  Object.entries(props.marks)
    .map(([key, text]) => ({ value: Number(key), text }))
    .filter((mark) => Number.isFinite(mark.value)),
)

function toPercent(value: number) {
  return ((value - props.min) / span.value) * 100
}

const rangeStyle = computed(() => {
  const start = props.range ? toPercent(values.value[0]) : 0
  const end = props.range ? toPercent(values.value[1]) : toPercent(values.value[0])
  const size = Math.max(0, end - start)

  return props.vertical
    ? { bottom: `${start}%`, height: `${size}%` }
    : { left: `${start}%`, width: `${size}%` }
})

function handleStyle(value: number) {
  return props.vertical ? { bottom: `${toPercent(value)}%` } : { left: `${toPercent(value)}%` }
}

function markStyle(value: number) {
  return props.vertical ? { bottom: `${toPercent(value)}%` } : { left: `${toPercent(value)}%` }
}

function handleLabel(index: number) {
  if (!props.range) {
    return props.label || '滑块'
  }

  const suffix = index === 0 ? '最小值' : '最大值'

  return props.label ? `${props.label} ${suffix}` : suffix
}

function tooltipVisible(index: number) {
  return (
    props.showTooltip &&
    !props.disabled &&
    (dragging.value === index || hovered.value === index)
  )
}

function setHandleRef(el: Element | ComponentPublicInstance | null, index: number) {
  handleRefs.value[index] = el instanceof HTMLElement ? el : null
}

function focusHandle(index: number) {
  handleRefs.value[index]?.focus()
}

function commit(index: number, raw: number) {
  const next = clamp(raw)

  if (!props.range) {
    if (next === values.value[0]) {
      return
    }

    model.value = next
    emit('change', next)
    return
  }

  const pair: [number, number] = [values.value[0], values.value[1]]
  pair[index] = index === 0 ? Math.min(next, pair[1]) : Math.max(next, pair[0])

  if (pair[0] === values.value[0] && pair[1] === values.value[1]) {
    return
  }

  model.value = pair
  emit('change', pair)
}

function valueFromEvent(event: PointerEvent) {
  const el = trackRef.value

  if (!el) {
    return props.min
  }

  const rect = el.getBoundingClientRect()
  const ratio = props.vertical
    ? (rect.bottom - event.clientY) / (rect.height || 1)
    : (event.clientX - rect.left) / (rect.width || 1)

  return props.min + Math.min(1, Math.max(0, ratio)) * span.value
}

function onPointerMove(event: PointerEvent) {
  if (dragging.value === null) {
    return
  }

  commit(dragging.value, valueFromEvent(event))
}

function stopDrag(event: PointerEvent) {
  const el = trackRef.value

  if (el?.hasPointerCapture(event.pointerId)) {
    el.releasePointerCapture(event.pointerId)
  }

  dragging.value = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopDrag)
  window.removeEventListener('pointercancel', stopDrag)
}

function startDrag(event: PointerEvent, index: number) {
  dragging.value = index
  trackRef.value?.setPointerCapture(event.pointerId)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDrag)
  window.addEventListener('pointercancel', stopDrag)
}

function onTrackPointerDown(event: PointerEvent) {
  if (props.disabled) {
    return
  }

  const raw = valueFromEvent(event)
  const index =
    props.range && Math.abs(raw - values.value[0]) > Math.abs(raw - values.value[1]) ? 1 : 0

  focusHandle(index)
  commit(index, raw)
  startDrag(event, index)
}

function onHandlePointerDown(event: PointerEvent, index: number) {
  if (props.disabled) {
    return
  }

  event.preventDefault()
  focusHandle(index)
  startDrag(event, index)
}

function onHandleKeydown(event: KeyboardEvent, index: number) {
  if (props.disabled) {
    return
  }

  const current = values.value[index]
  const step = stepValue.value
  let next: number | null = null

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      next = current + step
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      next = current - step
      break
    case 'PageUp':
      next = current + step * 10
      break
    case 'PageDown':
      next = current - step * 10
      break
    case 'Home':
      next = props.min
      break
    case 'End':
      next = props.max
      break
    default:
      return
  }

  event.preventDefault()
  commit(index, next)
}

function onInputChange(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const parsed = Number(input.value)

  if (!Number.isNaN(parsed)) {
    commit(index, parsed)
  }

  input.value = String(values.value[index])
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopDrag)
  window.removeEventListener('pointercancel', stopDrag)
})
</script>

<template>
  <NyField
    :label="label"
    :hint="hint"
    :disabled="disabled"
    :message-id="messageId"
  >
    <div
      class="ny-slider"
      :class="{ 'is-vertical': vertical, 'is-disabled': disabled }"
    >
      <div class="ny-slider__body">
        <div ref="trackRef" class="ny-slider__track" @pointerdown="onTrackPointerDown">
          <div class="ny-slider__rail" />
          <div class="ny-slider__range" :style="rangeStyle" />

          <div
            v-for="(value, index) in handleValues"
            :key="index"
            :ref="(el) => setHandleRef(el, index)"
            class="ny-slider__handle"
            :class="{ 'is-active': dragging === index || hovered === index }"
            :style="handleStyle(value)"
            role="slider"
            tabindex="0"
            :aria-valuemin="min"
            :aria-valuemax="max"
            :aria-valuenow="value"
            :aria-orientation="vertical ? 'vertical' : 'horizontal'"
            :aria-disabled="disabled || undefined"
            :aria-label="handleLabel(index)"
            :aria-describedby="hint ? messageId : undefined"
            @pointerdown.stop="onHandlePointerDown($event, index)"
            @pointerenter="hovered = index"
            @pointerleave="hovered = null"
            @keydown="onHandleKeydown($event, index)"
          >
            <span v-show="tooltipVisible(index)" class="ny-slider__tooltip">{{ value }}</span>
          </div>
        </div>

        <div v-if="markList.length" class="ny-slider__marks">
          <span
            v-for="mark in markList"
            :key="mark.value"
            class="ny-slider__mark"
            :style="markStyle(mark.value)"
          >
            {{ mark.text }}
          </span>
        </div>
      </div>

      <div v-if="showInput" class="ny-slider__inputs">
        <input
          v-for="(value, index) in handleValues"
          :key="index"
          class="ny-slider__input"
          type="number"
          :min="min"
          :max="max"
          :step="stepValue"
          :value="value"
          :disabled="disabled"
          :aria-label="handleLabel(index)"
          @change="onInputChange(index, $event)"
          @keydown.enter="onInputChange(index, $event)"
        />
      </div>
    </div>
  </NyField>
</template>
