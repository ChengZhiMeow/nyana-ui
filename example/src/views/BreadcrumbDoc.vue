<script setup lang="ts">
import { ref } from 'vue'

import { NyBreadcrumb, NySpace } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const basicItems = [
  { label: '首页', href: '#breadcrumb-basic' },
  { label: '组件', href: '#breadcrumb-basic' },
  { label: '导航', href: '#breadcrumb-basic' },
  { label: '面包屑' },
]

const iconItems = [
  { label: '工作台', href: '#breadcrumb-icon', icon: 'dashboard' },
  { label: '项目', href: '#breadcrumb-icon', icon: 'folder' },
  { label: '组件文档', icon: 'file' },
]

const plainItems = [
  { label: '全部订单', clickable: true },
  { label: '待付款', clickable: true },
  { label: '订单详情' },
]

const lastSelect = ref('还没有点击')

function onSelect(payload: { item: { label: string }; index: number }) {
  lastSelect.value = `第 ${payload.index + 1} 项 ${payload.item.label}`
}

const codeBasic = `const items = [
  { label: '首页', href: '/home' },
  { label: '组件', href: '/components' },
  { label: '导航', href: '/components/nav' },
  { label: '面包屑' },
]

<NyBreadcrumb :items="items" @select="onSelect" />`

const codeSeparator = `<NyBreadcrumb :items="items" separator=">" />
<NyBreadcrumb :items="items" separator-icon="chevron-right" />`

const codeIcon = `<NyBreadcrumb :items="items" separator-icon="chevron-right" />

const items = [
  { label: '工作台', href: '/workbench', icon: 'dashboard' },
  { label: '项目', href: '/projects', icon: 'folder' },
  { label: '组件文档', icon: 'file' },
]`

const codeSize = `<NyBreadcrumb :items="items" size="sm" />
<NyBreadcrumb :items="items" />
<NyBreadcrumb :items="items" size="lg" />`

const codeClick = `const items = [
  { label: '全部订单', clickable: true },
  { label: '待付款', clickable: true },
  { label: '订单详情' },
]

<NyBreadcrumb :items="items" @select="onSelect" />`

const apiProps = [
  { name: 'items', desc: '层级数据, 每项支持 label / to / href / icon / clickable', type: 'NyBreadcrumbItem[]', default: '[]' },
  { name: 'separator', desc: '分隔符文本', type: 'string', default: "'/'" },
  { name: 'separatorIcon', desc: 'NyIcon 的图标名, 给了就替换掉文本分隔符', type: 'string', default: "''" },
  { name: 'linkComponent', desc: '链接组件, 传 RouterLink 时用 to, 缺省用 a[href]', type: "'a' | Component", default: "'a'" },
  { name: 'size', desc: '尺寸档位', type: "'sm' | 'md' | 'lg'", default: "'md'" },
]

const apiEvents = [
  { name: 'select', desc: '点击可交互项时触发, 当前页与纯文本项不触发', type: '{ item: NyBreadcrumbItem; index: number }' },
]
</script>

<template>
  <DocPage title="Breadcrumb 面包屑" desc="显示当前页面在层级中的位置">

    <DemoBlock
      title="基础用法"
      desc="最后一项是当前页, 不再渲染成链接。"
      :code="codeBasic"
      :value="`最近点击: ${lastSelect}`"
    >
      <NyBreadcrumb :items="basicItems" @select="onSelect" />
    </DemoBlock>

    <DemoBlock title="分隔符" desc="separator 换成文本, separatorIcon 则用图标替换掉文本。" :code="codeSeparator">
      <NySpace direction="vertical" align="start">
        <NyBreadcrumb :items="basicItems" separator=">" />
        <NyBreadcrumb :items="basicItems" separator-icon="chevron-right" />
      </NySpace>
    </DemoBlock>

    <DemoBlock title="带图标" desc="每一项都可以配一个 NyIcon 图标, 当前页同样显示。" :code="codeIcon">
      <NyBreadcrumb :items="iconItems" separator-icon="chevron-right" />
    </DemoBlock>

    <DemoBlock title="尺寸" desc="sm / md / lg 三档, 只影响字号与图标大小。" :code="codeSize">
      <NySpace direction="vertical" align="start">
        <NyBreadcrumb :items="basicItems" size="sm" />
        <NyBreadcrumb :items="basicItems" />
        <NyBreadcrumb :items="basicItems" size="lg" />
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="可点击项"
      desc="没有跳转目标的项默认不可点, 标 clickable 后渲染成按钮并抛 select。"
      :code="codeClick"
      :value="`最近点击: ${lastSelect}`"
    >
      <NySpace direction="vertical" align="start">
        <NyBreadcrumb :items="plainItems" separator-icon="chevron-right" @select="onSelect" />
        <span class="ex-note">最后一项是当前页, 点击不会触发 select。</span>
      </NySpace>
    </DemoBlock>

    <template #api>
      <NySpace direction="vertical" align="start" size="lg" block>
        <ApiTable title="NyBreadcrumb Props" :rows="apiProps" />
        <ApiTable title="NyBreadcrumb 事件" kind="events" :rows="apiEvents" />
      </NySpace>

      <p class="ex-note">没有插槽与 v-model: 层级文案与跳转目标全部由 items 描述。</p>
    </template>
  </DocPage>
</template>
