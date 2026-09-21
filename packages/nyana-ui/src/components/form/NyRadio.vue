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

<style scoped lang="scss">
.ny-radio {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--ny-space-2);
  min-width: 0;
  font-size: var(--ny-font-size-md);
  color: var(--ny-text);
  cursor: pointer;
  transition: color var(--ny-transition-fast);

  &:hover:not(.is-disabled) .ny-radio__dot {
    border-color: var(--ny-primary);
  }
}

.ny-radio__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}

.ny-radio__dot {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--ny-border-strong);
  border-radius: 50%;
  background: var(--ny-surface);
  transition:
    background var(--ny-transition-fast),
    border-color var(--ny-transition-fast),
    box-shadow var(--ny-transition-fast);

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ny-primary);
    transform: scale(0);
    transition: transform var(--ny-transition-fast);
  }
}

.ny-radio__input:focus-visible + .ny-radio__dot {
  box-shadow: var(--ny-shadow-focus);
}

.ny-radio__text {
  min-width: 0;
  word-break: break-word;
}

.ny-radio--sm {
  gap: 6px;
  font-size: var(--ny-font-size-sm);

  .ny-radio__dot {
    width: 16px;
    height: 16px;

    &::after {
      width: 7px;
      height: 7px;
    }
  }
}

.ny-radio--lg {
  font-size: var(--ny-font-size-lg);

  .ny-radio__dot {
    width: 20px;
    height: 20px;

    &::after {
      width: 9px;
      height: 9px;
    }
  }
}

.ny-radio.is-checked .ny-radio__dot {
  border-color: var(--ny-primary);
  box-shadow: 0 1px 6px var(--ny-primary-glow);

  &::after {
    transform: scale(1);
  }
}

.ny-radio.is-invalid .ny-radio__dot {
  border-color: var(--ny-danger);
}

.ny-radio.is-disabled {
  color: var(--ny-text-muted);
  cursor: not-allowed;

  .ny-radio__dot {
    border-color: var(--ny-border);
    background: var(--ny-surface-2);
    box-shadow: none;

    &::after {
      background: var(--ny-text-muted);
    }
  }
}
</style>
