<script setup lang="ts">
import { computed, useSlots } from 'vue'

import type { CSSProperties } from 'vue'
import type { NySize, NyStatus } from '../../types'

const props = withDefaults(
  defineProps<{
    count?: number
    max?: number
    dot?: boolean
    status?: NyStatus
    text?: string
    size?: NySize
    showZero?: boolean
    offset?: [number, number]
    color?: string
  }>(),
  {
    max: 99,
    dot: false,
    text: '',
    size: 'md',
    showZero: false,
    color: '',
  },
)

const slots = useSlots()

const hasContent = computed(() => !!slots.default)
const isStatus = computed(() => !!props.status)

const visible = computed(() => {
  if (typeof props.count === 'number') {
    return props.count !== 0 || props.showZero || props.dot
  }

  return isStatus.value || props.dot || !!props.text
})

const label = computed(() => {
  if (typeof props.count !== 'number') {
    return props.text
  }

  return props.count > props.max ? `${props.max}+` : `${props.count}`
})

const classes = computed(() => [
  `ny-badge--${props.size}`,
  props.status ? `ny-badge--${props.status}` : '',
  {
    'ny-badge--host': hasContent.value,
    'is-status': isStatus.value,
  },
])

const supClasses = computed(() => ({
  'is-dot': props.dot && !isStatus.value,
  'is-status': isStatus.value,
}))

const supStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  if (props.color) {
    style['--ny-badge-color'] = props.color

    if (!isStatus.value) {
      style.color = 'var(--ny-on-primary)'
    }
  }

  if (props.offset && hasContent.value) {
    const [x, y] = props.offset
    style.transform = `translate(calc(50% + ${x}px), calc(-50% + ${y}px))`
  }

  return style
})
</script>

<template>
  <span class="ny-badge" :class="classes">
    <slot />

    <sup v-if="visible" class="ny-badge__sup" :class="supClasses" :style="supStyle">
      <template v-if="isStatus">
        <span class="ny-badge__status" />
        <span v-if="label" class="ny-badge__label">{{ label }}</span>
      </template>

      <template v-else-if="!dot">{{ label }}</template>
    </sup>
  </span>
</template>
