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

const AVATAR_SIZES: Record<string, number> = { xs: 24, sm: 28, md: 36, lg: 44, xl: 56 }

const px = computed(() =>
  typeof props.size === 'number' ? props.size : (AVATAR_SIZES[props.size] ?? AVATAR_SIZES.md),
)

const overlap = computed(() => Math.round(px.value * 0.3))

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

<style scoped lang="scss">
.ny-avatar-group {
  display: inline-flex;
  align-items: center;
}

.ny-avatar-group :deep(.ny-avatar:not(:first-child)),
.ny-avatar-group__more {
  margin-left: calc(var(--ny-avatar-overlap) * -1);
}

.ny-avatar-group :deep(.ny-avatar) {
  box-shadow: 0 0 0 2px var(--ny-surface);
}

.ny-avatar-group__more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface-3);
  color: var(--ny-text-sub);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  box-shadow: 0 0 0 2px var(--ny-surface);
}

.ny-avatar-group__more--square {
  border-radius: var(--ny-radius-sm);
}
</style>
