<script setup lang="ts">
import { computed } from 'vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    items: { label: string; value?: string | number; span?: number }[]
    column?: number
    bordered?: boolean
    size?: NySize
    title?: string
    layout?: 'horizontal' | 'vertical'
    labelWidth?: string | number
  }>(),
  {
    column: 3,
    bordered: false,
    size: 'md',
    title: '',
    layout: 'horizontal',
    labelWidth: '',
  },
)

const classes = computed(() => [
  `ny-desc--${props.size}`,
  `ny-desc--${props.layout}`,
  { 'ny-desc--bordered': props.bordered },
])

const gridStyle = computed(() => ({
  '--ny-desc-column': String(props.column),
  '--ny-desc-column-md': String(Math.min(props.column, 2)),
  '--ny-desc-column-sm': '1',
}))

const labelStyle = computed(() =>
  props.labelWidth === '' ? undefined : { width: toCssSize(props.labelWidth) },
)

function spanClass(span?: number) {
  return `ny-desc__cell--span-${Math.min(Math.max(span ?? 1, 1), 12)}`
}

function toCssSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}
</script>

<template>
  <div class="ny-desc" :class="classes">
    <header v-if="title || $slots.default" class="ny-desc__head">
      <h3 v-if="title" class="ny-desc__title">{{ title }}</h3>

      <div v-if="$slots.default" class="ny-desc__extra">
        <slot />
      </div>
    </header>

    <div class="ny-desc__grid" :style="gridStyle">
      <div
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="ny-desc__cell"
        :class="spanClass(item.span)"
      >
        <div class="ny-desc__label" :style="labelStyle">
          <slot name="label" :item="item">{{ item.label }}</slot>
        </div>

        <div class="ny-desc__value">
          <slot name="value" :item="item" :index="index">{{ item.value ?? '' }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>
