import type { ComputedRef, InjectionKey } from 'vue'

import type { NySize } from '../../types'

export interface NyCheckboxContext {
  values: ComputedRef<(string | number)[]>
  disabled: ComputedRef<boolean>
  size: ComputedRef<NySize>
  invalid: ComputedRef<boolean>
  canCheckMore: ComputedRef<boolean>
  canUncheck: ComputedRef<boolean>
  toggle: (value: string | number, checked: boolean) => void
}

export const nyCheckboxContextKey: InjectionKey<NyCheckboxContext> = Symbol('ny-checkbox-group')
