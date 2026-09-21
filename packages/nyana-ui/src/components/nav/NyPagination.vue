<script setup lang="ts">
import { computed, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    total: number
    pageSize?: number
    size?: NySize
    showTotal?: boolean
    showSizeChanger?: boolean
    pageSizes?: number[]
    simple?: boolean
    disabled?: boolean
    maxButtons?: number
    maxPage?: number
  }>(),
  {
    pageSize: 10,
    size: 'md',
    showTotal: true,
    showSizeChanger: false,
    pageSizes: () => [10, 20, 50, 100],
    simple: false,
    disabled: false,
    maxButtons: 7,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: { page: number; pageSize: number }): void
}>()

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const hasTotal = computed(() => Number.isFinite(props.total) && props.total > 0)

const pageCap = computed(() => (props.maxPage && props.maxPage > 0 ? Math.floor(props.maxPage) : 0))

const totalPages = computed(() => {
  const byTotal = hasTotal.value ? Math.max(1, Math.ceil(props.total / Math.max(1, pageSize.value))) : 0

  if (byTotal > 0 && pageCap.value > 0) {
    return Math.min(byTotal, pageCap.value)
  }

  return byTotal || pageCap.value
})

const hasPages = computed(() => totalPages.value > 0)

const currentPage = computed(() => Math.min(Math.max(1, page.value || 1), Math.max(1, totalPages.value)))

const classes = computed(() => [`ny-pagination--${props.size}`, { 'is-disabled': props.disabled }])

const iconSize = computed(() => (props.size === 'sm' ? 13 : 15))

const buttons = computed<(number | 'ellipsis')[]>(() => {
  const last = totalPages.value
  const max = Math.max(5, props.maxButtons)

  if (last <= max) {
    return Array.from({ length: last }, (_, index) => index + 1)
  }

  const side = Math.floor((max - 4) / 2)
  const from = currentPage.value - side
  const to = currentPage.value + side

  if (from <= 2) {
    return [...Array.from({ length: max - 2 }, (_, index) => index + 1), 'ellipsis', last]
  }

  if (to >= last - 1) {
    return [1, 'ellipsis', ...Array.from({ length: max - 2 }, (_, index) => last - max + 3 + index)]
  }

  return [1, 'ellipsis', ...Array.from({ length: side * 2 + 1 }, (_, index) => from + index), 'ellipsis', last]
})

const selectedPageSize = computed(() => pageSize.value || props.pageSize)

function goTo(value: number) {
  if (props.disabled) {
    return
  }

  const target = Math.min(Math.max(1, value), Math.max(1, totalPages.value))

  if (target === currentPage.value) {
    return
  }

  page.value = target
  emit('change', { page: target, pageSize: selectedPageSize.value })
}

function onSizeChange(event: Event) {
  const next = Number((event.target as HTMLSelectElement).value)

  if (!Number.isFinite(next) || next <= 0) {
    return
  }

  pageSize.value = next
  page.value = 1
  emit('change', { page: 1, pageSize: next })
}

watch(
  [currentPage, hasPages],
  () => {
    if (hasPages.value && page.value !== currentPage.value) {
      page.value = currentPage.value
    }
  },
  { immediate: true },
)
</script>

