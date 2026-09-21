<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'
import NyInputShell from './NyInputShell.vue'

import { usePopup } from '../../composables/usePopup'
import type { NyPlacement, NySize, NyVariant } from '../../types'

const props = withDefaults(
  defineProps<{
    size?: NySize
    variant?: NyVariant
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    clearable?: boolean
    placeholder?: string
    placement?: NyPlacement
    min?: string
    max?: string
    disabledDate?: (date: string) => boolean
    weekStart?: 0 | 1
  }>(),
  {
    size: 'md',
    variant: 'outline',
    disabled: false,
    readonly: false,
    invalid: false,
    clearable: true,
    placeholder: '请选择日期',
    placement: 'bottom-start',
    min: undefined,
    max: undefined,
    disabledDate: undefined,
    weekStart: 1,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string | null): void
  (event: 'clear'): void
}>()

const model = defineModel<string | null>({ default: null })

interface NyDatePart {
  year: number
  month: number
  day: number
}

interface NyMonthView {
  year: number
  month: number
}

interface NyDateCell {
  text: string
  day: number
  outside: boolean
  disabled: boolean
  today: boolean
}

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六']
const ARROW_STEPS: Record<string, number | undefined> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
}

const visible = ref(false)
const focused = ref(false)
const gridFocused = ref(false)
const cursorText = ref('')

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)

const today = ref(toText(new Date()))
const view = ref<NyMonthView>(parseText(today.value) ?? { year: 1970, month: 1 })

const gridId = useId()

function cellId(text: string) {
  return `${gridId}-${text}`
}

function pad(value: number) {
  return value < 10 ? `0${value}` : String(value)
}

function toText(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseText(text: string): NyDatePart | null {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text)

  if (!matched) {
    return null
  }

  return { year: Number(matched[1]), month: Number(matched[2]), day: Number(matched[3]) }
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function shiftDay(text: string, offset: number) {
  const parts = parseText(text)

  if (!parts) {
    return text
  }

  return toText(new Date(parts.year, parts.month - 1, parts.day + offset))
}

const { style } = usePopup({
  open: visible,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  offset: () => 6,
  matchWidth: () => false,
  onOutside: () => close(),
  onEscape: () => close(true),
})

const ringVisible = computed(() => focused.value || visible.value)

const weekLabels = computed(() =>
  props.weekStart === 1 ? [...WEEK_LABELS.slice(1), WEEK_LABELS[0]] : WEEK_LABELS,
)

function isDisabled(text: string) {
  if (props.min && text < props.min) {
    return true
  }

  if (props.max && text > props.max) {
    return true
  }

  return props.disabledDate?.(text) ?? false
}

const cells = computed<NyDateCell[]>(() => {
  const { year, month } = view.value
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const offset = (firstWeekday - props.weekStart + 7) % 7
  const list: NyDateCell[] = []

  for (let index = 0; index < 42; index++) {
    const date = new Date(year, month - 1, index - offset + 1)
    const text = toText(date)

    list.push({
      text,
      day: date.getDate(),
      outside: date.getMonth() + 1 !== month,
      disabled: isDisabled(text),
      today: text === today.value,
    })
  }

  return list
})

const rows = computed(() => {
  const list = cells.value
  const result: NyDateCell[][] = []

  for (let index = 0; index < list.length; index += 7) {
    result.push(list.slice(index, index + 7))
  }

  return result
})

const activeCell = computed(() => cells.value.find((cell) => cell.text === cursorText.value) ?? null)

function initialCursor() {
  if (model.value) {
    return model.value
  }

  if (props.min && today.value < props.min) {
    return props.min
  }

  if (props.max && today.value > props.max) {
    return props.max
  }

  return today.value
}

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
  model.value = null
  emit('clear')
}

function pick(cell: NyDateCell) {
  if (cell.disabled) {
    return
  }

  model.value = cell.text
  emit('change', cell.text)
  close(true)
}

function shiftMonth(step: number) {
  const total = view.value.year * 12 + (view.value.month - 1) + step

  view.value = { year: Math.floor(total / 12), month: (total % 12) + 1 }

  const parts = parseText(cursorText.value)

  if (parts) {
    const day = Math.min(parts.day, daysInMonth(view.value.year, view.value.month))

    cursorText.value = toText(new Date(view.value.year, view.value.month - 1, day))
  }
}

function moveCursor(offset: number) {
  const next = shiftDay(cursorText.value || initialCursor(), offset)
  const parts = parseText(next)

  cursorText.value = next

  if (parts && (parts.year !== view.value.year || parts.month !== view.value.month)) {
    view.value = { year: parts.year, month: parts.month }
  }
}

function onGridKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()

    const cell = activeCell.value

    if (cell) {
      pick(cell)
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    close(true)
    return
  }

  if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault()
    shiftMonth(event.key === 'PageUp' ? -1 : 1)
    return
  }

  const offset = ARROW_STEPS[event.key]

  if (offset === undefined) {
    return
  }

  event.preventDefault()
  moveCursor(offset)
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

  if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
    event.preventDefault()
    open()
  }
}

