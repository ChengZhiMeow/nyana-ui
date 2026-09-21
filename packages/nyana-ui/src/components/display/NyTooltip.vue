<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots } from 'vue'

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
  offset: () => props.offset,
  onEscape: () => hide(),
})

const panelStyle = computed<CSSProperties>(() => ({
  ...style.value,
  maxWidth: `${props.maxWidth}px`,
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
    show(80)
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
        :class="`ny-tooltip--${theme}`"
        :style="panelStyle"
        role="tooltip"
      >
        <slot name="content">{{ content }}</slot>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-tooltip__trigger {
  display: inline-block;
}

.ny-tooltip {
  position: fixed;
  z-index: var(--ny-z-popup);
  padding: 6px 10px;
  font-size: var(--ny-font-size-sm);
  line-height: 1.6;
  word-break: break-word;
}

.ny-tooltip--dark {
  border-color: transparent;
  background: var(--ny-text-strong);
  color: var(--ny-surface);
}

.ny-tooltip--light {
  background: var(--ny-surface);
  color: var(--ny-text);
}
</style>
