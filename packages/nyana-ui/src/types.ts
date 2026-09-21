
export type NySize = 'sm' | 'md' | 'lg'

export type NyVariant = 'outline' | 'soft' | 'ghost'

export type NyStatus = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger'

export type NyPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export type NyTrigger = 'hover' | 'click' | 'focus' | 'manual'

export type NyDirection = 'horizontal' | 'vertical'

export type NyAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'

export type NyJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface NyOption<T = string | number> {
  label: string
  value: T
  disabled?: boolean
  icon?: string
  desc?: string
}

export type NyValidateTrigger = 'blur' | 'input'

export type NyLayoutMode = 'side' | 'top' | 'mix' | 'blank'

export interface NyNavItem {
  key?: string
  label: string
  icon?: string
  href?: string
  to?: unknown
  disabled?: boolean
  active?: boolean
  badge?: string | number
  children?: NyNavItem[]
}

export interface NyNavGroup {
  title?: string
  items: NyNavItem[]
}

export interface NyControlProps {
  size?: NySize
  variant?: NyVariant
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
}

export interface NyValidateResult {
  valid: boolean
  message: string | null
  value: unknown
}

export interface NyFormRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  validator?: (value: unknown) => string | null | undefined | Promise<string | null | undefined>
  trigger?: NyValidateTrigger
}

export type NyFormRules = Record<string, NyFormRule | NyFormRule[]>
