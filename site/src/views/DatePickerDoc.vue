<script setup lang="ts">
import { ref } from 'vue'

import { NyDatePicker } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const date = ref<string | null>(null)
const limited = ref<string | null>(null)
const weekday = ref<string | null>(null)
const mondayFirst = ref<string | null>(null)
const sundayFirst = ref<string | null>(null)
const kept = ref<string | null>(null)
const compact = ref<string | null>(null)

function toText(target: Date) {
  const month = String(target.getMonth() + 1).padStart(2, '0')
  const day = String(target.getDate()).padStart(2, '0')

  return `${target.getFullYear()}-${month}-${day}`
}

function shift(days: number) {
  const target = new Date()

  target.setDate(target.getDate() + days)

  return toText(target)
}

const minDate = shift(-7)
const maxDate = shift(7)

function isWeekend(text: string) {
  const day = new Date(`${text}T00:00:00`).getDay()

  return day === 0 || day === 6
}

const codeBasic = `<NyDatePicker v-model="date" placeholder="请选择日期" />

const date = ref<string | null>(null)`

const codeRange = '<NyDatePicker v-model="limited" :min="minDate" :max="maxDate" />'

const codeDisabledDate = `<NyDatePicker v-model="weekday" :disabled-date="isWeekend" />

function isWeekend(text: string) {
  const day = new Date(text + 'T00:00:00').getDay()

  return day === 0 || day === 6
}`

const codeWeekStart = `<NyDatePicker v-model="mondayFirst" :week-start="1" />
<NyDatePicker v-model="sundayFirst" :week-start="0" />`

const codeSize = `<NyDatePicker v-model="kept" :clearable="false" />
<NyDatePicker v-model="compact" size="sm" placeholder="小号" />`

const apiProps = [
  { name: 'v-model', desc: "选中的日期, 格式 'YYYY-MM-DD'", type: 'string | null', default: 'null' },
  { name: 'min', desc: "最早可选日期, 'YYYY-MM-DD'", type: 'string', default: 'undefined' },
  { name: 'max', desc: "最晚可选日期, 'YYYY-MM-DD'", type: 'string', default: 'undefined' },
  {
    name: 'disabledDate',
    desc: '逐日判断是否禁用, 与 min / max 叠加生效',
    type: '(date: string) => boolean',
    default: 'undefined',
  },
  { name: 'weekStart', desc: '一周的第一天, 1 表示周一开头', type: '0 | 1', default: '1' },
  { name: 'clearable', desc: '显示清空按钮', type: 'boolean', default: 'true' },
  { name: 'size', desc: '尺寸档', type: 'NySize', default: "'md'" },
  { name: 'variant', desc: '输入框风格', type: 'NyVariant', default: "'outline'" },
  { name: 'placeholder', desc: '未选日期时的占位文案', type: 'string', default: "'请选择日期'" },
  { name: 'placement', desc: '日历面板相对触发器的位置', type: 'NyPlacement', default: "'bottom-start'" },
  { name: 'disabled', desc: '禁用, 面板不展开', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读, 可展开看日历但选不中', type: 'boolean', default: 'false' },
  { name: 'invalid', desc: '校验失败态, 只改描边与颜色', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'change', desc: '选中某一天后触发', type: '(value: string | null) => void' },
  { name: 'clear', desc: '点清空按钮后触发', type: '() => void' },
]

const apiMethods = [
  { name: 'focus', desc: '把焦点移到触发器上', type: '() => void' },
  { name: 'open', desc: '展开日历面板, 禁用与只读时无效', type: '() => void' },
  { name: 'close', desc: '收起面板, 传 true 时把焦点还给触发器', type: '(refocus?: boolean) => void' },
  { name: 'clear', desc: '清空选中值', type: '() => void' },
]
</script>

<template>
  <DocPage title="DatePicker 日期选择" desc="月视图日历, 支持区间与禁用规则。">

    <DemoBlock
      title="基础用法"
      desc="值固定是 'YYYY-MM-DD' 文本, 直接当字符串用。"
      :code="codeBasic"
      :value="`当前: ${date ?? '未选择'}`"
    >
      <NyDatePicker v-model="date" placeholder="请选择日期" />
    </DemoBlock>

    <DemoBlock
      title="可选区间"
      desc="min 与 max 之外的日子在面板里直接标为不可选, 这里取前后各七天。"
      :code="codeRange"
      :value="`可选范围: ${minDate} 至 ${maxDate}`"
    >
      <NyDatePicker v-model="limited" :min="minDate" :max="maxDate" placeholder="请选择日期" />
    </DemoBlock>

    <DemoBlock
      title="禁用日期"
      desc="disabledDate 逐日判断, 这里把周六与周日禁掉。"
      :code="codeDisabledDate"
      :value="`当前: ${weekday ?? '未选择'}`"
    >
      <NyDatePicker v-model="weekday" :disabled-date="isWeekend" placeholder="只能选工作日" />
    </DemoBlock>

    <DemoBlock
      title="一周的起始日"
      desc="weekStart 为 1 时周一排在第一列, 为 0 时周日排在第一列。"
      :code="codeWeekStart"
      :value="`周一开头: ${mondayFirst ?? '未选择'} | 周日开头: ${sundayFirst ?? '未选择'}`"
    >
      <div class="ex-group">
        <NyDatePicker v-model="mondayFirst" :week-start="1" placeholder="周一开头" />
        <NyDatePicker v-model="sundayFirst" :week-start="0" placeholder="周日开头" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="清空与尺寸"
      desc="clearable 关掉后没有清空按钮, size 决定触发器高度。"
      :code="codeSize"
      :value="`不可清空: ${kept ?? '未选择'} | 小号: ${compact ?? '未选择'}`"
    >
      <div class="ex-group">
        <NyDatePicker v-model="kept" :clearable="false" placeholder="不可清空" />
        <NyDatePicker v-model="compact" size="sm" placeholder="小号" />
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyDatePicker Props" :rows="apiProps" />
      <ApiTable title="NyDatePicker 事件" :rows="apiEvents" kind="events" />
      <ApiTable title="NyDatePicker 方法" :rows="apiMethods" kind="methods" />
    </template>
  </DocPage>
</template>
