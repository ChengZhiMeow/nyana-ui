<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

import NyIcon from '../basic/NyIcon.vue'
import NyPagination from '../nav/NyPagination.vue'

import type { NySize } from '../../types'

interface NyTablePagination {
  mode?: 'sync' | 'async'
  total?: number
  pageSize?: number
  pageSizes?: number[]
  maxPage?: number
  showSizeChanger?: boolean
  showTotal?: boolean
  align?: 'start' | 'center' | 'end'
}

const props = withDefaults(
  defineProps<{
    columns: {
      key: string
      title: string
      width?: number | string
      align?: 'start' | 'center' | 'end'
      sortable?: boolean
      ellipsis?: boolean
    }[]
    data: Record<string, unknown>[]
    rowKey?: string
    size?: NySize
    bordered?: boolean
    striped?: boolean
    hoverable?: boolean
    loading?: boolean
    emptyText?: string
    maxHeight?: number
    selectable?: boolean
    rowDisabled?: (row: Record<string, unknown>, index: number) => boolean
    pagination?: boolean | NyTablePagination
  }>(),
  {
    rowKey: 'id',
    size: 'md',
    bordered: false,
    striped: false,
    hoverable: true,
    loading: false,
    emptyText: '暂无数据',
    selectable: false,
    pagination: false,
  },
)

const emit = defineEmits<{
  (event: 'sort-change', payload: { key: string; order: 'asc' | 'desc' | null }): void
  (event: 'row-click', payload: { row: Record<string, unknown>; index: number }): void
  (event: 'selection-change', payload: (string | number)[]): void
  (event: 'page-change', payload: { page: number; pageSize: number }): void
}>()

const selectedKeys = defineModel<(string | number)[]>('selectedKeys', { default: () => [] })

const paginationConfig = computed<NyTablePagination | null>(() => {
  if (!props.pagination) {
    return null
  }

  return props.pagination === true ? {} : props.pagination
})

const pageModel = defineModel<number>('page', { default: 1 })
const pageSizeModel = defineModel<number>('pageSize')

const activePageSize = computed(() => {
  const bound = pageSizeModel.value

  if (typeof bound === 'number' && bound > 0) {
    return Math.floor(bound)
  }

  const fromConfig = paginationConfig.value?.pageSize

  return typeof fromConfig === 'number' && fromConfig > 0 ? Math.floor(fromConfig) : 10
})

const paginationMode = computed(() => paginationConfig.value?.mode ?? 'sync')

const paginationTotal = computed(() => {
  const config = paginationConfig.value

  if (!config) {
    return 0
  }

  if (typeof config.total === 'number' && Number.isFinite(config.total)) {
    return Math.max(0, config.total)
  }

  return paginationMode.value === 'sync' ? props.data.length : 0
})

const slicePage = computed(() => {
  const raw = Math.max(1, Math.floor(pageModel.value || 1))

  if (paginationMode.value !== 'sync') {
    return raw
  }

  const pages = Math.max(1, Math.ceil(props.data.length / activePageSize.value))

  return Math.min(raw, pages)
})

const visibleRows = computed(() => {
  const config = paginationConfig.value

  if (!config || paginationMode.value === 'async') {
    return props.data.map((row, index) => ({ row, index }))
  }

  const size = activePageSize.value
  const from = (slicePage.value - 1) * size

  return props.data.slice(from, from + size).map((row, index) => ({ row, index: from + index }))
})

const showFooter = computed(() => {
  const config = paginationConfig.value

  if (!config) {
    return false
  }

  return paginationTotal.value > 0 || Boolean(config.maxPage)
})

const footerClass = computed(() => `ny-table__footer--${paginationConfig.value?.align ?? 'end'}`)

const SKELETON_ROWS = 3

const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc' | null>(null)
const headCheckbox = ref<HTMLInputElement | null>(null)

const classes = computed(() => [
  `ny-table--${props.size}`,
  {
    'ny-table--bordered': props.bordered,
    'ny-table--striped': props.striped,
    'ny-table--hoverable': props.hoverable,
    'ny-table--fixed-head': Boolean(props.maxHeight),
    'ny-table--paginated': showFooter.value,
  },
])

