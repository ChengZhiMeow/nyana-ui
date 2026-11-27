<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyTimePicker } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

function isDisabledTime(time: string) {
  const [hour] = time.split(':')

  return Number(hour) < 9
}

const basic = ref('09:30')
const full = ref('')
const stepped = ref('')
const restricted = ref('')
const sized = ref('')
const soft = ref('')
const empty = ref('')
const rejected = ref('')
const disabledValue = ref('18:00')
const readonlyValue = ref('12:00')
const events = ref('')
const lastEvent = ref('—')
const methodValue = ref('')

const methodRef = ref<InstanceType<typeof NyTimePicker> | null>(null)

function onChange(value: string | null) {
  events.value = value ?? ''
  lastEvent.value = `change: ${value ?? 'null'}`
}

const codeBasic = `<NyTimePicker v-model="basic" />`

const codeFormat = `<NyTimePicker v-model="full" format="HH:mm:ss" />

<!-- 步进控制分钟与秒的可选值 -->
<NyTimePicker v-model="stepped" format="HH:mm:ss" :minute-step="15" :second-step="30" />`

const codeDisabledTime = `<NyTimePicker v-model="restricted" :disabled-time="isDisabledTime" placeholder="9 点前不可选" />

// isDisabledTime 收到的是补全后的时间串, 返回 true 的候选不可点
function isDisabledTime(time: string) {
  const [hour] = time.split(':')

  return Number(hour) < 9
}`

const codeState = `<NyTimePicker v-model="sized" size="sm" />
<NyTimePicker v-model="sized" size="lg" />
<NyTimePicker v-model="soft" variant="soft" />
<NyTimePicker v-model="empty" placeholder="请选择时间" />
<NyTimePicker v-model="rejected" invalid />
<NyTimePicker v-model="disabledValue" disabled />
<NyTimePicker v-model="readonlyValue" readonly />`

const codeEvents = `<NyTimePicker v-model="events" @change="onChange" @clear="lastEvent = 'clear'" />

<NyTimePicker v-model="soft" placement="top-start" :max-height="140" />`

const codeMethods = `<NyTimePicker ref="methodRef" v-model="methodValue" />

<NyButton size="sm" @click="methodRef?.focus()">focus()</NyButton>
<NyButton size="sm" @click="methodRef?.open()">open()</NyButton>
<NyButton size="sm" @click="methodRef?.close()">close()</NyButton>
<NyButton size="sm" @click="methodRef?.clear()">clear()</NyButton>`

const apiProps = [
  { name: 'v-model', desc: '当前时间, 未选是空串', type: 'string', default: "''" },
  { name: 'format', desc: '时间格式, 决定面板出现几列', type: "'HH:mm' | 'HH:mm:ss'", default: "'HH:mm'" },
  { name: 'minuteStep', desc: '分钟列的步进', type: 'number', default: '1' },
  { name: 'secondStep', desc: '秒列的步进', type: 'number', default: '1' },
  { name: 'disabledTime', desc: '命中即禁用的时刻, 参数是补全后的时间串', type: '(time: string) => boolean', default: '—' },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读, 不能展开面板', type: 'boolean', default: 'false' },
  { name: 'invalid', desc: '校验失败态由使用方决定', type: 'boolean', default: 'false' },
  { name: 'clearable', desc: '有值时显示清空按钮', type: 'boolean', default: 'true' },
  { name: 'placeholder', desc: '未选择时的占位文案', type: 'string', default: "'请选择时间'" },
  { name: 'placement', desc: '面板相对触发器的位置', type: 'NyPlacement', default: "'bottom-start'" },
  { name: 'maxHeight', desc: '每列的最大高度, 超出滚动', type: 'number', default: '220' },
]

const apiEvents = [
  { name: 'change', desc: '时间变化, 清空时为 null', type: 'string | null' },
  { name: 'clear', desc: '点击清空按钮', type: '—' },
]

