<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import { nyPalette } from '../../palette'
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

const AVATAR_SIZES: Record<string, number> = { xs: 24, sm: 28, md: 36, lg: 44, xl: 56 }

const AVATAR_PALETTE = nyPalette.map((color) => ({
  bg: `var(--ny-${color.name}-soft)`,
  fg: `var(--ny-${color.name}-text)`,
}))

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
      background: `color-mix(in srgb, ${props.color} 20%, transparent)`,
      color: `color-mix(in srgb, ${props.color} 62%, #0b0e14)`,
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

<style scoped lang="scss">
.ny-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  overflow: hidden;
  border-radius: 50%;
  background: var(--ny-surface-3);
  color: var(--ny-text-sub);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  vertical-align: middle;
}

.ny-avatar--square {
  border-radius: var(--ny-radius-sm);
}

.ny-avatar__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ny-avatar__text {
  padding: 0 2px;
}
</style>
