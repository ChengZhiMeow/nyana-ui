<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NySize, NyStatus } from '../../types'

const props = withDefaults(
  defineProps<{
    title?: string
    value: number | string
    precision?: number
    prefix?: string
    suffix?: string
    groupSeparator?: boolean
    trend?: 'up' | 'down'
    trendText?: string
    status?: NyStatus
    size?: NySize
  }>(),
  {
    title: '',
    prefix: '',
    suffix: '',
    groupSeparator: true,
    trendText: '',
    status: 'default',
    size: 'md',
  },
)

const classes = computed(() => [`ny-stat--${props.size}`, `ny-stat--${props.status}`])

function formatNumber(input: number) {
  if (props.precision === undefined) {
    return input.toLocaleString('en-US', {
      useGrouping: props.groupSeparator,
      maximumFractionDigits: 20,
    })
  }

  return input.toLocaleString('en-US', {
    useGrouping: props.groupSeparator,
    minimumFractionDigits: props.precision,
    maximumFractionDigits: props.precision,
  })
}

const displayValue = computed(() => {
  const { value, precision } = props

  if (typeof value === 'number' && Number.isFinite(value)) {
    return formatNumber(value)
  }

  const parsed = Number(value)

  if (precision !== undefined && value !== '' && Number.isFinite(parsed)) {
    return formatNumber(parsed)
  }

  return String(value)
})

const trendIcon = computed(() => (props.trend === 'up' ? 'arrow-up' : 'arrow-down'))
</script>

<template>
  <div class="ny-stat" :class="classes">
    <p v-if="title" class="ny-stat__title">{{ title }}</p>

    <div class="ny-stat__value">
      <span v-if="prefix" class="ny-stat__affix">{{ prefix }}</span>
      <span class="ny-stat__number">{{ displayValue }}</span>
      <span v-if="suffix" class="ny-stat__affix">{{ suffix }}</span>
    </div>

    <p v-if="trend" class="ny-stat__trend" :class="`ny-stat__trend--${trend}`">
      <NyIcon :name="trendIcon" :size="13" />
      <span v-if="trendText">{{ trendText }}</span>
    </p>
  </div>
</template>
