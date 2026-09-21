<script setup lang="ts">
import type { NySize } from '../../types'

withDefaults(
  defineProps<{
    label?: string
    hint?: string
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
    error: null,
    required: false,
    size: 'md',
    disabled: false,
    controlId: undefined,
    messageId: undefined,
  },
)
</script>

<template>
  <div
    class="ny-field"
    :class="[`ny-field--${size}`, { 'is-disabled': disabled, 'is-invalid': !!error }]"
  >
    <label v-if="label || $slots.label" class="ny-field__label" :for="controlId">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="ny-field__star" aria-hidden="true">*</span>
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

<style scoped lang="scss">
.ny-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.ny-field__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--ny-text-sub);
  transition: color var(--ny-transition-fast);
}

.ny-field__star {
  color: var(--ny-danger);
  font-weight: 700;
}

.ny-field__msg {
  margin: 0;
  font-size: 12px;
  color: var(--ny-text-muted);
  line-height: 1.5;
  word-break: break-word;
}

.ny-field__msg--error {
  color: var(--ny-danger);
}

.ny-field__extra {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  font-size: 12px;
  color: var(--ny-text-muted);
}

.ny-field.is-invalid .ny-field__label {
  color: var(--ny-danger);
}

.ny-field.is-disabled .ny-field__label {
  color: var(--ny-text-muted);
}

.ny-field--sm {
  gap: 4px;
}
</style>
