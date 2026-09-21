import type { ComputedRef, InjectionKey } from 'vue'

import type { NySize } from '../../types'

export interface NyRadioContext {
  value: ComputedRef<string | number | null>
  disabled: ComputedRef<boolean>
  size: ComputedRef<NySize>
  invalid: ComputedRef<boolean>
  name: string
  select: (value: string | number) => void
}

export const nyRadioContextKey: InjectionKey<NyRadioContext> = Symbol('ny-radio-group')
