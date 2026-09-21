
export interface NyPatternPreset {
  pattern: RegExp
  message: string
  placeholder: string
  example?: string
  allowedChars?: RegExp
  maxLength?: number
}

export const nyPatternPresets: Record<string, NyPatternPreset> = {
  username: {
    pattern: /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/,
    message: '字母开头, 4-16 位字母, 数字或下划线',
    placeholder: '字母开头, 4-16 位',
    example: 'nyana_01',
    allowedChars: /[a-zA-Z0-9_]/,
    maxLength: 16,
  },
  email: {
    pattern: /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/,
    message: '邮箱格式不正确',
    placeholder: 'name@example.com',
    example: 'nyana@example.com',
    allowedChars: /[a-zA-Z0-9_.+@-]/,
    maxLength: 64,
  },
  mobile: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入 11 位手机号',
    placeholder: '11 位手机号',
    example: '13800000000',
    allowedChars: /\d/,
    maxLength: 11,
  },
  tel: {
    pattern: /^(\d{3,4}-?)?\d{7,8}$/,
    message: '座机格式不正确',
    placeholder: '如 010-12345678',
    example: '010-12345678',
    allowedChars: /[\d-]/,
    maxLength: 13,
  },
  url: {
    pattern: /^https?:\/\/[^\s]+$/,
    message: '需要以 http:// 或 https:// 开头',
    placeholder: 'https://example.com',
    example: 'https://example.com',
    maxLength: 200,
  },
  ipv4: {
    pattern: /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    message: 'IPv4 地址格式不正确',
    placeholder: '如 192.168.1.1',
    example: '192.168.1.1',
    allowedChars: /[\d.]/,
    maxLength: 15,
  },
  idcard: {
    pattern: /^\d{17}[\dXx]$/,
    message: '请输入 18 位身份证号',
    placeholder: '18 位身份证号',
    example: '110101199003074567',
    allowedChars: /[\dXx]/,
    maxLength: 18,
  },
  postalCode: {
    pattern: /^[1-9]\d{5}$/,
    message: '请输入 6 位邮政编码',
    placeholder: '6 位邮政编码',
    example: '100000',
    allowedChars: /\d/,
    maxLength: 6,
  },
  integer: {
    pattern: /^-?\d+$/,
    message: '请输入整数',
    placeholder: '整数',
    allowedChars: /[\d-]/,
  },
  decimal: {
    pattern: /^-?\d+(\.\d+)?$/,
    message: '请输入数字, 最多两位小数',
    placeholder: '如 12.50',
    allowedChars: /[\d.-]/,
  },
  hexColor: {
    pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    message: '请输入 # 开头的 3 或 6 位色值',
    placeholder: '#5bcffa',
    example: '#5bcffa',
    allowedChars: /[#0-9a-fA-F]/,
    maxLength: 7,
  },
  date: {
    pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    message: '日期格式应为 YYYY-MM-DD',
    placeholder: 'YYYY-MM-DD',
    example: '2026-01-01',
    allowedChars: /[\d-]/,
    maxLength: 10,
  },
  time: {
    pattern: /^([01]\d|2[0-3]):[0-5]\d$/,
    message: '时间格式应为 HH:mm',
    placeholder: 'HH:mm',
    example: '09:30',
    allowedChars: /[\d:]/,
    maxLength: 5,
  },
}

export type NyPatternPresetName = keyof typeof nyPatternPresets

export type NyMatchMode = 'full' | 'partial'

export function resolvePattern(
  pattern?: string | RegExp,
  flags = '',
  match: NyMatchMode = 'full',
): RegExp | undefined {
  const base =
    pattern instanceof RegExp
      ? pattern
      : typeof pattern === 'string' && pattern
        ? new RegExp(pattern, flags)
        : undefined

  if (!base || match === 'partial') {
    return base
  }

  return new RegExp(`^(?:${base.source})$`, base.flags)
}

export function presetConstraints(preset?: NyPatternPresetName): Partial<{
  pattern: RegExp
  allowedChars: RegExp
  maxLength: number
  placeholder: string
  message: string
}> {
  if (!preset) {
    return {}
  }

  const item = nyPatternPresets[preset]

  if (!item) {
    return {}
  }

  return {
    pattern: item.pattern,
    allowedChars: item.allowedChars,
    maxLength: item.maxLength,
    placeholder: item.placeholder,
    message: item.message,
  }
}
