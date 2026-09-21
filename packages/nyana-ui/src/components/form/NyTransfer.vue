<script setup lang="ts">
import { computed, ref } from 'vue'

import NyButton from '../basic/NyButton.vue'
import NyCheckbox from './NyCheckbox.vue'
import NyIcon from '../basic/NyIcon.vue'
import NyInputShell from './NyInputShell.vue'

interface NyTransferItem {
  key: string
  title: string
  desc?: string
  disabled?: boolean
}

type NyTransferDirection = 'left' | 'right'

const props = withDefaults(
  defineProps<{
    data: NyTransferItem[]
    titles?: [string, string]
    showSearch?: boolean
    disabled?: boolean
    oneWay?: boolean
    operationTexts?: [string, string]
    maxHeight?: number
    emptyText?: [string, string]
  }>(),
  {
    titles: () => ['待选列表', '已选列表'],
    showSearch: true,
    disabled: false,
    oneWay: false,
    operationTexts: () => ['移入', '移出'],
    maxHeight: 320,
    emptyText: () => ['暂无数据', '暂无数据'],
  },
)

const emit = defineEmits<{
  (event: 'change', payload: { keys: string[]; direction: NyTransferDirection; movedKeys: string[] }): void
  (event: 'search', payload: { direction: NyTransferDirection; value: string }): void
}>()

const targetKeys = defineModel<string[]>('targetKeys', { default: () => [] })

const sourceKeyword = ref('')
const targetKeyword = ref('')
const sourceChecked = ref<string[]>([])
const targetChecked = ref<string[]>([])

const targetSet = computed(() => new Set(targetKeys.value))
const sourceItems = computed(() => props.data.filter((item) => !targetSet.value.has(item.key)))
const targetItems = computed(() => props.data.filter((item) => targetSet.value.has(item.key)))

function keywordRef(direction: NyTransferDirection) {
  return direction === 'left' ? sourceKeyword : targetKeyword
}

function checkedRef(direction: NyTransferDirection) {
  return direction === 'left' ? sourceChecked : targetChecked
}

function matches(items: NyTransferItem[], direction: NyTransferDirection) {
  const text = keywordRef(direction).value.trim().toLowerCase()

  if (!text) {
    return items
  }

  return items.filter((item) => `${item.title} ${item.desc ?? ''}`.toLowerCase().includes(text))
}

const sourceList = computed(() => matches(sourceItems.value, 'left'))
const targetList = computed(() => matches(targetItems.value, 'right'))

const panels = computed(() => [
  { direction: 'left' as const, title: props.titles[0], empty: props.emptyText[0], items: sourceList.value },
  { direction: 'right' as const, title: props.titles[1], empty: props.emptyText[1], items: targetList.value },
])

const listStyle = computed(() => ({ maxHeight: `${props.maxHeight}px` }))

function enabledKeys(items: NyTransferItem[]) {
  return items.filter((item) => !item.disabled).map((item) => item.key)
}

function isChecked(direction: NyTransferDirection, item: NyTransferItem) {
  return checkedRef(direction).value.includes(item.key)
}

function allChecked(direction: NyTransferDirection) {
  const keys = enabledKeys(direction === 'left' ? sourceList.value : targetList.value)

  return keys.length > 0 && keys.every((key) => checkedRef(direction).value.includes(key))
}

function partialChecked(direction: NyTransferDirection) {
  const keys = enabledKeys(direction === 'left' ? sourceList.value : targetList.value)

  return keys.some((key) => checkedRef(direction).value.includes(key)) && !allChecked(direction)
}

function toggleItem(direction: NyTransferDirection, item: NyTransferItem) {
  if (props.disabled || item.disabled) {
    return
  }

  const checked = checkedRef(direction)
  const next = checked.value.includes(item.key)
    ? checked.value.filter((key) => key !== item.key)
    : [...checked.value, item.key]

  checked.value = next
}

function toggleAll(direction: NyTransferDirection) {
  if (props.disabled) {
    return
  }

  const checked = checkedRef(direction)
  const keys = enabledKeys(direction === 'left' ? sourceList.value : targetList.value)

  if (!keys.length) {
    return
  }

  checked.value = allChecked(direction)
    ? checked.value.filter((key) => !keys.includes(key))
    : Array.from(new Set([...checked.value, ...keys]))
}

function onSearch(direction: NyTransferDirection, event: Event) {
  const value = (event.target as HTMLInputElement).value

  keywordRef(direction).value = value
  emit('search', { direction, value })
}

function sourcePanel(direction: NyTransferDirection) {
  return direction === 'right' ? 'left' : 'right'
}

function moveDisabled(direction: NyTransferDirection) {
  if (props.disabled) {
    return true
  }

  if (direction === 'left' && props.oneWay) {
    return true
  }

  const source = sourcePanel(direction)
  const items = source === 'left' ? sourceList.value : targetList.value
  const checked = checkedRef(source).value

  return !items.some((item) => checked.includes(item.key) && !item.disabled)
}

