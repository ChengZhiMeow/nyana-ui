<script setup lang="ts">
import { computed, ref } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NyStatus } from '../../types'

const props = withDefaults(
  defineProps<{
    type?: NyStatus
    title?: string
    desc?: string
    variant?: 'soft' | 'outline'
    showIcon?: boolean
    closable?: boolean
    banner?: boolean
    action?: string
  }>(),
  {
    type: 'info',
    title: '',
    desc: '',
    variant: 'soft',
    showIcon: true,
    closable: false,
    banner: false,
    action: '',
  },
)

const emit = defineEmits<{
  (event: 'close', payload: MouseEvent): void
  (event: 'action'): void
}>()

const ALERT_TYPES: NyStatus[] = ['info', 'success', 'warning', 'danger']

const ALERT_ICONS: Record<string, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert',
  danger: 'close-circle',
}

const visible = ref(true)

const resolvedType = computed(() => (ALERT_TYPES.includes(props.type) ? props.type : 'info'))

const iconName = computed(() => ALERT_ICONS[resolvedType.value] || 'info')

const classes = computed(() => [
  `ny-alert--${resolvedType.value}`,
  `ny-alert--${props.variant}`,
  { 'ny-alert--banner': props.banner },
])

const role = computed(() =>
  resolvedType.value === 'danger' || resolvedType.value === 'warning' ? 'alert' : 'status',
)

function onAction() {
  emit('action')
}

function onClose(event: MouseEvent) {
  visible.value = false
  emit('close', event)
}
</script>

<template>
  <transition name="ny-fade" :duration="160">
    <div v-if="visible" class="ny-alert" :class="classes" :role="role">
      <span v-if="showIcon" class="ny-alert__icon">
        <slot name="icon">
          <NyIcon :name="iconName" :size="18" />
        </slot>
      </span>

      <div class="ny-alert__main">
        <p v-if="title || $slots.title" class="ny-alert__title">
          <slot name="title">{{ title }}</slot>
        </p>

        <div v-if="desc || $slots.default" class="ny-alert__desc">
          <slot>{{ desc }}</slot>
        </div>
      </div>

      <div v-if="action || $slots.action" class="ny-alert__foot">
        <button type="button" class="ny-alert__action" @click="onAction">
          <slot name="action">{{ action }}</slot>
        </button>
      </div>

      <button v-if="closable" type="button" class="ny-alert__close" aria-label="关闭" @click="onClose">
        <NyIcon name="close" :size="16" />
      </button>
    </div>
  </transition>
</template>
