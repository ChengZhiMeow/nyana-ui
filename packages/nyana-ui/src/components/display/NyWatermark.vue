<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    content?: string | string[]
    image?: string
    rotate?: number
    gap?: [number, number]
    offset?: [number, number]
    fontSize?: number
    fontWeight?: 'normal' | 'bold'
    color?: string
    opacity?: number
    zIndex?: number
    disabled?: boolean
  }>(),
  {
    content: 'Nyana UI',
    image: '',
    rotate: -22,
    gap: () => [100, 100],
    offset: () => [0, 0],
    fontSize: 14,
    fontWeight: 'normal',
    color: 'rgba(0, 0, 0, 0.12)',
    opacity: 1,
    zIndex: 9,
    disabled: false,
  },
)

interface NyWatermarkTile {
  url: string
  width: number
  height: number
}

const LINE_GAP = 4

const DEFAULT_COLOR = 'rgba(0, 0, 0, 0.12)'
const DARK_COLOR = 'rgba(255, 255, 255, 0.12)'

const rootRef = ref<HTMLElement | null>(null)
const tile = ref<NyWatermarkTile | null>(null)

let token = 0

const lines = computed(() => {
  const list = Array.isArray(props.content) ? props.content : [props.content]

  return list.map((item) => item.trim()).filter(Boolean)
})

const layerStyle = computed(() => {
  const style: Record<string, string> = {
    opacity: String(props.opacity),
    zIndex: String(props.zIndex),
  }

  if (tile.value) {
    style.backgroundImage = `url(${tile.value.url})`
    style.backgroundSize = `${tile.value.width}px ${tile.value.height}px`
    style.backgroundPosition = `${props.offset[0]}px ${props.offset[1]}px`
  }

  return style
})

function fontFamily() {
  const root = rootRef.value

  return (root && getComputedStyle(root).fontFamily) || 'sans-serif'
}

function isDarkTheme() {
  const root = rootRef.value

  if (!root) {
    return false
  }

  const theme = root.closest('[data-theme]')?.getAttribute('data-theme')

  if (theme) {
    return theme === 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function textColor() {
  if (props.color !== DEFAULT_COLOR) {
    return props.color
  }

  return isDarkTheme() ? DARK_COLOR : DEFAULT_COLOR
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

async function generate() {
  const current = ++token

  if (props.disabled) {
    tile.value = null

    return
  }

  const image = props.image ? await loadImage(props.image) : null

  if (current !== token) {
    return
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return
  }

  const font = `${props.fontWeight} ${props.fontSize}px ${fontFamily()}`

  ctx.font = font

  const contentWidth = image
    ? image.naturalWidth
    : Math.max(0, ...lines.value.map((line) => ctx.measureText(line).width))
  const contentHeight = image
    ? image.naturalHeight
    : lines.value.length * props.fontSize + Math.max(lines.value.length - 1, 0) * LINE_GAP

  if (!contentWidth || !contentHeight) {
    tile.value = null

    return
  }

  const angle = (props.rotate * Math.PI) / 180
  const boxWidth = Math.abs(contentWidth * Math.cos(angle)) + Math.abs(contentHeight * Math.sin(angle))
  const boxHeight = Math.abs(contentWidth * Math.sin(angle)) + Math.abs(contentHeight * Math.cos(angle))
  const width = Math.ceil(props.gap[0] + boxWidth)
  const height = Math.ceil(props.gap[1] + boxHeight)

  canvas.width = width
  canvas.height = height

  ctx.translate(width / 2, height / 2)
  ctx.rotate(angle)
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (image) {
    ctx.drawImage(image, -contentWidth / 2, -contentHeight / 2, contentWidth, contentHeight)
  } else {
    const step = props.fontSize + LINE_GAP

    ctx.fillStyle = textColor()

    lines.value.forEach((line, index) => {
      ctx.fillText(line, 0, (index - (lines.value.length - 1) / 2) * step)
    })
  }

  try {
    tile.value = { url: canvas.toDataURL(), width, height }
  } catch {
    tile.value = null
  }
}

watch(
  () => [
    props.content,
    props.image,
    props.rotate,
    props.gap,
    props.offset,
    props.fontSize,
    props.fontWeight,
    props.color,
    props.disabled,
  ],
  () => void generate(),
  { deep: true },
)

onMounted(() => void generate())

onBeforeUnmount(() => {
  token++
})
</script>

<template>
  <div ref="rootRef" class="ny-watermark">
    <slot />

    <div v-if="tile" class="ny-watermark__layer" :style="layerStyle" aria-hidden="true" />
  </div>
</template>

<style scoped lang="scss">
.ny-watermark {
  position: relative;
}

.ny-watermark__layer {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  pointer-events: none;
  user-select: none;
}
</style>
