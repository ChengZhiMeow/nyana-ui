<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    width?: string | number
    height?: string | number
    fit?: 'cover' | 'contain' | 'fill'
    radius?: 'sm' | 'md' | 'lg' | 'none'
    preview?: boolean
    caption?: string
    fallback?: string
  }>(),
  {
    alt: '',
    fit: 'cover',
    radius: 'md',
    preview: true,
    caption: '',
    fallback: '加载失败',
  },
)

const loading = ref(true)
const failed = ref(false)
const open = ref(false)

let previousOverflow = ''

const classes = computed(() => [
  `ny-image--fit-${props.fit}`,
  `ny-image--radius-${props.radius}`,
  { 'is-loading': loading.value, 'is-failed': failed.value },
])

const frameStyle = computed(() => ({
  width: toCssSize(props.width),
  height: toCssSize(props.height),
}))

const viewerLabel = computed(() => props.alt || '图片预览')

function toCssSize(value?: number | string) {
  if (value === undefined || value === '') {
    return undefined
  }

  return typeof value === 'number' ? `${value}px` : value
}

watch(
  () => props.src,
  () => {
    loading.value = true
    failed.value = false
  },
)

function onLoad() {
  loading.value = false
}

function onError() {
  loading.value = false
  failed.value = true
}

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

watch(open, (value) => {
  if (value) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)

    return
  }

  document.body.style.overflow = previousOverflow
  window.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <figure class="ny-image" :class="classes">
    <div class="ny-image__frame" :style="frameStyle">
      <img v-if="!failed" class="ny-image__img" :src="src" :alt="alt" @load="onLoad" @error="onError" />

      <div v-if="loading" class="ny-image__placeholder" aria-hidden="true" />

      <div v-else-if="failed" class="ny-image__fallback" role="img" :aria-label="fallback">
        <NyIcon name="image" :size="22" />
        <span class="ny-image__fallback-text">{{ fallback }}</span>
      </div>

      <button
        v-if="preview && !loading && !failed"
        type="button"
        class="ny-image__preview"
        aria-label="查看大图"
        @click="open = true"
      >
        <NyIcon name="zoom-in" :size="20" />
      </button>

      <div class="ny-image__overlay">
        <slot />
      </div>
    </div>

    <figcaption v-if="caption || $slots.caption" class="ny-image__caption">
      <slot name="caption">{{ caption }}</slot>
    </figcaption>

    <Teleport to="body">
      <transition name="ny-image-viewer" :duration="220">
        <div
          v-if="open"
          class="ny-image-viewer"
          role="dialog"
          aria-modal="true"
          :aria-label="viewerLabel"
          @click="close"
        >
          <img class="ny-image-viewer__img" :src="src" :alt="alt" @click.stop />

          <div class="ny-image-viewer__bar" @click.stop>
            <span v-if="alt" class="ny-image-viewer__name">{{ alt }}</span>

            <button
              type="button"
              class="ny-image-viewer__close"
              aria-label="关闭预览"
              @click.stop="close"
            >
              <NyIcon name="close" :size="18" />
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </figure>
</template>
