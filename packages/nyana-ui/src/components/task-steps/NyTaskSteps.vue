<script setup lang="ts">
import NyIcon from '../icon/NyIcon.vue'

export interface NyTaskStep {
  title: string
  status?: 'done' | 'current' | 'pending' | 'error'
  // 右侧的耗时或状态文字
  time?: string
}

defineProps<{
  steps: NyTaskStep[]
}>()
</script>

<template>
  <ol class="ny-task-steps">
    <li v-for="step in steps" :key="step.title" class="ny-task-steps__item" :class="`is-${step.status || 'pending'}`">
      <span class="ny-task-steps__mark" aria-hidden="true">
        <NyIcon v-if="step.status === 'done'" name="check" :size="12" :stroke-width="3" />
        <NyIcon v-else-if="step.status === 'error'" name="close" :size="12" :stroke-width="3" />
        <span v-else-if="step.status === 'current'" class="ny-task-steps__spin" />
      </span>
      <span class="ny-task-steps__title">{{ step.title }}</span>
      <span v-if="step.time" class="ny-task-steps__time">{{ step.time }}</span>
    </li>
  </ol>
</template>
