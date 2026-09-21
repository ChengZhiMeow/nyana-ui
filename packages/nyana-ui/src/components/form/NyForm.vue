<script setup lang="ts">
import { computed, provide, reactive, ref } from 'vue'

import { nyFormKey } from './formContext'

import type { NyFormContext, NyFormField } from './formContext'
import type { NyFormRules, NySize, NyValidateTrigger } from '../../types'

const props = withDefaults(
  defineProps<{
    model: Record<string, unknown>
    rules?: NyFormRules
    size?: NySize
    disabled?: boolean
    layout?: 'vertical' | 'horizontal' | 'inline'
    labelWidth?: string | number
    labelAlign?: 'start' | 'end'
    validateOn?: NyValidateTrigger
    gap?: number
  }>(),
  {
    rules: () => ({}),
    size: 'md',
    disabled: false,
    layout: 'vertical',
    labelWidth: 'auto',
    labelAlign: 'start',
    validateOn: 'blur',
    gap: 18,
  },
)

const emit = defineEmits<{
  (event: 'validate', payload: { valid: boolean; errors: Record<string, string | null> }): void
  (event: 'submit', payload: Record<string, unknown>): void
  (event: 'reset'): void
}>()

const formRef = ref<HTMLFormElement | null>(null)

const fields = new Map<string, NyFormField>()
const errors = reactive<Record<string, string | null>>({})

function normalizeWidth(width: string | number): string {
  return typeof width === 'number' ? `${width}px` : width
}

const formStyle = computed(() => ({
  '--ny-form-gap': `${props.gap}px`,
  '--ny-label-width': normalizeWidth(props.labelWidth),
}))

const context: NyFormContext = {
  get model() {
    return props.model
  },
  get rules() {
    return props.rules
  },
  get size() {
    return props.size
  },
  get disabled() {
    return props.disabled
  },
  get layout() {
    return props.layout
  },
  get labelWidth() {
    return normalizeWidth(props.labelWidth)
  },
  get labelAlign() {
    return props.labelAlign
  },
  get validateOn() {
    return props.validateOn
  },
  register(field) {
    fields.set(field.name, field)
  },
  unregister(name) {
    fields.delete(name)
  },
  getValue(name) {
    return props.model[name]
  },
  setValue(name, value) {
    props.model[name] = value
  },
}

provide(nyFormKey, context)

function recordError(name: string, passed: boolean, message?: () => string | null) {
  errors[name] = passed ? null : message?.() ?? ''
}

function clearErrors() {
  for (const name of Object.keys(errors)) {
    delete errors[name]
  }
}

async function validate(): Promise<boolean> {
  let valid = true

  for (const [name, field] of fields) {
    const passed = await field.validate()

    recordError(name, passed, field.message)
    valid = valid && passed
  }

  emit('validate', { valid, errors: { ...errors } })

  return valid
}

async function validateField(name: string): Promise<boolean> {
  const field = fields.get(name)

  if (!field) {
    return true
  }

  const passed = await field.validate()

  recordError(name, passed, field.message)

  return passed
}

function resetFields() {
  for (const field of fields.values()) {
    field.reset()
  }

  clearErrors()
  emit('reset')
}

function clearValidate() {
  for (const field of fields.values()) {
    field.clear()
  }

  clearErrors()
}

function scrollToField(name: string) {
  const root = formRef.value

  if (!root) {
    return
  }

  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-ny-field]'))
  const target = nodes.find((node) => node.dataset.nyField === name)

  target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function getFields(): string[] {
  return [...fields.keys()]
}

function onSubmit() {
  emit('submit', props.model)
}

defineExpose({ validate, validateField, resetFields, clearValidate, scrollToField, getFields })
</script>

<template>
  <form
    ref="formRef"
    class="ny-form"
    :class="[`ny-form--${layout}`, { 'is-disabled': disabled }]"
    :style="formStyle"
    @submit.prevent="onSubmit"
  >
    <slot />

    <div v-if="$slots.actions" class="ny-form__actions">
      <slot name="actions" />
    </div>
  </form>
</template>

<style scoped lang="scss">
.ny-form {
  display: flex;
  flex-direction: column;
  gap: var(--ny-form-gap);
  width: 100%;
}

.ny-form--inline {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;

  :deep(.ny-form-item) {
    flex: 0 1 auto;
    max-width: 100%;
  }

  .ny-form__actions {
    flex: none;
  }
}

.ny-form__actions {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
}
</style>
