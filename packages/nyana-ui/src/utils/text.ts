
export interface NyTextConstraint {
  required?: boolean
  minLength?: number
  maxLength?: number
  trim?: boolean
  lowercase?: boolean
  uppercase?: boolean
  allowedChars?: RegExp
  denyChars?: RegExp
  pattern?: RegExp
  patternMessage?: string
  validator?: (value: string) => string | null | undefined
}

export const nyTextMessages = {
  required: '此项为必填',
  minLength: (min: number) => `至少输入 ${min} 个字符`,
  maxLength: (max: number) => `最多输入 ${max} 个字符`,
  pattern: '格式不正确',
}

function globalize(source: RegExp): RegExp {
  return source.flags.includes('g') ? source : new RegExp(source.source, `${source.flags}g`)
}

function keepAllowed(value: string, allowed: RegExp): string {
  const single = new RegExp(`^(?:${allowed.source})$`, allowed.flags.replace('g', ''))
  let result = ''

  for (const char of value) {
    if (single.test(char)) {
      result += char
    }
  }

  return result
}

export function sanitizeText(raw: string, constraint: NyTextConstraint = {}): string {
  let value = raw

  if (constraint.denyChars) {
    value = value.replace(globalize(constraint.denyChars), '')
  }

  if (constraint.allowedChars) {
    value = keepAllowed(value, constraint.allowedChars)
  }

  if (constraint.lowercase) {
    value = value.toLowerCase()
  }

  if (constraint.uppercase) {
    value = value.toUpperCase()
  }

  if (typeof constraint.maxLength === 'number') {
    value = Array.from(value).slice(0, constraint.maxLength).join('')
  }

  return value
}

export function validateText(value: string, constraint: NyTextConstraint = {}): string | null {
  const text = constraint.trim ? value.trim() : value

  if (constraint.required && !text) {
    return nyTextMessages.required
  }

  if (!text) {
    return null
  }

  const length = Array.from(text).length

  if (typeof constraint.minLength === 'number' && length < constraint.minLength) {
    return nyTextMessages.minLength(constraint.minLength)
  }

  if (typeof constraint.maxLength === 'number' && length > constraint.maxLength) {
    return nyTextMessages.maxLength(constraint.maxLength)
  }

  if (constraint.pattern && !constraint.pattern.test(text)) {
    return constraint.patternMessage || nyTextMessages.pattern
  }

  return constraint.validator?.(text) ?? null
}

export function countText(value: string, maxLength?: number): string {
  const length = Array.from(value).length

  return typeof maxLength === 'number' ? `${length}/${maxLength}` : `${length}`
}

export function constraintHint(constraint: NyTextConstraint): string {
  const parts: string[] = []

  if (typeof constraint.minLength === 'number' && typeof constraint.maxLength === 'number') {
    parts.push(`${constraint.minLength}-${constraint.maxLength} 个字符`)
  } else if (typeof constraint.maxLength === 'number') {
    parts.push(`最多 ${constraint.maxLength} 个字符`)
  } else if (typeof constraint.minLength === 'number') {
    parts.push(`至少 ${constraint.minLength} 个字符`)
  }

  return parts.join(', ')
}
