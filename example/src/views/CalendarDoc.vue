<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyCalendar, NyTag } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NyStatus } from '@chengzhimeow/nyana-ui'

const basic = ref('')
const marked = ref('')
const limited = ref('')
const plain = ref('')
const bare = ref('')
const yearView = ref('')
const custom = ref('')

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

const todayText = toText(new Date())

const events: Record<string, { text: string; status?: NyStatus }[]> = {
  [todayText]: [
    { text: '站会 10:00', status: 'info' },
    { text: '设计评审', status: 'warning' },
  ],
  [shift(2)]: [{ text: '版本发布', status: 'success' }],
  [shift(-3)]: [
    { text: '季度复盘', status: 'danger' },
    { text: '团建', status: 'primary' },
    { text: '补周报' },
  ],
}

const eventDays = Object.keys(events).length

function isWeekend(date: string) {
  const day = new Date(`${date}T00:00:00`).getDay()

  return day === 0 || day === 6
}

const codeBasic = `<NyCalendar v-model="basic" />

const basic = ref('')`

const codeEvents = `<NyCalendar v-model="marked" :events="events" />

const todayText = toText(new Date())

const events: Record<string, { text: string; status?: NyStatus }[]> = {
  [todayText]: [
    { text: '站会 10:00', status: 'info' },
    { text: '设计评审', status: 'warning' },
  ],
  [shift(2)]: [{ text: '版本发布', status: 'success' }],
  [shift(-3)]: [
    { text: '季度复盘', status: 'danger' },
    { text: '团建', status: 'primary' },
    { text: '补周报' },
  ],
}`

const codeDisabled = `<NyCalendar v-model="limited" :disabled-date="isWeekend" />

function isWeekend(date: string) {
  const day = new Date(date + 'T00:00:00').getDay()

  return day === 0 || day === 6
}`

const codeCompact = `<NyCalendar v-model="plain" :fullscreen="false" />
<NyCalendar v-model="bare" :fullscreen="false" :show-today="false" />`

const codeYear = `<NyCalendar v-model="yearView" mode="year" />`

const codeCustom = `<NyCalendar v-model="custom">
  <template #header="{ year, month, prev, next, today }">
    <div class="ex-group">
      <NyButton size="sm" @click="prev">上一月</NyButton>
      <span class="ex-value">{{ year }} 年 {{ month }} 月</span>
      <NyButton size="sm" @click="next">下一月</NyButton>
      <NyButton size="sm" variant="text" @click="today">今天</NyButton>
    </div>
  </template>

  <template #cell="{ date, today, selected }">
    <span>{{ Number(date.slice(8)) }}</span>
    <NyTag v-if="today" size="sm" :status="selected ? 'default' : 'primary'">今天</NyTag>
  </template>
</NyCalendar>`

const apiProps = [
  { name: 'v-model', desc: "选中日期, 格式 'YYYY-MM-DD'", type: 'string', default: "''" },
  { name: 'mode', desc: '初始视图, year 先展示 12 个月份块', type: "'month' | 'year'", default: "'month'" },
  {
    name: 'events',
    desc: '按日期挂日程, 一格最多铺两条, 再多折成 +N',
    type: 'Record<string, { text: string; status?: NyStatus }[]>',
    default: '{}',
  },
  {
    name: 'disabledDate',
    desc: '逐日判断是否禁用',
    type: '(date: string) => boolean',
    default: '—',
  },
  { name: 'weekStart', desc: '一周的第一天, 1 表示周一开头', type: '0 | 1', default: '1' },
  { name: 'fullscreen', desc: '通栏大日历, 关掉后是小卡片', type: 'boolean', default: 'true' },
  { name: 'showToday', desc: '是否显示"今天"按钮', type: 'boolean', default: 'true' },
]

const apiEvents = [
  { name: 'select', desc: '点击或键盘选中某一天后触发', type: '(date: string) => void' },
  {
    name: 'panelChange',
    desc: '视图的年月变化时触发, 翻月与跳转都算',
    type: '(payload: { year: number; month: number }) => void',
  },
]

