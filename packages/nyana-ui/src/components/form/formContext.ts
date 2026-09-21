import type { InjectionKey } from 'vue'

import type { NyFormRules, NySize, NyValidateTrigger } from '../../types'

export interface NyFormField {
  name: string
  validate: (trigger?: NyValidateTrigger) => Promise<boolean>
  reset: () => void
  clear: () => void
  message?: () => string | null
}

export interface NyFormContext {
  model: Record<string, unknown>
  rules: NyFormRules
  size: NySize
  disabled: boolean
  layout: 'vertical' | 'horizontal' | 'inline'
  labelWidth: string
  labelAlign: 'start' | 'end'
  validateOn: NyValidateTrigger
  register: (field: NyFormField) => void
  unregister: (name: string) => void
  getValue: (name: string) => unknown
  setValue: (name: string, value: unknown) => void
}

export const nyFormKey: InjectionKey<NyFormContext> = Symbol('nyForm')
