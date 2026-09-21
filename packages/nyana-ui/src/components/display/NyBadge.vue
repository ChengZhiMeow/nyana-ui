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
      style.color = 'var(--ny-text-invert)'
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

<style scoped lang="scss">
.ny-badge {
  --ny-badge-color: var(--ny-red);
  --ny-badge-fg: var(--ny-on-red);
  --ny-badge-size: 20px;
  --ny-badge-font: var(--ny-font-size-xs);
  --ny-badge-dot: 8px;

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--ny-space-2);
  line-height: 1;
  vertical-align: middle;
}

.ny-badge--sm {
  --ny-badge-size: 16px;
  --ny-badge-font: 11px;
  --ny-badge-dot: 6px;
}

.ny-badge--lg {
  --ny-badge-size: 22px;
  --ny-badge-font: var(--ny-font-size-sm);
  --ny-badge-dot: 10px;
}

.ny-badge--default {
  --ny-badge-color: var(--ny-text-muted);
  --ny-badge-fg: var(--ny-surface);
}

.ny-badge--primary {
  --ny-badge-color: var(--ny-primary);
  --ny-badge-fg: var(--ny-on-primary);
}

.ny-badge--info {
  --ny-badge-color: var(--ny-info);
  --ny-badge-fg: var(--ny-on-primary);
}

.ny-badge--success {
  --ny-badge-color: var(--ny-success);
  --ny-badge-fg: var(--ny-on-success);
}

.ny-badge--warning {
  --ny-badge-color: var(--ny-warning);
  --ny-badge-fg: var(--ny-on-warning);
}

.ny-badge--danger {
  --ny-badge-color: var(--ny-danger);
  --ny-badge-fg: var(--ny-on-danger);
}

.ny-badge__sup {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--ny-badge-size);
  height: var(--ny-badge-size);
  padding: 0 6px;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-badge-color);
  color: var(--ny-badge-fg);
  font-size: var(--ny-badge-font);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.ny-badge--host .ny-badge__sup:not(.is-status) {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.ny-badge__sup.is-dot {
  min-width: 0;
  width: var(--ny-badge-dot);
  height: var(--ny-badge-dot);
  padding: 0;
}

.ny-badge__sup.is-status {
  gap: 6px;
  min-width: 0;
  height: auto;
  padding: 0;
  background: transparent;
  color: var(--ny-text);
}

.ny-badge__status {
  flex: none;
  width: var(--ny-badge-dot);
  height: var(--ny-badge-dot);
  border-radius: 50%;
  background: var(--ny-badge-color);
}

.ny-badge__label {
  color: var(--ny-text);
  font-size: var(--ny-font-size-sm);
  font-weight: 400;
}
</style>
