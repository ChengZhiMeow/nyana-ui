<script setup lang="ts">
import { computed, provide, useId } from 'vue'

import { nyCheckboxContextKey } from './checkboxContext'
import NyCheckbox from './NyCheckbox.vue'
import NyField from './NyField.vue'

import type { NyDirection, NyOption, NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    options?: NyOption[]
    disabled?: boolean
    direction?: NyDirection
    size?: NySize
    min?: number
    max?: number
    label?: string
    hint?: string
    invalid?: boolean
  }>(),
  {
    options: () => [],
    disabled: false,
    direction: 'horizontal',
    size: 'md',
    min: undefined,
    max: undefined,
    label: '',
    hint: '',
    invalid: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: (string | number)[]): void
}>()

const model = defineModel<(string | number)[]>()

const messageId = `${useId()}-msg`

const values = computed(() => model.value ?? [])
const canCheckMore = computed(() => props.max === undefined || values.value.length < props.max)
const canUncheck = computed(() => props.min === undefined || values.value.length > props.min)

function toggle(value: string | number, checked: boolean) {
  if (props.disabled) {
    return
  }

  if (checked && !canCheckMore.value) {
    return
  }

  if (!checked && !canUncheck.value) {
    return
  }

  const next = checked
    ? [...values.value, value]
    : values.value.filter((item) => item !== value)

  model.value = next
  emit('change', next)
}

provide(nyCheckboxContextKey, {
  values,
  disabled: computed(() => props.disabled),
  size: computed(() => props.size),
  invalid: computed(() => props.invalid),
  canCheckMore,
  canUncheck,
  toggle,
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
      class="ny-checkbox-group"
      :class="`ny-checkbox-group--${direction}`"
      role="group"
      :aria-label="label || undefined"
      :aria-invalid="invalid || undefined"
      :aria-describedby="hint ? messageId : undefined"
    >
      <NyCheckbox
        v-for="option in options"
        :key="String(option.value)"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      />

      <slot />
    </div>
  </NyField>
</template>

<style scoped lang="scss">
.ny-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ny-space-2) var(--ny-space-4);
}

.ny-checkbox-group--vertical {
  flex-direction: column;
  gap: var(--ny-space-2);
}
</style>
