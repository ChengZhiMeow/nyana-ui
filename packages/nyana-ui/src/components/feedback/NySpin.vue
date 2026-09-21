<script setup lang="ts">
import { computed, useSlots } from 'vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    size?: NySize | number
    label?: string
    spinning?: boolean
    tip?: string
    blur?: boolean
  }>(),
  {
    size: 'md',
    label: '加载中',
    spinning: true,
    tip: '',
    blur: false,
  },
)

const slots = useSlots()

const SIZES: Record<NySize, number> = { sm: 16, md: 22, lg: 28 }

const hasContent = computed(() => Boolean(slots.default))

const pixelSize = computed(() => (typeof props.size === 'number' ? props.size : SIZES[props.size]))

const classes = computed(() => ({
  'is-wrap': hasContent.value,
  'is-blurred': props.blur && hasContent.value,
}))

const ringStyle = computed(() => ({ width: `${pixelSize.value}px`, height: `${pixelSize.value}px` }))
</script>

<template>
  <slot v-if="!spinning" />

  <div v-else class="ny-spin" :class="classes" role="status" aria-busy="true">
    <span class="ny-spin__indicator">
      <svg class="ny-spin__svg" :style="ringStyle" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle class="ny-spin__track" cx="12" cy="12" r="9.5" />
        <circle class="ny-spin__ring" cx="12" cy="12" r="9.5" />
      </svg>

      <span v-if="tip || $slots.tip" class="ny-spin__tip">
        <slot name="tip">{{ tip }}</slot>
      </span>

      <span class="ny-sr-only">{{ label }}</span>
    </span>

    <span v-if="hasContent" class="ny-spin__content">
      <slot />
    </span>

    <span v-if="blur && hasContent" class="ny-spin__veil" aria-hidden="true" />
  </div>
</template>

<style scoped lang="scss">
$ny-spin-radius: 9.5;
$ny-spin-circumference: 2 * 3.14159265 * $ny-spin-radius;

.ny-spin {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ny-space-2);
}

.ny-spin.is-wrap {
  display: block;
}

.ny-spin__content {
  display: block;
  min-width: 0;
}

.ny-spin__indicator {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ny-space-2);
}

.ny-spin.is-wrap .ny-spin__indicator {
  position: absolute;
  inset: 0;
  z-index: 2;
  justify-content: center;
}

.ny-spin__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: var(--ny-surface);
  opacity: 0.72;
}

.ny-spin__svg {
  display: block;
  transform-origin: center;
  animation: ny-spin-rotate 0.9s linear infinite;
}

.ny-spin__track {
  fill: none;
  stroke: var(--ny-track);
  stroke-width: 2.6;
}

.ny-spin__ring {
  fill: none;
  stroke: var(--ny-primary);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-dasharray: $ny-spin-circumference * 0.7 $ny-spin-circumference;
}

.ny-spin__tip {
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
}

@keyframes ny-spin-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
