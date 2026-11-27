<script setup lang="ts">
import { computed, inject } from 'vue'

import { nyRadioContextKey } from './radioContext'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    label?: string
    value?: string | number
    disabled?: boolean
    size?: NySize
  }>(),
  {
    label: '',
    value: undefined,
    disabled: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string | number): void
}>()

const model = defineModel<string | number | null>()

const group = inject(nyRadioContextKey, null)

const current = computed(() => (group ? group.value.value : model.value ?? null))

const isChecked = computed(() => props.value !== undefined && current.value === props.value)
const isDisabled = computed(() => props.disabled || (group?.disabled.value ?? false))
const isInvalid = computed(() => group?.invalid.value ?? false)
const resolvedSize = computed(() => group?.size.value ?? props.size)

function onChange() {
  const value = props.value

  if (isDisabled.value || value === undefined) {
    return
  }

  if (group) {
    group.select(value)
  } else {
    model.value = value
  }

  emit('change', value)
}
</script>

<template>
  <label
    class="ny-radio"
    :class="[
      `ny-radio--${resolvedSize}`,
      { 'is-checked': isChecked, 'is-disabled': isDisabled, 'is-invalid': isInvalid },
    ]"
  >
    <input
      class="ny-radio__input"
      type="radio"
      :name="group?.name"
      :checked="isChecked"
      :disabled="isDisabled"
      :aria-invalid="isInvalid || undefined"
      @change="onChange"
    />

    <span class="ny-radio__dot" aria-hidden="true" />

    <span v-if="label || $slots.default" class="ny-radio__text">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
