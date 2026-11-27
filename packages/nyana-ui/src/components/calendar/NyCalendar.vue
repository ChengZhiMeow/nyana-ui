<script setup lang="ts">
import { computed, onMounted, ref, useId, useSlots, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NyStatus } from '../../types'

export interface NyCalendarEvent {
  text: string
  status?: NyStatus
}

interface NyMonthView {
  year: number
  month: number
}

interface NyDatePart extends NyMonthView {
  day: number
}

interface NyCalendarCell {
  date: string
  day: number
  inMonth: boolean
  disabled: boolean
  today: boolean
  selected: boolean
  events: NyCalendarEvent[]
}

const props = withDefaults(
  defineProps<{
    mode?: 'month' | 'year'
    events?: Record<string, NyCalendarEvent[]>
    disabledDate?: (date: string) => boolean
    weekStart?: 0 | 1
    fullscreen?: boolean
    showToday?: boolean
  }>(),
  {
    mode: 'month',
    events: () => ({}),
    disabledDate: undefined,
    weekStart: 1,
    fullscreen: true,
    showToday: true,
  },
)

const emit = defineEmits<{
  (event: 'select', payload: string): void
  (event: 'panelChange', payload: { year: number; month: number }): void
}>()

const model = defineModel<string>({ default: '' })

const slots = useSlots()

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六']
const ARROW_STEPS: Record<string, number | undefined> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
}
const MAX_EVENTS = 2

const gridId = useId()

const focused = ref(false)
const gridRef = ref<HTMLElement | null>(null)
const today = ref(toText(new Date()))
const viewMode = ref<'month' | 'year'>(props.mode)
const view = ref<NyMonthView>(initialView())
const cursor = ref(model.value || toText(new Date()))

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

function initialView(): NyMonthView {
  return parseText(model.value) ?? parseText(today.value) ?? { year: 1970, month: 1 }
}

function isDisabled(date: string) {
  return props.disabledDate?.(date) ?? false
}

function cellId(date: string) {
  return `${gridId}-${date}`
}

const weekLabels = computed(() =>
  props.weekStart === 1 ? [...WEEK_LABELS.slice(1), WEEK_LABELS[0]] : WEEK_LABELS,
)

const cells = computed<NyCalendarCell[]>(() => {
  const { year, month } = view.value
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const offset = (firstWeekday - props.weekStart + 7) % 7
  const list: NyCalendarCell[] = []

  for (let index = 0; index < 42; index++) {
    const date = new Date(year, month - 1, index - offset + 1)
    const text = toText(date)

    list.push({
      date: text,
      day: date.getDate(),
      inMonth: date.getMonth() + 1 === month,
      disabled: isDisabled(text),
      today: text === today.value,
      selected: text === model.value,
      events: props.events[text] ?? [],
    })
  }

  return list
})

const rows = computed(() => {
  const list = cells.value
  const result: NyCalendarCell[][] = []

  for (let index = 0; index < list.length; index += 7) {
    result.push(list.slice(index, index + 7))
  }

  return result
})

const months = computed(() => Array.from({ length: 12 }, (_, index) => index + 1))

const activeCell = computed(() => cells.value.find((cell) => cell.date === cursor.value) ?? null)

const anchor = computed(() => parseText(model.value) ?? parseText(today.value))

const headerScope = computed(() => ({
  year: view.value.year,
  month: view.value.month,
  prev: () => shiftPanel(-1),
  next: () => shiftPanel(1),
  today: goToday,
}))

function isCurrentMonth(month: number) {
  return anchor.value?.year === view.value.year && anchor.value.month === month
}

function visibleEvents(cell: NyCalendarCell) {
  return cell.events.slice(0, MAX_EVENTS)
}

function setView(year: number, month: number) {
  if (view.value.year === year && view.value.month === month) {
    return
  }

  view.value = { year, month }
  emit('panelChange', { year, month })
}

function shiftPanel(step: number) {
  if (viewMode.value === 'year') {
    setView(view.value.year + step, view.value.month)
    return
  }

  const total = view.value.year * 12 + (view.value.month - 1) + step

  setView(Math.floor(total / 12), (total % 12) + 1)
}

function select(date: string) {
  if (isDisabled(date)) {
    return
  }

  const parts = parseText(date)

  model.value = date
  cursor.value = date

  if (parts) {
    setView(parts.year, parts.month)
  }

  emit('select', date)
}

function pick(cell: NyCalendarCell) {
  select(cell.date)
}

function pickMonth(month: number) {
  viewMode.value = 'month'
  setView(view.value.year, month)
}

function toggleMode() {
  viewMode.value = viewMode.value === 'year' ? 'month' : 'year'
}

function goToday() {
  today.value = toText(new Date())
  viewMode.value = 'month'
  select(today.value)
}

