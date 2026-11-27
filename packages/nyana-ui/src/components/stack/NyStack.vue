<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    gap?: number
    align?: 'stretch' | 'start' | 'center' | 'end'
    fill?: boolean
  }>(),
  {
    gap: 16,
    align: 'stretch',
    fill: false,
  },
)

const style = computed(() => ({ gap: `${props.gap}px` }))
</script>

<template>
  <div
    class="ny-stack"
    :class="[`ny-stack--${align}`, { 'ny-stack--fill': fill }]"
    :style="style"
  >
    <slot />
  </div>
</template>