function move(direction: NyTransferDirection) {
  if (moveDisabled(direction)) {
    return
  }

  const source = sourcePanel(direction)
  const items = source === 'left' ? sourceItems.value : targetItems.value
  const from = checkedRef(source)
  const movedKeys = items
    .filter((item) => from.value.includes(item.key) && !item.disabled)
    .map((item) => item.key)

  if (!movedKeys.length) {
    return
  }

  const next =
    direction === 'right'
      ? Array.from(new Set([...targetKeys.value, ...movedKeys]))
      : targetKeys.value.filter((key) => !movedKeys.includes(key))

  targetKeys.value = next
  from.value = []
  emit('change', { keys: next, direction, movedKeys })
}
</script>

<template>
  <div class="ny-transfer" :class="{ 'is-disabled': disabled, 'ny-transfer--oneway': oneWay }">
    <template v-for="(panel, index) in panels" :key="panel.direction">
      <div class="ny-transfer__panel">
        <div class="ny-transfer__head">
          <NyCheckbox
            class="ny-transfer__all"
            size="sm"
            :checked="allChecked(panel.direction)"
            :indeterminate="partialChecked(panel.direction)"
            :disabled="disabled || panel.items.length === 0"
            @change="toggleAll(panel.direction)"
          />

          <span class="ny-transfer__title">{{ panel.title }}</span>
          <span class="ny-transfer__count">{{ panel.items.length }} 项</span>
        </div>

        <NyInputShell v-if="showSearch" class="ny-transfer__search" size="sm" variant="soft">
          <template #prefix>
            <NyIcon name="search" :size="13" />
          </template>

          <input
            class="ny-shell__control"
            type="text"
            autocomplete="off"
            placeholder="搜索"
            :value="keywordRef(panel.direction).value"
            :disabled="disabled"
            @input="onSearch(panel.direction, $event)"
          />
        </NyInputShell>

        <ul
          v-if="panel.items.length"
          class="ny-transfer__list ny-scroll"
          role="listbox"
          aria-multiselectable="true"
          :style="listStyle"
        >
          <li
            v-for="item in panel.items"
            :key="item.key"
            class="ny-transfer__item"
            :class="{ 'is-checked': isChecked(panel.direction, item), 'is-disabled': item.disabled || disabled }"
            role="option"
            :tabindex="item.disabled || disabled ? -1 : 0"
            :aria-selected="isChecked(panel.direction, item)"
            :aria-disabled="item.disabled || undefined"
            @click="toggleItem(panel.direction, item)"
            @keydown.enter.prevent="toggleItem(panel.direction, item)"
            @keydown.space.prevent="toggleItem(panel.direction, item)"
          >
            <NyCheckbox
              class="ny-transfer__check"
              size="sm"
              :checked="isChecked(panel.direction, item)"
              :disabled="disabled || item.disabled"
              @click.stop
              @change="toggleItem(panel.direction, item)"
            />

            <slot
              name="item"
              :item="item"
              :direction="panel.direction"
              :checked="isChecked(panel.direction, item)"
            >
              <span class="ny-transfer__body">
                <span class="ny-transfer__label">{{ item.title }}</span>
                <span v-if="item.desc" class="ny-transfer__desc">{{ item.desc }}</span>
              </span>
            </slot>
          </li>
        </ul>

        <div v-else class="ny-transfer__empty">
          <slot name="empty" :direction="panel.direction">{{ panel.empty }}</slot>
        </div>
      </div>

      <div v-if="index === 0" class="ny-transfer__operations">
        <NyButton
          size="sm"
          icon="chevron-right"
          :disabled="moveDisabled('right')"
          @click="move('right')"
        >
          <template v-if="operationTexts[0]">{{ operationTexts[0] }}</template>
        </NyButton>

        <NyButton
          size="sm"
          icon="chevron-left"
          :disabled="moveDisabled('left')"
          @click="move('left')"
        >
          <template v-if="operationTexts[1]">{{ operationTexts[1] }}</template>
        </NyButton>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.ny-transfer {
  display: flex;
  align-items: stretch;
  gap: var(--ny-space-3);
}

.ny-transfer__panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
  overflow: hidden;
}

.ny-transfer__head {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  padding: 10px var(--ny-space-3);
  border-bottom: 1px solid var(--ny-border-soft);
  background: var(--ny-surface-2);
}

.ny-transfer__title {
  flex: 1;
  min-width: 0;
  color: var(--ny-text-strong);
  font-size: var(--ny-font-size-sm);
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ny-transfer__count {
  flex: none;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
}

.ny-transfer__search {
  margin: var(--ny-space-2) var(--ny-space-2) 0;
  width: auto;
}

.ny-transfer__list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-height: 80px;
  margin: 0;
  padding: var(--ny-space-2);
  list-style: none;
}

.ny-transfer__item {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  padding: 7px var(--ny-space-2);
  border-radius: var(--ny-radius-xs);
  color: var(--ny-text);
  font-size: var(--ny-font-size-sm);
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &:hover:not(.is-disabled) {
    background: var(--ny-surface-2);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &.is-checked {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
  }

  &.is-disabled {
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}

.ny-transfer__check {
  flex: none;
}

.ny-transfer__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ny-transfer__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ny-transfer__desc {
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
}

.ny-transfer__empty {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  padding: var(--ny-space-4);
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
  text-align: center;
}

.ny-transfer__operations {
  display: flex;
  flex: none;
  flex-direction: column;
  justify-content: center;
  gap: var(--ny-space-2);
}

.ny-transfer--oneway .ny-transfer__operations :deep(.ny-btn:last-child) {
  opacity: 0.5;
}
</style>
