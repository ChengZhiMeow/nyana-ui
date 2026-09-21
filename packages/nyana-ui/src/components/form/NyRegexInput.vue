<script setup lang="ts">
import { computed, ref, useId, useSlots } from 'vue'

import NyField from './NyField.vue'
import NyIcon from '../basic/NyIcon.vue'
import NyInputShell from './NyInputShell.vue'

import { useValidation } from '../../composables/useValidation'
import type { NySize, NyValidateResult, NyValidateTrigger, NyVariant } from '../../types'
import { constraintHint, countText, sanitizeText, validateText } from '../../utils/text'
import type { NyTextConstraint } from '../../utils/text'
import { nyPatternPresets, presetConstraints, resolvePattern } from '../../utils/pattern'
import type { NyMatchMode, NyPatternPresetName } from '../../utils/pattern'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    preset?: NyPatternPresetName
    pattern?: string | RegExp
    patternFlags?: string
    match?: NyMatchMode
    message?: string
    size?: NySize
    variant?: NyVariant
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    showCount?: boolean
    showStatus?: boolean
    label?: string
    hint?: string
    autoHint?: boolean
    required?: boolean
    trim?: boolean
    allowedChars?: RegExp
    denyChars?: RegExp
    minLength?: number
    maxLength?: number
    validator?: (value: string) => string | null | undefined
    validateOn?: NyValidateTrigger
    autocomplete?: string
    name?: string
    controlId?: string
  }>(),
  {
    preset: undefined,
    pattern: undefined,
    patternFlags: '',
    match: 'full',
    message: '',
    size: 'md',
    variant: 'outline',
    placeholder: '',
    disabled: false,
    readonly: false,
    clearable: false,
    showCount: false,
    showStatus: true,
    label: '',
    hint: '',
    autoHint: true,
    required: false,
    trim: false,
    allowedChars: undefined,
    denyChars: undefined,
    minLength: undefined,
    maxLength: undefined,
    validator: undefined,
    validateOn: 'input',
    autocomplete: 'off',
    name: undefined,
    controlId: undefined,
  },
)

const emit = defineEmits<{
  (event: 'validate', result: NyValidateResult): void
  (event: 'input', value: string): void
  (event: 'enter', value: string): void
  (event: 'clear'): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', value: string): void
}>()

const slots = useSlots()
const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)

const autoId = useId()
const controlId = computed(() => props.controlId || autoId)
const messageId = computed(() => `${controlId.value}-msg`)

const preset = computed(() => presetConstraints(props.preset))

const resolvedPattern = computed(() =>
  resolvePattern(props.pattern ?? preset.value.pattern, props.patternFlags, props.match),
)

const resolvedMaxLength = computed(() => props.maxLength ?? preset.value.maxLength)

const resolvedPlaceholder = computed(() => props.placeholder || preset.value.placeholder || '')

const resolvedMessage = computed(
  () => props.message || preset.value.message || '格式不正确',
)

const constraint = computed<NyTextConstraint>(() => ({
  required: props.required,
  minLength: props.minLength,
  maxLength: resolvedMaxLength.value,
  trim: props.trim,
  allowedChars: props.allowedChars ?? preset.value.allowedChars,
  denyChars: props.denyChars,
  pattern: resolvedPattern.value,
  patternMessage: resolvedMessage.value,
  validator: props.validator,
}))

const { error, touched, validate, handleInput, handleBlur, reset } = useValidation(
  () => validateText(model.value, constraint.value),
  { trigger: () => props.validateOn, value: () => model.value },
)

const state = computed<'valid' | 'invalid' | null>(() => {
  if (!touched.value || !model.value) {
    return null
  }

  return error.value ? 'invalid' : 'valid'
})

const hintText = computed(() => {
  if (props.hint) {
    return props.hint
  }

  if (!props.autoHint) {
    return ''
  }

  const parts: string[] = []
  const lengthHint = constraintHint(constraint.value)
  const example = props.preset ? nyPatternPresets[props.preset]?.example : undefined

  if (lengthHint) {
    parts.push(lengthHint)
  }

  if (example) {
    parts.push(`示例: ${example}`)
  }

  return parts.join(', ')
})

const describedBy = computed(() =>
  error.value || hintText.value || slots.hint ? messageId.value : undefined,
)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const next = sanitizeText(target.value, constraint.value)

  if (next !== target.value) {
    target.value = next
  }

  model.value = next
  handleInput()
  emit('input', next)
}

function onFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function onBlur() {
  focused.value = false

  if (props.trim) {
    model.value = model.value.trim()
  }

  handleBlur()
  emit('blur', model.value)
  emit('validate', validate())
}

function clear() {
  model.value = ''
  emit('clear')
}

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus, clear, validate, reset, inputRef, error, touched, state, value: model })
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

    <template v-if="showCount" #extra>
      {{ countText(model, resolvedMaxLength) }}
    </template>

    <NyInputShell
      :size="size"
      :variant="variant"
      :disabled="disabled"
      :readonly="readonly"
      :invalid="!!error"
      :focused="focused"
      :clearable="clearable"
      :has-value="!!model"
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
        :value="model"
        :placeholder="resolvedPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :name="name"
        :autocomplete="autocomplete"
        :aria-invalid="!!error"
        :aria-describedby="describedBy"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="emit('enter', model)"
      />

      <template #suffix>
        <span
          v-if="showStatus && state"
          class="ny-regex__state"
          :class="`is-${state}`"
          :title="state === 'valid' ? '格式正确' : error || '格式不正确'"
        >
          <NyIcon :name="state === 'valid' ? 'check' : 'alert'" :size="14" />
        </span>

        <slot name="suffix" />
      </template>
    </NyInputShell>
  </NyField>
</template>

<style scoped lang="scss">
.ny-regex__state {
  display: inline-flex;
  align-items: center;

  &.is-valid {
    color: var(--ny-success);
  }

  &.is-invalid {
    color: var(--ny-danger);
  }
}
</style>
