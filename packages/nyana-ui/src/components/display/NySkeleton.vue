<script setup lang="ts">
import { computed } from 'vue'

import type { CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    rows?: number
    title?: boolean
    avatar?: boolean
    button?: boolean
    active?: boolean
    width?: string | number
    rowWidths?: (string | number)[]
  }>(),
  {
    loading: true,
    rows: 3,
    title: true,
    avatar: false,
    button: false,
    active: false,
  },
)

function toSize(value: string | number) {
  return typeof value === 'number' ? `${value}px` : value
}

const rootStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  if (props.width !== undefined) {
    style.width = toSize(props.width)
  }

  return style
})

const lines = computed(() => {
  const total = Math.max(0, Math.floor(props.rows))

  return Array.from({ length: total }, (_, index) => {
    const custom = props.rowWidths?.[index]

    if (custom !== undefined) {
      return toSize(custom)
    }

    return total > 1 && index === total - 1 ? '60%' : '100%'
  })
})
</script>

<template>
  <div v-if="loading" class="ny-skeleton" :class="{ 'is-active': active }" :style="rootStyle" aria-busy="true">
    <div class="ny-skeleton__layout">
      <div v-if="avatar" class="ny-skeleton__avatar" aria-hidden="true" />

      <div class="ny-skeleton__paragraph">
        <div v-if="title" class="ny-skeleton__block ny-skeleton__title" aria-hidden="true" />

        <div
          v-for="(line, index) in lines"
          :key="index"
          class="ny-skeleton__block ny-skeleton__row"
          :style="{ width: line }"
          aria-hidden="true"
        />
      </div>
    </div>

    <div v-if="button" class="ny-skeleton__footer">
      <div class="ny-skeleton__block ny-skeleton__button" aria-hidden="true" />
    </div>
  </div>

  <slot v-else />
</template>

<style scoped lang="scss">
.ny-skeleton {
  display: block;
  width: 100%;
}

.ny-skeleton__layout {
  display: flex;
  align-items: flex-start;
  gap: var(--ny-space-3);
}

.ny-skeleton__paragraph {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--ny-space-2);
  min-width: 0;
}

.ny-skeleton__block {
  background: var(--ny-surface-3);
  border-radius: var(--ny-radius-xs);
}

.ny-skeleton__title {
  width: 38%;
  height: 18px;
}

.ny-skeleton__row {
  height: 14px;
}

.ny-skeleton__avatar {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ny-surface-3);
}

.ny-skeleton__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--ny-space-4);
}

.ny-skeleton__button {
  width: 88px;
  height: var(--ny-control-height-sm);
}

.ny-skeleton.is-active {
  .ny-skeleton__block,
  .ny-skeleton__avatar {
    background-image: linear-gradient(
      90deg,
      var(--ny-surface-3) 25%,
      var(--ny-surface-hover) 37%,
      var(--ny-surface-3) 63%
    );
    background-size: 400% 100%;
    background-repeat: no-repeat;
    animation: ny-skeleton-shimmer 1.4s var(--ny-ease) infinite;
  }
}

@keyframes ny-skeleton-shimmer {
  from {
    background-position: 100% 50%;
  }

  to {
    background-position: 0 50%;
  }
}
</style>
