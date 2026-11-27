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
