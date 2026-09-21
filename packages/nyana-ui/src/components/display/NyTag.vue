<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import type { NySize, NyStatus } from '../../types'

const props = withDefaults(
  defineProps<{
    status?: NyStatus
    variant?: 'soft' | 'outline' | 'solid'
    size?: NySize
    closable?: boolean
    round?: boolean
    icon?: string
    checkable?: boolean
    disabled?: boolean
  }>(),
  {
    status: 'default',
    variant: 'soft',
    size: 'md',
    closable: false,
    round: false,
    icon: '',
    checkable: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'close', payload: MouseEvent): void
  (event: 'change', payload: boolean): void
}>()

const checked = defineModel<boolean>('checked', { default: false })

const classes = computed(() => [
  `ny-tag--${props.status}`,
  `ny-tag--${props.variant}`,
  `ny-tag--${props.size}`,
  {
    'ny-tag--round': props.round,
    'is-checkable': props.checkable,
    'is-checked': props.checkable && checked.value,
    'is-disabled': props.disabled,
  },
])

const iconSize = computed(() => (props.size === 'lg' ? 14 : 12))

function toggle() {
  if (!props.checkable || props.disabled) {
    return
  }

  checked.value = !checked.value
  emit('change', checked.value)
}

function onClose(payload: MouseEvent) {
  if (props.disabled) {
    return
  }

  emit('close', payload)
}
</script>

<template>
  <span
    class="ny-tag"
    :class="classes"
    :tabindex="checkable && !disabled ? 0 : undefined"
    :role="checkable ? 'checkbox' : undefined"
    :aria-checked="checkable ? checked : undefined"
    :aria-disabled="disabled ? true : undefined"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <NyIcon v-if="checkable && checked" name="check" :size="iconSize" />
    <NyIcon v-else-if="icon" :name="icon" :size="iconSize" />

    <span class="ny-tag__text"><slot /></span>

    <button
      v-if="closable"
      type="button"
      class="ny-tag__close"
      :disabled="disabled"
      aria-label="关闭"
      @keydown.stop
      @click.stop="onClose"
    >
      <NyIcon name="close" :size="iconSize" />
    </button>
  </span>
</template>

<style scoped lang="scss">
.ny-tag {
  --ny-tag-bg: var(--ny-surface-3);
  --ny-tag-fg: var(--ny-text-sub);
  --ny-tag-line: var(--ny-border-strong);
  --ny-tag-solid: var(--ny-text-strong);
  --ny-tag-on-solid: var(--ny-surface);

  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  border: 1px solid transparent;
  border-radius: var(--ny-radius-xs);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition:
    background var(--ny-transition-fast),
    border-color var(--ny-transition-fast),
    color var(--ny-transition-fast);
}

.ny-tag--primary {
  --ny-tag-bg: var(--ny-primary-soft);
  --ny-tag-fg: var(--ny-primary-text);
  --ny-tag-line: var(--ny-primary);
  --ny-tag-solid: var(--ny-primary);
  --ny-tag-on-solid: var(--ny-on-primary);
}

.ny-tag--info {
  --ny-tag-bg: var(--ny-info-soft);
  --ny-tag-fg: var(--ny-info-text);
  --ny-tag-line: var(--ny-info);
  --ny-tag-solid: var(--ny-info-strong);
  --ny-tag-on-solid: var(--ny-surface);
}

.ny-tag--success {
  --ny-tag-bg: var(--ny-success-soft);
  --ny-tag-fg: var(--ny-success-text);
  --ny-tag-line: var(--ny-success);
  --ny-tag-solid: var(--ny-success-strong);
  --ny-tag-on-solid: var(--ny-surface);
}

.ny-tag--warning {
  --ny-tag-bg: var(--ny-warning-soft);
  --ny-tag-fg: var(--ny-warning-text);
  --ny-tag-line: var(--ny-warning);
  --ny-tag-solid: var(--ny-warning-strong);
  --ny-tag-on-solid: var(--ny-surface);
}

.ny-tag--danger {
  --ny-tag-bg: var(--ny-danger-soft);
  --ny-tag-fg: var(--ny-danger-text);
  --ny-tag-line: var(--ny-danger);
  --ny-tag-solid: var(--ny-danger);
  --ny-tag-on-solid: var(--ny-on-danger);
}

.ny-tag--soft {
  background: var(--ny-tag-bg);
  color: var(--ny-tag-fg);
}

.ny-tag--outline {
  border-color: var(--ny-tag-line);
  background: transparent;
  color: var(--ny-tag-fg);
}

.ny-tag--solid {
  background: var(--ny-tag-solid);
  color: var(--ny-tag-on-solid);
  font-weight: 600;
}

.ny-tag--sm {
  height: 22px;
  padding: 0 6px;
  font-size: var(--ny-font-size-xs);
}

.ny-tag--md {
  height: 24px;
  padding: 0 8px;
  font-size: var(--ny-font-size-xs);
}

.ny-tag--lg {
  height: 28px;
  padding: 0 10px;
  font-size: var(--ny-font-size-sm);
}

.ny-tag--round {
  border-radius: var(--ny-radius-pill);
}

.ny-tag.is-checkable {
  cursor: pointer;
  user-select: none;

  &:hover:not(.is-disabled) {
    border-color: var(--ny-tag-line);
  }
}

.ny-tag.is-checked {
  border-color: var(--ny-primary);
}

.ny-tag.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ny-tag__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ny-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 14px;
  height: 14px;
  margin-right: -2px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  opacity: 0.65;
  cursor: pointer;
  transition: opacity var(--ny-transition-fast);

  &:hover:not(:disabled) {
    opacity: 1;
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
