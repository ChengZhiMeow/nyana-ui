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

import NyIcon from '../icon/NyIcon.vue'

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
