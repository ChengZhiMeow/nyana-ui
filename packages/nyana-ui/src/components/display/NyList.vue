<script setup lang="ts">
import { computed } from 'vue'

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
        <svg class="ny-list__empty-art" viewBox="0 0 64 48" aria-hidden="true" focusable="false">
          <rect x="8" y="6" width="48" height="36" rx="6" />
          <path d="M8 18h48" />
          <path d="M19 28h26" />
          <path d="M19 34h15" />
        </svg>

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

<style scoped lang="scss">
.ny-list {
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
  color: var(--ny-text);
  font-size: var(--ny-font-size-md);
}

.ny-list--bordered {
  border: 1px solid var(--ny-border);
}

.ny-list__body {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ny-list__item {
  padding: var(--ny-space-3) var(--ny-space-4);
}

.ny-list--split .ny-list__item + .ny-list__item {
  border-top: 1px solid var(--ny-border-soft);
}

.ny-list--hoverable .ny-list__item:hover {
  background: var(--ny-surface-hover);
}

.ny-list--sm .ny-list__item {
  padding: var(--ny-space-2) var(--ny-space-3);
  font-size: var(--ny-font-size-sm);
}

.ny-list--lg .ny-list__item {
  padding: var(--ny-space-4) var(--ny-space-5);
}

.ny-list__header,
.ny-list__footer {
  padding: var(--ny-space-3) var(--ny-space-4);
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
}

.ny-list__header {
  border-bottom: 1px solid var(--ny-border);
  font-weight: 600;
}

.ny-list__footer {
  border-top: 1px solid var(--ny-border);
}

.ny-list__item--skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--ny-space-2);
}

.ny-list__skeleton {
  display: block;
  height: 12px;
  border-radius: var(--ny-radius-xs);
  background: var(--ny-surface-3);
  animation: ny-list-breath 1.4s var(--ny-ease) infinite;
}

.ny-list__skeleton--title {
  width: 40%;
}

.ny-list__skeleton--desc {
  width: 72%;
  animation-delay: 0.15s;
}

.ny-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ny-space-3);
  padding: var(--ny-space-7) var(--ny-space-4);
}

.ny-list__empty-art {
  width: 88px;
  height: 66px;
  fill: none;
  stroke: var(--ny-border-strong);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ny-list__empty-text {
  margin: 0;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
}

@keyframes ny-list-breath {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>
