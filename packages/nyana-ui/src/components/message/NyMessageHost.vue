<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

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
