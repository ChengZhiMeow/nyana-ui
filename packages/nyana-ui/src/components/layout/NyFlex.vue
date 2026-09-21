<script setup lang="ts">
import { computed } from 'vue'

import type { NyAlign, NyJustify } from '../../types'

const props = withDefaults(
  defineProps<{
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    align?: NyAlign
    justify?: NyJustify
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
    gap?: number
    rowGap?: number
    columnGap?: number
    inline?: boolean
    fill?: boolean
  }>(),
  {
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    wrap: 'nowrap',
    gap: 12,
    rowGap: undefined,
    columnGap: undefined,
    inline: false,
    fill: false,
  },
)

const justifyMap: Record<NyJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

const alignMap: Record<NyAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

const style = computed(() => ({
  flexDirection: props.direction,
  flexWrap: props.wrap,
  justifyContent: justifyMap[props.justify],
  alignItems: alignMap[props.align],
  rowGap: `${props.rowGap ?? props.gap}px`,
  columnGap: `${props.columnGap ?? props.gap}px`,
}))
</script>

<template>
  <div
    class="ny-flex"
    :class="{ 'ny-flex--inline': inline, 'ny-flex--fill': fill }"
    :style="style"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.ny-flex {
  display: flex;
  min-width: 0;
}

.ny-flex--inline {
  display: inline-flex;
}

.ny-flex--fill {
  flex: 1;
  min-height: 0;
}
</style>
