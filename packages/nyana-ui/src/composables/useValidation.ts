import { computed, ref } from 'vue'

import type { NyValidateResult, NyValidateTrigger } from '../types'

export interface NyValidationOptions {
  trigger?: () => NyValidateTrigger
  value?: () => unknown
}

export function useValidation(
  getMessage: () => string | null,
  options: NyValidationOptions = {},
) {
  const touched = ref(false)

  const error = computed(() => (touched.value ? getMessage() : null))

  function validate(): NyValidateResult {
    touched.value = true

    return {
      valid: !error.value,
      message: error.value,
      value: options.value ? options.value() : undefined,
    }
  }

  function handleInput() {
    if ((options.trigger?.() ?? 'blur') === 'input') {
      touched.value = true
    }
  }

  function handleBlur() {
    touched.value = true
  }

  function reset() {
    touched.value = false
  }

  return { error, touched, validate, handleInput, handleBlur, reset }
}