const scrollStyle = computed(() =>
  props.maxHeight ? { maxHeight: `${props.maxHeight}px` } : undefined,
)

const colspan = computed(() => props.columns.length + (props.selectable ? 1 : 0))

const selectableKeys = computed(() =>
  visibleRows.value
    .filter(({ row, index }) => !disabledAt(row, index))
    .map(({ row, index }) => resolveKey(row, index)),
)

const allSelected = computed(
  () =>
    selectableKeys.value.length > 0 &&
    selectableKeys.value.every((key) => selectedKeys.value.includes(key)),
)

const someSelected = computed(() =>
  selectableKeys.value.some((key) => selectedKeys.value.includes(key)),
)

watchEffect(() => {
  if (headCheckbox.value) {
    headCheckbox.value.indeterminate = !allSelected.value && someSelected.value
  }
})

function toCssSize(value?: number | string) {
  if (value === undefined || value === '') {
    return undefined
  }

  return typeof value === 'number' ? `${value}px` : value
}

function alignClass(align?: 'start' | 'center' | 'end') {
  return align && align !== 'start' ? `ny-table__cell--${align}` : ''
}

const SKELETON_WIDTHS = ['72%', '44%', '88%', '58%']

function skeletonWidth(seed: number) {
  return SKELETON_WIDTHS[seed % SKELETON_WIDTHS.length]
}

function onPageChange(payload: { page: number; pageSize: number }) {
  emit('page-change', payload)
}

function resolveKey(row: Record<string, unknown>, index: number): string | number {
  const value = row[props.rowKey]

  return typeof value === 'string' || typeof value === 'number' ? value : index
}

function disabledAt(row: Record<string, unknown>, index: number) {
  return props.rowDisabled?.(row, index) ?? false
}

function cellText(value: unknown) {
  if (value === null || value === undefined) {
    return ''
  }

  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}

function nextOrder(key: string): 'asc' | 'desc' | null {
  if (sortKey.value !== key) {
    return 'asc'
  }

  if (sortOrder.value === 'asc') {
    return 'desc'
  }

  if (sortOrder.value === 'desc') {
    return null
  }

  return 'asc'
}

function toggleSort(key: string) {
  const order = nextOrder(key)

  sortKey.value = key
  sortOrder.value = order
  emit('sort-change', { key, order })
}

function ariaSort(column: { key: string; sortable?: boolean }) {
  if (!column.sortable) {
    return undefined
  }

  if (sortKey.value !== column.key || !sortOrder.value) {
    return 'none'
  }

  return sortOrder.value === 'asc' ? 'ascending' : 'descending'
}

function toggleAll() {
  const next = allSelected.value
    ? selectedKeys.value.filter((key) => !selectableKeys.value.includes(key))
    : [
        ...selectedKeys.value,
        ...selectableKeys.value.filter((key) => !selectedKeys.value.includes(key)),
      ]

  selectedKeys.value = next
  emit('selection-change', next)
}

function toggleRow(row: Record<string, unknown>, index: number) {
  if (disabledAt(row, index)) {
    return
  }

  const key = resolveKey(row, index)
  const next = selectedKeys.value.includes(key)
    ? selectedKeys.value.filter((item) => item !== key)
    : [...selectedKeys.value, key]

  selectedKeys.value = next
  emit('selection-change', next)
}

function onRowClick(row: Record<string, unknown>, index: number) {
  emit('row-click', { row, index })
}
</script>

