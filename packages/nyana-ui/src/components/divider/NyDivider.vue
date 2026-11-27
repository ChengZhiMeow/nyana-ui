<script setup lang="ts">
withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    dashed?: boolean
    align?: 'start' | 'center' | 'end'
    spacing?: number
  }>(),
  {
    direction: 'horizontal',
    dashed: false,
    align: 'center',
    spacing: 16,
  },
)
</script>

<template>
  <div
    class="ny-divider"
    :class="[
      `ny-divider--${direction}`,
      `ny-divider--align-${align}`,
      { 'ny-divider--dashed': dashed },
    ]"
    :style="direction === 'horizontal' ? { margin: `${spacing}px 0` } : undefined"
    role="separator"
  >
    <span v-if="$slots.default" class="ny-divider__text"><slot /></span>
  </div>
</template>
