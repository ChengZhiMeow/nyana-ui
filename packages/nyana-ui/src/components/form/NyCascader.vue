<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'
import NyInputShell from './NyInputShell.vue'

import { usePopup } from '../../composables/usePopup'

import type { NyPlacement, NySize, NyVariant } from '../../types'

interface NyCascaderOption {
  value: string | number
  label: string
  disabled?: boolean
  children?: NyCascaderOption[]
}

type NyCascaderValue = string | number

const props = withDefaults(
  defineProps<{
    options: NyCascaderOption[]
    size?: NySize
    variant?: NyVariant
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    clearable?: boolean
    placeholder?: string
    placement?: NyPlacement
    maxHeight?: number
    expandTrigger?: 'click' | 'hover'
    separator?: string
    changeOnSelect?: boolean
    emptyText?: string
  }>(),
  {
    size: 'md',
    variant: 'outline',
    disabled: false,
    readonly: false,
    invalid: false,
    clearable: true,
    placeholder: '请选择',
    placement: 'bottom-start',
    maxHeight: 260,
    expandTrigger: 'hover',
    separator: ' / ',
    changeOnSelect: false,
    emptyText: '暂无数据',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: { value: NyCascaderValue[]; selectedOptions: unknown[] }): void
  (event: 'clear'): void
}>()

const model = defineModel<NyCascaderValue[]>('value', { default: () => [] })

const visible = ref(false)
const focused = ref(false)
const activePath = ref<NyCascaderValue[]>([])
const activeIndex = ref(-1)

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const panelId = useId()

function optionId(columnIndex: number, index: number) {
  return `${panelId}-column-${columnIndex}-option-${index}`
}

const { style } = usePopup({
  open: visible,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  offset: () => 6,
  matchWidth: () => true,
  onOutside: () => close(),
  onEscape: () => close(true),
})

const columns = computed(() => {
  const list: NyCascaderOption[][] = [props.options]
  let current = props.options

  for (const value of activePath.value) {
    const node = current.find((option) => option.value === value)

    if (!node?.children?.length) {
      break
    }

    current = node.children
    list.push(current)
  }

  return list
})

const activeOption = computed(() => {
  const column = columns.value[columns.value.length - 1] ?? []

  return column[activeIndex.value]
})

const displayText = computed(() =>
  model.value
    .map((value, index) => resolveOptions(model.value.slice(0, index + 1))[index]?.label ?? String(value))
    .join(props.separator),
)

const ringVisible = computed(() => focused.value || visible.value)

function resolveOptions(path: NyCascaderValue[]) {
  const list: NyCascaderOption[] = []
  let current = props.options

  for (const value of path) {
    const node = current.find((option) => option.value === value)

    if (!node) {
      break
    }

    list.push(node)
    current = node.children ?? []
  }

  return list
}

function hasChildren(option: NyCascaderOption) {
  return Boolean(option.children?.length)
}

function optionPath(columnIndex: number, option: NyCascaderOption) {
  return [...activePath.value.slice(0, columnIndex), option.value]
}

function isChosen(columnIndex: number, option: NyCascaderOption) {
  const path = optionPath(columnIndex, option)

  return model.value.length === path.length && path.every((part, index) => part === model.value[index])
}

async function scrollActiveIntoView() {
  await nextTick()
  panelRef.value?.querySelector<HTMLElement>('.is-active')?.scrollIntoView({ block: 'nearest' })
}

watch(activeIndex, () => {
  scrollActiveIntoView()
})

watch(visible, (opened) => {
  if (!opened) {
    return
  }

  activePath.value = [...model.value]

  const column = columns.value[columns.value.length - 1] ?? []
  const chosen = column.findIndex((option) => isChosen(columns.value.length - 1, option) && !option.disabled)

  activeIndex.value = chosen >= 0 ? chosen : column.findIndex((option) => !option.disabled)
})

function focus() {
  triggerRef.value?.focus()
}