watch(visible, async (opened) => {
  if (!opened) {
    gridFocused.value = false
    return
  }

  today.value = toText(new Date())

  const cursor = initialCursor()
  const parts = parseText(cursor)

  cursorText.value = cursor

  if (parts) {
    view.value = { year: parts.year, month: parts.month }
  }

  await nextTick()
  gridRef.value?.focus()
})

defineExpose({ focus, open, close, clear })
</script>

<template>
  <div
    ref="triggerRef"
    class="ny-datepicker"
    :class="[`ny-datepicker--${size}`, { 'is-open': visible, 'is-disabled': disabled, 'is-invalid': invalid }]"
    role="button"
    aria-haspopup="dialog"
    :tabindex="disabled ? -1 : 0"
    :aria-expanded="visible"
    :aria-controls="visible ? gridId : undefined"
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
      :has-value="!!model"
      @clear="clear"
    >
      <span class="ny-datepicker__value" :class="{ 'is-placeholder': !model }">
        {{ model || placeholder }}
      </span>

      <template #suffix>
        <NyIcon class="ny-datepicker__icon" name="calendar" :size="15" />
      </template>
    </NyInputShell>
  </div>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div v-if="visible" ref="panelRef" class="ny-pop ny-datepicker__panel" :style="style">
        <div class="ny-datepicker__head">
          <button class="ny-datepicker__nav" type="button" title="上个月" tabindex="-1" @click="shiftMonth(-1)">
            <NyIcon name="chevron-left" :size="16" />
          </button>

          <span class="ny-datepicker__title">{{ view.year }} 年 {{ view.month }} 月</span>

          <button class="ny-datepicker__nav" type="button" title="下个月" tabindex="-1" @click="shiftMonth(1)">
            <NyIcon name="chevron-right" :size="16" />
          </button>
        </div>

        <div
          :id="gridId"
          ref="gridRef"
          class="ny-datepicker__grid"
          role="grid"
          tabindex="0"
          :aria-label="`${view.year} 年 ${view.month} 月`"
          :aria-activedescendant="activeCell ? cellId(activeCell.text) : undefined"
          @keydown="onGridKeydown"
          @focus="gridFocused = true"
          @blur="gridFocused = false"
        >
          <div class="ny-datepicker__row" role="row">
            <span v-for="label in weekLabels" :key="label" class="ny-datepicker__week" role="columnheader">
              {{ label }}
            </span>
          </div>

          <div v-for="row in rows" :key="row[0].text" class="ny-datepicker__row" role="row">
            <div
              v-for="cell in row"
              :id="cellId(cell.text)"
              :key="cell.text"
              class="ny-datepicker__day"
              :class="{
                'is-outside': cell.outside,
                'is-today': cell.today,
                'is-selected': cell.text === model,
                'is-cursor': gridFocused && cell.text === cursorText,
                'is-disabled': cell.disabled,
              }"
              role="gridcell"
              :aria-label="cell.text"
              :aria-selected="cell.text === model"
              :aria-disabled="cell.disabled || undefined"
              @click="pick(cell)"
            >
              {{ cell.day }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-datepicker {
  display: block;
  width: 100%;
  cursor: pointer;
}

.ny-datepicker[tabindex]:focus-visible {
  outline: none;
  box-shadow: none;
}

.ny-datepicker.is-disabled {
  cursor: not-allowed;
}

.ny-datepicker__value {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ny-datepicker__value.is-placeholder {
  color: var(--ny-text-muted);
}

.ny-datepicker__icon {
  color: var(--ny-text-muted);
}

.ny-datepicker__panel {
  position: fixed;
  z-index: var(--ny-z-popup);
  width: 268px;
  padding: 10px;
}

.ny-datepicker__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 6px;
}

.ny-datepicker__title {
  color: var(--ny-text-strong);
  font-size: var(--ny-font-size-md);
  font-weight: 600;
}

.ny-datepicker__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: var(--ny-radius-xs);
  background: transparent;
  color: var(--ny-text-sub);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
  }
}

.ny-datepicker__grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-radius: var(--ny-radius-sm);
}

.ny-datepicker__grid[tabindex]:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 1px var(--ny-primary-ring);
}

.ny-datepicker__row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.ny-datepicker__week {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
  font-weight: 400;
}

.ny-datepicker__day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border: 1px solid transparent;
  border-radius: var(--ny-radius-xs);
  color: var(--ny-text);
  font-size: var(--ny-font-size-sm);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover {
    background: var(--ny-surface-3);
  }

  &.is-outside {
    color: var(--ny-text-muted);
  }

  &.is-today {
    border-color: var(--ny-primary);
  }

  &.is-cursor {
    background: var(--ny-surface-3);
  }

  &.is-selected {
    border-color: transparent;
    background: var(--ny-primary);
    color: var(--ny-on-primary);
    font-weight: 600;
  }

  &.is-disabled {
    border-color: transparent;
    background: transparent;
    color: var(--ny-text-muted);
    opacity: 0.45;
    cursor: not-allowed;
  }
}
</style>
