<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from './NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'solid' | 'secondary' | 'ghost' | 'danger' | 'text'
    size?: NySize
    shape?: 'default' | 'round' | 'circle'
    type?: 'button' | 'submit' | 'reset'
    icon?: string
    disabled?: boolean
    loading?: boolean
    block?: boolean
    iconOnly?: boolean
  }>(),
  {
    variant: 'default',
    size: 'md',
    shape: 'default',
    type: 'button',
    icon: '',
    disabled: false,
    loading: false,
    block: false,
    iconOnly: false,
  },
)

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void
}>()

const classes = computed(() => [
  `ny-btn--${props.variant}`,
  `ny-btn--${props.size}`,
  `ny-btn--shape-${props.shape}`,
  {
    'ny-btn--block': props.block,
    'ny-btn--icon': props.iconOnly,
    'is-loading': props.loading,
  },
])

const iconSize = computed(() => (props.size === 'lg' ? 17 : props.size === 'sm' ? 14 : 15))

function onClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <button class="ny-btn" :class="classes" :type="type" :disabled="disabled || loading" @click="onClick">
    <NyIcon v-if="loading" name="refresh" :size="iconSize" spin />
    <NyIcon v-else-if="icon" :name="icon" :size="iconSize" />

    <slot name="icon" />
    <slot />
  </button>
</template>

<style scoped lang="scss">
.ny-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--ny-control-height-md);
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: calc(var(--ny-radius-sm) + 2px);
  background: transparent;
  color: var(--ny-text-sub);
  font-family: inherit;
  font-size: var(--ny-font-size-md);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    border-color var(--ny-transition-fast),
    color var(--ny-transition-fast),
    box-shadow var(--ny-transition-fast),
    transform var(--ny-transition-fast);

  &:hover:not(:disabled) {
    background: var(--ny-surface-hover);
    color: var(--ny-text);
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &:active:not(:disabled) {
    transform: translateY(0.5px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ny-btn--primary {
  border-color: transparent;
  background: var(--ny-primary-soft);
  color: var(--ny-primary-text);
  font-weight: 600;

  &:hover:not(:disabled) {
    border-color: transparent;
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
    box-shadow: inset 0 0 0 1px var(--ny-primary-ring);
  }

  &:active:not(:disabled) {
    background: var(--ny-primary-soft);
    filter: brightness(0.96);
  }
}

.ny-btn--solid {
  border-color: transparent;
  background: var(--ny-primary);
  color: var(--ny-on-primary);
  font-weight: 600;

  &:hover:not(:disabled) {
    border-color: transparent;
    background: var(--ny-primary-hover);
    color: var(--ny-on-primary);
  }

  &:active:not(:disabled) {
    background: var(--ny-primary-active);
  }
}

.ny-btn--secondary {
  border-color: transparent;
  background: var(--ny-secondary-soft);
  color: var(--ny-secondary-text);
  font-weight: 600;

  &:hover:not(:disabled) {
    background: var(--ny-secondary-soft);
    border-color: transparent;
    color: var(--ny-secondary-text);
    box-shadow: inset 0 0 0 1px var(--ny-secondary);
  }
}

.ny-btn--ghost {
  border-color: transparent;
  background: var(--ny-surface-3);
  color: var(--ny-text-sub);

  &:hover:not(:disabled) {
    background: var(--ny-surface-hover);
    border-color: transparent;
    color: var(--ny-text);
  }
}

.ny-btn--text {
  height: auto;
  padding: 2px 4px;
  border-color: transparent;
  background: transparent;
  color: var(--ny-primary-text);
  box-shadow: none;

  &:hover:not(:disabled) {
    background: var(--ny-primary-soft);
    border-color: transparent;
    color: var(--ny-primary-text);
    box-shadow: none;
  }
}

.ny-btn--danger {
  border-color: transparent;
  background: var(--ny-danger-soft);
  color: var(--ny-danger-text);
  font-weight: 600;

  &:hover:not(:disabled) {
    background: var(--ny-danger-soft);
    border-color: transparent;
    color: var(--ny-danger-text);
    box-shadow: inset 0 0 0 1px var(--ny-danger);
  }
}

.ny-btn--sm {
  gap: 4px;
  height: var(--ny-control-height-sm);
  padding: 0 12px;
  font-size: var(--ny-font-size-sm);
  border-radius: calc(var(--ny-radius-xs) + 2px);
}

.ny-btn--lg {
  gap: 8px;
  height: var(--ny-control-height-lg);
  padding: 0 22px;
  font-size: var(--ny-font-size-lg);
}

.ny-btn--shape-round {
  border-radius: var(--ny-radius-pill);
}

.ny-btn--shape-circle {
  width: var(--ny-control-height-md);
  padding: 0;
  border-radius: 50%;

  &.ny-btn--sm {
    width: var(--ny-control-height-sm);
  }

  &.ny-btn--lg {
    width: var(--ny-control-height-lg);
  }
}

.ny-btn--block {
  width: 100%;
}

.ny-btn--icon {
  width: var(--ny-control-height-md);
  padding: 0;

  &.ny-btn--sm {
    width: var(--ny-control-height-sm);
  }

  &.ny-btn--lg {
    width: var(--ny-control-height-lg);
  }
}
</style>
