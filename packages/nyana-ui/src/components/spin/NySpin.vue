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

const ringStyle = computed(() => ({
  width: `${pixelSize.value}px`,
  height: `${pixelSize.value}px`,
  borderWidth: pixelSize.value >= 24 ? '2.5px' : '2px',
}))
</script>

<template>
  <slot v-if="!spinning" />

  <div v-else class="ny-spin" :class="classes" role="status" aria-busy="true">
    <span class="ny-spin__indicator">
      <span class="ny-spin__ring" :style="ringStyle" aria-hidden="true" />

      <span v-if="tip || $slots.tip" class="ny-spin__tip">
        <slot name="tip">{{ tip }}</slot>
      </span>

      <span class="ny-sr-only">{{ label }}</span>
    </span>

    <span v-if="hasContent" class="ny-spin__content">
      <slot />
    </span>

    <span v-if="hasContent" class="ny-spin__veil" aria-hidden="true" />
  </div>
</template>
