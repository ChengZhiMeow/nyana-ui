<script setup lang="ts">
import { ref } from 'vue'

import { NySlider } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const single = ref<number | [number, number]>(40)
const ranged = ref<number | [number, number]>([20, 60])
const marked = ref<number | [number, number]>(30)
const withInput = ref<number | [number, number]>(64)
const stepped = ref<number | [number, number]>(20)
const vertical = ref<number | [number, number]>(70)
const disabled = ref<number | [number, number]>(50)

const marks: Record<number, string> = {
  0: '0°C',
  30: '30°C',
  70: '70°C',
  100: '100°C',
}

function textOf(value: number | [number, number]) {
  return Array.isArray(value) ? `${value[0]} - ${value[1]}` : String(value)
}

const codeBasic = '<NySlider v-model="single" :min="0" :max="100" />'

const codeRange = '<NySlider v-model="ranged" range />'

const codeMarks = `<NySlider v-model="marked" :marks="marks" />

const marks = {
  0: '0°C',
  30: '30°C',
  70: '70°C',
  100: '100°C',
}`

const codeInput = '<NySlider v-model="withInput" show-input />'

const codeStep = '<NySlider v-model="stepped" :step="10" />'

const codeVertical = `<NySlider v-model="vertical" vertical />

<NySlider v-model="disabled" disabled />`

const apiProps = [
  { name: 'v-model', desc: '当前值, range 模式下是 [低, 高]', type: 'number | [number, number]', default: 'undefined' },
  { name: 'min', desc: '最小值', type: 'number', default: '0' },
  { name: 'max', desc: '最大值', type: 'number', default: '100' },
  { name: 'step', desc: '步长, 值会先对齐到这个网格', type: 'number', default: '1' },
  { name: 'range', desc: '双滑块区间模式', type: 'boolean', default: 'false' },
  { name: 'vertical', desc: '纵向排列, 进度从下往上长', type: 'boolean', default: 'false' },
  { name: 'showTooltip', desc: '拖动或悬停时显示当前值气泡', type: 'boolean', default: 'true' },
  { name: 'showInput', desc: '右侧数字输入框, 直接编辑精确值', type: 'boolean', default: 'false' },
  { name: 'marks', desc: '刻度文案, 键是刻度值', type: 'Record<number, string>', default: '{}' },
  { name: 'disabled', desc: '禁用, 拖动与键盘调值都停用', type: 'boolean', default: 'false' },
  { name: 'label', desc: '字段标题, 显示在滑块上方', type: 'string', default: "''" },
  { name: 'hint', desc: '滑块下方的提示文本', type: 'string', default: "''" },
]

const apiEvents = [
  {
    name: 'change',
    desc: '拖动, 点击轨道或键盘调值后触发',
    type: '(value: number | [number, number]) => void',
  },
]
</script>

<template>
  <DocPage title="Slider 滑动输入条" desc="单值与区间滑动, 支持刻度。">

    <DemoBlock
      title="基础用法"
      desc="一个手柄, 值是一个数字。"
      :code="codeBasic"
      :value="`当前: ${textOf(single)}`"
    >
      <NySlider v-model="single" :min="0" :max="100" />
    </DemoBlock>

    <DemoBlock
      title="区间"
      desc="range 模式有两个手柄, 两个手柄不会交叉。"
      :code="codeRange"
      :value="`区间: ${textOf(ranged)}`"
    >
      <NySlider v-model="ranged" range />
    </DemoBlock>

    <DemoBlock
      title="刻度"
      desc="marks 的键是刻度值, 值是要显示的文案。"
      :code="codeMarks"
      :value="`当前: ${textOf(marked)}`"
    >
      <NySlider v-model="marked" :marks="marks" />
    </DemoBlock>

    <DemoBlock
      title="数字输入框"
      desc="showInput 在右侧配一个输入框, 便于精确到个位。"
      :code="codeInput"
      :value="`当前: ${textOf(withInput)}`"
    >
      <NySlider v-model="withInput" show-input />
    </DemoBlock>

    <DemoBlock
      title="步进"
      desc="step 决定拖动的粒度, 键盘方向键也按这个粒度走。"
      :code="codeStep"
      :value="`当前: ${textOf(stepped)}`"
    >
      <NySlider v-model="stepped" :step="10" />
    </DemoBlock>

    <DemoBlock
      title="纵向与禁用"
      desc="纵向滑块高度固定 200px, 禁用后不响应拖动与键盘。"
      :code="codeVertical"
      :value="`纵向: ${textOf(vertical)} | 禁用: ${textOf(disabled)}`"
    >
      <div class="ex-group">
        <NySlider v-model="vertical" vertical />

        <div class="ex-box">纵向滑块</div>
      </div>

      <p class="ex-note">禁用后手柄仍在, 但不再响应交互。</p>

      <NySlider v-model="disabled" disabled />
    </DemoBlock>

    <template #api>
      <ApiTable title="NySlider Props" :rows="apiProps" />
      <ApiTable title="NySlider 事件" :rows="apiEvents" kind="events" />
    </template>
  </DocPage>
</template>
