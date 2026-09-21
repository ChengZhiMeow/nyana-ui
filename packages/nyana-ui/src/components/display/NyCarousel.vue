<script setup lang="ts">
import {
  Comment,
  Fragment,
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
  type VNode,
} from 'vue'

import NyIcon from '../basic/NyIcon.vue'

const props = withDefaults(
  defineProps<{
    autoplay?: boolean
    interval?: number
    dots?: boolean
    arrows?: boolean
    effect?: 'slide' | 'fade'
    pauseOnHover?: boolean
    loop?: boolean
    height?: number | string
    draggable?: boolean
  }>(),
  {
    autoplay: true,
    interval: 4000,
    dots: true,
    arrows: true,
    effect: 'slide',
    pauseOnHover: true,
    loop: true,
    height: 220,
    draggable: true,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: { index: number; prevIndex: number }): void
}>()

const model = defineModel<number>('activeIndex', { default: 0 })

const slots = useSlots()

const rootRef = ref<HTMLElement | null>(null)
const hovering = ref(false)
const dragging = ref(false)
const dragOffset = ref(0)

const DRAG_THRESHOLD = 40
const MIN_INTERVAL = 300

let timer: number | null = null
let pointerId: number | null = null
let startX = 0
let startY = 0
let dragElement: HTMLElement | null = null

function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Fragment && Array.isArray(node.children)) {
      return flatten(node.children as VNode[])
    }

    if (node.type === Comment || typeof node.type === 'symbol') {
      return []
    }

    return typeof node.type === 'string' || typeof node.type === 'object' || typeof node.type === 'function'
      ? [node]
      : []
  })
}

const items = computed(() => flatten(slots.default?.() ?? []))

const count = computed(() => items.value.length)

const current = computed(() => {
  if (count.value === 0) {
    return 0
  }

  return Math.min(Math.max(Math.round(model.value ?? 0), 0), count.value - 1)
})

const rootStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

const trackStyle = computed(() => {
  if (props.effect !== 'slide') {
    return undefined
  }

  return { transform: `translate3d(calc(${-current.value * 100}% + ${dragOffset.value}px), 0, 0)` }
})

const prevDisabled = computed(() => !props.loop && current.value <= 0)
const nextDisabled = computed(() => !props.loop && current.value >= count.value - 1)
const paused = computed(() => (props.pauseOnHover && hovering.value) || dragging.value)

function go(target: number) {
  const total = count.value

  if (total < 2) {
    return
  }

  const index = props.loop ? (target + total) % total : Math.min(Math.max(target, 0), total - 1)

  if (index === current.value) {
    return
  }

  const prevIndex = current.value

  model.value = index
  emit('change', { index, prevIndex })
}

function step(offset: number) {
  go(current.value + offset)
}

function stopTimer() {
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
}

function startTimer() {
  stopTimer()

  if (!props.autoplay || count.value < 2 || paused.value) {
    return
  }

  timer = window.setInterval(() => step(1), Math.max(MIN_INTERVAL, props.interval))
}

watch([() => props.autoplay, () => props.interval, count, paused, current], startTimer)

watch(count, () => {
  if (count.value > 0 && model.value > count.value - 1) {
    model.value = count.value - 1
  }
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    step(-1)
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    step(1)
  }
}

function resist(offset: number) {
  if (props.loop) {
    return offset
  }

  if ((current.value <= 0 && offset > 0) || (current.value >= count.value - 1 && offset < 0)) {
    return offset * 0.35
  }

  return offset
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== pointerId) {
    return
  }

  const offsetX = event.clientX - startX

  if (Math.abs(offsetX) <= Math.abs(event.clientY - startY)) {
    return
  }

  dragOffset.value = resist(offsetX)
}

function releaseDrag() {
  const element = dragElement

  if (element) {
    element.removeEventListener('pointermove', onPointerMove)
    element.removeEventListener('pointerup', onPointerUp)
    element.removeEventListener('pointercancel', onPointerUp)

    if (pointerId !== null && element.hasPointerCapture(pointerId)) {
      element.releasePointerCapture(pointerId)
    }
  }

  dragElement = null
  pointerId = null
  dragging.value = false
  dragOffset.value = 0
}

function onPointerUp(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== pointerId) {
    return
  }

  const offset = dragOffset.value

  releaseDrag()

  if (Math.abs(offset) >= DRAG_THRESHOLD) {
    step(offset < 0 ? 1 : -1)
  }
}

