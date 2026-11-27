<script setup lang="ts">
import { computed } from 'vue'

import type { NyAlign, NyDirection, NyJustify, NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    direction?: NyDirection
    size?: NySize | number | [number, number]
    align?: NyAlign
    justify?: NyJustify
    wrap?: boolean
    block?: boolean
    inline?: boolean
    split?: boolean
  }>(),
  {
    direction: 'horizontal',
    size: 'md',
    align: 'center',
    justify: 'start',
    wrap: false,
    block: false,
    inline: false,
    split: false,
  },
)

const sizeMap: Record<NySize, number> = { sm: 8, md: 14, lg: 22 }

function toPx(value: NySize | number) {
  return typeof value === 'number' ? `${value}px` : `${sizeMap[value]}px`
}

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

const style = computed(() => {
  const [rowSize, columnSize] = Array.isArray(props.size)
    ? [props.size[0], props.size[1]]
    : [props.size, props.size]

  return {
    rowGap: toPx(rowSize),
    columnGap: toPx(columnSize),
    justifyContent: justifyMap[props.justify],
    alignItems: alignMap[props.align],
  }
})

const classes = computed(() => [
  `ny-space--${props.direction}`,
  {
    'ny-space--wrap': props.wrap,
    'ny-space--block': props.block,
    'ny-space--inline': props.inline,
    'ny-space--split': props.split,
  },
])
</script>

<template>
  <div class="ny-space" :class="classes" :style="style">
    <slot />
  </div>
</template>
