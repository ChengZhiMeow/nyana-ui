<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    // 用量与总量是显示用的文字, percent 决定进度条长度与颜色
    used?: string | number
    total?: string | number
    percent: number
    warn?: number
    danger?: number
    stack?: boolean
  }>(),
  {
    used: undefined,
    total: undefined,
    warn: 80,
    danger: 95,
    stack: false,
  },
)

const clamped = computed(() => Math.max(0, Math.min(100, props.percent)))
const tone = computed(() => (clamped.value >= props.danger ? 'danger' : clamped.value >= props.warn ? 'warning' : ''))
</script>

<template>
  <div class="ny-meter" :class="{ 'ny-meter--stack': stack }">
    <div class="ny-meter__head">
      <span class="ny-meter__label">{{ label }}</span>
      <b v-if="used !== undefined" class="ny-meter__value"
        >{{ used }}<span v-if="total !== undefined"> / {{ total }}</span></b
      >
    </div>
    <span class="ny-meter__track" role="meter" :aria-valuenow="clamped" aria-valuemin="0" aria-valuemax="100" :aria-label="label">
      <span class="ny-meter__bar" :class="tone && `ny-meter__bar--${tone}`" :style="{ width: clamped + '%' }" />
    </span>
  </div>
</template>
