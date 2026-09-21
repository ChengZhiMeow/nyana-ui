<script setup lang="ts">
import { computed } from 'vue'

import type { NyAlign, NyJustify } from '../../types'

const props = withDefaults(
  defineProps<{
    gap?: number
    align?: NyAlign
    justify?: NyJustify
    wrap?: boolean
    inline?: boolean
  }>(),
  {
    gap: 12,
    align: 'center',
    justify: 'start',
    wrap: false,
    inline: false,
  },
)

const style = computed(() => ({ gap: `${props.gap}px` }))

const justifyMap: Record<NyJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

const classList = computed(() => [
  `ny-row--align-${props.align}`,
  { 'ny-row--wrap': props.wrap, 'ny-row--inline': props.inline },
])

const rowStyle = computed(() => ({
  ...style.value,
  justifyContent: justifyMap[props.justify],
}))
</script>

<template>
  <div class="ny-row" :class="classList" :style="rowStyle">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.ny-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.ny-row--inline {
  display: inline-flex;
}

.ny-row--wrap {
  flex-wrap: wrap;
}

.ny-row--align-start {
  align-items: flex-start;
}

.ny-row--align-center {
  align-items: center;
}

.ny-row--align-end {
  align-items: flex-end;
}

.ny-row--align-baseline {
  align-items: baseline;
}

.ny-row--align-stretch {
  align-items: stretch;
}
</style>