function moveCursor(offset: number) {
  const next = shiftDay(cursor.value || model.value || today.value, offset)
  const parts = parseText(next)

  if (!parts) {
    return
  }

  cursor.value = next
  setView(parts.year, parts.month)
  select(next)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault()
    shiftPanel(event.key === 'PageUp' ? -1 : 1)
    return
  }

  const offset = ARROW_STEPS[event.key]

  if (offset === undefined) {
    return
  }

  event.preventDefault()
  moveCursor(offset)
}

watch(model, (value) => {
  const parts = parseText(value)

  if (!parts) {
    return
  }

  cursor.value = value
  setView(parts.year, parts.month)
})

watch(
  () => props.mode,
  (value) => {
    viewMode.value = value
  },
)

onMounted(() => {
  today.value = toText(new Date())

  if (!model.value) {
    cursor.value = today.value
  }
})
</script>

<template>
  <div class="ny-calendar" :class="[`ny-calendar--${viewMode}`, { 'ny-calendar--compact': !fullscreen }]">
    <header class="ny-calendar__head">
      <slot name="header" v-bind="headerScope">
        <div class="ny-calendar__titles">
          <button
            type="button"
            class="ny-calendar__year"
            :aria-expanded="viewMode === 'year'"
            @click="toggleMode"
          >
            {{ view.year }} 年
          </button>

          <span v-if="viewMode === 'month'" class="ny-calendar__month">{{ view.month }} 月</span>
        </div>

        <div class="ny-calendar__actions">
          <button v-if="showToday" type="button" class="ny-calendar__today" @click="goToday">今天</button>

          <button
            type="button"
            class="ny-calendar__nav"
            :title="viewMode === 'year' ? '上一年' : '上个月'"
            :aria-label="viewMode === 'year' ? '上一年' : '上个月'"
            @click="shiftPanel(-1)"
          >
            <NyIcon name="chevron-left" :size="16" />
          </button>

          <button
            type="button"
            class="ny-calendar__nav"
            :title="viewMode === 'year' ? '下一年' : '下个月'"
            :aria-label="viewMode === 'year' ? '下一年' : '下个月'"
            @click="shiftPanel(1)"
          >
            <NyIcon name="chevron-right" :size="16" />
          </button>
        </div>
      </slot>
    </header>

    <div v-if="viewMode === 'year'" class="ny-calendar__months">
      <button
        v-for="month in months"
        :key="month"
        type="button"
        class="ny-calendar__month-block"
        :class="{ 'is-current': isCurrentMonth(month) }"
        :aria-pressed="isCurrentMonth(month)"
        @click="pickMonth(month)"
      >
        {{ month }} 月
      </button>
    </div>

    <div
      v-else
      :id="gridId"
      ref="gridRef"
      class="ny-calendar__grid"
      role="grid"
      tabindex="0"
      :aria-label="`${view.year} 年 ${view.month} 月`"
      :aria-activedescendant="activeCell ? cellId(activeCell.date) : undefined"
      @keydown="onKeydown"
      @focus="focused = true"
      @blur="focused = false"
    >
      <div class="ny-calendar__row" role="row">
        <span v-for="label in weekLabels" :key="label" class="ny-calendar__week" role="columnheader">
          {{ label }}
        </span>
      </div>

      <div v-for="row in rows" :key="row[0].date" class="ny-calendar__row" role="row">
        <div
          v-for="cell in row"
          :id="cellId(cell.date)"
          :key="cell.date"
          class="ny-calendar__day"
          :class="{
            'is-outside': !cell.inMonth,
            'is-today': cell.today,
            'is-selected': cell.selected,
            'is-cursor': focused && cell.date === cursor,
            'is-disabled': cell.disabled,
            'is-has-events': cell.events.length > 0,
          }"
          role="gridcell"
          :aria-label="cell.date"
          :aria-selected="cell.selected"
          :aria-disabled="cell.disabled || undefined"
          @click="pick(cell)"
        >
          <slot v-if="slots.dateCell" name="dateCell" v-bind="cell" />
          <slot v-else name="cell" v-bind="cell">
            <span class="ny-calendar__num">{{ cell.day }}</span>

            <span v-if="cell.events.length" class="ny-calendar__events">
              <span
                v-for="(item, index) in visibleEvents(cell)"
                :key="index"
                class="ny-calendar__event"
                :class="`is-${item.status ?? 'default'}`"
              >
                <span class="ny-calendar__dot" :class="`is-${item.status ?? 'default'}`" />
                <span class="ny-calendar__text">{{ item.text }}</span>
              </span>

              <span v-if="cell.events.length > MAX_EVENTS" class="ny-calendar__more">
                +{{ cell.events.length - MAX_EVENTS }}
              </span>
            </span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
