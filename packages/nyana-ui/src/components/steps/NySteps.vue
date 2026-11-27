<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NyDirection, NySize } from '../../types'

export interface NyStepItem {
  title: string
  desc?: string
  icon?: string
  status?: 'wait' | 'process' | 'finish' | 'error'
}

type NyStepStatus = 'wait' | 'process' | 'finish' | 'error'

const props = withDefaults(
  defineProps<{
    items: NyStepItem[]
    current?: number
    direction?: NyDirection
    size?: NySize
    clickable?: boolean
    progressDot?: boolean
  }>(),
  {
    items: () => [],
    current: 0,
    direction: 'horizontal',
    size: 'md',
    clickable: false,
    progressDot: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: number): void
}>()

const nodeSize = computed(() => (props.size === 'sm' ? 24 : props.size === 'lg' ? 32 : 28))

const iconSize = computed(() => (props.size === 'sm' ? 13 : 15))

const classes = computed(() => [
  `ny-steps--${props.direction}`,
  `ny-steps--${props.size}`,
  {
    'is-dot': props.progressDot,
    'is-bar': props.direction === 'horizontal' && !props.progressDot,
    'is-clickable': props.clickable,
  },
])

function statusOf(item: NyStepItem, index: number): NyStepStatus {
  if (item.status) {
    return item.status
  }

  if (index < props.current) {
    return 'finish'
  }

  return index === props.current ? 'process' : 'wait'
}

function onSelect(index: number) {
  if (!props.clickable || index === props.current) {
    return
  }

  emit('change', index)
}
</script>

<template>
  <ol class="ny-steps" :class="classes" :style="{ '--ny-steps-node': nodeSize + 'px' }">
    <li v-for="(item, index) in items" :key="index" class="ny-steps__item" :class="[`is-${statusOf(item, index)}`]">
      <span class="ny-steps__bar" aria-hidden="true" />

      <div class="ny-steps__head">
        <button
          class="ny-steps__node"
          type="button"
          :aria-current="index === current ? 'step' : undefined"
          :aria-disabled="clickable ? undefined : true"
          :tabindex="clickable ? 0 : -1"
          @click="onSelect(index)"
        >
          <NyIcon v-if="statusOf(item, index) === 'error'" name="close" :size="iconSize" />
          <NyIcon v-else-if="statusOf(item, index) === 'finish'" name="check" :size="iconSize" />
          <NyIcon v-else-if="statusOf(item, index) === 'process' && item.icon" :name="item.icon" :size="iconSize" />
          <span v-else class="ny-steps__index">{{ index + 1 }}</span>
        </button>
      </div>

      <div class="ny-steps__body">
        <span class="ny-steps__label">第 {{ index + 1 }} 步</span>

        <button
          class="ny-steps__title"
          type="button"
          :aria-current="index === current ? 'step' : undefined"
          :tabindex="clickable ? 0 : -1"
          @click="onSelect(index)"
        >
          {{ item.title }}
        </button>

        <p v-if="item.desc" class="ny-steps__desc">{{ item.desc }}</p>
      </div>
    </li>
  </ol>
</template>
