<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    title?: string
    desc?: string
    size?: NySize
    image?: 'default' | 'simple'
    icon?: string
  }>(),
  {
    title: '暂无数据',
    desc: '',
    size: 'md',
    image: 'default',
    icon: '',
  },
)

const iconSize = computed(() => (props.size === 'sm' ? 32 : props.size === 'lg' ? 52 : 42))
</script>

<template>
  <div class="ny-empty" :class="`ny-empty--${size}`">
    <div class="ny-empty__image">
      <slot name="image">
        <NyIcon v-if="icon" :name="icon" :size="iconSize" />

        <svg v-else-if="image === 'simple'" class="ny-empty__drawing" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          <rect
            x="34"
            y="18"
            width="52"
            height="64"
            rx="8"
            fill="currentColor"
            fill-opacity="0.06"
            stroke="currentColor"
            stroke-width="1.6"
          />
          <path d="M46 40h28" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.6" />
          <path d="M46 52h20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.45" />
          <path d="M46 64h24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.3" />
        </svg>

        <svg v-else class="ny-empty__drawing" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          <ellipse cx="60" cy="86" rx="40" ry="5" fill="currentColor" opacity="0.08" />
          <path
            d="M20 34a4 4 0 0 1 4-4h20l6 8h46a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V34Z"
            fill="currentColor"
            fill-opacity="0.06"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path d="M20 52h24l4 7h28l4-7h20" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
          <path d="M44 20h32" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.45" />
        </svg>
      </slot>
    </div>

    <p v-if="title" class="ny-empty__title">{{ title }}</p>
    <p v-if="desc" class="ny-empty__desc">{{ desc }}</p>

    <div v-if="$slots.default" class="ny-empty__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--ny-space-6) var(--ny-space-4);
  text-align: center;
}

.ny-empty__image {
  color: var(--ny-text-muted);
  line-height: 0;
}

.ny-empty__drawing {
  display: block;
  width: 116px;
  height: auto;
}

.ny-empty__title {
  margin: var(--ny-space-4) 0 0;
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-md);
  font-weight: 600;
}

.ny-empty__desc {
  margin: var(--ny-space-1) 0 0;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
  line-height: 1.7;
}

.ny-empty__actions {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  margin-top: var(--ny-space-4);
}

.ny-empty--sm .ny-empty__drawing {
  width: 88px;
}

.ny-empty--sm .ny-empty__title {
  margin-top: var(--ny-space-3);
  font-size: var(--ny-font-size-sm);
}

.ny-empty--lg .ny-empty__drawing {
  width: 148px;
}

.ny-empty--lg .ny-empty__title {
  margin-top: var(--ny-space-5);
  font-size: var(--ny-font-size-lg);
}
</style>
