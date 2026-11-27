<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'

import NyIcon from '../icon/NyIcon.vue'
import NyDatePicker from './NyDatePicker.vue'
import NyInputShell from '../input/NyInputShell.vue'
import NyTimePicker from '../time-picker/NyTimePicker.vue'

import type { NySize, NyVariant } from '../../types'

// 一个框里同时选日期和时间: 值格式固定 yyyy-MM-ddTHH:mm, 没选日期时整体为空
const props = withDefaults(
  defineProps<{
    size?: NySize
    variant?: NyVariant
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    clearable?: boolean
    placeholder?: string
    minuteStep?: number
    min?: string
    max?: string
  }>(),
  {
    size: 'md',
    variant: 'outline',
    disabled: false,
    readonly: false,
    invalid: false,
    clearable: false,
    placeholder: '选择日期时间',
    minuteStep: 1,
    min: undefined,
    max: undefined,
  },
)

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  (event: 'change', payload: string): void
}>()

const visible = ref(false)
const focused = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<CSSProperties>({})

const datePart = computed<string | null>({
  get: () => model.value.slice(0, 10) || null,
  set: (value) => {
    const time = model.value.slice(11, 16) || '00:00'

    model.value = value ? `${value}T${time}` : ''
    emit('change', model.value)
  },
})

const timePart = computed<string>({
  get: () => model.value.slice(11, 16),
  set: (value) => {
    const date = model.value.slice(0, 10)

    model.value = date ? `${date}T${value || '00:00'}` : ''
    emit('change', model.value)
  },
})

const display = computed(() => model.value.replace('T', ' '))

const ringVisible = computed(() => focused.value || visible.value)

// 面板挂在 body 上, 位置按触发器算, 空间不够就翻到上方
function place() {
  const trigger = triggerRef.value

  if (!trigger) {
    return
  }

  const rect = trigger.getBoundingClientRect()
  const height = panelRef.value?.offsetHeight ?? 340
  const below = rect.bottom + 6
  const top = below + height > window.innerHeight - 8 && rect.top - height - 6 > 8
    ? rect.top - height - 6
    : below

  panelStyle.value = {
    position: 'fixed',
    left: `${Math.max(8, Math.min(rect.left, window.innerWidth - 300))}px`,
    top: `${top}px`,
    zIndex: 'var(--ny-z-popup)',
  }
}

function toggle() {
  if (props.disabled || props.readonly) {
    return
  }

  visible.value = !visible.value
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!visible.value) {
    return
  }

  const target = event.target as Node

  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return
  }

  visible.value = false
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && visible.value) {
    visible.value = false
  }
}

function clear() {
  model.value = ''
  emit('change', '')
}

watch(visible, async (open) => {
  if (!open) {
    window.removeEventListener('scroll', place, true)
    window.removeEventListener('resize', place)

    return
  }

  await nextTick()
  place()
  window.addEventListener('scroll', place, true)
  window.addEventListener('resize', place)
})

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
  window.removeEventListener('scroll', place, true)
  window.removeEventListener('resize', place)
})
</script>

<template>
  <div
    ref="triggerRef"
    class="ny-datetime"
    :class="[
      `ny-datetime--${props.size}`,
      { 'is-open': visible, 'is-disabled': props.disabled },
    ]"
    role="button"
    aria-haspopup="dialog"
    :aria-expanded="visible"
    :tabindex="props.disabled ? -1 : 0"
    @click="toggle"
    @focus="focused = true"
    @blur="focused = false"
  >
    <NyInputShell
      :clearable="props.clearable"
      :disabled="props.disabled"
      :focused="ringVisible"
      :has-value="!!model"
      :invalid="props.invalid"
      :readonly="props.readonly"
      :size="props.size"
      :variant="props.variant"
      @clear="clear"
    >
      <span class="ny-datetime__value" :class="{ 'is-placeholder': !model }">
        {{ model ? display : props.placeholder }}
      </span>

      <template #suffix>
        <NyIcon class="ny-datetime__icon" name="calendar" :size="15" />
      </template>
    </NyInputShell>
  </div>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="visible"
        ref="panelRef"
        class="ny-pop ny-datetime__panel"
        :style="panelStyle"
      >
        <NyDatePicker
          v-model="datePart"
          :max="props.max"
          :min="props.min"
          :size="props.size"
          inline
        />

        <NyTimePicker
          v-model="timePart"
          :minute-step="props.minuteStep"
          :size="props.size"
          inline
        />
      </div>
    </transition>
  </Teleport>
</template>
