<script setup lang="ts">
import { computed, ref, useId, useSlots, watch } from 'vue'

import NyField from './NyField.vue'
import NyIcon from '../basic/NyIcon.vue'
import NyInputShell from './NyInputShell.vue'

import { useValidation } from '../../composables/useValidation'
import type { NySize, NyValidateResult, NyValidateTrigger, NyVariant } from '../../types'
import {
  clampNumber,
  formatNumberText,
  normalizeNumber,
  parseNumberText,
  roundNumber,
  sanitizeNumberText,
  stepNumber,
  validateNumber,
} from '../../utils/number'
import type { NyNumberConstraint } from '../../utils/number'

const model = defineModel<number | null>({ default: null })

const props = withDefaults(
  defineProps<{
    size?: NySize
    variant?: NyVariant
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    label?: string
    hint?: string
    autoHint?: boolean
    required?: boolean
    min?: number
    max?: number
    step?: number
    precision?: number
    thousands?: boolean
    allowNegative?: boolean
    clamp?: boolean
    stepper?: boolean
    wheel?: boolean
    keyboard?: boolean
    validateOn?: NyValidateTrigger
    name?: string
    controlId?: string
  }>(),
  {
    size: 'md',
    variant: 'outline',
    placeholder: '',
    disabled: false,
    readonly: false,
    clearable: false,
    label: '',
    hint: '',
    autoHint: true,
    required: false,
    min: undefined,
    max: undefined,
    step: 1,
    precision: undefined,
    thousands: false,
    allowNegative: true,
    clamp: true,
    stepper: true,
    wheel: false,
    keyboard: true,
    validateOn: 'blur',
    name: undefined,
    controlId: undefined,
  },
)

const emit = defineEmits<{
  (event: 'validate', result: NyValidateResult): void
  (event: 'change', value: number | null): void
  (event: 'input', value: number | null): void
  (event: 'clear'): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', value: number | null): void
}>()

const slots = useSlots()
const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)
const text = ref('')

const autoId = useId()
const controlId = computed(() => props.controlId || autoId)
const messageId = computed(() => `${controlId.value}-msg`)

const allowNegative = computed(() =>
  props.min === undefined ? props.allowNegative : props.min < 0,
)

const constraint = computed<NyNumberConstraint>(() => ({
  min: props.min,
  max: props.max,
  precision: props.precision,
  step: props.step,
  thousands: props.thousands,
  allowNegative: allowNegative.value,
  required: props.required,
}))

const textConstraint = computed(() => ({
  allowNegative: allowNegative.value,
  precision: props.precision,
  thousands: props.thousands,
}))

const { error, validate, handleInput, handleBlur, reset } = useValidation(
  () => validateNumber(model.value, constraint.value),
  { trigger: () => props.validateOn, value: () => model.value },
)

const hintText = computed(() => {
  if (props.hint) {
    return props.hint
  }

  if (!props.autoHint) {
    return ''
  }

  const parts: string[] = []

  if (props.min !== undefined && props.max !== undefined) {
    parts.push(`范围 ${props.min} - ${props.max}`)
  } else if (props.min !== undefined) {
    parts.push(`不小于 ${props.min}`)
  } else if (props.max !== undefined) {
    parts.push(`不大于 ${props.max}`)
  }

  if (props.precision !== undefined) {
    parts.push(`最多 ${props.precision} 位小数`)
  }

  if (props.step !== 1) {
    parts.push(`步进 ${props.step}`)
  }

  return parts.join(', ')
})

const describedBy = computed(() =>
  error.value || hintText.value || slots.hint ? messageId.value : undefined,
)

const atMin = computed(
  () => props.min !== undefined && model.value !== null && model.value <= props.min,
)

const atMax = computed(
  () => props.max !== undefined && model.value !== null && model.value >= props.max,
)

function syncFromModel() {
  const current = parseNumberText(text.value)

  if (current !== model.value || (model.value === null && text.value !== '')) {
    text.value = formatNumberText(model.value, constraint.value)
  }
}

