<script setup lang="ts">
import { computed } from 'vue'

import { isBrandIcon, nyIconPaths, nyIconViewBox, nyIcons } from '../../icons'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    strokeWidth?: number
    spin?: boolean
  }>(),
  {
    size: 18,
    strokeWidth: 1.8,
    spin: false,
  },
)

const paths = computed(() => nyIconPaths(props.name))

// 品牌图标 (brand- 开头) 是实心的 logo, 加上 ny-icon--brand 和 data-brand 标记.
const filled = computed(() => isBrandIcon(props.name))

const viewBox = computed(() => nyIconViewBox(props.name))

const style = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
}))

if (import.meta.env.DEV && !(props.name in nyIcons)) {
  console.warn(`[nyana-ui] 未定义的图标: ${props.name}`)
}
</script>

<template>
  <svg
    class="ny-icon"
    :class="{ 'ny-icon--spin': spin, 'ny-icon--brand': filled }"
    :data-brand="filled ? '' : undefined"
    :style="style"
    :viewBox="viewBox"
    :fill="filled ? 'currentColor' : 'none'"
    :stroke="filled ? 'none' : 'currentColor'"
    :stroke-width="filled ? undefined : strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, index) in paths" :key="index" :d="d" />
  </svg>
</template>
