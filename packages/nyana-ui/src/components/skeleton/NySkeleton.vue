<script setup lang="ts">
import { computed } from 'vue'

import type { CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    rows?: number
    title?: boolean
    avatar?: boolean
    button?: boolean
    active?: boolean
    width?: string | number
    rowWidths?: (string | number)[]
  }>(),
  {
    loading: true,
    rows: 3,
    title: true,
    avatar: false,
    button: false,
    active: false,
  },
)

function toSize(value: string | number) {
  return typeof value === 'number' ? `${value}px` : value
}

const rootStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  if (props.width !== undefined) {
    style.width = toSize(props.width)
  }

  return style
})

const lines = computed(() => {
  const total = Math.max(0, Math.floor(props.rows))

  return Array.from({ length: total }, (_, index) => {
    const custom = props.rowWidths?.[index]

    if (custom !== undefined) {
      return toSize(custom)
    }

    return total > 1 && index === total - 1 ? '60%' : '100%'
  })
})
</script>

<template>
  <div v-if="loading" class="ny-skeleton" :class="{ 'is-active': active }" :style="rootStyle" aria-busy="true">
    <div class="ny-skeleton__layout">
      <div v-if="avatar" class="ny-skeleton__avatar" aria-hidden="true" />

      <div class="ny-skeleton__paragraph">
        <div v-if="title" class="ny-skeleton__block ny-skeleton__title" aria-hidden="true" />

        <div
          v-for="(line, index) in lines"
          :key="index"
          class="ny-skeleton__block ny-skeleton__row"
          :style="{ width: line }"
          aria-hidden="true"
        />
      </div>
    </div>

    <div v-if="button" class="ny-skeleton__footer">
      <div class="ny-skeleton__block ny-skeleton__button" aria-hidden="true" />
    </div>
  </div>

  <slot v-else />
</template>
