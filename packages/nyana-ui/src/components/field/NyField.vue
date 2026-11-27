<script setup lang="ts">
import { computed } from 'vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    note?: string
    error?: string | null
    required?: boolean
    size?: NySize
    disabled?: boolean
    controlId?: string
    messageId?: string
  }>(),
  {
    label: '',
    hint: '',
    note: '',
    error: null,
    required: false,
    size: 'md',
    disabled: false,
    controlId: undefined,
    messageId: undefined,
  },
)

const noteText = computed(() => props.note || (props.required ? '必填' : ''))
</script>

<template>
  <div
    class="ny-field"
    :class="[`ny-field--${size}`, { 'is-disabled': disabled, 'is-invalid': !!error }]"
  >
    <label v-if="label || $slots.label" class="ny-field__label" :for="controlId">
      <span class="ny-field__text"><slot name="label">{{ label }}</slot></span>
      <span v-if="required" class="ny-field__star" aria-hidden="true">*</span>
      <span v-if="noteText" class="ny-field__note">({{ noteText }})</span>
    </label>

    <slot />

    <p v-if="error" :id="messageId" class="ny-field__msg ny-field__msg--error" role="alert">
      {{ error }}
    </p>

    <div v-else-if="hint || $slots.hint" :id="messageId" class="ny-field__msg">
      <slot name="hint">{{ hint }}</slot>
    </div>

    <div v-if="$slots.extra" class="ny-field__extra">
      <slot name="extra" />
    </div>
  </div>
</template>
