export interface NyHsv {
  h: number
  s: number
  v: number
}

export interface NyRgb {
  r: number
  g: number
  b: number
}

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

export function isHexColor(value: string): boolean {
  return HEX_PATTERN.test(value.trim())
}

export function normalizeHex(value: string): string | null {
  const text = value.trim()

  if (!HEX_PATTERN.test(text)) {
    return null
  }

  const raw = text.replace('#', '').toLowerCase()
  const full = raw.length === 3 ? raw.split('').map((char) => char + char).join('') : raw

  return `#${full}`
}

export function hexToRgb(value: string): NyRgb | null {
  const hex = normalizeHex(value)

  if (!hex) {
    return null
  }

  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  }
}

export function rgbToHex(rgb: NyRgb): string {
  const part = (value: number) => {
    const channel = Math.min(255, Math.max(0, Math.round(value)))

    return channel.toString(16).padStart(2, '0')
  }

  return `#${part(rgb.r)}${part(rgb.g)}${part(rgb.b)}`
}

export function rgbToHsv(rgb: NyRgb): NyHsv {
  const red = rgb.r / 255
  const green = rgb.g / 255
  const blue = rgb.b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let hue = 0

  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6
    } else if (max === green) {
      hue = (blue - red) / delta + 2
    } else {
      hue = (red - green) / delta + 4
    }
  }

  return {
    h: Math.round((hue * 60 + 360) % 360),
    s: max === 0 ? 0 : delta / max,
    v: max,
  }
}

export function hsvToRgb(hsv: NyHsv): NyRgb {
  const hue = ((hsv.h % 360) + 360) % 360
  const saturation = Math.min(1, Math.max(0, hsv.s))
  const value = Math.min(1, Math.max(0, hsv.v))
  const chroma = value * saturation
  const second = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const base = value - chroma
  const sector = Math.floor(hue / 60) % 6
  const table: [number, number, number][] = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second],
  ]
  const [red, green, blue] = table[sector] ?? [0, 0, 0]

  return {
    r: Math.round((red + base) * 255),
    g: Math.round((green + base) * 255),
    b: Math.round((blue + base) * 255),
  }
}

export function hexToHsv(value: string): NyHsv | null {
  const rgb = hexToRgb(value)

  return rgb ? rgbToHsv(rgb) : null
}

export function hsvToHex(hsv: NyHsv): string {
  return rgbToHex(hsvToRgb(hsv))
}

export function colorBrightness(value: string): number {
  const rgb = hexToRgb(value)

  if (!rgb) {
    return 255
  }

  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}