function onPointerDown(event: PointerEvent) {
  if (!props.draggable || count.value < 2 || event.button !== 0) {
    return
  }

  if ((event.target as Element | null)?.closest('.ny-carousel__dots, .ny-carousel__arrow')) {
    return
  }

  const element = event.currentTarget as HTMLElement

  dragging.value = true
  startX = event.clientX
  startY = event.clientY
  pointerId = event.pointerId
  dragElement = element

  element.setPointerCapture(event.pointerId)
  element.addEventListener('pointermove', onPointerMove)
  element.addEventListener('pointerup', onPointerUp)
  element.addEventListener('pointercancel', onPointerUp)
}

onMounted(startTimer)

onBeforeUnmount(() => {
  stopTimer()
  releaseDrag()
})
</script>

<template>
  <div
    ref="rootRef"
    class="ny-carousel"
    :class="[
      `ny-carousel--${effect}`,
      { 'is-draggable': draggable && count > 1, 'is-dragging': dragging },
    ]"
    :style="rootStyle"
    role="region"
    aria-roledescription="carousel"
    tabindex="0"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @keydown="onKeydown"
    @pointerdown="onPointerDown"
  >
    <div class="ny-carousel__viewport">
      <div class="ny-carousel__track" :style="trackStyle">
        <div
          v-for="(node, index) in items"
          :key="index"
          class="ny-carousel__slide"
          :class="{ 'is-active': index === current }"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${index + 1} / ${count}`"
        >
          <component :is="() => node" />
        </div>
      </div>
    </div>

    <button
      v-if="arrows"
      type="button"
      class="ny-carousel__arrow ny-carousel__arrow--prev"
      aria-label="上一张"
      :disabled="prevDisabled"
      @click="step(-1)"
    >
      <NyIcon name="chevron-left" :size="18" />
    </button>

    <button
      v-if="arrows"
      type="button"
      class="ny-carousel__arrow ny-carousel__arrow--next"
      aria-label="下一张"
      :disabled="nextDisabled"
      @click="step(1)"
    >
      <NyIcon name="chevron-right" :size="18" />
    </button>

    <div v-if="dots" class="ny-carousel__dots">
      <slot name="dots" :index="current" :count="count" :go="go">
        <button
          v-for="index in count"
          :key="index"
          type="button"
          class="ny-carousel__dot"
          :class="{ 'is-active': index - 1 === current }"
          :aria-label="`第 ${index} 张`"
          :aria-current="index - 1 === current ? 'true' : undefined"
          @click="go(index - 1)"
        />
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-carousel {
  position: relative;
  width: 100%;
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface-3);
  overflow: hidden;
}

.ny-carousel__viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ny-carousel__track {
  display: flex;
  height: 100%;
  transition: transform var(--ny-transition-base) var(--ny-ease);
}

.ny-carousel__slide {
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

.ny-carousel.is-draggable .ny-carousel__slide {
  cursor: grab;
}

.ny-carousel.is-dragging .ny-carousel__slide {
  cursor: grabbing;
}

.ny-carousel.is-dragging .ny-carousel__track {
  transition: none;
}

.ny-carousel--slide .ny-carousel__slide {
  flex: 0 0 100%;
}

.ny-carousel--fade .ny-carousel__track {
  display: block;
  transition: none;
}

.ny-carousel--fade .ny-carousel__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--ny-transition-base) var(--ny-ease);
}

.ny-carousel--fade .ny-carousel__slide.is-active {
  opacity: 1;
  pointer-events: auto;
}

.ny-carousel__arrow {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface);
  color: var(--ny-text-sub);
  box-shadow: var(--ny-shadow-sm);
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.85;
  transition:
    opacity var(--ny-transition-fast),
    background var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &:hover:not(:disabled) {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
    opacity: 1;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }
}

.ny-carousel__arrow--prev {
  left: var(--ny-space-3);
}

.ny-carousel__arrow--next {
  right: var(--ny-space-3);
}

.ny-carousel__dots {
  position: absolute;
  right: 0;
  bottom: var(--ny-space-3);
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.ny-carousel__dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-text-muted);
  opacity: 0.65;
  cursor: pointer;
  transition:
    width var(--ny-transition-fast),
    background var(--ny-transition-fast),
    opacity var(--ny-transition-fast);

  &:hover {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &.is-active {
    width: 20px;
    background: var(--ny-primary);
    opacity: 1;
  }
}
</style>
