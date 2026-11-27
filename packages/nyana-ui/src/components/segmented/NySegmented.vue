<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NyOption, NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    options: NyOption[]
    size?: NySize
    block?: boolean
    disabled?: boolean
  }>(),
  {
    options: () => [],
    size: 'md',
    block: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string | number): void
}>()

const model = defineModel<string | number>()

const groupRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLButtonElement[]>([])

const thumbLeft = ref(0)
const thumbWidth = ref(0)

let observer: ResizeObserver | null = null

const classes = computed(() => [`ny-segmented--${props.size}`, { 'is-block': props.block, 'is-disabled': props.disabled }])

function isActive(option: NyOption): boolean {
  return model.value === option.value
}

function setItemRef(el: Element | ComponentPublicInstance | null, index: number) {
  const node = el as HTMLButtonElement | null

  if (node) {
    itemRefs.value[index] = node
  }
}

function select(option: NyOption) {
  if (props.disabled || option.disabled || option.value === model.value) {
    return
  }

  model.value = option.value
  emit('change', option.value)
}

function onKeydown(event: KeyboardEvent) {
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0

  if (step === 0 || props.disabled) {
    return
  }

  event.preventDefault()

  const count = props.options.length
  const index = props.options.findIndex((option) => option.value === model.value)

  for (let offset = 1; offset <= count; offset += 1) {
    const next = (Math.max(index, 0) + step * offset + count * count) % count

    if (!props.options[next].disabled) {
      select(props.options[next])
      nextTick(() => itemRefs.value[next]?.focus())

      return
    }
  }
}

function measure() {
  const index = props.options.findIndex((option) => option.value === model.value)
  const node = index < 0 ? null : itemRefs.value[index]

  if (!node) {
    thumbWidth.value = 0

    return
  }

  thumbLeft.value = node.offsetLeft
  thumbWidth.value = node.offsetWidth
}

onMounted(() => {
  measure()

  if (typeof ResizeObserver !== 'undefined' && groupRef.value) {
    observer = new ResizeObserver(measure)
    observer.observe(groupRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

watch(() => [model.value, props.options], () => nextTick(measure), { deep: true, flush: 'post' })
</script>

<template>
  <div
    ref="groupRef"
    class="ny-segmented"
    :class="classes"
    role="radiogroup"
    :aria-disabled="disabled || undefined"
    @keydown="onKeydown"
  >
    <span
      v-show="thumbWidth > 0"
      class="ny-segmented__thumb"
      aria-hidden="true"
      :style="{ width: `${thumbWidth}px`, transform: `translateX(${thumbLeft}px)` }"
    />

    <button
      v-for="(option, index) in options"
      :key="String(option.value)"
      :ref="(el) => setItemRef(el, index)"
      class="ny-segmented__item"
      :class="{ 'is-active': isActive(option) }"
      type="button"
      role="radio"
      :aria-checked="isActive(option)"
      :disabled="disabled || option.disabled"
      :tabindex="isActive(option) ? 0 : -1"
      @click="select(option)"
    >
      <NyIcon v-if="option.icon" :name="option.icon" :size="size === 'sm' ? 14 : 15" />

      <span class="ny-segmented__label">{{ option.label }}</span>
    </button>
  </div>
</template>
