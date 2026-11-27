<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    icon?: string
    unit?: string
    // 只有带上限的数值才传 percent; 余额、待办数这类不传, 卡片就不显示进度条
    percent?: number | null
    status?: 'auto' | 'primary' | 'success' | 'warning' | 'danger'
    foot?: string
    warn?: number
    danger?: number
  }>(),
  {
    icon: undefined,
    unit: undefined,
    percent: null,
    status: 'auto',
    foot: undefined,
    warn: 80,
    danger: 95,
  },
)

const clamped = computed(() => (props.percent == null ? null : Math.max(0, Math.min(100, props.percent))))
const tone = computed(() => {
  if (props.status !== 'auto') return props.status
  if (clamped.value == null) return 'primary'
  return clamped.value >= props.danger ? 'danger' : clamped.value >= props.warn ? 'warning' : 'primary'
})
</script>

<template>
  <div class="ny-metric">
    <span class="ny-metric__label">
      <NyIcon v-if="icon" :name="icon" :size="17" />
      <span class="ny-metric__text">{{ label }}</span>
      <span v-if="$slots.extra" class="ny-metric__extra"><slot name="extra" /></span>
    </span>
    <span class="ny-metric__value">{{ value }}<small v-if="unit">{{ unit }}</small></span>
    <slot>
      <span v-if="clamped != null" class="ny-metric__track">
        <span class="ny-metric__bar" :class="`ny-metric__bar--${tone}`" :style="{ width: clamped + '%' }" />
      </span>
    </slot>
    <span v-if="foot || $slots.foot" class="ny-metric__foot"><slot name="foot">{{ foot }}</slot></span>
  </div>
</template>
