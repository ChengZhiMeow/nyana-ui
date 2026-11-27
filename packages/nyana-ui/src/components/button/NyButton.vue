<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

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

const iconSize = computed(() => (props.size === 'sm' ? 16 : 18))

function onClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <button class="ny-btn" :class="classes" :type="type" :disabled="disabled || loading" @click="onClick">
    <span v-if="loading" class="ny-btn__spinner" aria-hidden="true" />
    <NyIcon v-else-if="icon" :name="icon" :size="iconSize" />

    <slot name="icon" />
    <span v-if="$slots.default" class="ny-btn__label"><slot /></span>
  </button>
</template>
