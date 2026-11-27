<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'
import NyInputShell from '../input/NyInputShell.vue'

import { usePopup } from '../../composables/usePopup'
import type { NyPlacement, NySize, NyVariant } from '../../types'

type NyTimeSegment = 'hour' | 'minute' | 'second'

const props = withDefaults(
  defineProps<{
    format?: 'HH:mm' | 'HH:mm:ss'
    minuteStep?: number
    secondStep?: number
    disabledTime?: (time: string) => boolean
    size?: NySize
    variant?: NyVariant
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    clearable?: boolean
    placeholder?: string
    placement?: NyPlacement
    maxHeight?: number
    inline?: boolean
  }>(),
  {
    format: 'HH:mm',
    minuteStep: 1,
    secondStep: 1,
    disabledTime: undefined,
    size: 'md',
    variant: 'outline',
    disabled: false,
    readonly: false,
    invalid: false,
    clearable: true,
    placeholder: '请选择时间',
    placement: 'bottom-start',
    maxHeight: 220,
    inline: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string | null): void
  (event: 'clear'): void
}>()

const model = defineModel<string>({ default: '' })

const visible = ref(false)
const focused = ref(false)
const parts = ref<(string | null)[]>([null, null, null])
const highlight = ref({ column: 0, index: 0 })

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const panelId = useId()

const ringVisible = computed(() => focused.value || visible.value)

const segmentKeys = computed<NyTimeSegment[]>(() =>
  props.format === 'HH:mm:ss' ? ['hour', 'minute', 'second'] : ['hour', 'minute'],
)

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function stepOf(key: NyTimeSegment) {
  if (key === 'hour') {
    return 1
  }

  return Math.max(1, Math.floor(key === 'minute' ? props.minuteStep : props.secondStep))
}

function columnValues(key: NyTimeSegment) {
  const max = key === 'hour' ? 23 : 59
  const step = stepOf(key)
  const values: string[] = []

  for (let value = 0; value <= max; value += step) {
    values.push(pad(value))
  }

  return values
}

const columns = computed(() =>
  segmentKeys.value.map((key) => ({ key, values: columnValues(key) })),
)

const displayTime = computed(() =>
  segmentKeys.value.map((key, index) => parts.value[index] ?? '--').join(':'),
)

const { style } = usePopup({
  open: visible,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  offset: () => 6,
  matchWidth: () => true,
  onOutside: () => confirmOnOutside(),
  onEscape: () => close(true),
})

function composeParts(values: (string | null)[]) {
  const segments: string[] = []

  for (let index = 0; index < segmentKeys.value.length; index++) {
    const value = values[index]

    if (!value) {
      return null
    }

    segments.push(value)
  }

  return segments.join(':')
}

function candidateTime(column: number, value: string) {
  return segmentKeys.value
    .map((key, index) => (index === column ? value : (parts.value[index] ?? '00')))
    .join(':')
}

function isDisabled(column: number, value: string) {
  if (!props.disabledTime) {
    return false
  }

  return props.disabledTime(candidateTime(column, value))
}

function parseTime(value: string) {
  const segments = value.split(':')

  if (segments.length !== segmentKeys.value.length) {
    return [null, null, null]
  }

  return segmentKeys.value.map((key, index) => {
    const segment = segments[index]

    return /^\d{1,2}$/.test(segment) ? pad(Number(segment)) : null
  })
}

function currentIndex(column: number) {
  const value = parts.value[column]
  const index = value ? columns.value[column].values.indexOf(value) : -1

  return index >= 0 ? index : 0
}

async function scrollColumnIntoView(column: number, selector: string) {
  await nextTick()

  const lists = panelRef.value?.querySelectorAll<HTMLElement>('.ny-time-picker__list')
  const list = lists?.[column]

  list?.querySelector<HTMLElement>(selector)?.scrollIntoView({ block: 'nearest' })
}

async function scrollAllIntoView() {
  await nextTick()

  const lists = panelRef.value?.querySelectorAll<HTMLElement>('.ny-time-picker__list')

  lists?.forEach((list) => {
    list.querySelector<HTMLElement>('.is-selected')?.scrollIntoView({ block: 'nearest' })
  })
}

watch(highlight, () => {
  scrollColumnIntoView(highlight.value.column, '.is-active')
})

// 内联模式没有 open 动作, 挂载时也要把列滚到已选值
watch(
  () => props.inline,
  (inline) => {
    if (!inline) {
      return
    }

    parts.value = parseTime(model.value)
    highlight.value = { column: 0, index: currentIndex(0) }
  },
  { immediate: true },
)

function focus() {
  triggerRef.value?.focus()
}

