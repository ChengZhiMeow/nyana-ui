<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    data?: Record<string, unknown>[]
    bordered?: boolean
    split?: boolean
    hoverable?: boolean
    size?: NySize
    loading?: boolean
    emptyText?: string
    itemKey?: string
  }>(),
  {
    data: () => [],
    bordered: true,
    split: true,
    hoverable: true,
    size: 'md',
    loading: false,
    emptyText: '暂无数据',
    itemKey: 'id',
  },
)

const SKELETON_ROWS = 3

const classes = computed(() => [
  `ny-list--${props.size}`,
  {
    'ny-list--bordered': props.bordered,
    'ny-list--split': props.split,
    'ny-list--hoverable': props.hoverable,
  },
])

const isEmpty = computed(() => !props.loading && props.data.length === 0)

function rowKey(item: Record<string, unknown>, index: number) {
  const value = item[props.itemKey]

  return typeof value === 'string' || typeof value === 'number' ? String(value) : String(index)
}
</script>

<template>
  <div class="ny-list" :class="classes">
    <div v-if="$slots.header" class="ny-list__header">
      <slot name="header" />
    </div>

    <ul v-if="loading" class="ny-list__body" aria-busy="true">
      <li v-for="row in SKELETON_ROWS" :key="`skeleton-${row}`" class="ny-list__item ny-list__item--skeleton">
        <span class="ny-list__skeleton ny-list__skeleton--title" />
        <span class="ny-list__skeleton ny-list__skeleton--desc" />
      </li>
    </ul>

    <div v-else-if="isEmpty" class="ny-list__empty">
      <slot name="empty">
        <span class="ny-list__empty-icon">
          <NyIcon name="inbox" :size="22" />
        </span>

        <p class="ny-list__empty-text">{{ emptyText }}</p>
      </slot>
    </div>

    <ul v-else class="ny-list__body">
      <li v-for="(item, index) in data" :key="rowKey(item, index)" class="ny-list__item">
        <slot :item="item" :index="index" />
      </li>
    </ul>

    <div v-if="$slots.footer" class="ny-list__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
