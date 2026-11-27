<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyIcon, NyTransfer } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

interface TransferItem {
  key: string
  title: string
  desc?: string
  disabled?: boolean
}

const members: TransferItem[] = [
  { key: 'lin', title: '林晚', desc: '前端' },
  { key: 'zhou', title: '周叙', desc: '后端' },
  { key: 'chen', title: '陈屿', desc: '设计' },
  { key: 'su', title: '苏念', desc: '测试' },
  { key: 'he', title: '何洲', desc: '运维' },
  { key: 'gu', title: '顾青', desc: '产品' },
  { key: 'qin', title: '秦昭', desc: '已离职, 不可搬运', disabled: true },
]

function list(keys: string[]) {
  return keys.length ? keys.join(', ') : '无'
}

const targetKeys = ref<string[]>(['lin', 'zhou'])
const basicText = computed(() => `已选 ${targetKeys.value.length} 项: ${list(targetKeys.value)}`)

const titledKeys = ref<string[]>([])
const titledText = computed(() => `已选 ${titledKeys.value.length} 项: ${list(titledKeys.value)}`)

const oneWayKeys = ref<string[]>([])
const oneWayText = computed(() => `项目成员 ${oneWayKeys.value.length} 人: ${list(oneWayKeys.value)}`)

const eventKeys = ref<string[]>([])
const lastSearch = ref('')
const lastChange = ref('')

function onTransferSearch(payload: { direction: 'left' | 'right'; value: string }) {
  lastSearch.value = `${payload.direction === 'left' ? '左栏' : '右栏'}: ${payload.value || '空'}`
}

function onTransferChange(payload: { keys: string[]; direction: 'left' | 'right'; movedKeys: string[] }) {
  lastChange.value = `${payload.direction === 'right' ? '移入' : '移出'} ${payload.movedKeys.join(', ')}`
}

const eventText = computed(() => `搜索: ${lastSearch.value || '—'} | 最近搬运: ${lastChange.value || '—'}`)

const customKeys = ref<string[]>([])
const customText = computed(() => `已选 ${customKeys.value.length} 项: ${list(customKeys.value)}`)

const codeBasic = `<NyTransfer v-model:targetKeys="targetKeys" :data="members" />`

const codeTitled = `<NyTransfer
  v-model:targetKeys="titledKeys"
  :data="members"
  :titles="['候选成员', '已选成员']"
  :operation-texts="['加入右侧', '退回左侧']"
  :max-height="200"
/>`

const codeOneWay = `<NyTransfer
  v-model:targetKeys="oneWayKeys"
  :data="members"
  one-way
  :titles="['全部成员', '项目成员']"
  :operation-texts="['加入', '']"
/>`

const codeEvents = `<NyTransfer
  v-model:targetKeys="eventKeys"
  :data="members"
  @search="onTransferSearch"
  @change="onTransferChange"
/>`

const codeCustom = `<NyTransfer
  v-model:targetKeys="customKeys"
  :data="members"
  :titles="['候选人', '团队成员']"
>
  <template #item="{ item }">
    <span class="ex-group">
      <NyIcon name="user" :size="14" />
      <span>{{ item.title }}</span>
    </span>
  </template>

  <template #empty="{ direction }">
    {{ direction === 'right' ? '还没有选人' : '候选人都选完了' }}
  </template>
</NyTransfer>`

const apiProps = [
  { name: 'data', desc: '全部数据, 左栏是没被 targetKeys 命中的部分, 右栏是命中的部分; 字段见下一张表', type: 'TransferItem[]', default: '—' },
  { name: 'titles', desc: '左栏与右栏的标题', type: '[string, string]', default: "['待选列表', '已选列表']" },
  { name: 'showSearch', desc: '两栏顶部各带一个搜索框, 按 title 与 desc 过滤', type: 'boolean', default: 'true' },
  { name: 'disabled', desc: '整体禁用, 列表不可点, 按钮不可用', type: 'boolean', default: 'false' },
  { name: 'oneWay', desc: '单向搬运, 只能移入不能移出', type: 'boolean', default: 'false' },
  { name: 'operationTexts', desc: '中间两个按钮的文案, 传空串即只显示图标', type: '[string, string]', default: "['移入', '移出']" },
  { name: 'maxHeight', desc: '列表区最大高度, 超出滚动, 两栏高度一致', type: 'number', default: '320' },
  { name: 'emptyText', desc: '左栏与右栏空数据时的文案', type: '[string, string]', default: "['暂无数据', '暂无数据']" },
  { name: 'v-model:targetKeys', desc: '已搬运过去的项 key 列表', type: 'string[]', default: '[]' },
]