function open() {
  if (props.disabled || props.readonly || visible.value) {
    return
  }

  parts.value = parseTime(model.value)
  visible.value = true
  highlight.value = { column: 0, index: currentIndex(0) }
  scrollAllIntoView()
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

function commit(next: string | null) {
  if (next === model.value) {
    return
  }

  if (next === null) {
    if (!model.value) {
      return
    }

    model.value = ''
    emit('change', null)
    return
  }

  model.value = next
  emit('change', next)
}

function pick(column: number, value: string) {
  const next = [...parts.value]

  for (let index = 0; index < column; index++) {
    if (!next[index]) {
      next[index] = '00'
    }
  }

  next[column] = value
  parts.value = next

  if (column === columns.value.length - 1) {
    commit(composeParts(next))
    close(true)
    return
  }

  highlight.value = { column, index: columns.value[column].values.indexOf(value) }
}

function pickNow() {
  const now = new Date()
  const minuteStep = stepOf('minute')
  const secondStep = stepOf('second')

  parts.value = [
    pad(now.getHours()),
    pad(Math.floor(now.getMinutes() / minuteStep) * minuteStep),
    pad(Math.floor(now.getSeconds() / secondStep) * secondStep),
  ]

  commit(composeParts(parts.value))
  close(true)
}

function confirmOnOutside() {
  commit(composeParts(parts.value))
  close()
}

function move(step: 1 | -1) {
  const column = highlight.value.column
  const values = columns.value[column].values
  const total = values.length

  if (!total) {
    return
  }

  let index = highlight.value.index

  for (let count = 0; count < total; count++) {
    index = (index + step + total) % total

    if (!isDisabled(column, values[index])) {
      highlight.value = { column, index }
      return
    }
  }
}

function onItemClick(column: number, value: string) {
  if (isDisabled(column, value)) {
    return
  }

  pick(column, value)
}

function onKeydown(event: KeyboardEvent) {
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

  if (!visible.value) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      open()
    }

    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    move(event.key === 'ArrowDown' ? 1 : -1)
    return
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()

    const total = columns.value.length
    const column = (highlight.value.column + (event.key === 'ArrowRight' ? 1 : -1) + total) % total

    highlight.value = { column, index: currentIndex(column) }
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()

    const column = highlight.value.column
    const value = columns.value[column].values[highlight.value.index]

    if (value && !isDisabled(column, value)) {
      pick(column, value)
    }
  }
}

function clear() {
  if (!model.value) {
    return
  }

  model.value = ''
  emit('change', null)
  emit('clear')
}

function onTriggerMousedown(event: MouseEvent) {
  const target = event.target as Element | null

  if (target?.closest('.ny-shell__clear')) {
    event.preventDefault()
  }
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

defineExpose({ focus, open, close, clear })
</script>

<template>
  <div
    v-if="!inline"
    ref="triggerRef"
    class="ny-time-picker"
    :class="[`ny-time-picker--${size}`, { 'is-open': visible, 'is-disabled': disabled, 'is-invalid': invalid }]"
    role="combobox"
    aria-haspopup="dialog"
    :tabindex="disabled ? -1 : 0"
    :aria-expanded="visible"
    :aria-controls="visible ? panelId : undefined"
    :aria-disabled="disabled || undefined"
    :aria-invalid="invalid || undefined"
    @mousedown="onTriggerMousedown"
    @click="onTriggerClick"
    @keydown="onKeydown"
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
      <template #prefix>
        <NyIcon name="clock" :size="14" />
      </template>

      <span class="ny-time-picker__value" :class="{ 'is-placeholder': !model }">
        {{ model || placeholder }}
      </span>

      <template #suffix>
        <NyIcon class="ny-time-picker__arrow" :class="{ 'is-open': visible }" name="chevron-down" :size="14" />
      </template>
    </NyInputShell>
  </div>

  <Teleport to="body" :disabled="inline">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="inline || visible"
        :id="panelId"
        ref="panelRef"
        class="ny-pop ny-time-picker__panel"
        :class="{ 'is-inline': inline }"
        :style="inline ? undefined : style"
        @mousedown.prevent
      >
        <div class="ny-time-picker__head">
          <span class="ny-time-picker__current">{{ displayTime }}</span>

          <button class="ny-time-picker__now" type="button" @click="pickNow">现在</button>
        </div>

        <div class="ny-time-picker__columns">
          <ul
            v-for="(column, columnIndex) in columns"
            :key="column.key"
            class="ny-time-picker__list ny-scroll"
            :style="{ maxHeight: `${maxHeight}px` }"
            role="listbox"
          >
            <li
              v-for="(value, index) in column.values"
              :key="value"
              class="ny-time-picker__item"
              :class="{
                'is-active': highlight.column === columnIndex && highlight.index === index,
                'is-selected': parts[columnIndex] === value,
                'is-disabled': isDisabled(columnIndex, value),
              }"
              role="option"
              :aria-selected="parts[columnIndex] === value"
              :aria-disabled="isDisabled(columnIndex, value) || undefined"
              @click="onItemClick(columnIndex, value)"
              @mouseenter="highlight = { column: columnIndex, index }"
            >
              {{ value }}
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
