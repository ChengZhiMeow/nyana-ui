<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import { lockScroll, unlockScroll } from '../../composables/useScrollLock'

const props = withDefaults(
  defineProps<{
    src?: string
    viewport?: number
    output?: number
    shape?: 'circle' | 'square'
    title?: string
    desc?: string
    maxZoom?: number
  }>(),
  {
    src: '',
    viewport: 320,
    output: 400,
    shape: 'circle',
    title: '裁剪头像',
    desc: '拖动调整位置, 滚轮或滑杆缩放, 导出的是一张正方形图片。',
    maxZoom: 4,
  },
)

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  (event: 'confirm', payload: { blob: Blob; dataUrl: string }): void
  (event: 'cancel'): void
}>()

const stage = ref<HTMLDivElement | null>(null)
const image = ref<HTMLImageElement | null>(null)

const naturalWidth = ref(0)
const naturalHeight = ref(0)
const zoom = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const ready = ref(false)
const failed = ref(false)
const exporting = ref(false)

let dragging = false
let startX = 0
let startY = 0
let originX = 0
let originY = 0

const baseScale = computed(() => {
  if (!naturalWidth.value || !naturalHeight.value) {
    return 1
  }

  return Math.max(props.viewport / naturalWidth.value, props.viewport / naturalHeight.value)
})

const scale = computed(() => baseScale.value * zoom.value)

const imageStyle = computed(() => ({
  width: `${naturalWidth.value * scale.value}px`,
  height: `${naturalHeight.value * scale.value}px`,
  transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0)`,
}))

const stageStyle = computed(() => ({
  width: `${props.viewport}px`,
  height: `${props.viewport}px`,
}))

const percent = computed(() => Math.round(zoom.value * 100))

const rangeStyle = computed(() => ({
  '--ny-crop-progress': `${props.maxZoom > 1 ? ((zoom.value - 1) / (props.maxZoom - 1)) * 100 : 0}%`,
}))

function clamp() {
  const width = naturalWidth.value * scale.value
  const height = naturalHeight.value * scale.value

  offsetX.value = Math.min(0, Math.max(props.viewport - width, offsetX.value))
  offsetY.value = Math.min(0, Math.max(props.viewport - height, offsetY.value))
}

function reset() {
  zoom.value = 1
  offsetX.value = 0
  offsetY.value = 0

  if (naturalWidth.value && naturalHeight.value) {
    offsetX.value = (props.viewport - naturalWidth.value * baseScale.value) / 2
    offsetY.value = (props.viewport - naturalHeight.value * baseScale.value) / 2
  }

  clamp()
}

function setZoom(value: number) {
  const previous = scale.value
  const next = Math.min(props.maxZoom, Math.max(1, Number(value.toFixed(2))))

  zoom.value = next

  const center = props.viewport / 2

  offsetX.value = center - ((center - offsetX.value) / previous) * scale.value
  offsetY.value = center - ((center - offsetY.value) / previous) * scale.value

  clamp()
}

function onImageLoad() {
  const element = image.value

  if (!element) {
    return
  }

  naturalWidth.value = element.naturalWidth
  naturalHeight.value = element.naturalHeight
  failed.value = false
  ready.value = true
  reset()
}

function onPointerDown(event: PointerEvent) {
  if (!ready.value) {
    return
  }

  dragging = true
  startX = event.clientX
  startY = event.clientY
  originX = offsetX.value
  originY = offsetY.value

  stage.value?.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging) {
    return
  }

  offsetX.value = originX + (event.clientX - startX)
  offsetY.value = originY + (event.clientY - startY)

  clamp()
}

function onPointerUp(event: PointerEvent) {
  dragging = false

  stage.value?.releasePointerCapture(event.pointerId)
}

function onWheel(event: WheelEvent) {
  event.preventDefault()
  setZoom(zoom.value + (event.deltaY < 0 ? 0.08 : -0.08))
}

async function confirm() {
  const element = image.value

  if (!element || !ready.value) {
    return
  }

  const canvas = document.createElement('canvas')

  canvas.width = props.output
  canvas.height = props.output

  const context = canvas.getContext('2d')

  if (!context) {
    return
  }

  const size = props.viewport / scale.value
  const sourceX = -offsetX.value / scale.value
  const sourceY = -offsetY.value / scale.value

  context.imageSmoothingQuality = 'high'
  context.drawImage(element, sourceX, sourceY, size, size, 0, 0, props.output, props.output)

  exporting.value = true

  const dataUrl = canvas.toDataURL('image/png')

  canvas.toBlob(
    (blob) => {
      exporting.value = false

      if (!blob) {
        return
      }

      emit('confirm', { blob, dataUrl })
      open.value = false
    },
    'image/png',
    0.95,
  )
}

function cancel() {
  emit('cancel')
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    cancel()
  }
}

watch(open, async (value) => {
  if (!value) {
    unlockScroll()

    return
  }

  lockScroll()
  ready.value = false
  failed.value = false
  zoom.value = 1
  offsetX.value = 0
  offsetY.value = 0

  await nextTick()
  window.addEventListener('keydown', onKeydown)

  if (image.value?.complete && image.value.naturalWidth > 0) {
    onImageLoad()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <transition name="ny-fade" :duration="200">
      <div v-if="open" class="ny-crop" role="dialog" aria-modal="true" :aria-label="title">
        <div class="ny-crop__mask" @click="cancel" />

        <div class="ny-pop ny-crop__panel">
          <header class="ny-crop__head">
            <h3 class="ny-crop__title">{{ title }}</h3>

            <button class="ny-crop__close" type="button" aria-label="关闭" @click="cancel">
              <NyIcon name="close" :size="18" />
            </button>
          </header>

          <p class="ny-crop__desc">{{ desc }}</p>

          <div
            ref="stage"
            class="ny-crop__stage"
            :class="{ 'is-circle': shape === 'circle', 'is-empty': !ready }"
            :style="stageStyle"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @wheel="onWheel"
          >
            <img
              v-if="src && !failed"
              ref="image"
              class="ny-crop__image"
              :src="src"
              :style="imageStyle"
              alt=""
              draggable="false"
              @load="onImageLoad"
              @error="failed = true"
            />

            <span v-if="failed" class="ny-crop__hint">图片加载失败, 换一张试试</span>

            <span v-if="ready && shape === 'square'" class="ny-crop__grid" />
          </div>

          <div class="ny-crop__tools">
            <NyIcon name="zoom-in" :size="16" />

            <input
              class="ny-crop__range"
              type="range"
              min="1"
              :max="maxZoom"
              step="0.01"
              :value="zoom"
              :style="rangeStyle"
              :disabled="!ready"
              aria-label="缩放"
              @input="setZoom(Number(($event.target as HTMLInputElement).value))"
            />

            <span class="ny-crop__percent">{{ percent }}%</span>

            <button class="ny-crop__reset" type="button" :disabled="!ready" @click="reset">重置</button>
          </div>

          <footer class="ny-crop__foot">
            <button class="ny-crop__btn" type="button" @click="cancel">取消</button>

            <button
              class="ny-crop__btn ny-crop__btn--primary"
              type="button"
              :disabled="!ready || exporting"
              @click="confirm"
            >
              <NyIcon name="check" :size="15" />
              {{ exporting ? '正在处理...' : '确认' }}
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
