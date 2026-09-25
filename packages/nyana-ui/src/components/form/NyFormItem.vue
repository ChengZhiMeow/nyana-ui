<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useId, useSlots, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import { nyFormKey } from './formContext'
import { useValidation } from '../../composables/useValidation'
import { describeRules, runRules } from '../../utils/rule'

import type { NyFormField } from './formContext'
import type { CSSProperties } from 'vue'
import type { NyFormRule, NyValidateResult, NyValidateTrigger } from '../../types'

const props = withDefaults(
  defineProps<{
    name?: string
    label?: string
    rules?: NyFormRule | NyFormRule[]
    required?: boolean
    hint?: string
    note?: string
    labelWidth?: string | number
    labelAlign?: 'start' | 'end'
    validateOn?: NyValidateTrigger
    layout?: 'vertical' | 'horizontal'
    extra?: string
  }>(),
  {
    name: undefined,
    label: '',
    rules: undefined,
    required: undefined,
    hint: '',
    note: '',
    labelWidth: undefined,
    labelAlign: undefined,
    validateOn: undefined,
    layout: undefined,
    extra: '',
  },
)

const emit = defineEmits<{
  (event: 'validate', payload: { name: string; valid: boolean; message: string | null }): void
}>()

const slots = useSlots()
const form = inject(nyFormKey, null)

const itemRef = ref<HTMLElement | null>(null)
const message = ref<string | null>(null)
const validating = ref(false)

let composing = false
let initialValue: unknown

const autoId = useId()
const controlId = computed(() => `${autoId}-control`)
const messageId = computed(() => `${autoId}-msg`)

const trigger = computed<NyValidateTrigger>(() => props.validateOn ?? form?.validateOn ?? 'blur')

const layout = computed<'vertical' | 'horizontal'>(() => {
  if (props.layout) {
    return props.layout
  }

  if (form?.layout === 'horizontal' || form?.layout === 'inline') {
    return 'horizontal'
  }

  return 'vertical'
})

const rules = computed<NyFormRule[]>(() => {
  const local = props.rules ? (Array.isArray(props.rules) ? props.rules : [props.rules]) : []
  const shared = props.name ? form?.rules[props.name] : undefined
  const list = [...local, ...(Array.isArray(shared) ? shared : shared ? [shared] : [])]

  if (props.required === true && !list.some((rule) => rule.required)) {
    list.unshift({ required: true })
  }

  return list
})

const required = computed(() => props.required ?? rules.value.some((rule) => rule.required))

const noteText = computed(() => props.note || describeRules(rules.value))

const hasLabel = computed(() => !!props.label || !!slots.label)

const disabled = computed(() => form?.disabled ?? false)

const size = computed(() => form?.size ?? 'md')

function readValue(): unknown {
  return props.name && form ? form.getValue(props.name) : undefined
}

const labelStyle = computed<CSSProperties | undefined>(() => {
  if (layout.value === 'vertical') {
    return undefined
  }

  return { textAlign: (props.labelAlign ?? form?.labelAlign ?? 'start') === 'end' ? 'end' : 'start' }
})

const itemStyle = computed<CSSProperties | undefined>(() => {
  const width = props.labelWidth

  if (width === undefined) {
    return undefined
  }

  return { '--ny-label-width': typeof width === 'number' ? `${width}px` : width }
})

const {
  error,
  validate: commit,
  handleInput,
  handleBlur,
  reset: resetValidation,
} = useValidation(() => message.value, { trigger: () => trigger.value, value: () => readValue() })

function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return [...value]
  }

  if (value && typeof value === 'object') {
    return Object.assign({}, value)
  }

  return value
}

async function execute(only?: NyValidateTrigger): Promise<boolean> {
  if (!form || !props.name) {
    return true
  }

  const list = only
    ? rules.value.filter((rule) => (rule.trigger ?? trigger.value) === only)
    : rules.value

  if (!list.length) {
    return !error.value
  }

  validating.value = true

  const failed = await runRules(readValue(), list, { label: props.label || props.name })

  validating.value = false
  message.value = failed
  commit()
  emit('validate', { name: props.name, valid: !failed, message: failed })

  return !failed
}

async function validate(triggerName?: NyValidateTrigger): Promise<NyValidateResult> {
  const valid = await execute(triggerName)

  return { valid, message: error.value, value: readValue() }
}

function clear() {
  message.value = null
  validating.value = false
  resetValidation()
}

function reset() {
  if (form && props.name) {
    form.setValue(props.name, cloneValue(initialValue))
  }

  clear()
}

async function onInput() {
  if (composing || trigger.value !== 'input') {
    return
  }

  await nextTick()

  handleInput()
  await execute('input')
}