<template>
  <nav v-if="hasPages" class="ny-pagination" :class="classes" aria-label="分页">
    <span v-if="showTotal && hasTotal" class="ny-pagination__total">共 {{ total }} 条</span>

    <template v-if="simple">
      <button
        class="ny-pagination__btn"
        type="button"
        aria-label="上一页"
        :disabled="disabled || currentPage <= 1"
        @click="goTo(currentPage - 1)"
      >
        <NyIcon name="chevron-left" :size="iconSize" />
      </button>

      <span class="ny-pagination__simple" aria-live="polite">{{ currentPage }} / {{ totalPages }}</span>

      <button
        class="ny-pagination__btn"
        type="button"
        aria-label="下一页"
        :disabled="disabled || currentPage >= totalPages"
        @click="goTo(currentPage + 1)"
      >
        <NyIcon name="chevron-right" :size="iconSize" />
      </button>
    </template>

    <template v-else>
      <button
        class="ny-pagination__btn"
        type="button"
        aria-label="上一页"
        :disabled="disabled || currentPage <= 1"
        @click="goTo(currentPage - 1)"
      >
        <NyIcon name="chevron-left" :size="iconSize" />
      </button>

      <template v-for="(item, index) in buttons" :key="`${item}-${index}`">
        <span v-if="item === 'ellipsis'" class="ny-pagination__ellipsis" aria-hidden="true">···</span>

        <button
          v-else
          class="ny-pagination__item"
          :class="{ 'is-active': item === currentPage }"
          type="button"
          :aria-label="`第 ${item} 页`"
          :aria-current="item === currentPage ? 'page' : undefined"
          :disabled="disabled"
          @click="goTo(item)"
        >
          {{ item }}
        </button>
      </template>

      <button
        class="ny-pagination__btn"
        type="button"
        aria-label="下一页"
        :disabled="disabled || currentPage >= totalPages"
        @click="goTo(currentPage + 1)"
      >
        <NyIcon name="chevron-right" :size="iconSize" />
      </button>
    </template>

    <select
      v-if="showSizeChanger"
      class="ny-pagination__size"
      aria-label="每页条数"
      :value="selectedPageSize"
      :disabled="disabled"
      @change="onSizeChange"
    >
      <option v-for="sizeOption in pageSizes" :key="sizeOption" :value="sizeOption">{{ sizeOption }} 条/页</option>
    </select>
  </nav>
</template>

<style scoped lang="scss">
.ny-pagination {
  display: flex;
  align-items: center;
  gap: var(--ny-space-1);
  font-size: var(--ny-font-size-md);

  &.is-disabled {
    opacity: 0.6;
  }
}

.ny-pagination__total {
  margin-right: var(--ny-space-2);
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
}

.ny-pagination__item,
.ny-pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--ny-control-height-md);
  height: var(--ny-control-height-md);
  padding: 0 6px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface);
  color: var(--ny-text);
  font-size: var(--ny-font-size-sm);
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    border-color var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &:hover:not(:disabled, .is-active) {
    border-color: var(--ny-primary);
    color: var(--ny-primary-text);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &:disabled {
    background: var(--ny-surface-2);
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}

.ny-pagination__item.is-active {
  border-color: transparent;
  background: var(--ny-primary-soft);
  color: var(--ny-primary-text);
  font-weight: 600;
}

.ny-pagination__ellipsis {
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  min-width: 24px;
  height: var(--ny-control-height-md);
  color: var(--ny-text-muted);
  user-select: none;
}

.ny-pagination__simple {
  padding: 0 var(--ny-space-2);
  color: var(--ny-text-sub);
}

.ny-pagination__size {
  height: var(--ny-control-height-md);
  margin-left: var(--ny-space-2);
  padding: 0 var(--ny-space-2);
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface);
  color: var(--ny-text);
  font-size: var(--ny-font-size-sm);
  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }
}

.ny-pagination--sm {
  font-size: var(--ny-font-size-sm);

  .ny-pagination__item,
  .ny-pagination__btn {
    min-width: var(--ny-control-height-sm);
    height: var(--ny-control-height-sm);
    font-size: var(--ny-font-size-xs);
  }

  .ny-pagination__ellipsis,
  .ny-pagination__size {
    height: var(--ny-control-height-sm);
  }
}

.ny-pagination--lg {
  font-size: var(--ny-font-size-lg);

  .ny-pagination__item,
  .ny-pagination__btn {
    min-width: var(--ny-control-height-lg);
    height: var(--ny-control-height-lg);
    font-size: var(--ny-font-size-md);
  }

  .ny-pagination__ellipsis,
  .ny-pagination__size {
    height: var(--ny-control-height-lg);
  }
}
</style>
