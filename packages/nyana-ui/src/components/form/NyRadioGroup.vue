<script setup lang="ts">
import { computed, provide, ref, useId } from 'vue'

import NyField from './NyField.vue'
import NyRadio from './NyRadio.vue'
import { nyRadioContextKey } from './radioContext'

import type { NyDirection, NyOption, NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    options?: NyOption[]
    disabled?: boolean
    direction?: NyDirection
    size?: NySize
    label?: string
    hint?: string
    invalid?: boolean
    button?: boolean
  }>(),
  {
    options: () => [],
    disabled: false,
    direction: 'horizontal',
    size: 'md',
    label: '',
    hint: '',
    invalid: false,
    button: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string | number): void
}>()

const model = defineModel<string | number | null>()

const groupRef = ref<HTMLElement | null>(null)
const messageId = `${useId()}-msg`
const name = `ny-radio-${useId()}`

const currentValue = computed(() => model.value ?? null)
const enabledOptions = computed(() => props.options.filter((option) => !option.disabled))

const focusValue = computed(() => {
  const current = currentValue.value

  if (current !== null && enabledOptions.value.some((option) => option.value === current)) {
    return current
  }

  return enabledOptions.value[0]?.value ?? null
})

function select(value: string | number) {
  if (props.disabled || currentValue.value === value) {
    return
  }

  model.value = value
  emit('change', value)
}

function onKeydown(event: KeyboardEvent) {
  if (!props.button || props.disabled) {
    return
  }

  const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']

  if (!keys.includes(event.key)) {
    return
  }

  const buttons = Array.from(
    groupRef.value?.querySelectorAll<HTMLElement>('[role="radio"]:not(:disabled)') ?? [],
  )

  if (!buttons.length) {
    return
  }

  event.preventDefault()

  const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
  const active = buttons.findIndex((button) => button === document.activeElement)
  const base = active === -1 ? (delta > 0 ? -1 : 0) : active
  const nextIndex = (base + delta + buttons.length) % buttons.length
  const next = enabledOptions.value[nextIndex]

  if (!next) {
    return
  }

  select(next.value)
  buttons[nextIndex].focus()
}

function buttonTabindex(value: string | number) {
  return value === focusValue.value ? 0 : -1
}

provide(nyRadioContextKey, {
  value: currentValue,
  disabled: computed(() => props.disabled),
  size: computed(() => props.size),
  invalid: computed(() => props.invalid),
  name,
  select,
})
</script>

<template>
  <NyField
    :label="label"
    :hint="hint"
    :size="size"
    :disabled="disabled"
    :message-id="messageId"
    :class="{ 'is-invalid': invalid }"
  >
    <div
      ref="groupRef"
      class="ny-radio-group"
      :class="[`ny-radio-group--${direction}`, { 'is-button': button }]"
      role="radiogroup"
      :aria-label="label || undefined"
      :aria-invalid="invalid || undefined"
      :aria-describedby="hint ? messageId : undefined"
      @keydown="onKeydown"
    >
      <template v-if="button">
        <button
          v-for="option in options"
          :key="String(option.value)"
          class="ny-radio-group__btn"
          :class="{ 'is-checked': currentValue === option.value }"
          type="button"
          role="radio"
          :aria-checked="currentValue === option.value"
          :tabindex="buttonTabindex(option.value)"
          :disabled="disabled || option.disabled"
          @click="select(option.value)"
        >
          {{ option.label }}
        </button>
      </template>

      <template v-else>
        <NyRadio
          v-for="option in options"
          :key="String(option.value)"
          :label="option.label"
          :value="option.value"
          :disabled="option.disabled"
        />
      </template>

      <slot />
    </div>
  </NyField>
</template>

<style scoped lang="scss">
.ny-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ny-space-2) var(--ny-space-4);
}

.ny-radio-group--vertical {
  flex-direction: column;
  gap: var(--ny-space-2);
}

.ny-radio-group__btn {
  padding: 0 var(--ny-space-4);
  border: 1px solid transparent;
  border-radius: var(--ny-radius-pill);
  background: transparent;
  color: var(--ny-text-sub);
  font-family: inherit;
  font-size: var(--ny-font-size-md);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    color var(--ny-transition-fast),
    box-shadow var(--ny-transition-fast);

  &:hover:not(:disabled) {
    color: var(--ny-text);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ny-radio-group.is-button {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface-2);

  .ny-radio-group__btn {
    height: 30px;
  }

  .ny-radio-group__btn.is-checked {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
    font-weight: 600;
    box-shadow: 0 2px 8px var(--ny-primary-glow);
  }

  &.ny-radio-group--md .ny-radio-group__btn {
    height: 32px;
  }

  &.ny-radio-group--lg .ny-radio-group__btn {
    height: 40px;
  }
}

.ny-radio-group.is-button.ny-radio-group--vertical {
  display: inline-flex;
  flex-direction: column;
  border-radius: var(--ny-radius-md);

  .ny-radio-group__btn {
    width: 100%;
  }
}
</style>
