<script setup lang="ts">
import { computed, ref } from 'vue'

import { NySegmented, NySpace } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const view = ref<string | number>('list')

const viewOptions = [
  { label: '列表', value: 'list' },
  { label: '卡片', value: 'card' },
  { label: '表格', value: 'table' },
]

const iconOptions = [
  { label: '列表', value: 'list', icon: 'list' },
  { label: '网格', value: 'grid', icon: 'grid' },
  { label: '看板', value: 'board', icon: 'dashboard' },
]

const iconView = ref<string | number>('grid')

const blockView = ref<string | number>('week')

const blockOptions = [
  { label: '今天', value: 'day' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
]

const sizeView = ref<string | number>('md')

const sizeOptions = [
  { label: '小', value: 'sm' },
  { label: '中', value: 'md' },
  { label: '大', value: 'lg' },
]

const limitedView = ref<string | number>('auto')

const limitedOptions = [
  { label: '自动', value: 'auto' },
  { label: '手动', value: 'manual', disabled: true },
  { label: '关闭', value: 'off' },
]

const frozenView = ref<string | number>('on')

const frozenOptions = [
  { label: '开启', value: 'on' },
  { label: '关闭', value: 'off' },
]

const monthValue = ref<string | number>(2)
const lastChange = ref('还没有切换')

const monthOptions = [
  { label: '一月', value: 1 },
  { label: '二月', value: 2 },
  { label: '三月', value: 3 },
]

function labelOf(options: { label: string; value: string | number }[], value: string | number) {
  return options.find((option) => option.value === value)?.label ?? '未选择'
}

const viewLabel = computed(() => labelOf(viewOptions, view.value))
const sizeLabel = computed(() => labelOf(sizeOptions, sizeView.value))
const blockLabel = computed(() => labelOf(blockOptions, blockView.value))

function onChange(payload: string | number) {
  lastChange.value = `value ${payload}`
}

const codeBasic = `const view = ref('list')

const options = [
  { label: '列表', value: 'list' },
  { label: '卡片', value: 'card' },
  { label: '表格', value: 'table' },
]

<NySegmented v-model="view" :options="options" />`

const codeIcon = `const options = [
  { label: '列表', value: 'list', icon: 'list' },
  { label: '网格', value: 'grid', icon: 'grid' },
  { label: '看板', value: 'board', icon: 'dashboard' },
]

<!-- icon 走 NyIcon, 与文字一起居中 -->
<NySegmented v-model="view" :options="options" />`

const codeBlock = `<!-- block: 等分宽度撑满父容器, 适合做筛选条 -->
<NySegmented v-model="range" :options="options" block />`

const codeSize = `<!-- 三档尺寸只改控件高度与字号 -->
<NySegmented v-model="view" :options="options" size="sm" />
<NySegmented v-model="view" :options="options" />
<NySegmented v-model="view" :options="options" size="lg" />`

const codeDisabled = `const options = [
  { label: '自动', value: 'auto' },
  { label: '手动', value: 'manual', disabled: true },
  { label: '关闭', value: 'off' },
]

<!-- 单项禁用: 鼠标与方向键都会跳过 -->
<NySegmented v-model="view" :options="options" />

<!-- 整组禁用 -->
<NySegmented v-model="view" :options="options" disabled />`

const codeNumber = `const month = ref(2)

const options = [
  { label: '一月', value: 1 },
  { label: '二月', value: 2 },
  { label: '三月', value: 3 },
]

<!-- value 可以是数字, model 类型是 string | number -->
<NySegmented v-model="month" :options="options" @change="onChange" />`

const apiProps = [
  { name: 'options', desc: '选项数据, 每项支持 label / value / icon / disabled', type: 'NyOption[]', default: '[]' },
  { name: 'size', desc: '尺寸档位', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'block', desc: '等分宽度撑满父容器', type: 'boolean', default: 'false' },
  { name: 'disabled', desc: '整组禁用, 键盘与鼠标都不响应', type: 'boolean', default: 'false' },
  { name: 'v-model', desc: '当前选中的 option.value, 双向绑定; 类型与 value 一致', type: 'string | number', default: 'undefined' },
]

const apiEvents = [
  { name: 'change', desc: '选中项变化时触发, 携带新值', type: 'string | number' },
]
</script>

<template>
  <DocPage title="Segmented 分段控制器" desc="轻量的单选切换, 带滑动指示块">

    <DemoBlock
      title="基础用法"
      desc="单选但外观像按钮组, 选中态由背后的滑块负责。"
      :code="codeBasic"
      :value="`当前选中: ${view} (${viewLabel})`"
    >
      <NySegmented v-model="view" :options="viewOptions" />
    </DemoBlock>

    <DemoBlock
      title="带图标"
      desc="option.icon 走 NyIcon, 与文字一起居中排布。"
      :code="codeIcon"
      :value="`当前选中: ${iconView}`"
    >
      <NySegmented v-model="iconView" :options="iconOptions" />
    </DemoBlock>

    <DemoBlock
      title="等分宽度"
      desc="block 打开后每个选项等宽撑满父容器, 适合放在筛选条里。"
      :code="codeBlock"
      :value="`当前选中: ${blockView} (${blockLabel})`"
    >
      <div class="ex-box">
        <NySegmented v-model="blockView" :options="blockOptions" block />
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸"
      desc="sm / md / lg 三档, 只改控件高度与字号。"
      :code="codeSize"
      :value="`当前选中: ${sizeView} (${sizeLabel})`"
    >
      <NySpace direction="vertical" align="start">
        <NySegmented v-model="sizeView" :options="sizeOptions" size="sm" />
        <NySegmented v-model="sizeView" :options="sizeOptions" />
        <NySegmented v-model="sizeView" :options="sizeOptions" size="lg" />
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="禁用"
      desc="单项禁用鼠标与方向键都会跳过, 整组禁用时整个控件不可操作。"
      :code="codeDisabled"
      :value="`单项禁用的当前值: ${limitedView} · 整组禁用保持 ${frozenView}`"
    >
      <NySpace direction="vertical" align="start">
        <NySegmented v-model="limitedView" :options="limitedOptions" />
        <NySegmented v-model="frozenView" :options="frozenOptions" disabled />
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="数值型选项"
      desc="value 可以是数字, 模型类型是 string | number, change 里拿到的是同一个值。"
      :code="codeNumber"
      :value="`当前选中: ${monthValue} · 最近一次 change: ${lastChange}`"
    >
      <NySegmented v-model="monthValue" :options="monthOptions" @change="onChange" />
    </DemoBlock>

    <template #api>
      <NySpace direction="vertical" align="start" size="lg" block>
        <ApiTable title="NySegmented Props" :rows="apiProps" />
        <ApiTable title="NySegmented 事件" kind="events" :rows="apiEvents" />
      </NySpace>

      <p class="ex-note">没有插槽: 选项文案与图标由 options 描述, 尺寸与禁用走 props。</p>
    </template>
  </DocPage>
</template>
