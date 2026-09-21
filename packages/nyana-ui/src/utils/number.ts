
export interface NyNumberConstraint {
  min?: number
  max?: number
  precision?: number
  step?: number
  allowEmpty?: boolean
  required?: boolean
  allowNegative?: boolean
  thousands?: boolean
}

export const nyNumberMessages = {
  required: '此项为必填',
  invalid: '请输入数字',
  min: (min: number) => `不能小于 ${min}`,
  max: (max: number) => `不能大于 ${max}`,
  precision: (precision: number) => `最多保留 ${precision} 位小数`,
}

export function roundNumber(value: number, precision?: number): number {
  if (typeof precision !== 'number' || precision < 0) {
    return value
  }

  const factor = 10 ** precision

  return Math.round(value * factor) / factor
}

export function clampNumber(value: number, min?: number, max?: number): number {
  let result = value

  if (typeof min === 'number' && result < min) {
    result = min
  }

  if (typeof max === 'number' && result > max) {
    result = max
  }

  return result
}

export function sanitizeNumberText(raw: string, constraint: NyNumberConstraint = {}): string {
  const { allowNegative = true, precision, thousands = false } = constraint
  const source = thousands ? raw.replace(/,/g, '') : raw
  let negative = false
  let body = ''

  for (const char of source) {
    if (char === '-') {
      if (allowNegative && !negative && body === '') {
        negative = true
      }

      continue
    }

    if (char === '.') {
      if (precision !== 0 && !body.includes('.')) {
        body += '.'
      }

      continue
    }

    if (char >= '0' && char <= '9') {
      body += char
    }
  }

  if (typeof precision === 'number' && precision >= 0) {
    const dot = body.indexOf('.')

    if (dot >= 0) {
      body = body.slice(0, dot + 1 + precision)
    }
  }

  body = body.replace(/^0+(?=\d)/, '')

  const sign = negative && Number(body) !== 0 ? '-' : ''

  return `${sign}${body}`
}

export function parseNumberText(text: string): number | null {
  if (!text || text === '-' || text === '.' || text === '-.') {
    return null
  }

  const value = Number(text)

  return Number.isFinite(value) ? value : null
}

export function formatNumberText(value: number | null, constraint: NyNumberConstraint = {}): string {
  if (value === null) {
    return ''
  }

  const { thousands = false, precision } = constraint
  const text = typeof precision === 'number' ? value.toFixed(precision) : String(value)

  if (!thousands) {
    return text
  }

  const [integer, decimal] = text.split('.')

  return decimal === undefined
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`
}

export function validateNumber(value: number | null, constraint: NyNumberConstraint = {}): string | null {
  if (value === null) {
    return constraint.required ? nyNumberMessages.required : null
  }

  if (!Number.isFinite(value)) {
    return nyNumberMessages.invalid
  }

  if (typeof constraint.min === 'number' && value < constraint.min) {
    return nyNumberMessages.min(constraint.min)
  }

  if (typeof constraint.max === 'number' && value > constraint.max) {
    return nyNumberMessages.max(constraint.max)
  }

  if (typeof constraint.precision === 'number') {
    const factor = 10 ** constraint.precision

    if (Math.round(value * factor) / factor !== value) {
      return nyNumberMessages.precision(constraint.precision)
    }
  }

  return null
}

export function stepNumber(
  value: number | null,
  direction: 1 | -1,
  constraint: NyNumberConstraint = {},
): number {
  const { step = 1, precision, min, max } = constraint
  const base = value ?? (direction > 0 ? (min ?? 0) : (max ?? 0))
  const next = roundNumber(base + step * direction, precision ?? decimalPlaces(step))

  return roundNumber(clampNumber(next, min, max), precision)
}

export function decimalPlaces(value: number): number {
  const text = String(value)
  const dot = text.indexOf('.')

  return dot < 0 ? 0 : text.length - dot - 1
}

export function normalizeNumber(
  value: number,
  constraint: NyNumberConstraint = {},
  clamp = true,
): number {
  const { min, max, precision } = constraint
  const rounded = roundNumber(value, precision)

  return clamp ? roundNumber(clampNumber(rounded, min, max), precision) : rounded
}
