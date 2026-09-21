<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import {
  nyNotificationConfig,
  nyNotifications,
  removeNotification,
  type NyNotificationItem,
  type NyNotificationPlacement,
  type NyNotificationType,
} from './notificationStore'

const placements: NyNotificationPlacement[] = ['topRight', 'topLeft', 'bottomRight', 'bottomLeft']

const timers = new Map<number, number>()

const iconMap: Record<NyNotificationType, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert',
  error: 'close-circle',
}

function listOf(placement: NyNotificationPlacement) {
  return nyNotifications.filter((item) => item.placement === placement)
}

const containerStyle = computed(() => ({
  '--ny-notification-offset': `${nyNotificationConfig.offset}px`,
  '--ny-notification-width': `${nyNotificationConfig.width}px`,
}))

function startTimer(item: NyNotificationItem) {
  if (item.duration <= 0 || timers.has(item.id)) {
    return
  }

  timers.set(
    item.id,
    window.setTimeout(() => removeNotification(item.id), item.duration * 1000),
  )
}

watch(
  () => nyNotifications.map((item) => item.id).join(','),
  () => {
    nyNotifications.forEach(startTimer)

    timers.forEach((timer, id) => {
      if (!nyNotifications.some((item) => item.id === id)) {
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
    <div
      v-for="placement in placements"
      :key="placement"
      class="ny-notification"
      :class="`ny-notification--${placement}`"
      :style="containerStyle"
      role="status"
      aria-live="polite"
    >
      <transition-group name="ny-notification" :duration="250">
        <div
          v-for="item in listOf(placement)"
          :key="item.id"
          class="ny-notification__card"
          :class="`ny-notification__card--${item.type}`"
        >
          <span class="ny-notification__icon">
            <NyIcon :name="iconMap[item.type]" :size="18" />
          </span>

          <div class="ny-notification__body">
            <p v-if="item.title" class="ny-notification__title">{{ item.title }}</p>
            <p v-if="item.desc" class="ny-notification__desc">{{ item.desc }}</p>
          </div>

          <button
            v-if="item.closable"
            class="ny-notification__close"
            type="button"
            title="关闭"
            aria-label="关闭"
            @click="removeNotification(item.id)"
          >
            <NyIcon name="close" :size="14" />
          </button>

          <span
            v-if="item.duration > 0"
            class="ny-notification__bar"
            :style="{ animationDuration: `${item.duration}s` }"
          />
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-notification {
  position: fixed;
  z-index: var(--ny-z-message);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: var(--ny-notification-width);
  max-width: calc(100vw - 32px);
  pointer-events: none;
}

.ny-notification--topRight {
  top: var(--ny-notification-offset);
  right: 24px;
}

.ny-notification--topLeft {
  top: var(--ny-notification-offset);
  left: 24px;
}

.ny-notification--bottomRight {
  bottom: var(--ny-notification-offset);
  right: 24px;
}

.ny-notification--bottomLeft {
  bottom: var(--ny-notification-offset);
  left: 24px;
}

.ny-notification__card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
  box-shadow: var(--ny-shadow-lg);
  overflow: hidden;
  pointer-events: auto;
}

.ny-notification__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  flex: none;
}

.ny-notification__card--info .ny-notification__icon {
  color: var(--ny-info-text);
}

.ny-notification__card--success .ny-notification__icon {
  color: var(--ny-success-text);
}

.ny-notification__card--warning .ny-notification__icon {
  color: var(--ny-warning-text);
}

.ny-notification__card--error .ny-notification__icon {
  color: var(--ny-danger-text);
}

.ny-notification__body {
  flex: 1;
  min-width: 0;
}

.ny-notification__title {
  margin: 0;
  font-size: var(--ny-font-size-md);
  font-weight: 600;
  color: var(--ny-text-strong);
}

.ny-notification__desc {
  margin: 4px 0 0;
  font-size: var(--ny-font-size-sm);
  line-height: 1.6;
  color: var(--ny-text-sub);
  word-break: break-word;
}

.ny-notification__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex: none;
  padding: 0;
  border: none;
  border-radius: var(--ny-radius-xs);
  background: transparent;
  color: var(--ny-text-muted);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover {
    background: var(--ny-surface-3);
    color: var(--ny-text);
  }
}

.ny-notification__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background: var(--ny-primary);
  transform-origin: left center;
  animation-name: ny-notification-countdown;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes ny-notification-countdown {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

.ny-notification-enter-active,
.ny-notification-leave-active,
.ny-notification-move {
  transition:
    opacity var(--ny-transition-base),
    transform var(--ny-transition-base);
}

.ny-notification-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.ny-notification-leave-to {
  opacity: 0;
  transform: translateX(16px) scale(0.98);
}

.ny-notification-leave-active {
  position: absolute;
  width: 100%;
}

.ny-notification--topLeft .ny-notification-enter-from,
.ny-notification--topLeft .ny-notification-leave-to,
.ny-notification--bottomLeft .ny-notification-enter-from,
.ny-notification--bottomLeft .ny-notification-leave-to {
  transform: translateX(-16px);
}
</style>
