<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyProgress } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const percent = ref(0)
const loading = ref(false)

const codeLine = `<NyProgress :percent="40" />
<NyProgress :percent="60" :stroke-width="14" />`

const codeCircle = `<NyProgress type="circle" :percent="75" />
<NyProgress type="circle" :percent="75" :size="120" :stroke-width="10" />`

const codeStatus = `<NyProgress :percent="100" status="success" />
<NyProgress :percent="70" status="error" />`

const codeIndeterminate = `<!-- 不确定进度只对线形生效, 此时文字自动收起 -->
<NyProgress indeterminate :stroke-width="14" />`

const codeFormat = `<!-- format 收百分比, 返回要显示的文本 -->
<NyProgress :percent="percent" :format="(value) => \`\${value}% 已完成\`" />`

const codeDynamic = `<NyProgress :percent="percent" />
<NyButton @click="percent = Math.min(100, percent + 10)">加 10</NyButton>`

const apiProps = [
  { name: 'percent', desc: '进度百分比, 越界值会夹到 0~100', type: 'number', default: '0' },
  { name: 'type', desc: '线形或环形', type: "'line' | 'circle'", default: "'line'" },
  { name: 'status', desc: '状态色, 只改颜色不改数值', type: "'normal' | 'success' | 'error'", default: "'normal'" },
  { name: 'showText', desc: '是否显示右侧 (环形为中间) 的数值文字', type: 'boolean', default: 'true' },
  { name: 'strokeWidth', desc: '线形下是轨道高度, 环形下是环宽', type: 'number', default: '8' },
  { name: 'size', desc: '环形直径, 线形不使用', type: 'number', default: '96' },
  { name: 'indeterminate', desc: '不确定进度, 只对线形生效且自动隐藏文字', type: 'boolean', default: 'false' },
  { name: 'format', desc: '自定义数值文本, 收夹取后的百分比', type: '(percent: number) => string', default: 'undefined' },
]

const apiSlots = [
  { name: 'default', desc: '替换数值文字, 优先级高于 format' },
]

const formatText = computed(() => `已完成 ${Math.round(percent.value)}%`)

function step() {
  percent.value = Math.min(100, percent.value + 10)
}

function reset() {
  percent.value = 0
}

function autoRun() {
  if (loading.value) {
    return
  }

  loading.value = true
  percent.value = 0

  const timer = window.setInterval(() => {
    percent.value = Math.min(100, percent.value + 10)

    if (percent.value >= 100) {
      window.clearInterval(timer)
      loading.value = false
    }
  }, 220)
}
</script>

<template>
  <DocPage title="Progress 进度条" desc="线与环两种形态的进度展示">

    <DemoBlock
      title="线形进度"
      desc="percent 越界会夹到 0~100, stroke-width 控制轨道高度。"
      :code="codeLine"
    >
      <div class="ex-stack">
        <NyProgress :percent="40" />
        <NyProgress :percent="60" :stroke-width="14" />
      </div>
    </DemoBlock>

    <DemoBlock title="环形进度" desc="type 为 circle 时 size 决定直径, 数值显示在圆心。" :code="codeCircle">
      <div class="ex-group">
        <NyProgress type="circle" :percent="75" />
        <NyProgress type="circle" :percent="75" :size="120" :stroke-width="10" />
      </div>
    </DemoBlock>

    <DemoBlock title="状态色" desc="status 只改颜色, 数值仍由 percent 决定。" :code="codeStatus">
      <div class="ex-stack">
        <NyProgress :percent="100" status="success" />
        <NyProgress :percent="70" status="error" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="不确定进度"
      desc="indeterminate 只用一段来回平移的色块表示还在跑, 此时数值文字自动收起。"
      :code="codeIndeterminate"
    >
      <div class="ex-stack">
        <NyProgress indeterminate />
        <NyProgress indeterminate :stroke-width="14" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="自定义数值文本"
      desc="format 收百分比返回文本, 优先级低于默认插槽。"
      :code="codeFormat"
      :value="`format 结果: ${formatText}`"
    >
      <div class="ex-stack">
        <NyProgress :percent="percent" :format="(value: number) => `${value}% 已完成`" />
        <NyProgress type="circle" :percent="percent" :format="() => '上传中'" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="让进度动起来"
      desc="percent 是普通 prop, 用按钮或定时器推它即可。"
      :code="codeDynamic"
      :value="`percent: ${percent}`"
    >
      <div class="ex-stack">
        <NyProgress :percent="percent" />
        <NyProgress type="circle" :percent="percent" />
      </div>

      <div class="ex-group">
        <NyButton size="sm" :disabled="percent >= 100" @click="step">加 10</NyButton>
        <NyButton size="sm" @click="reset">归零</NyButton>
        <NyButton size="sm" variant="primary" :loading="loading" @click="autoRun">
          模拟上传
        </NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyProgress Props" :rows="apiProps" />
      <ApiTable title="NyProgress 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
