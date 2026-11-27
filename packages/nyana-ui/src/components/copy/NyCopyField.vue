<script setup lang="ts">
import NyCopyButton from './NyCopyButton.vue'

withDefaults(
  defineProps<{
    value: string
    // large: 大号等宽字, 用于游戏连接地址这种页面上最重要的一串文字
    large?: boolean
    copyLabel?: string
  }>(),
  {
    large: true,
    copyLabel: '复制',
  },
)
</script>

<template>
  <div class="ny-copy-field" :class="{ 'ny-copy-field--large': large }">
    <code :title="value">{{ value }}</code>
    <NyCopyButton :text="value" :label="copyLabel" type="primary" />
  </div>
</template>
