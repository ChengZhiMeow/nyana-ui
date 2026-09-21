<script setup lang="ts">
import { computed } from 'vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    items: { label: string; value?: string | number; span?: number }[]
    column?: number
    bordered?: boolean
    size?: NySize
    title?: string
    layout?: 'horizontal' | 'vertical'
    labelWidth?: string | number
  }>(),
  {
    column: 3,
    bordered: false,
    size: 'md',
    title: '',
    layout: 'horizontal',
    labelWidth: '',
  },
)

const classes = computed(() => [
  `ny-desc--${props.size}`,
  `ny-desc--${props.layout}`,
  { 'ny-desc--bordered': props.bordered },
])

const gridStyle = computed(() => ({
  '--ny-desc-column': String(props.column),
  '--ny-desc-column-md': String(Math.min(props.column, 2)),
  '--ny-desc-column-sm': '1',
}))

const labelStyle = computed(() =>
  props.labelWidth === '' ? undefined : { width: toCssSize(props.labelWidth) },
)

function spanClass(span?: number) {
  return `ny-desc__cell--span-${Math.min(Math.max(span ?? 1, 1), 12)}`
}

function toCssSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}
</script>

<template>
  <div class="ny-desc" :class="classes">
    <header v-if="title || $slots.default" class="ny-desc__head">
      <h3 v-if="title" class="ny-desc__title">{{ title }}</h3>

      <div v-if="$slots.default" class="ny-desc__extra">
        <slot />
      </div>
    </header>

    <div class="ny-desc__grid" :style="gridStyle">
      <div
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="ny-desc__cell"
        :class="spanClass(item.span)"
      >
        <div class="ny-desc__label" :style="labelStyle">
          <slot name="label" :item="item">{{ item.label }}</slot>
        </div>

        <div class="ny-desc__value">
          <slot name="value" :item="item" :index="index">{{ item.value ?? '' }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-desc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ny-space-4);
  margin-bottom: var(--ny-space-4);
}

.ny-desc__title {
  margin: 0;
  color: var(--ny-text);
  font-size: var(--ny-font-size-lg);
  font-weight: 600;
}

.ny-desc__extra {
  flex: none;
}

.ny-desc__grid {
  display: grid;
  grid-template-columns: repeat(var(--ny-desc-column, 3), minmax(0, 1fr));
}

.ny-desc__cell {
  min-width: 0;
  padding: 0 var(--ny-space-4) var(--ny-space-4) 0;
}

@for $i from 1 through 12 {
  .ny-desc__cell--span-#{$i} {
    grid-column: span #{$i};
  }
}

.ny-desc__label {
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
}

.ny-desc__value {
  min-width: 0;
  color: var(--ny-text);
  word-break: break-word;
}

.ny-desc--horizontal {
  .ny-desc__cell {
    display: flex;
    align-items: baseline;
    gap: var(--ny-space-3);
  }

  .ny-desc__label {
    flex: none;
  }

  .ny-desc__value {
    flex: 1;
  }
}

.ny-desc--vertical {
  .ny-desc__cell {
    display: flex;
    flex-direction: column;
    gap: var(--ny-space-1);
  }
}

.ny-desc--bordered {
  .ny-desc__grid {
    border-top: 1px solid var(--ny-border);
    border-left: 1px solid var(--ny-border);
    border-radius: var(--ny-radius-md);
    background: var(--ny-surface);
    overflow: hidden;
  }

  .ny-desc__cell {
    padding: 0;
    box-shadow:
      1px 0 0 var(--ny-border),
      0 1px 0 var(--ny-border);
  }

  .ny-desc__label {
    padding: 10px var(--ny-space-3);
    background: var(--ny-surface-2);
  }

  .ny-desc__value {
    padding: 10px var(--ny-space-3);
  }
}

.ny-desc--bordered.ny-desc--horizontal {
  .ny-desc__cell {
    align-items: stretch;
    gap: 0;
  }

  .ny-desc__label {
    flex: none;
    box-shadow: 1px 0 0 var(--ny-border);
  }

  .ny-desc__value {
    display: flex;
    align-items: center;
  }
}

.ny-desc--bordered.ny-desc--vertical {
  .ny-desc__cell {
    gap: 0;
  }

  .ny-desc__value {
    flex: 1;
  }
}

.ny-desc--sm {
  .ny-desc__label,
  .ny-desc__value {
    font-size: var(--ny-font-size-sm);
  }
}

.ny-desc--lg {
  .ny-desc__label {
    font-size: var(--ny-font-size-md);
  }

  .ny-desc__value {
    font-size: var(--ny-font-size-lg);
  }
}

@media (max-width: 1024px) {
  .ny-desc__grid {
    grid-template-columns: repeat(var(--ny-desc-column-md, 2), minmax(0, 1fr));
  }

  @for $i from 3 through 12 {
    .ny-desc__cell--span-#{$i} {
      grid-column: span 2;
    }
  }
}

@media (max-width: 640px) {
  .ny-desc__grid {
    grid-template-columns: repeat(var(--ny-desc-column-sm, 1), minmax(0, 1fr));
  }

  .ny-desc__cell {
    grid-column: span 1;
  }
}
</style>
