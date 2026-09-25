<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

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
      <NyIcon :name="trendIcon" :size="14" />
      <span v-if="trendText">{{ trendText }}</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.ny-stat {
  display: flex;
  flex-direction: column;
  gap: var(--ny-space-1);
  min-width: 0;
  text-align: left;
}

.ny-stat__title {
  margin: 0;
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
}

.ny-stat__value {
  display: flex;
  align-items: baseline;
  gap: 2px;
  color: var(--ny-text-strong);
  font-family: var(--ny-font-family-mono);
  font-weight: 600;
  line-height: 1.2;
}

.ny-stat__affix {
  font-size: 0.6em;
  color: var(--ny-text-sub);
}

.ny-stat__number {
  font-variant-numeric: tabular-nums;
}

.ny-stat__trend {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--ny-space-1);
  font-size: var(--ny-font-size-sm);
}

.ny-stat__trend--up {
  color: var(--ny-success-text);
}

.ny-stat__trend--down {
  color: var(--ny-danger-text);
}

.ny-stat--sm .ny-stat__value {
  font-size: 22px;
}

.ny-stat--md .ny-stat__value {
  font-size: 28px;
}

.ny-stat--lg .ny-stat__value {
  font-size: 36px;
}

.ny-stat--primary .ny-stat__value {
  color: var(--ny-primary-text);
}

.ny-stat--info .ny-stat__value {
  color: var(--ny-info-text);
}

.ny-stat--success .ny-stat__value {
  color: var(--ny-success-text);
}

.ny-stat--warning .ny-stat__value {
  color: var(--ny-warning-text);
}

.ny-stat--danger .ny-stat__value {
  color: var(--ny-danger-text);
}
</style>
