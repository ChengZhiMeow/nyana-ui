<script setup lang="ts">
import NyIcon from '../icon/NyIcon.vue'

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
        <NyIcon name="close" :size="10" :stroke-width="2.4" />
      </button>

      <slot name="suffix" />
    </span>
  </div>
</template>
