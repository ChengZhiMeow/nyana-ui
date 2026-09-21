<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { usePopup } from '../../composables/usePopup'

import type { CSSProperties } from 'vue'
import type { NyPlacement, NyTrigger } from '../../types'

const props = withDefaults(
  defineProps<{
    title?: string
    placement?: NyPlacement
    trigger?: NyTrigger
    width?: number
    maxHeight?: number
    disabled?: boolean
    content?: string
  }>(),
  {
    title: '',
    placement: 'bottom',
    trigger: 'hover',
    width: 240,
    maxHeight: 320,
    disabled: false,
    content: '',
  },
)

const emit = defineEmits<{
  (event: 'open'): void
  (event: 'close'): void
}>()

const open = defineModel<boolean>('open', { default: false })

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const byClick = computed(() => props.trigger === 'click')

let closeTimer: ReturnType<typeof setTimeout> | undefined

const { style } = usePopup({
  open,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  offset: () => 8,
  onOutside: () => close(),
  onEscape: () => close(),
})

const panelStyle = computed<CSSProperties>(() => ({ ...style.value, width: `${props.width}px` }))
const bodyStyle = computed<CSSProperties>(() => ({ maxHeight: `${props.maxHeight}px` }))

function clearTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = undefined
  }
}

function setOpen(next: boolean) {
  if (props.disabled || next === open.value) {
    return
  }

  open.value = next

  if (next) {
    emit('open')
  } else {
    emit('close')
  }
}

function close() {
  clearTimer()
  setOpen(false)
}

function scheduleClose() {
  clearTimer()
  closeTimer = setTimeout(() => {
    closeTimer = undefined
    setOpen(false)
  }, 120)
}

function onTriggerClick() {
  if (!byClick.value) {
    return
  }

  clearTimer()

  if (open.value) {
    close()
    return
  }

  setOpen(true)
}

function onTriggerEnter() {
  if (byClick.value || props.disabled) {
    return
  }

  clearTimer()
  setOpen(true)
}

function onTriggerLeave() {
  if (byClick.value) {
    return
  }

  scheduleClose()
}

function onPanelEnter() {
  if (byClick.value) {
    return
  }

  clearTimer()
}

function onPanelLeave() {
  if (byClick.value) {
    return
  }

  scheduleClose()
}

watch(
  () => props.disabled,
  (value) => {
    if (!value) {
      return
    }

    clearTimer()
    open.value = false
  },
)

onBeforeUnmount(clearTimer)
</script>

<template>
  <span
    ref="triggerRef"
    class="ny-popover__trigger"
    @click="onTriggerClick"
    @mouseenter="onTriggerEnter"
    @mouseleave="onTriggerLeave"
  >
    <slot />
  </span>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="open"
        ref="panelRef"
        class="ny-pop ny-popover"
        :style="panelStyle"
        @mouseenter="onPanelEnter"
        @mouseleave="onPanelLeave"
      >
        <div v-if="title || $slots.title" class="ny-popover__title">
          <slot name="title">{{ title }}</slot>
        </div>

        <div class="ny-popover__body ny-scroll" :style="bodyStyle">
          <slot name="content">{{ content }}</slot>
        </div>

        <div v-if="$slots.footer" class="ny-popover__footer">
          <slot name="footer" />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-popover__trigger {
  display: inline-block;
}

.ny-popover {
  position: fixed;
  z-index: var(--ny-z-popup);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  padding: var(--ny-space-3);
  font-size: var(--ny-font-size-md);
}

.ny-popover__title {
  margin-bottom: var(--ny-space-2);
  color: var(--ny-text-strong);
  font-weight: 600;
}

.ny-popover__body {
  min-height: 0;
  color: var(--ny-text);
  font-size: var(--ny-font-size-sm);
  line-height: 1.7;
}

.ny-popover__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--ny-space-2);
  margin-top: var(--ny-space-3);
  padding-top: var(--ny-space-2);
  border-top: 1px solid var(--ny-border-soft);
}
</style>
