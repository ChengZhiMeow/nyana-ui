<script setup lang="ts">
import { computed, inject, ref, useId, watchEffect } from 'vue'

import { nyCheckboxContextKey } from './checkboxContext'
import NyField from './NyField.vue'
import NyIcon from '../basic/NyIcon.vue'

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

<style scoped lang="scss">
.ny-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--ny-space-2);
  min-width: 0;
  font-size: var(--ny-font-size-md);
  color: var(--ny-text);
  cursor: pointer;
  transition: color var(--ny-transition-fast);

  &:hover:not(.is-disabled) .ny-checkbox__box {
    border-color: var(--ny-primary);
  }
}

.ny-checkbox__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}

.ny-checkbox__box {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--ny-border-strong);
  border-radius: calc(var(--ny-radius-xs) + 2px);
  background: var(--ny-surface);
  color: transparent;
  transition:
    background var(--ny-transition-fast),
    border-color var(--ny-transition-fast),
    box-shadow var(--ny-transition-fast);
}

.ny-checkbox__input:focus-visible + .ny-checkbox__box {
  box-shadow: var(--ny-shadow-focus);
}

.ny-checkbox__text {
  min-width: 0;
  word-break: break-word;
}

.ny-checkbox--sm {
  gap: 6px;
  font-size: var(--ny-font-size-sm);

  .ny-checkbox__box {
    width: 16px;
    height: 16px;
  }
}

.ny-checkbox--lg {
  font-size: var(--ny-font-size-lg);

  .ny-checkbox__box {
    width: 20px;
    height: 20px;
  }
}

.ny-checkbox.is-checked,
.ny-checkbox.is-mixed {
  .ny-checkbox__box {
    border-color: transparent;
    background: var(--ny-primary);
    color: var(--ny-text-invert);
    box-shadow: 0 1px 6px var(--ny-primary-glow);
  }
}

.ny-checkbox.is-invalid .ny-checkbox__box {
  border-color: var(--ny-danger);
}

.ny-checkbox.is-locked {
  cursor: not-allowed;
}

.ny-checkbox.is-disabled {
  color: var(--ny-text-muted);
  cursor: not-allowed;

  .ny-checkbox__box {
    background: var(--ny-surface-2);
    border-color: var(--ny-border);
    color: var(--ny-text-muted);
    box-shadow: none;
  }

  &.is-checked .ny-checkbox__box,
  &.is-mixed .ny-checkbox__box {
    background: var(--ny-surface-3);
  }
}
</style>