function open() {
  if (props.disabled || props.readonly) {
    return
  }

  visible.value = true
}

function close(refocus = false) {
  if (!visible.value) {
    return
  }

  visible.value = false

  if (refocus) {
    focus()
  }
}

function clear() {
  model.value = []
  emit('clear')
}

function expandTo(path: NyCascaderValue[]) {
  activePath.value = path

  const column = columns.value[columns.value.length - 1] ?? []

  activeIndex.value = column.findIndex((option) => !option.disabled)
}

function commit(path: NyCascaderValue[]) {
  model.value = [...path]
  emit('change', { value: [...path], selectedOptions: resolveOptions(path) })
  close(true)
}

function onOptionClick(columnIndex: number, option: NyCascaderOption) {
  if (option.disabled) {
    return
  }

  const path = optionPath(columnIndex, option)

  if (hasChildren(option)) {
    expandTo(path)
  }

  if (!hasChildren(option) || props.changeOnSelect) {
    commit(path)
  }
}

function onOptionHover(columnIndex: number, index: number, option: NyCascaderOption) {
  if (option.disabled) {
    return
  }

  if (props.expandTrigger === 'hover' && hasChildren(option)) {
    expandTo(optionPath(columnIndex, option))
    return
  }

  if (columnIndex === columns.value.length - 1) {
    activeIndex.value = index
  }
}

function moveActive(step: 1 | -1) {
  const column = columns.value[columns.value.length - 1] ?? []

  if (!column.length) {
    return
  }

  let index = activeIndex.value < 0 ? (step === 1 ? -1 : 0) : activeIndex.value

  for (let count = 0; count < column.length; count++) {
    index = (index + step + column.length) % column.length

    if (!column[index].disabled) {
      activeIndex.value = index
      return
    }
  }
}

function expandActive() {
  const option = activeOption.value

  if (!option || option.disabled || !hasChildren(option)) {
    return
  }

  expandTo(optionPath(columns.value.length - 1, option))
}

function collapseActive() {
  if (!activePath.value.length) {
    return
  }

  const removed = activePath.value[activePath.value.length - 1]
  const parentColumn = columns.value[columns.value.length - 2] ?? []
  const index = parentColumn.findIndex((option) => option.value === removed)

  activePath.value = activePath.value.slice(0, -1)
  activeIndex.value = index
}

function chooseActive() {
  const option = activeOption.value

  if (!option || option.disabled) {
    return
  }

  onOptionClick(columns.value.length - 1, option)
}

function onTriggerClick(event: MouseEvent) {
  const target = event.target as Element | null

  if (target?.closest('.ny-shell__clear')) {
    return
  }

  if (visible.value) {
    close(true)
    return
  }

  open()
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) {
    return
  }

  if (event.key === 'Escape') {
    if (visible.value) {
      event.preventDefault()
      close(true)
    }
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()

    if (!visible.value) {
      open()
      return
    }

    moveActive(event.key === 'ArrowDown' ? 1 : -1)
    return
  }

  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    if (!visible.value) {
      return
    }

    event.preventDefault()

    if (event.key === 'ArrowRight') {
      expandActive()
      return
    }

    collapseActive()
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()

    if (!visible.value) {
      open()
      return
    }

    chooseActive()
  }
}

function onPanelPointerDown() {
  focus()
}

defineExpose({ focus, open, close, clear })
</script>