<template>
  <div class="ny-table" :class="classes">
    <div v-if="$slots['header-extra']" class="ny-table__toolbar">
      <slot name="header-extra" />
    </div>

    <div class="ny-scroll ny-table__scroll" :style="scrollStyle">
      <table class="ny-table__table">
        <colgroup>
          <col v-if="selectable" class="ny-table__col-select" />
          <col v-for="column in columns" :key="column.key" :style="{ width: toCssSize(column.width) }" />
        </colgroup>

        <thead class="ny-table__head">
          <tr>
            <th v-if="selectable" class="ny-table__cell ny-table__cell--select" scope="col">
              <input
                ref="headCheckbox"
                class="ny-table__checkbox"
                type="checkbox"
                :checked="allSelected"
                :disabled="selectableKeys.length === 0"
                aria-label="全选"
                @change="toggleAll"
              />
            </th>

            <th
              v-for="column in columns"
              :key="column.key"
              class="ny-table__cell"
              :class="alignClass(column.align)"
              scope="col"
              :aria-sort="ariaSort(column)"
            >
              <button v-if="column.sortable" type="button" class="ny-table__sorter" @click="toggleSort(column.key)">
                <span class="ny-table__sorter-text">{{ column.title }}</span>
                <NyIcon
                  v-if="sortKey === column.key && sortOrder"
                  :name="sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'"
                  :size="14"
                />
                <NyIcon v-else class="ny-table__sorter-idle" name="sort" :size="14" />
              </button>

              <template v-else>{{ column.title }}</template>
            </th>
          </tr>
        </thead>

        <tbody class="ny-table__body">
          <template v-if="loading">
            <tr v-for="row in SKELETON_ROWS" :key="`skeleton-${row}`" class="ny-table__row">
              <td v-if="selectable" class="ny-table__cell ny-table__cell--select">
                <span class="ny-table__skeleton" style="width: 16px" />
              </td>

              <td
                v-for="(column, columnIndex) in columns"
                :key="column.key"
                class="ny-table__cell"
                :class="alignClass(column.align)"
              >
                <span class="ny-table__skeleton" :style="{ width: skeletonWidth(row + columnIndex) }" />
              </td>
            </tr>
          </template>

          <tr v-else-if="visibleRows.length === 0" class="ny-table__row">
            <td :colspan="colspan" class="ny-table__cell ny-table__cell--empty">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>

          <template v-else>
            <tr
              v-for="{ row, index } in visibleRows"
              :key="resolveKey(row, index)"
              class="ny-table__row"
              :class="{
                'is-disabled': disabledAt(row, index),
                'is-selected': selectedKeys.includes(resolveKey(row, index)),
              }"
              tabindex="0"
              @click="onRowClick(row, index)"
              @keydown.enter="onRowClick(row, index)"
            >
              <td v-if="selectable" class="ny-table__cell ny-table__cell--select" @click.stop>
                <input
                  class="ny-table__checkbox"
                  type="checkbox"
                  :checked="selectedKeys.includes(resolveKey(row, index))"
                  :disabled="disabledAt(row, index)"
                  :aria-label="`选择第 ${index + 1} 行`"
                  @change="toggleRow(row, index)"
                />
              </td>

              <td
                v-for="column in columns"
                :key="column.key"
                class="ny-table__cell"
                :class="alignClass(column.align)"
              >
                <div class="ny-table__text" :class="{ 'ny-table__text--ellipsis': column.ellipsis }">
                  <slot
                    :name="column.key"
                    :row="row"
                    :value="row[column.key]"
                    :index="index"
                    :column="column"
                  >{{ cellText(row[column.key]) }}</slot>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="showFooter" class="ny-table__footer" :class="footerClass">
      <div v-if="$slots.footer" class="ny-table__footer-extra">
        <slot name="footer" />
      </div>

      <NyPagination
        v-model:page="pageModel"
        :page-size="activePageSize"
        :total="paginationTotal"
        :max-page="paginationConfig?.maxPage"
        :page-sizes="paginationConfig?.pageSizes"
        :show-size-changer="paginationConfig?.showSizeChanger ?? false"
        :show-total="paginationConfig?.showTotal ?? true"
        :size="size"
        @update:page-size="pageSizeModel = $event"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-table {
  position: relative;
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
  color: var(--ny-text);
}

.ny-table--bordered {
  border: 1px solid var(--ny-border);
}

.ny-table__toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ny-space-2);
  padding: var(--ny-space-3) var(--ny-space-3) 0;
}

.ny-table__scroll {
  overflow: auto;
}

.ny-table__table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  font-size: var(--ny-font-size-md);
}

.ny-table__col-select {
  width: 46px;
}

.ny-table__cell {
  padding: 11px var(--ny-space-3);
  border-bottom: 1px solid var(--ny-border);
  text-align: left;
  vertical-align: middle;
  overflow: hidden;
}

