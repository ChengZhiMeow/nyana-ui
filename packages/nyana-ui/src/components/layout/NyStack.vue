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

<style scoped lang="scss">
.ny-stack {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ny-stack--start {
  align-items: flex-start;
}

.ny-stack--center {
  align-items: center;
}

.ny-stack--end {
  align-items: flex-end;
}

.ny-stack--fill {
  flex: 1;
  min-height: 0;
}
</style>
