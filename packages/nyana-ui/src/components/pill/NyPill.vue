<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    dot?: boolean
  }>(),
  {
    type: 'default',
    dot: true,
  },
)
</script>

<template>
  <span class="ny-pill" :class="[`ny-pill--${type}`, { 'ny-pill--plain': !dot }]"><slot /></span>
</template>
