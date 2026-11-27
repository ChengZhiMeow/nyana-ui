<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

export interface NyTerminalLine {
  text: string
  // 日志级别决定颜色; prompt 是用户输入的命令回显
  level?: 'info' | 'warn' | 'error' | 'success' | 'prompt' | 'plain'
  time?: string
}

// 终端外壳: 工具条 + 输出区 + 命令输入.
// 真终端由使用方把 xterm 挂进默认插槽; 伪终端可以直接传 lines, 组件负责按行着色和输入历史.
const mode = defineModel<'real' | 'pseudo'>('mode', { default: 'pseudo' })

const props = withDefaults(
  defineProps<{
    title?: string
    status?: 'connected' | 'connecting' | 'disconnected'
    readonly?: boolean
    // 是否显示 真终端 / 伪终端 切换
    switchable?: boolean
    lines?: NyTerminalLine[]
    placeholder?: string
    height?: string
  }>(),
  {
    title: '服务器控制台',
    status: 'connected',
    readonly: false,
    switchable: true,
    lines: () => [],
    placeholder: '输入命令, 回车发送, ↑↓ 翻历史',
    height: '480px',
  },
)

const emit = defineEmits<{
  command: [command: string]
  reconnect: []
  clear: []
}>()

const full = ref(false)
const input = ref('')
const history: string[] = []
let cursor = 0
const out = ref<HTMLElement>()

const statusText = { connected: '已连接', connecting: '正在连接', disconnected: '已断开' }

function send() {
  const value = input.value.trim()
  if (!value || props.readonly) return
  history.push(value)
  cursor = history.length
  input.value = ''
  emit('command', value)
}

function browse(step: number) {
  if (!history.length) return
  cursor = Math.max(0, Math.min(history.length, cursor + step))
  input.value = history[cursor] ?? ''
}

// 新输出到达时, 只有原本就在底部才跟随滚动, 用户往上翻看时不打断
watch(
  () => props.lines.length,
  async () => {
    const el = out.value
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    await nextTick()
    if (atBottom) el.scrollTop = el.scrollHeight
  },
)
</script>

<template>
  <div class="ny-term" :class="{ 'is-full': full }" :style="full ? undefined : { height }">
    <div class="ny-term__bar">
      <b class="ny-term__title">{{ title }}</b>
      <span class="ny-term__status" :class="`is-${status}`">{{ statusText[status] }}<template v-if="readonly"> · 只读</template></span>
      <span class="ny-term__spacer" />
      <div v-if="switchable" class="ny-term__modes" role="tablist">
        <button type="button" role="tab" :aria-selected="mode === 'real'" :class="{ 'is-active': mode === 'real' }" @click="mode = 'real'">真终端</button>
        <button type="button" role="tab" :aria-selected="mode === 'pseudo'" :class="{ 'is-active': mode === 'pseudo' }" @click="mode = 'pseudo'">伪终端</button>
      </div>
      <slot name="actions" />
      <button type="button" class="ny-term__tool" aria-label="重新连接" title="重新连接" @click="emit('reconnect')"><NyIcon name="refresh" :size="16" /></button>
      <button type="button" class="ny-term__tool" aria-label="清屏" title="清屏" @click="emit('clear')"><NyIcon name="trash" :size="16" /></button>
      <button type="button" class="ny-term__tool" :aria-label="full ? '退出全屏' : '全屏'" :title="full ? '退出全屏' : '全屏'" @click="full = !full">
        <NyIcon :name="full ? 'minimize' : 'maximize'" :size="16" />
      </button>
    </div>
    <div ref="out" class="ny-term__out">
      <slot>
        <div v-for="(line, index) in lines" :key="index" class="ny-term__line">
          <span v-if="line.time" class="ny-term__time">{{ line.time }}</span>
          <span :class="`ny-term__text is-${line.level || 'plain'}`">{{ line.text }}</span>
        </div>
      </slot>
    </div>
    <form v-if="mode === 'pseudo' && !readonly" class="ny-term__in" @submit.prevent="send">
      <span class="ny-term__prompt">&gt;</span>
      <input
        v-model="input"
        autocomplete="off"
        spellcheck="false"
        :placeholder="placeholder"
        aria-label="命令"
        @keydown.up.prevent="browse(-1)"
        @keydown.down.prevent="browse(1)"
      />
      <button type="submit" class="ny-term__send">发送</button>
    </form>
  </div>
</template>