watch(model, syncFromModel, { immediate: true })

function commit(value: number | null, kind: 'input' | 'change') {
  model.value = value

  if (kind === 'input') {
    emit('input', value)
  } else {
    emit('change', value)
  }
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const next = sanitizeNumberText(target.value, textConstraint.value)

  if (next !== target.value) {
    target.value = next
  }

  text.value = next

  const parsed = parseNumberText(next)

  if (parsed !== null) {
    commit(roundNumber(parsed, props.precision), 'input')
  } else if (next === '') {
    commit(null, 'input')
  }

  handleInput()
}

function onFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function onBlur() {
  focused.value = false

  const parsed = parseNumberText(text.value)

  if (parsed === null) {
    if (text.value !== '') {
      text.value = ''
    }

    commit(null, 'change')
  } else {
    const next = normalizeNumber(parsed, constraint.value, props.clamp && !props.readonly)

    text.value = formatNumberText(next, constraint.value)
    commit(next, 'change')
  }

  handleBlur()
  emit('blur', model.value)
  emit('validate', validate())
}

function step(direction: 1 | -1) {
  if (props.disabled || props.readonly) {
    return
  }

  const next = stepNumber(model.value, direction, constraint.value)

  text.value = formatNumberText(next, constraint.value)
  commit(next, 'change')
}

function onKeydown(event: KeyboardEvent) {
  if (!props.keyboard) {
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    step(1)
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    step(-1)
  }
}

function onWheel(event: WheelEvent) {
  if (!props.wheel || props.disabled || props.readonly) {
    return
  }

  event.preventDefault()
  step(event.deltaY < 0 ? 1 : -1)
}

function clear() {
  text.value = ''
  commit(null, 'change')
  emit('clear')
}

function focus() {
  inputRef.value?.focus()
}

function setValue(value: number | null) {
  model.value = value
  text.value = formatNumberText(value, constraint.value)
}

defineExpose({
  focus,
  clear,
  setValue,
  stepUp: () => step(1),
  stepDown: () => step(-1),
  clamp: () => setValue(model.value === null ? null : clampNumber(model.value, props.min, props.max)),
  validate,
  reset,
  inputRef,
  error,
  value: model,
})
</script>

<template>
  <NyField
    :label="label"
    :hint="hintText"
    :error="error"
    :required="required"
    :size="size"
    :disabled="disabled"
    :control-id="controlId"
    :message-id="messageId"
  >
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>

    <template v-if="$slots.hint" #hint>
      <slot name="hint" />
    </template>

    <NyInputShell
      :size="size"
      :variant="variant"
      :disabled="disabled"
      :readonly="readonly"
      :invalid="!!error"
      :focused="focused"
      :clearable="clearable"
      :has-value="model !== null"
      @clear="clear"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>

      <input
        :id="controlId"
        ref="inputRef"
        class="ny-shell__control"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        :value="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :name="name"
        :aria-invalid="!!error"
        :aria-describedby="describedBy"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
        @wheel="onWheel"
      />

      <template v-if="stepper" #suffix>
        <span class="ny-number__stepper">
          <button
            class="ny-number__step"
            type="button"
            title="减"
            tabindex="-1"
            :disabled="disabled || readonly || atMin"
            @click="step(-1)"
          >
            <NyIcon name="minus" :size="13" />
          </button>

          <button
            class="ny-number__step"
            type="button"
            title="加"
            tabindex="-1"
            :disabled="disabled || readonly || atMax"
            @click="step(1)"
          >
            <NyIcon name="plus" :size="13" />
          </button>
        </span>
      </template>

      <template v-else-if="$slots.suffix" #suffix>
        <slot name="suffix" />
      </template>
    </NyInputShell>
  </NyField>
</template>

<style scoped lang="scss">
.ny-number__stepper {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-right: -6px;
}

.ny-number__step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: var(--ny-radius-xs);
  background: transparent;
  color: var(--ny-text-muted);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover:not(:disabled) {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
