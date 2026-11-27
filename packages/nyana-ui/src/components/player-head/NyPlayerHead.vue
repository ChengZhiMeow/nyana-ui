<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    // 由使用方提供的头像地址 (例如后端按 UUID 从正版皮肤裁出的脸); 没有或加载失败时按名字画默认像素脸
    src?: string
    size?: number
  }>(),
  {
    src: undefined,
    size: 20,
  },
)

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)

const cache = new Map<string, string>()

// 按名字生成稳定的 8×8 像素脸, 只作占位
function pixelFace(name: string): string {
  const hit = cache.get(name)
  if (hit) return hit
  if (typeof document === 'undefined') return ''
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  const pick = <T,>(list: T[]) => {
    const v = list[h % list.length]
    h = Math.floor(h / list.length) + 7
    return v
  }
  const skin = pick(['#f2c9a0', '#e8b48a', '#c98e62', '#a86f45', '#f6d7b8'])
  const hair = pick(['#3b2a1e', '#5a3b22', '#1f1f24', '#c8a052', '#8a3b2a', '#e9e3d8', '#4a6fa5'])
  const eye = pick(['#2f5fd0', '#3a7a3a', '#5a3b22', '#2a2a2a', '#7a4fc9'])
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 8
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.fillStyle = skin
  ctx.fillRect(0, 0, 8, 8)
  ctx.fillStyle = hair
  ctx.fillRect(0, 0, 8, 2)
  ctx.fillRect(0, 2, 1, 2)
  ctx.fillRect(7, 2, 1, 2)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(1, 4, 2, 1)
  ctx.fillRect(5, 4, 2, 1)
  ctx.fillStyle = eye
  ctx.fillRect(2, 4, 1, 1)
  ctx.fillRect(5, 4, 1, 1)
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.fillRect(3, 5, 2, 1)
  const url = canvas.toDataURL()
  cache.set(name, url)
  return url
}

const url = computed(() => (props.src && !failed.value ? props.src : pixelFace(props.name)))
</script>

<template>
  <img
    class="ny-head"
    :src="url"
    :alt="name"
    :width="size"
    :height="size"
    :style="{ width: size + 'px', height: size + 'px', borderRadius: Math.max(3, Math.round(size / 6)) + 'px' }"
    loading="lazy"
    @error="failed = true"
  />
</template>
