<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { CSSProperties } from 'vue'
import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    icon?: string
    text?: string
    size?: NySize | 'xs' | 'xl' | number
    shape?: 'circle' | 'square'
    color?: string
  }>(),
  {
    src: '',
    alt: '',
    icon: '',
    text: '',
    size: 'md',
    shape: 'circle',
    color: '',
  },
)

const AVATAR_SIZES: Record<string, number> = { xs: 24, sm: 30, md: 36, lg: 48, xl: 72 }

// 没有图片时按首字在 喵蓝 / 喵粉 / 紫 三种软色里轮换
const AVATAR_PALETTE = [
  { bg: 'var(--ny-primary-soft)', fg: 'var(--ny-primary-ink)' },
  { bg: 'var(--ny-secondary-soft)', fg: 'var(--ny-secondary-ink)' },
  { bg: 'var(--ny-accent-soft)', fg: 'var(--ny-accent-ink)' },
]

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

const px = computed(() =>
  typeof props.size === 'number' ? props.size : (AVATAR_SIZES[props.size] ?? AVATAR_SIZES.md),
)

const showImage = computed(() => !!props.src && !failed.value)

const letter = computed(() => {
  return Array.from(props.text || props.alt)[0] ?? ''
})

const boxStyle = computed<CSSProperties>(() => ({
  width: `${px.value}px`,
  height: `${px.value}px`,
  fontSize: `${Math.max(10, Math.round(px.value * 0.4))}px`,
}))

const colorStyle = computed<CSSProperties>(() => {
  if (props.color) {
    return {
      background: `color-mix(in srgb, ${props.color} 16%, var(--ny-bg))`,
      color: `color-mix(in srgb, ${props.color} 60%, var(--ny-text))`,
    }
  }

  if (!letter.value) {
    return {}
  }

  const seed = Array.from(letter.value).reduce((sum, char) => sum + (char.codePointAt(0) ?? 0), 0)
  const picked = AVATAR_PALETTE[seed % AVATAR_PALETTE.length]

  return picked ? { background: picked.bg, color: picked.fg } : {}
})

const iconSize = computed(() => Math.max(12, Math.round(px.value * 0.5)))
</script>

<template>
  <span class="ny-avatar" :class="`ny-avatar--${shape}`" :style="[boxStyle, colorStyle]">
    <img v-if="showImage" class="ny-avatar__img" :src="src" :alt="alt" @error="failed = true" />
    <NyIcon v-else-if="icon" :name="icon" :size="iconSize" />
    <span v-else class="ny-avatar__text">{{ letter }}</span>
  </span>
</template>
