<script setup lang="ts">
import { computed, useSlots, Comment, Fragment, Text, isVNode } from 'vue'

import type { CSSProperties, VNode, VNodeArrayChildren } from 'vue'
import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    max?: number
    size?: NySize | 'xs' | 'xl' | number
    shape?: 'circle' | 'square'
  }>(),
  {
    max: 3,
    size: 'md',
    shape: 'circle',
  },
)

const slots = useSlots()

const AVATAR_SIZES: Record<string, number> = { xs: 24, sm: 30, md: 36, lg: 48, xl: 72 }

const px = computed(() =>
  typeof props.size === 'number' ? props.size : (AVATAR_SIZES[props.size] ?? AVATAR_SIZES.md),
)

const overlap = computed(() => Math.max(6, Math.round(px.value * 0.22)))

const groupStyle = computed<CSSProperties>(() => ({ '--ny-avatar-overlap': `${overlap.value}px` }))

const moreStyle = computed<CSSProperties>(() => ({
  width: `${px.value}px`,
  height: `${px.value}px`,
  fontSize: `${Math.max(10, Math.round(px.value * 0.4))}px`,
}))

function collect(children: VNodeArrayChildren, out: VNode[] = []): VNode[] {
  for (const child of children) {
    if (Array.isArray(child)) {
      collect(child, out)
      continue
    }

    if (!isVNode(child) || child.type === Comment || child.type === Text) {
      continue
    }

    if (child.type === Fragment) {
      const inner = child.children

      if (Array.isArray(inner)) {
        collect(inner, out)
      }

      continue
    }

    out.push(child)
  }

  return out
}

function limit() {
  return Math.max(0, props.max)
}

function restCount(): number {
  return Math.max(0, collect(slots.default?.() ?? []).length - limit())
}

function AvatarNodes(): VNode[] {
  const nodes = collect(slots.default?.() ?? [])

  return nodes.length > limit() ? nodes.slice(0, limit()) : nodes
}
</script>

<template>
  <span class="ny-avatar-group" :style="groupStyle">
    <component :is="AvatarNodes" />

    <span
      v-if="restCount() > 0"
      class="ny-avatar-group__more"
      :class="`ny-avatar-group__more--${shape}`"
      :style="moreStyle"
    >
      {{ `+${restCount()}` }}
    </span>
  </span>
</template>