const apiEvents = [
  { name: 'change', desc: '完成一次搬运后触发, keys 是搬运后的完整列表', type: "{ keys: string[]; direction: 'right' | 'left'; movedKeys: string[] }" },
  { name: 'search', desc: '任一栏的搜索框输入变化时触发', type: "{ direction: 'left' | 'right'; value: string }" },
]

const apiSlots = [
  { name: 'item', desc: '自定义条目的内容, 复选框与选中态仍由组件渲染', type: '{ item: TransferItem; direction: \'left\' | \'right\'; checked: boolean }' },
  { name: 'empty', desc: '自定义空栏内容, 顶替 emptyText', type: "{ direction: 'left' | 'right' }" },
]

const apiItem = [
  { name: 'key', desc: '唯一标识, targetKeys 里存的就是它', type: 'string' },
  { name: 'title', desc: '条目主文案, 搜索时参与匹配', type: 'string' },
  { name: 'desc', desc: '条目下方的补充说明, 同样参与搜索匹配', type: 'string' },
  { name: 'disabled', desc: '禁用项不可勾选也不可搬运, 不参与全选', type: 'boolean' },
]
</script>

<template>
  <DocPage title="Transfer 穿梭框" desc="两栏之间来回搬运待选项">

    <DemoBlock
      title="基础用法"
      desc="data 是全部数据, 组件按 targetKeys 分成两栏; 点条目或复选框选中, 中间按钮批量搬运, 表头的复选框支持全选。"
      :code="codeBasic"
      :value="basicText"
    >
      <NyTransfer v-model:targetKeys="targetKeys" :data="members" />

      <p class="ex-note">秦昭是禁用项: 可以看见, 但勾不上也搬不动。</p>
    </DemoBlock>

    <DemoBlock
      title="标题与按钮文案"
      desc="titles 改两栏标题, operationTexts 改按钮文案, maxHeight 控制列表区的滚动高度, 两栏高度始终一致。"
      :code="codeTitled"
      :value="titledText"
    >
      <NyTransfer
        v-model:targetKeys="titledKeys"
        :data="members"
        :titles="['候选成员', '已选成员']"
        :operation-texts="['加入右侧', '退回左侧']"
        :max-height="200"
      />
    </DemoBlock>

    <DemoBlock
      title="单向搬运"
      desc="oneWay 只能从待选搬进已选, 左移按钮恒定不可用; 按钮文案传空串时只显示图标。"
      :code="codeOneWay"
      :value="oneWayText"
    >
      <NyTransfer
        v-model:targetKeys="oneWayKeys"
        :data="members"
        one-way
        :titles="['全部成员', '项目成员']"
        :operation-texts="['加入', '']"
      />
    </DemoBlock>

    <DemoBlock
      title="搜索与事件"
      desc="两栏的搜索各管各的, showSearch 关闭后整块搜索区消失; change 会带回这次搬运的 key, 方便做后续请求。"
      :code="codeEvents"
      :value="eventText"
    >
      <NyTransfer
        v-model:targetKeys="eventKeys"
        :data="members"
        @search="onTransferSearch"
        @change="onTransferChange"
      />
    </DemoBlock>

    <DemoBlock
      title="自定义条目与空态"
      desc="item 插槽替换条目内容, 复选框与选中态仍由组件渲染; empty 插槽按 direction 分别接管两栏的空态。"
      :code="codeCustom"
      :value="customText"
    >
      <NyTransfer
        v-model:targetKeys="customKeys"
        :data="members"
        :titles="['候选人', '团队成员']"
      >
        <template #item="{ item }">
          <span class="ex-group">
            <NyIcon name="user" :size="14" />
            <span>{{ item.title }}</span>
          </span>
        </template>

        <template #empty="{ direction }">
          {{ direction === 'right' ? '还没有选人' : '候选人都选完了' }}
        </template>
      </NyTransfer>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTransfer Props" :rows="apiProps" />
      <ApiTable title="NyTransfer 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyTransfer 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable title="TransferItem 数据项字段" :rows="apiItem" />
    </template>
  </DocPage>
</template>
