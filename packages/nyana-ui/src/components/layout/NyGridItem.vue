<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    span?: number
    start?: number
    rowSpan?: number
  }>(),
  {
    span: 1,
    start: undefined,
    rowSpan: undefined,
  },
)

const style = computed(() => ({
  gridColumn: props.start ? `${props.start} / span ${props.span}` : `span ${props.span}`,
  gridRow: props.rowSpan ? `span ${props.rowSpan}` : undefined,
}))
</script>

<template>
  <div class="ny-grid-item" :style="style">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.ny-grid-item {
  min-width: 0;
}
</style>
