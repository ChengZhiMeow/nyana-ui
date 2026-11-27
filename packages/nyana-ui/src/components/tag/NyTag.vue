<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

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
