<script setup lang="ts">
import { computed } from 'vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    columns?: number | 'auto'
    minItemWidth?: number
    gap?: number | [number, number]
    dense?: boolean
    responsive?: Partial<Record<NySize, number>>
  }>(),
  {
    columns: 'auto',
    minItemWidth: 280,
    gap: 18,
    dense: false,
    responsive: undefined,
  },
)

function template(cols: number | 'auto' | undefined) {
  if (cols === 'auto' || cols === undefined) {
    return undefined
  }

  return `repeat(${cols}, minmax(0, 1fr))`
}

const autoTemplate = computed(() => `repeat(auto-fill, minmax(${props.minItemWidth}px, 1fr))`)

const style = computed(() => {
  const [rowGap, columnGap] = Array.isArray(props.gap) ? [props.gap[0], props.gap[1]] : [props.gap, props.gap]
  const responsive = props.responsive ?? {}

  return {
    '--ny-grid-cols': template(props.columns) ?? autoTemplate.value,
    '--ny-grid-cols-sm': template(responsive.sm),
    '--ny-grid-cols-md': template(responsive.md),
    '--ny-grid-cols-lg': template(responsive.lg),
    '--ny-grid-cols-xl': template(responsive.lg),
    rowGap: `${rowGap}px`,
    columnGap: `${columnGap}px`,
    gridAutoFlow: props.dense ? 'row dense' : undefined,
  }
})
</script>

<template>
  <div class="ny-grid" :style="style">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.ny-grid {
  display: grid;
  grid-template-columns: var(--ny-grid-cols);
  min-width: 0;
}

@media (min-width: 640px) {
  .ny-grid {
    grid-template-columns: var(--ny-grid-cols-sm, var(--ny-grid-cols));
  }
}

@media (min-width: 768px) {
  .ny-grid {
    grid-template-columns: var(--ny-grid-cols-md, var(--ny-grid-cols-sm, var(--ny-grid-cols)));
  }
}

@media (min-width: 1024px) {
  .ny-grid {
    grid-template-columns:
      var(--ny-grid-cols-lg, var(--ny-grid-cols-md, var(--ny-grid-cols-sm, var(--ny-grid-cols))));
  }
}
</style>
