<script setup lang="ts">
import { computed, useId } from 'vue'

import NyField from './NyField.vue'
import NyIcon from '../basic/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    size?: NySize
    disabled?: boolean
    readonly?: boolean
    loading?: boolean
    checkedText?: string
    uncheckedText?: string
    label?: string
    hint?: string
  }>(),
  {
    size: 'md',
    disabled: false,
    readonly: false,
    loading: false,
    checkedText: '',
    uncheckedText: '',
    label: '',
    hint: '',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: boolean): void
}>()

const model = defineModel<boolean>('checked', { default: false })

const controlId = `${useId()}-switch`
const messageId = `${controlId}-msg`

const isLocked = computed(() => props.disabled || props.loading)
const text = computed(() => (model.value ? props.checkedText : props.uncheckedText))
const iconSize = computed(() => (props.size === 'lg' ? 13 : props.size === 'sm' ? 9 : 11))

function toggle() {
  if (isLocked.value || props.readonly) {
    return
  }

  const next = !model.value
  model.value = next
  emit('change', next)
}
</script>

<template>
  <NyField
    :label="label"
    :hint="hint"
    :size="size"
    :disabled="disabled"
    :control-id="controlId"
    :message-id="messageId"
  >
    <span
      :id="controlId"
      class="ny-switch"
      :class="[
        `ny-switch--${size}`,
        {
          'is-checked': model,
          'is-disabled': disabled,
          'is-readonly': readonly,
          'is-loading': loading,
        },
      ]"
      role="switch"
      :tabindex="disabled ? -1 : 0"
      :aria-checked="model"
      :aria-disabled="isLocked || undefined"
      :aria-readonly="readonly || undefined"
      :aria-label="label || undefined"
      :aria-describedby="hint ? messageId : undefined"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <span class="ny-switch__track">
        <span class="ny-switch__thumb">
          <NyIcon v-if="loading" name="refresh" :size="iconSize" spin />
        </span>
      </span>

      <span v-if="text" class="ny-switch__text">{{ text }}</span>
    </span>
  </NyField>
</template>

<style scoped lang="scss">
.ny-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--ny-space-2);
  outline: none;
  cursor: pointer;

  &:focus-visible .ny-switch__track {
    box-shadow: var(--ny-shadow-focus);
  }
}

.ny-switch__track {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  width: 42px;
  height: 22px;
  padding: 2px;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-border-strong);
  transition:
    background var(--ny-transition-base),
    box-shadow var(--ny-transition-fast);
}

.ny-switch__thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ny-surface);
  color: var(--ny-primary-text);
  box-shadow: var(--ny-shadow-sm);
  transition: transform var(--ny-transition-base);
}

.ny-switch__text {
  font-size: var(--ny-font-size-md);
  color: var(--ny-text-sub);
}

.ny-switch--sm {
  .ny-switch__track {
    width: 34px;
    height: 18px;
  }

  .ny-switch__thumb {
    width: 14px;
    height: 14px;
  }

  .ny-switch__text {
    font-size: var(--ny-font-size-sm);
  }
}

.ny-switch--lg {
  .ny-switch__track {
    width: 50px;
    height: 26px;
  }

  .ny-switch__thumb {
    width: 22px;
    height: 22px;
  }

  .ny-switch__text {
    font-size: var(--ny-font-size-lg);
  }
}

.ny-switch.is-checked {
  .ny-switch__track {
    background: var(--ny-primary);
  }

  .ny-switch__thumb {
    transform: translateX(20px);
  }

  .ny-switch__text {
    color: var(--ny-text);
  }
}

.ny-switch--sm.is-checked .ny-switch__thumb {
  transform: translateX(16px);
}

.ny-switch--lg.is-checked .ny-switch__thumb {
  transform: translateX(24px);
}

.ny-switch.is-disabled,
.ny-switch.is-readonly {
  cursor: not-allowed;
}

.ny-switch.is-disabled {
  opacity: 0.6;
}

.ny-switch.is-loading {
  cursor: wait;
}
</style>
