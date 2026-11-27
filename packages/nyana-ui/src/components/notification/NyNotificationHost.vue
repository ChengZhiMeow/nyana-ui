<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

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
