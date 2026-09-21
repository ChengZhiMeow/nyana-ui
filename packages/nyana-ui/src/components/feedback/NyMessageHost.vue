<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import { nyMessageConfig, nyMessages, removeMessage, type NyMessageItem, type NyMessageType } from './messageStore'

const timers = new Map<number, number>()

const iconMap: Record<NyMessageType, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert',
  error: 'close-circle',
  loading: 'refresh',
}

function iconOf(type: NyMessageType) {
  return iconMap[type]
}

function startTimer(item: NyMessageItem) {
  if (item.duration <= 0 || timers.has(item.id)) {
    return
  }

  timers.set(
    item.id,
    window.setTimeout(() => removeMessage(item.id), item.duration * 1000),
  )
}

watch(
  () => nyMessages.map((item) => item.id).join(','),
  () => {
    nyMessages.forEach(startTimer)

    timers.forEach((timer, id) => {
      if (!nyMessages.some((item) => item.id === id)) {
        window.clearTimeout(timer)
        timers.delete(id)
      }
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  timers.forEach((timer) => window.clearTimeout(timer))
  timers.clear()
})
</script>

<template>
  <Teleport to="body">
    <div class="ny-message" :style="{ top: `${nyMessageConfig.top}px` }" role="status" aria-live="polite">
      <transition-group name="ny-message" :duration="250">
        <div
          v-for="item in nyMessages"
          :key="item.id"
          class="ny-message__item"
          :class="`ny-message__item--${item.type}`"
        >
          <NyIcon :name="iconOf(item.type)" :size="16" :spin="item.type === 'loading'" />

          <span class="ny-message__text">{{ item.content }}</span>

          <button
            v-if="item.closable"
            class="ny-message__close"
            type="button"
            title="关闭"
            aria-label="关闭"
            @click="removeMessage(item.id)"
          >
            <NyIcon name="close" :size="13" />
          </button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-message {
  position: fixed;
  top: 24px;
  left: 50%;
  z-index: var(--ny-z-message);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ny-space-2);
  transform: translateX(-50%);
  pointer-events: none;
}

.ny-message__item {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  max-width: min(480px, calc(100vw - 32px));
  padding: 9px var(--ny-space-4);
  border: 1px solid transparent;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface-3);
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-md);
  box-shadow: var(--ny-shadow-md);
  pointer-events: auto;
}

.ny-message__text {
  min-width: 0;
  word-break: break-word;
}

.ny-message__item--info {
  background: var(--ny-info-soft);
  color: var(--ny-info-text);
}

.ny-message__item--success {
  background: var(--ny-success-soft);
  color: var(--ny-success-text);
}

.ny-message__item--warning {
  background: var(--ny-warning-soft);
  color: var(--ny-warning-text);
}

.ny-message__item--error {
  background: var(--ny-danger-soft);
  color: var(--ny-danger-text);
}

.ny-message__item--loading {
  background: var(--ny-surface-3);
  color: var(--ny-text-sub);
}

.ny-message__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex: none;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: currentColor;
  opacity: 0.6;
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover {
    opacity: 1;
    background: var(--ny-surface-3);
  }
}

.ny-message-enter-active,
.ny-message-leave-active,
.ny-message-move {
  transition:
    opacity var(--ny-transition-base),
    transform var(--ny-transition-base);
}

.ny-message-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.ny-message-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.ny-message-leave-active {
  position: absolute;
}
</style>
