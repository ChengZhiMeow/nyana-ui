<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4 | 5
    align?: 'start' | 'center' | 'end'
    mark?: boolean
    ellipsis?: boolean
  }>(),
  {
    level: 1,
    align: 'start',
    mark: false,
    ellipsis: false,
  },
)

const classes = computed(() => [
  `ny-title--h${props.level}`,
  `ny-title--align-${props.align}`,
  { 'ny-title--mark': props.mark, 'ny-title--ellipsis': props.ellipsis },
])

const tag = computed(() => `h${Math.min(props.level + 1, 6)}`)
</script>

<template>
  <component :is="tag" class="ny-title" :class="classes">
    <slot />
  </component>
</template>
