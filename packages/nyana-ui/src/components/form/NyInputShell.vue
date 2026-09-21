<script setup lang="ts">
import NyIcon from '../basic/NyIcon.vue'

import type { NySize, NyVariant } from '../../types'

const props = withDefaults(
  defineProps<{
    size?: NySize
    variant?: NyVariant
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    clearable?: boolean
    hasValue?: boolean
    multiline?: boolean
    focused?: boolean
  }>(),
  {
    size: 'md',
    variant: 'outline',
    disabled: false,
    readonly: false,
    invalid: false,
    clearable: false,
    hasValue: false,
    multiline: false,
    focused: false,
  },
)

const emit = defineEmits<{
  (event: 'clear'): void
}>()

const showClear = () => props.clearable && props.hasValue && !props.disabled && !props.readonly
</script>

<template>
  <div
    class="ny-shell"
    :class="[
      `ny-shell--${size}`,
      `ny-shell--${variant}`,
      {
        'ny-shell--multiline': multiline,
        'is-invalid': invalid,
        'is-disabled': disabled,
        'is-readonly': readonly,
        'is-focused': focused,
      },
    ]"
  >
    <span v-if="$slots.prefix" class="ny-addon ny-addon--prefix">
      <slot name="prefix" />
    </span>

    <slot />

    <span v-if="showClear() || $slots.suffix" class="ny-addon ny-addon--suffix">
      <button
        v-if="showClear()"
        class="ny-shell__clear"
        type="button"
        title="清空"
        tabindex="-1"
        @click="emit('clear')"
      >
        <NyIcon name="close" :size="13" />
      </button>

      <slot name="suffix" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.ny-shell {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-width: 0;
  height: var(--ny-control-height-md);
  padding: 0 12px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface);
  color: var(--ny-text);
  font-size: var(--ny-font-size-md);
  transition:
    border-color var(--ny-transition-fast),
    background var(--ny-transition-fast),
    box-shadow var(--ny-transition-fast);

  &:hover:not(.is-disabled):not(.is-readonly) {
    border-color: var(--ny-primary);
  }

  &.is-focused {
    border-color: var(--ny-primary);
    box-shadow: var(--ny-shadow-focus);
  }

  &.is-invalid {
    border-color: var(--ny-danger);

    &.is-focused {
      box-shadow: 0 0 0 3px var(--ny-danger-soft);
    }
  }

  &.is-disabled {
    background: var(--ny-surface-2);
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }

  &.is-readonly {
    background: var(--ny-surface-2);
  }
}

.ny-shell--sm {
  height: var(--ny-control-height-sm);
  padding: 0 10px;
  font-size: var(--ny-font-size-sm);
  border-radius: var(--ny-radius-xs);
}

.ny-shell--lg {
  height: var(--ny-control-height-lg);
  padding: 0 14px;
  font-size: var(--ny-font-size-lg);
}

.ny-shell--soft {
  border-color: transparent;
  background: var(--ny-surface-3);

  &:hover:not(.is-disabled):not(.is-readonly) {
    border-color: transparent;
  }

  &.is-focused {
    background: var(--ny-surface);
  }
}

.ny-shell--ghost {
  border-color: transparent;
  background: transparent;

  &:hover:not(.is-disabled):not(.is-readonly) {
    border-color: transparent;
    background: var(--ny-surface-2);
  }

  &.is-focused {
    background: var(--ny-surface-2);
  }
}

.ny-shell--multiline {
  align-items: flex-start;
  height: auto;
  padding: 9px 12px;
}

.ny-addon {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  color: var(--ny-text-muted);
}

.ny-shell--multiline .ny-addon {
  height: 20px;
}

.ny-shell__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--ny-surface-3);
  color: var(--ny-text-muted);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover {
    background: var(--ny-danger-soft);
    color: var(--ny-danger);
  }
}

.ny-shell :deep(.ny-shell__control) {
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  outline: none;

  &::placeholder {
    color: var(--ny-text-muted);
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--ny-text-muted);
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  &[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
}
</style>
