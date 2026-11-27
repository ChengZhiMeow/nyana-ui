<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyDescriptions, NyIcon, NyTag } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NyStatus } from '@chengzhimeow/nyana-ui'

const items = [
  { label: '订单号', value: 'NY-20240512-008' },
  { label: '客户', value: '林清' },
  { label: '金额', value: '¥ 1,280.00' },
  { label: '状态', value: '待发货' },
  { label: '下单时间', value: '2024-05-12 14:26' },
  { label: '配送方式', value: '顺丰标快' },
]

const spanItems = [
  { label: '订单号', value: 'NY-20240512-008' },
  { label: '状态', value: '待发货' },
  { label: '收货地址', value: '浙江省杭州市西湖区同人广场 3 幢 12 层', span: 2 },
  { label: '备注', value: '工作日 9:00 - 18:00 送达' },
]

const column = ref(3)
const COLUMNS = [2, 3, 4]
const columnInfo = computed(() => `column = ${column.value}, 条目 ${items.length} 条`)

const statusMap: Record<string, NyStatus> = {
  待发货: 'warning',
  已签收: 'success',
  已取消: 'danger',
}

const codeBasic = `const items = [
  { label: '订单号', value: 'NY-20240512-008' },
  { label: '客户', value: '林清' },
  { label: '金额', value: '¥ 1,280.00' },
  { label: '状态', value: '待发货' },
  { label: '下单时间', value: '2024-05-12 14:26' },
  { label: '配送方式', value: '顺丰标快' },
]

<NyDescriptions :items="items" :column="3" />`

const codeBordered = `const spanItems = [
  { label: '订单号', value: 'NY-20240512-008' },
  { label: '状态', value: '待发货' },
  { label: '收货地址', value: '浙江省杭州市西湖区同人广场 3 幢 12 层', span: 2 },
]

<NyDescriptions :items="spanItems" :column="3" bordered />`

const codeColumn = `const column = ref(3)

<div class="ex-group">
  <NyButton
    v-for="value in [2, 3, 4]"
    :key="value"
    size="sm"
    :variant="column === value ? 'primary' : 'default'"
    @click="column = value"
  >
    {{ value }} 列
  </NyButton>
</div>

<NyDescriptions :items="items" :column="column" bordered />`

const codeLayout = `const items = [
  { label: '订单号', value: 'NY-20240512-008' },
  { label: '客户', value: '林清' },
]

<NyDescriptions :items="items" :column="2" label-width="96px" bordered />
<NyDescriptions :items="items" :column="2" layout="vertical" />`

const codeSize = `<NyDescriptions :items="items.slice(0, 2)" :column="2" size="sm" />
<NyDescriptions :items="items.slice(0, 2)" :column="2" size="lg" />`

const codeSlots = `const statusMap: Record<string, NyStatus> = { 待发货: 'warning', 已签收: 'success' }

<NyDescriptions :items="items" :column="3" title="订单详情" bordered>
  <template #label="{ item }">
    <NyIcon name="info" :size="12" />
    {{ item.label }}
  </template>

  <template #value="{ item }">
    <NyTag v-if="statusMap[String(item.value)]" :status="statusMap[String(item.value)]">
      {{ item.value }}
    </NyTag>
    <span v-else>{{ item.value }}</span>
  </template>

  <NyButton size="sm" variant="text">编辑</NyButton>
</NyDescriptions>`

const apiProps = [
  { name: 'items', desc: '条目数组, 每项是 label / value / span', type: '{ label: string; value?: string | number; span?: number }[]', default: '—' },
  { name: 'column', desc: '每行几列, 窄屏自动降到 2 列再到 1 列', type: 'number', default: '3' },
  { name: 'bordered', desc: '画 1px 网格线, 关掉时只有标签与值', type: 'boolean', default: 'false' },
  { name: 'size', desc: '字号档位', type: 'NySize', default: "'md'" },
  { name: 'layout', desc: 'horizontal 标签与值同排, vertical 上下排', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
  { name: 'labelWidth', desc: '固定标签宽度, 只在 horizontal 下生效', type: 'string | number', default: "''" },
  { name: 'title', desc: '标题文字, 与默认插槽的操作区同排', type: 'string', default: "''" },
]

const apiSlots = [
  { name: 'default', desc: '标题右侧的操作区, 给了才渲染' },
  { name: 'label', desc: '自定义标签, 作用域参数 { item }' },
  { name: 'value', desc: '自定义值, 作用域参数 { item, index }' },
]
</script>

<template>
  <DocPage title="Descriptions 描述列表" desc="键值对形式的详情展示">

    <DemoBlock title="基础用法" desc="items 给数据, column 定列数。" :code="codeBasic">
      <NyDescriptions :items="items" :column="3" />
    </DemoBlock>

    <DemoBlock
      title="带边框与跨列"
      desc="bordered 画出网格线, span 让一格横跨多列。"
      :code="codeBordered"
      backdrop="muted"
    >
      <NyDescriptions :items="spanItems" :column="3" bordered />
    </DemoBlock>

    <DemoBlock
      title="列数切换"
      desc="column 是响应式的, 改完立刻重新铺排。"
      :code="codeColumn"
      :value="columnInfo"
    >
      <div class="ex-group">
        <NyButton
          v-for="value in COLUMNS"
          :key="value"
          size="sm"
          :variant="column === value ? 'primary' : 'default'"
          @click="column = value"
        >
          {{ value }} 列
        </NyButton>
      </div>

      <NyDescriptions :items="items" :column="column" bordered />
    </DemoBlock>

    <DemoBlock
      title="布局与标签宽度"
      desc="horizontal 紧凑, vertical 适合字段名较长或值是多行的场景。"
      :code="codeLayout"
    >
      <NyDescriptions :items="items.slice(0, 2)" :column="2" label-width="96px" bordered />

      <NyDescriptions :items="items.slice(0, 2)" :column="2" layout="vertical" />
    </DemoBlock>

    <DemoBlock title="尺寸" desc="字号档位, 用在紧凑的卡片里选 sm。" :code="codeSize">
      <NyDescriptions :items="items.slice(0, 2)" :column="2" size="sm" />
      <NyDescriptions :items="items.slice(0, 2)" :column="2" size="lg" />
    </DemoBlock>

    <DemoBlock
      title="标题, 操作区与自定义插槽"
      desc="title 与默认插槽同排, label / value 插槽能换掉任意一格。"
      :code="codeSlots"
    >
      <NyDescriptions :items="items" :column="3" title="订单详情" bordered>
        <template #label="{ item }">
          <NyIcon name="info" :size="12" />
          {{ item.label }}
        </template>

        <template #value="{ item }">
          <NyTag v-if="statusMap[String(item.value)]" :status="statusMap[String(item.value)]">
            {{ item.value }}
          </NyTag>

          <span v-else>{{ item.value }}</span>
        </template>

        <NyButton size="sm" variant="text">编辑</NyButton>
      </NyDescriptions>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyDescriptions Props" :rows="apiProps" />
      <ApiTable title="NyDescriptions 插槽" kind="slots" compact :rows="apiSlots" />
    </template>
  </DocPage>
</template>
