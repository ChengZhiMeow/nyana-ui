<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tag?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    weight?: 'normal' | 'medium' | 'semibold' | 'bold'
    type?: 'default' | 'secondary' | 'muted' | 'primary' | 'success' | 'warning' | 'danger'
    strong?: boolean
    italic?: boolean
    underline?: boolean
    strike?: boolean
    code?: boolean
    mark?: boolean
    disabled?: boolean
    truncate?: boolean
    lines?: number
    align?: 'start' | 'center' | 'end'
  }>(),
  {
    tag: 'span',
    size: 'md',
    weight: 'normal',
    type: 'default',
    strong: false,
    italic: false,
    underline: false,
    strike: false,
    code: false,
    mark: false,
    disabled: false,
    truncate: false,
    lines: 0,
    align: 'start',
  },
)

const classes = computed(() => [
  `ny-text--${props.size}`,
  `ny-text--${props.weight}`,
  `ny-text--${props.type}`,
  `ny-text--align-${props.align}`,
  {
    'ny-text--strong': props.strong,
    'ny-text--italic': props.italic,
    'ny-text--underline': props.underline,
    'ny-text--strike': props.strike,
    'ny-text--code': props.code,
    'ny-text--mark': props.mark,
    'ny-text--truncate': props.truncate,
    'ny-text--clamp': props.lines > 0,
    'is-disabled': props.disabled,
  },
])

const style = computed(() => (props.lines > 0 ? { '-webkit-line-clamp': String(props.lines) } : {}))
</script>

<template>
  <component :is="tag" class="ny-text" :class="classes" :style="style">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.ny-text {
  font-size: var(--ny-font-size-md);
  line-height: 1.65;
  word-break: break-word;
}

.ny-text--xs {
  font-size: var(--ny-font-size-xs);
}

.ny-text--sm {
  font-size: var(--ny-font-size-sm);
}

.ny-text--lg {
  font-size: var(--ny-font-size-lg);
}

.ny-text--xl {
  font-size: var(--ny-font-size-xl);
}

.ny-text--medium {
  font-weight: 500;
}

.ny-text--semibold {
  font-weight: 600;
}

.ny-text--bold {
  font-weight: 700;
}

.ny-text--secondary {
  color: var(--ny-text-sub);
}

.ny-text--muted {
  color: var(--ny-text-muted);
}

.ny-text--primary {
  color: var(--ny-primary-text);
}

.ny-text--success {
  color: var(--ny-success-text);
}

.ny-text--warning {
  color: var(--ny-warning-text);
}

.ny-text--danger {
  color: var(--ny-danger-text);
}

.ny-text--strong {
  font-weight: 600;
  color: var(--ny-text-strong);
}

.ny-text--italic {
  font-style: italic;
}

.ny-text--underline {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.ny-text--strike {
  text-decoration: line-through;
}

.ny-text--code {
  padding: 1px 6px;
  border-radius: var(--ny-radius-xs);
  background: var(--ny-surface-3);
  color: var(--ny-text);
  font-family: var(--ny-font-family-mono);
  font-size: 0.92em;
}

.ny-text--mark {
  padding: 1px 4px;
  border-radius: var(--ny-radius-xs);
  background: var(--ny-warning-soft);
  color: var(--ny-warning-text);
}

.ny-text--align-center {
  display: block;
  text-align: center;
}

.ny-text--align-end {
  display: block;
  text-align: right;
}

.ny-text--truncate {
  display: block;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ny-text--clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ny-text.is-disabled {
  color: var(--ny-text-muted);
  cursor: not-allowed;
  user-select: none;
}
</style>
