<script setup lang="ts">
import { computed, ref } from 'vue'

import NyCopyButton from '../copy/NyCopyButton.vue'

export interface NyCommandOption {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    // 一条命令直接传 command; 多种写法 (curl / wget) 传 commands, 上方出现切换
    command?: string
    commands?: NyCommandOption[]
    prompt?: string
    title?: string
    hint?: string
  }>(),
  {
    command: undefined,
    commands: () => [],
    prompt: '$',
    title: undefined,
    hint: undefined,
  },
)

const index = ref(0)
const current = computed(() => (props.commands.length ? props.commands[index.value]?.value ?? '' : props.command ?? ''))
</script>

<template>
  <div class="ny-command">
    <div v-if="title || commands.length > 1" class="ny-command__head">
      <b v-if="title">{{ title }}</b>
      <div v-if="commands.length > 1" class="ny-command__switch">
        <button
          v-for="(item, i) in commands"
          :key="item.label"
          type="button"
          :class="{ 'is-active': i === index }"
          @click="index = i"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
    <div class="ny-command__line">
      <span class="ny-command__prompt">{{ prompt }}</span>
      <code>{{ current }}</code>
      <NyCopyButton :text="current" label="复制" type="default" class="ny-command__copy" />
    </div>
    <span v-if="hint || $slots.hint" class="ny-command__hint"><slot name="hint">{{ hint }}</slot></span>
  </div>
</template>
