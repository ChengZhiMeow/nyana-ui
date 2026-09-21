<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, useSlots, watch } from 'vue'

import NyField from './NyField.vue'
import NyInputShell from './NyInputShell.vue'

import { useValidation } from '../../composables/useValidation'
import type { NySize, NyValidateResult, NyValidateTrigger, NyVariant } from '../../types'
import { countText, constraintHint, sanitizeText, validateText } from '../../utils/text'
import type { NyTextConstraint } from '../../utils/text'
import { resolvePattern } from '../../utils/pattern'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    size?: NySize
    variant?: NyVariant
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    label?: string
    hint?: string
    autoHint?: boolean
    rows?: number
    autosize?: boolean | { minRows?: number; maxRows?: number }
    resize?: 'none' | 'vertical' | 'horizontal' | 'both'
    showCount?: boolean
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
    name?: string
    controlId?: string
  }>(),
  {
    size: 'md',
    variant: 'outline',
    placeholder: '',
    disabled: false,
    readonly: false,
    label: '',
    hint: '',
    autoHint: true,
    rows: 3,
    autosize: false,
    resize: 'vertical',
    showCount: false,
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
    name: undefined,
    controlId: undefined,
  },
)

const emit = defineEmits<{
  (event: 'validate', result: NyValidateResult): void
  (event: 'input', value: string): void
  (event: 'clear'): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', value: string): void
}>()

const slots = useSlots()
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const focused = ref(false)

const autoId = useId()
const controlId = computed(() => props.controlId || autoId)
const messageId = computed(() => `${controlId.value}-msg`)

const autosizeEnabled = computed(() => props.autosize !== false)

const minRows = computed(() => {
  if (typeof props.autosize === 'object') {
    return props.autosize.minRows ?? props.rows
  }

  return props.rows
})

const maxRows = computed(() => {
  if (typeof props.autosize === 'object') {
    return props.autosize.maxRows ?? 8
  }

  return 8
})

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

const { error, validate, handleInput, handleBlur, reset } = useValidation(
  () => validateText(model.value, constraint.value),
  { trigger: () => props.validateOn, value: () => model.value },
)

const hintText = computed(() =>
  props.hint || (props.autoHint ? constraintHint(constraint.value) : ''),
)

const describedBy = computed(() =>
  error.value || hintText.value || slots.hint ? messageId.value : undefined,
)

function resizeToContent() {
  const element = textareaRef.value

  if (!element || !autosizeEnabled.value) {
    return
  }

  const styles = window.getComputedStyle(element)
  const lineHeight = Number.parseFloat(styles.lineHeight) || 21
  const padding =
    Number.parseFloat(styles.paddingTop) +
    Number.parseFloat(styles.paddingBottom) +
    Number.parseFloat(styles.borderTopWidth) +
    Number.parseFloat(styles.borderBottomWidth)

  const min = minRows.value * lineHeight + padding
  const max = maxRows.value * lineHeight + padding

  element.style.height = 'auto'
  element.style.height = `${Math.min(Math.max(element.scrollHeight, min), max)}px`
  element.style.overflowY = element.scrollHeight > max ? 'auto' : 'hidden'
}

const resizeStyle = computed(() => ({
  resize: autosizeEnabled.value ? 'none' : props.resize,
  lineHeight: '1.6',
}))

const textareaRows = computed(() => (autosizeEnabled.value ? minRows.value : props.rows))

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const next = sanitizeText(target.value, constraint.value)

  if (next !== target.value) {
    target.value = next
  }

  model.value = next
  handleInput()
  emit('input', next)
  resizeToContent()
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
  textareaRef.value?.focus()
}

onMounted(resizeToContent)

watch(
  () => model.value,
  () => {
    nextTick(resizeToContent)
  },
)

defineExpose({ focus, clear, resize: resizeToContent, validate, reset, textareaRef, error, value: model })
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
      multiline
    >
      <textarea
        :id="controlId"
        ref="textareaRef"
        class="ny-shell__control"
        :style="resizeStyle"
        :value="model"
        :rows="textareaRows"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :name="name"
        :aria-invalid="!!error"
        :aria-describedby="describedBy"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
    </NyInputShell>
  </NyField>
</template>
