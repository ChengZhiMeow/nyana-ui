<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue'

import { usePopup } from '../../composables/usePopup'

import type { CSSProperties } from 'vue'
import type { NyPlacement, NyTrigger } from '../../types'

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: NyPlacement
    trigger?: NyTrigger
    maxWidth?: number
    theme?: 'dark' | 'light'
    disabled?: boolean
    offset?: number
  }>(),
  {
    content: '',
    placement: 'top',
    trigger: 'hover',
    maxWidth: 260,
    theme: 'dark',
    disabled: false,
    offset: 6,
  },
)

const slots = useSlots()

const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const byHover = computed(() => props.trigger === 'hover')
const hasContent = computed(() => !!props.content || !!slots.content)

let showTimer: ReturnType<typeof setTimeout> | undefined

const { style } = usePopup({
  open,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  // 给小三角留出 2px
  offset: () => props.offset + 2,
  onEscape: () => hide(),
})

const side = ref<'top' | 'bottom' | 'left' | 'right'>('top')
const arrowAt = ref('50%')

// 位置可能因视口翻转或贴边, 按实际位置摆放小三角
function placeArrow() {
  const triggerEl = triggerRef.value
  const panelEl = panelRef.value

  if (!triggerEl || !panelEl) {
    return
  }

  const t = triggerEl.getBoundingClientRect()
  const p = panelEl.getBoundingClientRect()

  if (p.top >= t.bottom - 1) {
    side.value = 'bottom'
  } else if (p.bottom <= t.top + 1) {
    side.value = 'top'
  } else if (p.left >= t.right - 1) {
    side.value = 'right'
  } else {
    side.value = 'left'
  }

  const vertical = side.value === 'top' || side.value === 'bottom'
  const center = vertical ? t.left + t.width / 2 - p.left : t.top + t.height / 2 - p.top
  const size = vertical ? p.width : p.height

  arrowAt.value = `${Math.round(Math.min(Math.max(center, 10), size - 10))}px`
}

watch(style, () => nextTick(placeArrow))

const panelStyle = computed<CSSProperties>(() => ({
  ...style.value,
  maxWidth: `min(${props.maxWidth}px, calc(100vw - 32px))`,
  '--ny-tooltip-arrow': arrowAt.value,
}))

function clearTimer() {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = undefined
  }
}

function show(delay = 0) {
  if (props.disabled || !hasContent.value) {
    return
  }

  clearTimer()

  if (delay > 0) {
    showTimer = setTimeout(() => {
      showTimer = undefined
      open.value = true
    }, delay)

    return
  }

  open.value = true
}

function hide() {
  clearTimer()
  open.value = false
}

function onEnter() {
  if (byHover.value) {
    show(150)
  }
}

function onLeave() {
  if (byHover.value) {
    hide()
  }
}

onBeforeUnmount(clearTimer)
</script>

<template>
  <span
    ref="triggerRef"
    class="ny-tooltip__trigger"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="show()"
    @focusout="hide()"
  >
    <slot />
  </span>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="open"
        ref="panelRef"
        class="ny-pop ny-tooltip"
        :class="[`ny-tooltip--${theme}`, `is-${side}`]"
        :style="panelStyle"
        role="tooltip"
      >
        <slot name="content">{{ content }}</slot>
      </div>
    </transition>
  </Teleport>
</template>