<template>
  <div
    ref="triggerRef"
    class="ny-cascader"
    :class="[
      `ny-cascader--${size}`,
      { 'is-open': visible, 'is-disabled': disabled, 'is-invalid': invalid },
    ]"
    role="combobox"
    aria-haspopup="listbox"
    :tabindex="disabled ? -1 : 0"
    :aria-expanded="visible"
    :aria-controls="visible ? panelId : undefined"
    :aria-activedescendant="
      visible && activeIndex >= 0 ? optionId(columns.length - 1, activeIndex) : undefined
    "
    :aria-disabled="disabled || undefined"
    :aria-invalid="invalid || undefined"
    @click="onTriggerClick"
    @keydown="onTriggerKeydown"
    @focus="focused = true"
    @blur="focused = false"
  >
    <NyInputShell
      :size="size"
      :variant="variant"
      :disabled="disabled"
      :readonly="readonly"
      :invalid="invalid"
      :focused="ringVisible"
      :clearable="clearable"
      :has-value="model.length > 0"
      @clear="clear"
    >
      <span class="ny-cascader__value" :class="{ 'is-placeholder': !displayText }">
        {{ displayText || placeholder }}
      </span>

      <template #suffix>
        <NyIcon class="ny-cascader__arrow" :class="{ 'is-open': visible }" name="chevron-down" :size="14" />
      </template>
    </NyInputShell>
  </div>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="visible"
        :id="panelId"
        ref="panelRef"
        class="ny-pop ny-cascader__panel"
        :style="style"
        @pointerdown="onPanelPointerDown"
      >
        <template v-if="options.length">
          <ul
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
            class="ny-cascader__column ny-scroll"
            role="listbox"
            :style="{ maxHeight: `${maxHeight}px` }"
          >
            <li
              v-for="(option, index) in column"
              :id="optionId(columnIndex, index)"
              :key="option.value"
              class="ny-cascader__option"
              :class="{
                'is-active': columnIndex === columns.length - 1 && index === activeIndex,
                'is-chosen': isChosen(columnIndex, option),
                'is-disabled': option.disabled,
              }"
              role="option"
              :aria-selected="isChosen(columnIndex, option)"
              :aria-disabled="option.disabled || undefined"
              @click="onOptionClick(columnIndex, option)"
              @mouseenter="onOptionHover(columnIndex, index, option)"
            >
              <span class="ny-cascader__label">{{ option.label }}</span>

              <NyIcon v-if="isChosen(columnIndex, option)" class="ny-cascader__check" name="check" :size="14" />
              <NyIcon v-else-if="hasChildren(option)" class="ny-cascader__more" name="chevron-right" :size="14" />
            </li>
          </ul>
        </template>

        <div v-else class="ny-cascader__empty">{{ emptyText }}</div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-cascader {
  display: block;
  width: 100%;
  cursor: pointer;
}

.ny-cascader[tabindex]:focus-visible {
  outline: none;
  box-shadow: none;
}

.ny-cascader.is-disabled {
  cursor: not-allowed;
}

.ny-cascader__value {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ny-cascader__value.is-placeholder {
  color: var(--ny-text-muted);
}

.ny-cascader__arrow {
  color: var(--ny-text-muted);
  transition: transform var(--ny-transition-fast);
}

.ny-cascader__arrow.is-open {
  transform: rotate(180deg);
}

.ny-cascader__panel {
  position: fixed;
  z-index: var(--ny-z-popup);
  display: flex;
  min-width: 120px;
  padding: 4px;
  overflow: hidden;
}

.ny-cascader__column {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 130px;
  margin: 0;
  padding: 0 4px;
  list-style: none;
}

.ny-cascader__column + .ny-cascader__column {
  border-left: 1px solid var(--ny-border-soft);
}

.ny-cascader__option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: var(--ny-radius-xs);
  color: var(--ny-text);
  font-size: var(--ny-font-size-md);
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &.is-active {
    background: var(--ny-surface-3);
  }

  &.is-chosen {
    color: var(--ny-primary-text);
    font-weight: 600;
  }

  &.is-disabled {
    background: transparent;
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}

.ny-cascader__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ny-cascader__check {
  flex: none;
  color: var(--ny-primary);
}

.ny-cascader__more {
  flex: none;
  color: var(--ny-text-muted);
}

.ny-cascader__empty {
  padding: 18px 12px;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
  text-align: center;
}
</style>
