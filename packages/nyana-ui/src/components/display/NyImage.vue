<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

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
        {{ fallback }}
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
          <button
            type="button"
            class="ny-image-viewer__close"
            aria-label="关闭预览"
            @click.stop="close"
          >
            <NyIcon name="close" :size="18" />
          </button>

          <img class="ny-image-viewer__img" :src="src" :alt="alt" @click.stop />
        </div>
      </transition>
    </Teleport>
  </figure>
</template>

<style scoped lang="scss">
.ny-image {
  display: inline-flex;
  flex-direction: column;
  gap: var(--ny-space-2);
  max-width: 100%;
  margin: 0;
}

.ny-image__frame {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--ny-surface-3);
}

.ny-image--radius-none .ny-image__frame {
  border-radius: 0;
}

.ny-image--radius-sm .ny-image__frame {
  border-radius: var(--ny-radius-sm);
}

.ny-image--radius-md .ny-image__frame {
  border-radius: var(--ny-radius-md);
}

.ny-image--radius-lg .ny-image__frame {
  border-radius: var(--ny-radius-lg);
}

.ny-image__img {
  display: block;
  width: 100%;
  height: 100%;
}

.ny-image--fit-cover .ny-image__img {
  object-fit: cover;
}

.ny-image--fit-contain .ny-image__img {
  object-fit: contain;
}

.ny-image--fit-fill .ny-image__img {
  object-fit: fill;
}

.ny-image__placeholder {
  position: absolute;
  inset: 0;
  background: var(--ny-surface-3);
  animation: ny-image-breath 1.4s var(--ny-ease) infinite;
}

.ny-image__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  height: 100%;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
}

.ny-image__preview {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: var(--ny-mask);
  color: #ffffff;
  opacity: 0;
  cursor: zoom-in;
  transition: opacity var(--ny-transition-fast);
}

.ny-image:hover .ny-image__preview,
.ny-image__preview:focus-visible {
  opacity: 1;
}

.ny-image__preview:focus-visible {
  outline: none;
  box-shadow: var(--ny-shadow-focus);
}

.ny-image__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ny-image__caption {
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
  text-align: center;
}

.ny-image-viewer {
  position: fixed;
  inset: 0;
  z-index: var(--ny-z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ny-space-6);
  background: var(--ny-mask);
  cursor: zoom-out;
}

.ny-image-viewer__img {
  max-width: 100%;
  max-height: 100%;
  border-radius: var(--ny-radius-sm);
  cursor: default;
}

.ny-image-viewer__close {
  position: absolute;
  top: var(--ny-space-4);
  right: var(--ny-space-4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface-3);
  color: var(--ny-text);
  cursor: pointer;
  transition: background var(--ny-transition-fast);
}

.ny-image-viewer__close:hover {
  background: var(--ny-surface-hover);
}

.ny-image-viewer__close:focus-visible {
  outline: none;
  box-shadow: var(--ny-shadow-focus);
}

.ny-image-viewer-enter-active,
.ny-image-viewer-leave-active {
  transition: opacity var(--ny-transition-fast);
}

.ny-image-viewer-enter-from,
.ny-image-viewer-leave-to {
  opacity: 0;
}

@keyframes ny-image-breath {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.55;
  }
}
</style>
