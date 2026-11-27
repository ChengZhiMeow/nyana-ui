<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    percent?: number
    type?: 'line' | 'circle'
    status?: 'normal' | 'success' | 'error'
    showText?: boolean
    strokeWidth?: number
    size?: number
    indeterminate?: boolean
    format?: (percent: number) => string
  }>(),
  {
    percent: 0,
    type: 'line',
    status: 'normal',
    showText: true,
    strokeWidth: 8,
    size: 96,
    indeterminate: false,
  },
)

const clamped = computed(() => {
  const value = Number(props.percent)

  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(100, Math.max(0, value))
})

const isIndeterminate = computed(() => props.indeterminate && props.type === 'line')

const text = computed(() => (props.format ? props.format(clamped.value) : `${Math.round(clamped.value)}%`))

const showValueText = computed(() => props.showText && !isIndeterminate.value)

const classes = computed(() => [
  `ny-progress--${props.type}`,
  `ny-progress--${props.status}`,
  {
    'is-indeterminate': isIndeterminate.value,
  },
])

const barStyle = computed(() => ({ width: `${clamped.value}%` }))

const radius = computed(() => Math.max(props.size - props.strokeWidth, 0) / 2)

const circumference = computed(() => 2 * Math.PI * radius.value)

const viewBox = computed(() => `0 0 ${props.size} ${props.size}`)

const ringStyle = computed(() => ({ width: `${props.size}px`, height: `${props.size}px` }))

const center = computed(() => props.size / 2)

const fillStyle = computed(() => ({
  strokeDasharray: `${circumference.value} ${circumference.value}`,
  strokeDashoffset: `${circumference.value * (1 - clamped.value / 100)}`,
}))
</script>

<template>
  <div
    class="ny-progress"
    :class="classes"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="isIndeterminate ? undefined : clamped"
    :aria-valuetext="text"
    :aria-busy="isIndeterminate ? 'true' : undefined"
  >
    <div
      v-if="type === 'line'"
      class="ny-progress__track"
      :style="{ height: `${strokeWidth}px` }"
    >
      <div v-if="!isIndeterminate" class="ny-progress__bar" :style="barStyle" />
      <div v-else class="ny-progress__slider" />
    </div>

    <div v-else class="ny-progress__ring" :style="ringStyle">
      <svg class="ny-progress__svg" :viewBox="viewBox" fill="none" aria-hidden="true" focusable="false">
        <circle
          class="ny-progress__trail"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
        />

        <circle
          class="ny-progress__fill"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
          :style="fillStyle"
        />
      </svg>
    </div>

    <span v-if="showValueText" class="ny-progress__text" aria-hidden="true">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>
