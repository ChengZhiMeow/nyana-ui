<script setup lang="ts">
import { computed, ref } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import { useBelow } from '../../composables/useMediaQuery'

const width = defineModel<number>('width', { default: 280 })
const collapsed = defineModel<boolean>('collapsed', { default: false })

const props = withDefaults(
  defineProps<{
    side?: 'start' | 'end'
    min?: number
    max?: number
    resizable?: boolean
    collapsible?: boolean
    collapseBelow?: number
    gap?: number
    fill?: boolean
  }>(),
  {
    side: 'start',
    min: 180,
    max: 520,
    resizable: false,
    collapsible: false,
    collapseBelow: 768,
    gap: 16,
    fill: false,
  },
)

const root = ref<HTMLElement | null>(null)
const dragging = ref(false)

const stacked = useBelow(() => props.collapseBelow)

const effectiveWidth = computed(() => Math.min(Math.max(width.value, props.min), props.max))

const style = computed(() => {
  if (stacked.value) {
    return { display: 'flex', flexDirection: 'column' as const, gap: `${props.gap}px` }
  }

  if (collapsed.value) {
    return { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: `${props.gap}px` }
  }

  const columns =
    props.side === 'start'
      ? `${effectiveWidth.value}px minmax(0, 1fr)`
      : `minmax(0, 1fr) ${effectiveWidth.value}px`

  return { display: 'grid', gridTemplateColumns: columns, gap: `${props.gap}px` }
})

const handleStyle = computed(() => ({
  [props.side === 'start' ? 'left' : 'right']: `${effectiveWidth.value + props.gap / 2 - 5}px`,
}))

const toggleIcon = computed(() => {
  if (props.side === 'start') {
    return collapsed.value ? 'chevron-right' : 'chevron-left'
  }

  return collapsed.value ? 'chevron-left' : 'chevron-right'
})

const mainMinWidth = 240

function setWidth(value: number, containerWidth: number) {
  const limit = Math.min(props.max, Math.max(props.min, containerWidth - mainMinWidth))

  width.value = Math.round(Math.min(Math.max(value, props.min), limit))
}

function onPointerDown(event: PointerEvent) {
  if (!props.resizable || stacked.value) {
    return
  }

  const startX = event.clientX
  const startWidth = effectiveWidth.value
  const containerWidth = root.value?.getBoundingClientRect().width ?? 0

  dragging.value = true

  function onMove(moveEvent: PointerEvent) {
    const delta = props.side === 'start' ? moveEvent.clientX - startX : startX - moveEvent.clientX

    setWidth(startWidth + delta, containerWidth)
  }

  function onUp() {
    dragging.value = false
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }

  event.preventDefault()
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

function onHandleKeydown(event: KeyboardEvent) {
  const step = 16
  const forward = props.side === 'start' ? event.key === 'ArrowRight' : event.key === 'ArrowLeft'
  const backward = props.side === 'start' ? event.key === 'ArrowLeft' : event.key === 'ArrowRight'

  if (!forward && !backward) {
    return
  }

  const containerWidth = root.value?.getBoundingClientRect().width ?? 0

  event.preventDefault()
  setWidth(effectiveWidth.value + (forward ? step : -step), containerWidth)
}

function toggle() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div
    ref="root"
    class="ny-split"
    :class="[
      `ny-split--${side}`,
      { 'is-stacked': stacked, 'is-collapsed': collapsed, 'is-dragging': dragging, 'ny-split--fill': fill },
    ]"
    :style="style"
  >
    <aside v-show="!collapsed" class="ny-split__side">
      <slot name="side" />
    </aside>

    <div class="ny-split__main">
      <button
        v-if="collapsible"
        class="ny-split__toggle"
        type="button"
        :title="collapsed ? '展开侧栏' : '收起侧栏'"
        :aria-label="collapsed ? '展开侧栏' : '收起侧栏'"
        @click="toggle"
      >
        <NyIcon :name="toggleIcon" :size="15" />
      </button>

      <slot />
    </div>

    <div
      v-if="resizable && !stacked && !collapsed"
      class="ny-split__handle"
      :style="handleStyle"
      role="separator"
      aria-orientation="vertical"
      tabindex="0"
      :aria-valuenow="effectiveWidth"
      :aria-valuemin="min"
      :aria-valuemax="max"
      @pointerdown="onPointerDown"
      @keydown="onHandleKeydown"
    />
  </div>
</template>