const apiMethods = [
  { name: 'focus', desc: '让触发器获得焦点', type: 'void' },
  { name: 'open', desc: '展开面板, 禁用与只读时不生效', type: 'void' },
  { name: 'close', desc: '收起面板, 不写入未选全的时间', type: 'void' },
  { name: 'clear', desc: '清空时间并触发 change(null) 与 clear', type: 'void' },
]
</script>

<template>
  <DocPage title="TimePicker 时间选择" desc="时分秒滚动列表, 支持步进与禁用时刻">

    <DemoBlock
      title="基础用法"
      desc="点某一列就更新对应段, 选完最后一列自动收起面板; 顶部一行显示当前选择, 右边是「现在」按钮。"
      :code="codeBasic"
      :value="`当前值: ${basic || '空'}`"
    >
      <NyTimePicker v-model="basic" />
    </DemoBlock>

    <DemoBlock
      title="秒级格式与步进"
      desc="format 为 HH:mm:ss 时出现秒列; minuteStep 与 secondStep 决定每列的可选值。"
      :code="codeFormat"
      :value="`时分秒: ${full || '空'} | 步进: ${stepped || '空'}`"
    >
      <div class="ex-group">
        <NyTimePicker v-model="full" format="HH:mm:ss" />
        <NyTimePicker v-model="stepped" format="HH:mm:ss" :minute-step="15" :second-step="30" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="禁用时刻"
      desc="disabledTime 收到的是补全后的完整时间串, 返回 true 的候选不可点, 键盘上下键也会跳过。"
      :code="codeDisabledTime"
      :value="`当前值: ${restricted || '空'}`"
    >
      <NyTimePicker v-model="restricted" :disabled-time="isDisabledTime" placeholder="9 点前不可选" />
    </DemoBlock>

    <DemoBlock
      title="尺寸, 外观与各种状态"
      desc="尺寸与描边和 NyInput 一致; readonly 打不开面板, disabled 连清空按钮都不出现。"
      :code="codeState"
      :value="`sm/lg: ${sized || '空'} | soft: ${soft || '空'} | 空态: ${empty || '空'} | invalid: ${rejected || '空'}`"
    >
      <div class="ex-group">
        <NyTimePicker v-model="sized" size="sm" />
        <NyTimePicker v-model="sized" size="lg" />
        <NyTimePicker v-model="soft" variant="soft" />
        <NyTimePicker v-model="empty" placeholder="请选择时间" />
        <NyTimePicker v-model="rejected" invalid />
        <NyTimePicker v-model="disabledValue" disabled />
        <NyTimePicker v-model="readonlyValue" readonly />
      </div>
    </DemoBlock>

    <DemoBlock
      title="事件与面板参数"
      desc="change 抛出时间串, 清空时为 null 并额外抛 clear; placement 与 maxHeight 控制面板的位置和每列高度。"
      :code="codeEvents"
      :value="`当前值: ${events || '空'} | 最近事件: ${lastEvent}`"
    >
      <div class="ex-group">
        <NyTimePicker v-model="events" @change="onChange" @clear="lastEvent = 'clear'" />
        <NyTimePicker v-model="soft" placement="top-start" :max-height="140" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="调用组件方法"
      desc="通过 ref 调用 focus / open / close / clear, 用于外部按钮驱动面板。"
      :code="codeMethods"
      :value="`当前值: ${methodValue || '空'}`"
    >
      <div class="ex-group">
        <NyTimePicker ref="methodRef" v-model="methodValue" />

        <NyButton size="sm" @click="methodRef?.focus()">focus()</NyButton>
        <NyButton size="sm" @click="methodRef?.open()">open()</NyButton>
        <NyButton size="sm" @click="methodRef?.close()">close()</NyButton>
        <NyButton size="sm" @click="methodRef?.clear()">clear()</NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTimePicker Props" :rows="apiProps" />
      <ApiTable title="NyTimePicker 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyTimePicker 方法 (ref)" kind="methods" :rows="apiMethods" />
    </template>
  </DocPage>
</template>
