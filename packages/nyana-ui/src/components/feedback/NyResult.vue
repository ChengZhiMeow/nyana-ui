<script setup lang="ts">
import { computed } from 'vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    status?: 'success' | 'error' | 'warning' | 'info' | '404' | '403'
    title?: string
    desc?: string
    size?: NySize
  }>(),
  {
    status: 'info',
    title: '',
    desc: '',
    size: 'md',
  },
)

const ART_SIZES: Record<NySize, number> = { sm: 48, md: 56, lg: 64 }

const classes = computed(() => [`ny-result--${props.status}`, `ny-result--${props.size}`])

const artStyle = computed(() => {
  const size = ART_SIZES[props.size]

  return { width: `${size}px`, height: `${size}px` }
})

const role = computed(() => (props.status === 'error' ? 'alert' : 'status'))
</script>

<template>
  <div class="ny-result" :class="classes" :role="role">
    <div class="ny-result__art-wrap">
      <slot name="icon">
        <svg
          class="ny-result__art"
          :style="artStyle"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <template v-if="status === 'success'">
            <circle cx="24" cy="24" r="20" />
            <path d="M15.5 24.5l5.8 5.8L33 17.5" />
          </template>

          <template v-else-if="status === 'error'">
            <circle cx="24" cy="24" r="20" />
            <path d="M17.5 17.5l13 13" />
            <path d="M30.5 17.5l-13 13" />
          </template>

          <template v-else-if="status === 'warning'">
            <path d="M24 7l17.5 31.5H6.5z" />
            <path d="M24 19.5v9" />
            <path d="M24 33.6h.01" />
          </template>

          <template v-else-if="status === 'info'">
            <circle cx="24" cy="24" r="20" />
            <path d="M24 22.5v11" />
            <path d="M24 15.4h.01" />
          </template>

          <template v-else>
            <circle cx="24" cy="24" r="20" />
            <text class="ny-result__code" x="24" y="29" text-anchor="middle" stroke="none">
              {{ status }}
            </text>
          </template>
        </svg>
      </slot>
    </div>

    <h3 v-if="title || $slots.title" class="ny-result__title">
      <slot name="title">{{ title }}</slot>
    </h3>

    <p v-if="desc || $slots.desc" class="ny-result__desc">
      <slot name="desc">{{ desc }}</slot>
    </p>

    <div v-if="$slots.default" class="ny-result__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--ny-space-6) var(--ny-space-4);
  text-align: center;
}

.ny-result__art {
  display: block;
}

.ny-result__title {
  margin: var(--ny-space-4) 0 0;
  color: var(--ny-text-strong);
  font-size: var(--ny-font-size-xl);
  font-weight: 600;
  line-height: 1.4;
}

.ny-result__desc {
  max-width: 42em;
  margin: var(--ny-space-2) 0 0;
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-md);
  line-height: 1.7;
}

.ny-result__actions {
  display: flex;
  align-items: center;
  gap: var(--ny-space-3);
  margin-top: var(--ny-space-5);
}

.ny-result--sm {
  padding: var(--ny-space-5) var(--ny-space-3);

  .ny-result__title {
    margin: var(--ny-space-3) 0 0;
    font-size: var(--ny-font-size-lg);
  }
}

.ny-result--lg {
  padding: var(--ny-space-7) var(--ny-space-5);

  .ny-result__title {
    margin: var(--ny-space-5) 0 0;
    font-size: var(--ny-font-size-2xl);
  }
}

.ny-result--success .ny-result__art-wrap {
  color: var(--ny-success);
}

.ny-result--error .ny-result__art-wrap {
  color: var(--ny-danger);
}

.ny-result--warning .ny-result__art-wrap {
  color: var(--ny-warning);
}

.ny-result--info .ny-result__art-wrap {
  color: var(--ny-info);
}

.ny-result--404 .ny-result__art-wrap,
.ny-result--403 .ny-result__art-wrap {
  color: var(--ny-text-muted);
}

.ny-result__code {
  fill: currentColor;
  font-size: 14px;
  font-weight: 700;
}
</style>
