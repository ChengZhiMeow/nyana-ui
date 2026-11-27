<script setup lang="ts">
import { computed, inject, ref, useId, watchEffect } from 'vue'

import { nyCheckboxContextKey } from './checkboxContext'
import NyField from '../field/NyField.vue'
import NyIcon from '../icon/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    label?: string
    value?: string | number
    disabled?: boolean
    indeterminate?: boolean
    size?: NySize
    hint?: string
    invalid?: boolean
  }>(),
  {
    label: '',
    value: undefined,
    disabled: false,
    indeterminate: false,
    size: 'md',
    hint: '',
    invalid: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: boolean): void
}>()

const model = defineModel<boolean>('checked', { default: false })

const group = inject(nyCheckboxContextKey, null)

const inputRef = ref<HTMLInputElement | null>(null)
const messageId = `${useId()}-msg`

const optionValue = computed(() =>
  group && props.value !== undefined ? props.value : null,
)

const isChecked = computed(() => {
  const value = optionValue.value

  return value !== null && group ? group.values.value.includes(value) : model.value
})

const isDisabled = computed(() => props.disabled || (group?.disabled.value ?? false))
const isInvalid = computed(() => props.invalid || (group?.invalid.value ?? false))
const resolvedSize = computed(() => group?.size.value ?? props.size)

const isMixed = computed(() => props.indeterminate && !isChecked.value)

const isLocked = computed(() => {
  if (isDisabled.value) {
    return true
  }

  if (!group || optionValue.value === null) {
    return false
  }

  return isChecked.value ? !group.canUncheck.value : !group.canCheckMore.value
})

const iconSize = computed(() =>
  resolvedSize.value === 'lg' ? 15 : resolvedSize.value === 'sm' ? 11 : 13,
)

watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
})

function onChange(event: Event) {
  const input = event.target as HTMLInputElement

  if (isLocked.value) {
    input.checked = isChecked.value
    return
  }

  const next = input.checked
  const value = optionValue.value

  if (value !== null && group) {
    group.toggle(value, next)
  } else {
    model.value = next
  }

  emit('change', next)
}
</script>

<template>
  <NyField
    :hint="hint"
    :size="resolvedSize"
    :disabled="isDisabled"
    :message-id="messageId"
    :class="{ 'is-invalid': isInvalid }"
  >
    <label
      class="ny-checkbox"
      :class="[
        `ny-checkbox--${resolvedSize}`,
        {
          'is-checked': isChecked,
          'is-mixed': isMixed,
          'is-disabled': isDisabled,
          'is-locked': isLocked,
          'is-invalid': isInvalid,
        },
      ]"
    >
      <input
        ref="inputRef"
        class="ny-checkbox__input"
        type="checkbox"
        :checked="isChecked"
        :disabled="isLocked"
        :aria-checked="isMixed ? 'mixed' : isChecked"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="hint ? messageId : undefined"
        @change="onChange"
      />

      <span class="ny-checkbox__box" aria-hidden="true">
        <NyIcon v-if="isMixed" name="minus" :size="iconSize" :stroke-width="3" />
        <NyIcon v-else-if="isChecked" name="check" :size="iconSize" :stroke-width="3" />
      </span>

      <span v-if="label || $slots.default" class="ny-checkbox__text">
        <slot>{{ label }}</slot>
      </span>
    </label>
  </NyField>
</template>