.ny-table__head .ny-table__cell {
  background: var(--ny-surface-2);
  color: var(--ny-text-sub);
  font-weight: 600;
  white-space: nowrap;
}

.ny-table__head .ny-table__cell:first-child {
  border-start-start-radius: calc(var(--ny-radius-md) - 1px);
}

.ny-table__head .ny-table__cell:last-child {
  border-start-end-radius: calc(var(--ny-radius-md) - 1px);
}

.ny-table:not(.ny-table--paginated) .ny-table__body tr:last-child .ny-table__cell:first-child {
  border-end-start-radius: calc(var(--ny-radius-md) - 1px);
}

.ny-table:not(.ny-table--paginated) .ny-table__body tr:last-child .ny-table__cell:last-child {
  border-end-end-radius: calc(var(--ny-radius-md) - 1px);
}

.ny-table--fixed-head .ny-table__head .ny-table__cell {
  position: sticky;
  top: 0;
  z-index: 1;
}

.ny-table__cell--center {
  text-align: center;
}

.ny-table__cell--end {
  text-align: right;
}

.ny-table__cell--select {
  width: 46px;
  padding-right: 0;
  text-align: center;
}

.ny-table__cell--empty {
  padding: var(--ny-space-7) var(--ny-space-4);
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
  text-align: center;
}

.ny-table--bordered .ny-table__cell {
  border-right: 1px solid var(--ny-border);
}

.ny-table--bordered .ny-table__cell:last-child {
  border-right: 0;
}

.ny-table__body tr:last-child .ny-table__cell {
  border-bottom: 0;
}

.ny-table--striped .ny-table__body tr:nth-child(even) {
  background: var(--ny-surface-2);
}

.ny-table__row {
  transition: background var(--ny-transition-fast);
}

.ny-table--hoverable .ny-table__body .ny-table__row:hover {
  background: var(--ny-surface-hover);
}

.ny-table__body .ny-table__row.is-selected {
  background: var(--ny-primary-soft);
}

.ny-table__body .ny-table__row.is-selected .ny-table__cell:first-child {
  box-shadow: inset 2px 0 0 var(--ny-primary-strong);
}

.ny-table__body .ny-table__row.is-disabled {
  color: var(--ny-text-muted);
  cursor: not-allowed;
}

.ny-table__sorter {
  display: inline-flex;
  align-items: center;
  gap: var(--ny-space-1);
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.ny-table__cell--center .ny-table__sorter {
  justify-content: center;
}

.ny-table__cell--end .ny-table__sorter {
  justify-content: flex-end;
}

.ny-table__sorter-idle {
  color: var(--ny-text-muted);
  opacity: 0.6;
}

.ny-table__text {
  min-width: 0;
}

.ny-table__text--ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ny-table__checkbox {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--ny-primary);
  cursor: pointer;
}

.ny-table__checkbox:disabled {
  cursor: not-allowed;
}

.ny-table__checkbox:focus-visible {
  outline: none;
  box-shadow: var(--ny-shadow-focus);
}

.ny-table__skeleton {
  display: block;
  height: 13px;
  border-radius: var(--ny-radius-xs);
  background: var(--ny-surface-3);
  animation: ny-table-breath 1.4s var(--ny-ease) infinite;
}

.ny-table__cell--center .ny-table__skeleton {
  margin-inline: auto;
}

.ny-table__cell--end .ny-table__skeleton {
  margin-inline-start: auto;
}

.ny-table__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ny-space-3);
  padding: var(--ny-space-3);
  border-top: 1px solid var(--ny-border-soft);
}

.ny-table__footer--start {
  justify-content: flex-start;
}

.ny-table__footer--center {
  justify-content: center;
}

.ny-table__footer-extra {
  flex: 1;
  min-width: 0;
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
}

.ny-table--sm .ny-table__cell {
  padding: 7px var(--ny-space-2);
  font-size: var(--ny-font-size-sm);
}

.ny-table--lg .ny-table__cell {
  padding: 14px var(--ny-space-4);
}

@keyframes ny-table-breath {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>
