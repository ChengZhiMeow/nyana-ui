<script setup lang="ts">
withDefaults(
  defineProps<{
    max?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    padding?: boolean
  }>(),
  {
    max: 'xl',
    padding: true,
  },
)
</script>

<template>
  <div class="ny-container" :class="[`ny-container--${max}`, { 'ny-container--pad': padding }]">
    <slot />
  </div>
</template>
