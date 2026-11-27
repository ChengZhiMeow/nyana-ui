<script setup lang="ts">
import { computed, useId } from 'vue'

import NyField from '../field/NyField.vue'
import NyIcon from '../icon/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    size?: NySize
    disabled?: boolean
    readonly?: boolean
    loading?: boolean
    checkedText?: string
    uncheckedText?: string
    label?: string
    hint?: string
  }>(),
  {
    size: 'md',
    disabled: false,
    readonly: false,
    loading: false,
    checkedText: '',
    uncheckedText: '',
    label: '',
    hint: '',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: boolean): void
}>()

const model = defineModel<boolean>('checked', { default: false })

const controlId = `${useId()}-switch`
const messageId = `${controlId}-msg`

const isLocked = computed(() => props.disabled || props.loading)
const text = computed(() => (model.value ? props.checkedText : props.uncheckedText))
const iconSize = computed(() => (props.size === 'lg' ? 13 : props.size === 'sm' ? 9 : 11))

function toggle() {
  if (isLocked.value || props.readonly) {
    return
  }

  const next = !model.value
  model.value = next
  emit('change', next)
}
</script>

<template>
  <NyField
    :label="label"
    :hint="hint"
    :size="size"
    :disabled="disabled"
    :control-id="controlId"
    :message-id="messageId"
  >
    <span
      :id="controlId"
      class="ny-switch"
      :class="[
        `ny-switch--${size}`,
        {
          'is-checked': model,
          'is-disabled': disabled,
          'is-readonly': readonly,
          'is-loading': loading,
        },
      ]"
      role="switch"
      :tabindex="disabled ? -1 : 0"
      :aria-checked="model"
      :aria-disabled="isLocked || undefined"
      :aria-readonly="readonly || undefined"
      :aria-label="label || undefined"
      :aria-describedby="hint ? messageId : undefined"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <span class="ny-switch__track">
        <span class="ny-switch__thumb">
          <NyIcon v-if="loading" name="refresh" :size="iconSize" spin />
        </span>
      </span>

      <span v-if="text" class="ny-switch__text">{{ text }}</span>
    </span>
  </NyField>
</template>
