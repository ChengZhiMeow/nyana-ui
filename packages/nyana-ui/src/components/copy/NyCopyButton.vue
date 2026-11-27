<script setup lang="ts">
import { ref } from 'vue'

import NyIcon from '../icon/NyIcon.vue'
import { nyCopy } from './copy'

const props = withDefaults(
  defineProps<{
    text: string
    // 有 label 时是带文字的小按钮, 没有时是只有图标的按钮
    label?: string
    tip?: string | false
    type?: 'ghost' | 'primary' | 'default'
  }>(),
  {
    label: undefined,
    tip: '已复制',
    type: 'ghost',
  },
)

const emit = defineEmits<{ copied: [text: string] }>()

const done = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  if (!(await nyCopy(props.text, props.tip))) return
  emit('copied', props.text)
  done.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (done.value = false), 1500)
}
</script>

<template>
  <button
    type="button"
    class="ny-copy"
    :class="[`ny-copy--${type}`, { 'ny-copy--labeled': label }]"
    :aria-label="label || '复制'"
    :title="label ? undefined : '复制'"
    @click="copy"
  >
    <NyIcon :name="done ? 'check' : 'copy'" :size="label ? 15 : 15" />
    <span v-if="label">{{ label }}</span>
  </button>
</template>