async function onFocusout(event: FocusEvent) {
  const next = event.relatedTarget

  if (next instanceof Node && itemRef.value?.contains(next)) {
    return
  }

  handleBlur()
  await execute()
}

function onCompositionStart() {
  composing = true
}

async function onCompositionEnd() {
  composing = false
  await onInput()
}

function syncControlA11y() {
  const control = itemRef.value?.querySelector<HTMLElement>('input, textarea, select')

  if (!control) {
    return
  }

  if (!control.id) {
    control.id = controlId.value
  }

  if (!control.getAttribute('aria-describedby') && (error.value || props.hint || slots.hint)) {
    control.setAttribute('aria-describedby', messageId.value)
  }
}

watch(() => [!!error.value, props.hint, !!slots.hint], syncControlA11y, { flush: 'post' })

onMounted(() => {
  const name = props.name

  syncControlA11y()

  if (!form || !name) {
    return
  }

  initialValue = cloneValue(readValue())

  const field: NyFormField = {
    name,
    validate: (trigger?: NyValidateTrigger) => validate(trigger).then((result) => result.valid),
    reset,
    clear,
    message: () => error.value,
  }

  form.register(field)
})

onBeforeUnmount(() => {
  const name = props.name

  if (form && name) {
    form.unregister(name)
  }
})

defineExpose({ validate, reset, clear })
</script>

<template>
  <div
    ref="itemRef"
    class="ny-form-item"
    :class="[
      `ny-form-item--${layout}`,
      `ny-form-item--${size}`,
      { 'is-labeled': hasLabel, 'is-invalid': !!error, 'is-disabled': disabled },
    ]"
    :style="itemStyle"
    :data-ny-field="name"
    @focusout="onFocusout"
    @input.capture="onInput"
    @change.capture="onInput"
    @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd"
  >
    <label v-if="hasLabel" class="ny-form-item__label" :style="labelStyle" :for="controlId">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="ny-form-item__star" aria-hidden="true">*</span>
      <span v-if="noteText" class="ny-form-item__note">({{ noteText }})</span>
      <NyIcon v-if="validating" class="ny-form-item__spin" name="refresh" :size="12" spin />
    </label>

    <div class="ny-form-item__control">
      <slot
        :control-id="controlId"
        :message-id="messageId"
        :invalid="!!error"
        :error="error"
      />
    </div>

    <p v-if="error" :id="messageId" class="ny-form-item__msg" role="alert">
      <slot name="help" :error="error">{{ error }}</slot>
    </p>

    <p v-else-if="hint || $slots.hint" :id="messageId" class="ny-form-item__msg">
      <slot name="hint">{{ hint }}</slot>
    </p>

    <div v-if="extra || $slots.extra" class="ny-form-item__extra">
      <slot name="extra">{{ extra }}</slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;

  &.is-disabled .ny-form-item__label {
    color: var(--ny-text-muted);
  }

  &.is-invalid .ny-form-item__label {
    color: var(--ny-danger-text);
  }
}

.ny-form-item--horizontal.is-labeled {
  display: grid;
  grid-template-columns: var(--ny-label-width, auto) minmax(0, 1fr);
  column-gap: var(--ny-space-3);
  align-items: start;

  .ny-form-item__label {
    grid-column: 1;
    grid-row: 1;
    line-height: 20px;
  }

  .ny-form-item__control,
  .ny-form-item__msg,
  .ny-form-item__extra {
    grid-column: 2;
  }
}

.ny-form-item--sm.is-labeled .ny-form-item__label {
  padding-top: 5px;
}

.ny-form-item--md.is-labeled .ny-form-item__label {
  padding-top: 9px;
}

.ny-form-item--lg.is-labeled .ny-form-item__label {
  padding-top: 13px;
}

.ny-form-item__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding-left: 2px;
  font-size: var(--ny-font-size-sm);
  color: var(--ny-text-sub);
  transition: color var(--ny-transition-fast);
}

.ny-form-item__star {
  color: var(--ny-danger);
  font-weight: 700;
}

.ny-form-item__note {
  color: var(--ny-text-muted);
}

.ny-form-item__spin {
  color: var(--ny-text-muted);
}

.ny-form-item__control {
  min-width: 0;
}

.ny-form-item__msg {
  margin: 0;
  font-size: var(--ny-font-size-xs);
  color: var(--ny-text-muted);
  line-height: 1.5;
  word-break: break-word;
  text-align: left;

  &[role='alert'] {
    color: var(--ny-danger-text);
  }
}

.ny-form-item__extra {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ny-space-1);
  font-size: var(--ny-font-size-xs);
  color: var(--ny-text-muted);
}
</style>