const apiSlots = [
  {
    name: 'cell',
    desc: '自定义日期单元格, 给了就不再渲染默认的天数与日程',
    type: '{ date: string; day: number; inMonth: boolean; disabled: boolean; today: boolean; selected: boolean; events: { text: string; status?: NyStatus }[] }',
  },
  { name: 'dateCell', desc: 'cell 的等价别名, 两者写一个即可', type: '同 cell' },
  {
    name: 'header',
    desc: '自定义头部, 顶替默认的年月与翻页按钮',
    type: '{ year: number; month: number; prev: () => void; next: () => void; today: () => void }',
  },
]
</script>

<template>
  <DocPage title="Calendar 日历" desc="月视图日历, 支持事件与单元格自定义。">

    <DemoBlock
      title="基础用法"
      desc="v-model 绑的是 'YYYY-MM-DD' 文本; 今天描边, 选中的一天是实底。"
      :code="codeBasic"
      :value="`选中: ${basic || '未选择'} | 今天: ${todayText}`"
    >
      <NyCalendar v-model="basic" />
    </DemoBlock>

    <DemoBlock
      title="事件标记"
      desc="events 的键就是日期, 每格最多铺两条, 超出折成 +N; 状态色决定小点颜色。"
      :code="codeEvents"
      :value="`选中: ${marked || '未选择'} | 标记了 ${eventDays} 天`"
    >
      <NyCalendar v-model="marked" :events="events" />
    </DemoBlock>

    <DemoBlock
      title="禁用日期"
      desc="disabledDate 逐日判断, 这里把周六与周日禁掉, 命中后点击与键盘都不会选中。"
      :code="codeDisabled"
      :value="`选中: ${limited || '未选择'}`"
    >
      <NyCalendar v-model="limited" :disabled-date="isWeekend" />
    </DemoBlock>

    <DemoBlock
      title="小卡片与今天按钮"
      desc="fullscreen 关掉后是紧凑的小卡片, showToday 控制头部有没有今天按钮。"
      :code="codeCompact"
      :value="`带今天按钮: ${plain || '未选择'} | 不带今天按钮: ${bare || '未选择'}`"
    >
      <div class="ex-group">
        <NyCalendar v-model="plain" :fullscreen="false" />
        <NyCalendar v-model="bare" :fullscreen="false" :show-today="false" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="年视图"
      desc="mode 设为 year 时先看 12 个月份块, 点任意一个进入月视图; 也可以点标题里的年份来回切。"
      :code="codeYear"
      :value="`选中: ${yearView || '未选择'}`"
    >
      <NyCalendar v-model="yearView" mode="year" />
    </DemoBlock>

    <DemoBlock
      title="自定义表头与单元格"
      desc="header 顶替默认头部, cell 接手单元格内容, 插槽参数里带着这一天需要的全部信息。"
      :code="codeCustom"
      :value="`选中: ${custom || '未选择'}`"
    >
      <NyCalendar v-model="custom">
        <template #header="{ year, month, prev, next, today }">
          <div class="ex-group">
            <NyButton size="sm" @click="prev">上一月</NyButton>
            <span class="ex-value">{{ year }} 年 {{ month }} 月</span>
            <NyButton size="sm" @click="next">下一月</NyButton>
            <NyButton size="sm" variant="text" @click="today">今天</NyButton>
          </div>
        </template>

        <template #cell="{ date, today, selected }">
          <span>{{ Number(date.slice(8)) }}</span>
          <NyTag v-if="today" size="sm" :status="selected ? 'default' : 'primary'">今天</NyTag>
        </template>
      </NyCalendar>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyCalendar Props" :rows="apiProps" />
      <ApiTable title="NyCalendar 事件" :rows="apiEvents" kind="events" />
      <ApiTable title="NyCalendar 插槽" :rows="apiSlots" kind="slots" />
    </template>
  </DocPage>
</template>
