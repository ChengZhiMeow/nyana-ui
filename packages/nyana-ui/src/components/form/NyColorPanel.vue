<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { hexToHsv, hsvToHex, normalizeHex } from '../../utils/color'
import type { NyHsv } from '../../utils/color'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    height?: number
    disabled?: boolean
    readonly?: boolean
  }>(),
  {
    modelValue: '',
    height: 132,
    disabled: false,
    readonly: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string): void
}>()

const hsv = ref<NyHsv>({ h: 210, s: 0.62, v: 0.98 })
const dragging = ref<'' | 'area' | 'hue'>('')

const areaRef = ref<HTMLElement | null>(null)
const hueRef = ref<HTMLElement | null>(null)

const locked = computed(() => props.disabled || props.readonly)

const areaStyle = computed(() => ({
  height: `${props.height}px`,
  background: `hsl(${hsv.value.h}, 100%, 50%)`,
}))

const areaThumbStyle = computed(() => ({
  left: `${hsv.value.s * 100}%`,
  top: `${(1 - hsv.value.v) * 100}%`,
}))

const hueThumbStyle = computed(() => ({ left: `${(hsv.value.h / 360) * 100}%` }))

watch(
  () => props.modelValue,
  () => {
    const next = hexToHsv(props.modelValue)
    const normalized = normalizeHex(props.modelValue)

    if (!next || !normalized || hsvToHex(hsv.value) === normalized) {
      return
    }

    hsv.value = next
  },
  { immediate: true },
)

function clampUnit(value: number) {
  return Math.min(1, Math.max(0, value))
}

function pointIn(element: HTMLElement | null, event: PointerEvent) {
  if (!element) {
    return null
  }

  const rect = element.getBoundingClientRect()

  if (rect.width === 0 || rect.height === 0) {
    return null
  }

  return {
    x: clampUnit((event.clientX - rect.left) / rect.width),
    y: clampUnit((event.clientY - rect.top) / rect.height),
  }
}

function applyHsv(next: NyHsv) {
  hsv.value = next
  emit('change', hsvToHex(next))
}

function trackArea(event: PointerEvent) {
  const point = pointIn(areaRef.value, event)

  if (!point) {
    return
  }

  applyHsv({ h: hsv.value.h, s: point.x, v: 1 - point.y })
}

function trackHue(event: PointerEvent) {
  const point = pointIn(hueRef.value, event)

  if (!point) {
    return
  }

  applyHsv({ h: Math.round(point.x * 360), s: hsv.value.s, v: hsv.value.v })
}

function track(kind: 'area' | 'hue', event: PointerEvent) {
  if (kind === 'area') {
    trackArea(event)
    return
  }

  trackHue(event)
}

function onDragStart(kind: 'area' | 'hue', event: PointerEvent) {
  if (locked.value) {
    return
  }

  const element = kind === 'area' ? areaRef.value : hueRef.value

  if (!element) {
    return
  }

  dragging.value = kind
  element.setPointerCapture(event.pointerId)
  element.focus()
  track(kind, event)
}

function onDragMove(kind: 'area' | 'hue', event: PointerEvent) {
  if (dragging.value !== kind) {
    return
  }

  track(kind, event)
}

function onDragEnd(kind: 'area' | 'hue', event: PointerEvent) {
  if (dragging.value !== kind) {
    return
  }

  dragging.value = ''

  const element = kind === 'area' ? areaRef.value : hueRef.value

  if (element?.hasPointerCapture(event.pointerId)) {
    element.releasePointerCapture(event.pointerId)
  }
}

function onAreaKeydown(event: KeyboardEvent) {
  if (locked.value) {
    return
  }

  const step = event.shiftKey ? 0.1 : 0.02
  const { h, s, v } = hsv.value
  let next: NyHsv | null = null

  if (event.key === 'ArrowLeft') {
    next = { h, s: clampUnit(s - step), v }
  } else if (event.key === 'ArrowRight') {
    next = { h, s: clampUnit(s + step), v }
  } else if (event.key === 'ArrowUp') {
    next = { h, s, v: clampUnit(v + step) }
  } else if (event.key === 'ArrowDown') {
    next = { h, s, v: clampUnit(v - step) }
  }

  if (!next) {
    return
  }

  event.preventDefault()
  applyHsv(next)
}

function onHueKeydown(event: KeyboardEvent) {
  if (locked.value) {
    return
  }

  const step = event.shiftKey ? 12 : 3
  const { h, s, v } = hsv.value
  let next: NyHsv | null = null

  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    next = { h: (h - step + 360) % 360, s, v }
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    next = { h: (h + step) % 360, s, v }
  } else if (event.key === 'Home') {
    next = { h: 0, s, v }
  } else if (event.key === 'End') {
    next = { h: 360, s, v }
  }

  if (!next) {
    return
  }

  event.preventDefault()
  applyHsv(next)
}
</script>

<template>
  <div class="ny-color-panel" :class="{ 'is-locked': locked }">
    <div
      ref="areaRef"
      class="ny-color-panel__area"
      :style="areaStyle"
      role="slider"
      :tabindex="locked ? -1 : 0"
      aria-label="饱和度与明度"
      :aria-valuetext="`饱和度 ${Math.round(hsv.s * 100)}%, 明度 ${Math.round(hsv.v * 100)}%`"
      :aria-disabled="locked || undefined"
      @pointerdown="onDragStart('area', $event)"
      @pointermove="onDragMove('area', $event)"
      @pointerup="onDragEnd('area', $event)"
      @pointercancel="onDragEnd('area', $event)"
      @keydown="onAreaKeydown"
    >
      <span class="ny-color-panel__area-sat" />
      <span class="ny-color-panel__area-val" />
      <span class="ny-color-panel__thumb" :style="areaThumbStyle" />
    </div>

    <div
      ref="hueRef"
      class="ny-color-panel__hue"
      role="slider"
      :tabindex="locked ? -1 : 0"
      aria-label="色相"
      aria-valuemin="0"
      aria-valuemax="360"
      :aria-valuenow="hsv.h"
      :aria-disabled="locked || undefined"
      @pointerdown="onDragStart('hue', $event)"
      @pointermove="onDragMove('hue', $event)"
      @pointerup="onDragEnd('hue', $event)"
      @pointercancel="onDragEnd('hue', $event)"
      @keydown="onHueKeydown"
    >
      <span class="ny-color-panel__hue-thumb" :style="hueThumbStyle" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-color-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ny-color-panel__area {
  position: relative;
  border-radius: var(--ny-radius-sm);
  cursor: crosshair;
  touch-action: none;
  user-select: none;

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }
}

.ny-color-panel__area-sat,
.ny-color-panel__area-val {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.ny-color-panel__area-sat {
  background: linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0));
}

.ny-color-panel__area-val {
  background: linear-gradient(to top, #000000, rgba(0, 0, 0, 0));
}

.ny-color-panel__thumb {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid var(--ny-surface);
  border-radius: 50%;
  box-shadow:
    0 0 0 1px var(--ny-border-strong),
    var(--ny-shadow-xs);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ny-color-panel__hue {
  position: relative;
  height: 12px;
  border-radius: var(--ny-radius-pill);
  background: linear-gradient(
    to right,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
  cursor: pointer;
  touch-action: none;
  user-select: none;

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }
}

.ny-color-panel__hue-thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  border: 2px solid var(--ny-surface);
  border-radius: 50%;
  box-shadow:
    0 0 0 1px var(--ny-border-strong),
    var(--ny-shadow-xs);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ny-color-panel.is-locked .ny-color-panel__area,
.ny-color-panel.is-locked .ny-color-panel__hue {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
