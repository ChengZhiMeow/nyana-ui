
import type { NyFormRule } from '../types'

export interface NyRuleContext {
  label?: string
}

const FALLBACK_LABEL = '该字段'

export const nyRuleMessages: {
  required: (label: string) => string
  min: (label: string, n: number) => string
  max: (label: string, n: number) => string
  len: (label: string, n: number) => string
  pattern: (label: string) => string
} = {
  required: (label) => `${label}不能为空`,
  min: (label, n) => `${label}不能小于 ${n}`,
  max: (label, n) => `${label}不能大于 ${n}`,
  len: (label, n) => `${label}长度必须为 ${n}`,
  pattern: (label) => `${label}格式不正确`,
}

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true
  }

  if (typeof value === 'string') {
    return value === ''
  }

  return Array.isArray(value) && value.length === 0
}

function measurable(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value
  }

  return lengthOf(value)
}

function lengthOf(value: unknown): number | null {
  if (typeof value === 'string') {
    return Array.from(value).length
  }

  return Array.isArray(value) ? value.length : null
}

function matchPattern(value: unknown, pattern: RegExp): boolean {
  if (typeof value !== 'string') {
    return true
  }

  pattern.lastIndex = 0

  return pattern.test(value)
}

async function runRule(value: unknown, rule: NyFormRule, label: string): Promise<string | null> {
  if (rule.required && isEmpty(value)) {
    return rule.message || nyRuleMessages.required(label)
  }

  if (!isEmpty(value)) {
    const size = measurable(value)

    if (typeof rule.min === 'number' && size !== null && size < rule.min) {
      return rule.message || nyRuleMessages.min(label, rule.min)
    }

    if (typeof rule.max === 'number' && size !== null && size > rule.max) {
      return rule.message || nyRuleMessages.max(label, rule.max)
    }

    const length = lengthOf(value)

    if (typeof rule.len === 'number' && length !== null && length !== rule.len) {
      return rule.message || nyRuleMessages.len(label, rule.len)
    }

    if (rule.pattern && !matchPattern(value, rule.pattern)) {
      return rule.message || nyRuleMessages.pattern(label)
    }
  }

  if (rule.validator) {
    const failed = await rule.validator(value)

    if (typeof failed === 'string' && failed) {
      return rule.message || failed
    }
  }

  return null
}

export async function runRules(
  value: unknown,
  rules: NyFormRule | NyFormRule[] | undefined,
  context: NyRuleContext = {},
): Promise<string | null> {
  if (!rules) {
    return null
  }

  const label = context.label || FALLBACK_LABEL
  const list = Array.isArray(rules) ? rules : [rules]

  for (const rule of list) {
    const message = await runRule(value, rule, label)

    if (message) {
      return message
    }
  }

  return null
}
