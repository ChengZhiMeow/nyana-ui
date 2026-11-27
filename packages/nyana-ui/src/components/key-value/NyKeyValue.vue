<script setup lang="ts">
import { reactive } from 'vue'

import NyIcon from '../icon/NyIcon.vue'
import NyCopyButton from '../copy/NyCopyButton.vue'

export interface NyKeyValueItem {
  label: string
  value: string
  copyable?: boolean
  // 密码类: 默认打码, 点眼睛显示
  secret?: boolean
}

withDefaults(
  defineProps<{
    items: NyKeyValueItem[]
    mono?: boolean
  }>(),
  {
    mono: true,
  },
)

const shown = reactive<Record<number, boolean>>({})
</script>

<template>
  <div class="ny-kv">
    <div v-for="(item, index) in items" :key="item.label" class="ny-kv__row">
      <span class="ny-kv__label">{{ item.label }}</span>
      <span class="ny-kv__val" :class="{ 'ny-kv__val--mono': mono }">
        <span :title="item.secret && !shown[index] ? undefined : item.value">{{
          item.secret && !shown[index] ? '••••••••••••' : item.value
        }}</span>
        <button
          v-if="item.secret"
          type="button"
          class="ny-kv__eye"
          :aria-label="shown[index] ? '隐藏' : '显示'"
          @click="shown[index] = !shown[index]"
        >
          <NyIcon :name="shown[index] ? 'eye' : 'eye'" :size="15" />
        </button>
        <NyCopyButton v-if="item.copyable !== false" :text="item.value" />
      </span>
    </div>
  </div>
</template>
