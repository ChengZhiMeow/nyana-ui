import type { InjectionKey, Ref } from 'vue'

export interface NyChoiceContext {
  isSelected: (value: string | number) => boolean
  toggle: (value: string | number) => void
  multiple: Ref<boolean>
  disabled: Ref<boolean>
  indicator: Ref<boolean>
}

export const nyChoiceKey: InjectionKey<NyChoiceContext> = Symbol('nyChoice')
