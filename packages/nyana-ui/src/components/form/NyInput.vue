<script setup lang="ts">
import { computed, ref, useId, useSlots } from 'vue'

import NyField from './NyField.vue'
import NyInputShell from './NyInputShell.vue'
import NyIcon from '../basic/NyIcon.vue'

import { useValidation } from '../../composables/useValidation'
import type { NySize, NyValidateResult, NyValidateTrigger, NyVariant } from '../../types'
import { countText, constraintHint, sanitizeText, validateText } from '../../utils/text'
import type { NyTextConstraint } from '../../utils/text'
import { resolvePattern } from '../../utils/pattern'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    type?: 'text' | 'password' | 'email' | 'search' | 'tel' | 'url'
    size?: NySize
    variant?: NyVariant
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    passwordToggle?: boolean
    showCount?: boolean
    label?: string
    hint?: string
    autoHint?: boolean
    required?: boolean
    trim?: boolean
    lowercase?: boolean
    uppercase?: boolean
    allowedChars?: RegExp
    denyChars?: RegExp
    minLength?: number
    maxLength?: number
    pattern?: string | RegExp
    patternFlags?: string
    patternMessage?: string
    validator?: (value: string) => string | null | undefined
    validateOn?: NyValidateTrigger
    autocomplete?: string
    name?: string
    controlId?: string
  }>(),
  {
    type: 'text',
    size: 'md',
    variant: 'outline',
    placeholder: '',
    disabled: false,
    readonly: false,
    clearable: false,
    passwordToggle: false,
    showCount: false,
    label: '',
    hint: '',
    autoHint: true,
    required: false,
    trim: false,
    lowercase: false,
    uppercase: false,
    allowedChars: undefined,
    denyChars: undefined,
    minLength: undefined,
    maxLength: undefined,
    pattern: undefined,
    patternFlags: '',
    patternMessage: '',
    validator: undefined,
    validateOn: 'blur',
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
const revealed = ref(false)
const focused = ref(false)

const autoId = useId()
const controlId = computed(() => props.controlId || autoId)
const messageId = computed(() => `${controlId.value}-msg`)

const constraint = computed<NyTextConstraint>(() => ({
  required: props.required,
  minLength: props.minLength,
  maxLength: props.maxLength,
  trim: props.trim,
  lowercase: props.lowercase,
  uppercase: props.uppercase,
  allowedChars: props.allowedChars,
  denyChars: props.denyChars,
  pattern: resolvePattern(props.pattern, props.patternFlags),
  patternMessage: props.patternMessage || undefined,
  validator: props.validator,
}))

const { error, touched, validate, handleInput, handleBlur, reset } = useValidation(
  () => validateText(model.value, constraint.value),
  { trigger: () => props.validateOn, value: () => model.value },
)

const hintText = computed(() =>
  props.hint || (props.autoHint ? constraintHint(constraint.value) : ''),
)

const describedBy = computed(() =>
  error.value || hintText.value || slots.hint ? messageId.value : undefined,
)

const resolvedType = computed(() =>
  props.type === 'password' && revealed.value ? 'text' : props.type,
)

const showToggle = computed(() => props.passwordToggle && props.type === 'password')

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

defineExpose({ focus, clear, validate, reset, inputRef, error, touched, value: model })
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
      {{ countText(model, maxLength) }}
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
        :type="resolvedType"
        :value="model"
        :placeholder="placeholder"
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
        <button
          v-if="showToggle"
          class="ny-input__toggle"
          type="button"
          tabindex="-1"
          :title="revealed ? '隐藏内容' : '显示内容'"
          @click="revealed = !revealed"
        >
          <NyIcon :name="revealed ? 'eye-off' : 'eye'" :size="15" />
        </button>

        <slot name="suffix" />
      </template>
    </NyInputShell>
  </NyField>
</template>

<style scoped lang="scss">
.ny-input__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--ny-text-muted);
  cursor: pointer;
  transition: color var(--ny-transition-fast);

  &:hover {
    color: var(--ny-text);
  }
}
</style>
