<script setup lang="ts">
import { ref } from 'vue'

import { NyBreadcrumb, NyButton, NyPageHeader, NyStack, NySwitch, NyTag, NyTabs } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const crumbs = [
  { label: '首页', href: '#' },
  { label: '组件', href: '#' },
  { label: 'PageHeader 页头' },
]

const tabs = [
  { key: 'overview', label: '概览' },
  { key: 'members', label: '成员', badge: 8 },
  { key: 'settings', label: '设置' },
]

const activeTab = ref('overview')

const bordered = ref(true)

const showBack = ref(false)

const backCount = ref(0)

function onBack() {
  backCount.value += 1
}

const codeBasic = `<NyPageHeader title="用户列表" desc="管理后台里的基础页头">
  内容区
</NyPageHeader>`

const codeCrumb = `<!-- 面包屑与说明都可以走插槽 -->
<NyPageHeader title="PageHeader 页头" icon="panel-top">
  <template #breadcrumb>
    <NyBreadcrumb :items="crumbs" />
  </template>

  <template #desc>说明里可以放任意内容, 比如 <NyTag status="info" size="sm">Beta</NyTag>。</template>
</NyPageHeader>`

const codeActions = `<NyPageHeader title="项目详情" desc="页头右侧放主操作">
  <template #tags>
    <NyTag status="success" size="sm">运行中</NyTag>
    <NyTag size="sm">私有</NyTag>
  </template>

  <template #actions>
    <NyButton size="sm" variant="primary" icon="plus">新建</NyButton>
    <NyButton size="sm" icon="download">导出</NyButton>
  </template>
</NyPageHeader>`

const codeTabs = `<!-- 底部页签区: 页签状态由使用方维护 -->
<NyPageHeader title="项目详情" desc="页签切换交给使用方">
  <template #footer>
    <NyTabs v-model:active-key="activeTab" :items="tabs" />
  </template>
</NyPageHeader>

<div class="ex-box">当前页签: {{ activeTab }}</div>`

const codeBordered = `<!-- bordered 给边框与底色, back 显示返回按钮 -->
<NyPageHeader
  title="订单详情"
  desc="返回按钮只抛 back 事件, 跳转由使用方决定"
  :bordered="bordered"
  :back="showBack"
  @back="onBack"
>
  内容区
</NyPageHeader>`

const apiProps = [
  { name: 'title', desc: '标题', type: 'string', default: '—' },
  { name: 'desc', desc: '标题下方的说明, 也可以用 #desc 插槽', type: 'string', default: "''" },
  { name: 'icon', desc: '标题左侧的图标名, 取 NyIcon 的图标', type: 'string', default: "''" },
  { name: 'bordered', desc: '加边框, 圆角与底色', type: 'boolean', default: 'false' },
  { name: 'back', desc: '标题左侧显示返回按钮', type: 'boolean', default: 'false' },
]

const apiEvents = [{ name: 'back', desc: '点击返回按钮时触发, 不改路由', type: '—' }]

const apiSlots = [
  { name: '#breadcrumb', desc: '顶部面包屑区, 一般放 NyBreadcrumb', type: '—' },
  { name: '#desc', desc: '自定义说明, 优先于 desc', type: '—' },
  { name: '#tags', desc: '标题右侧的标签区', type: '—' },
  { name: '#actions', desc: '最右侧的操作区', type: '—' },
  { name: '#footer', desc: '底部区, 常放 NyTabs', type: '—' },
]
</script>

<template>
  <DocPage title="PageHeader 页头" desc="面包屑, 标题, 操作与页签的页头组合">

    <DemoBlock title="基础用法" desc="title 必填, desc 可选。" :code="codeBasic">
      <NyStack :gap="16">
        <NyPageHeader title="用户列表" desc="管理后台里的基础页头">
          内容区
        </NyPageHeader>

        <NyPageHeader title="只有标题" />
      </NyStack>
    </DemoBlock>

    <DemoBlock title="面包屑与图标" desc="面包屑与说明都可以走插槽, 插槽里放任意内容。" :code="codeCrumb">
      <NyPageHeader title="PageHeader 页头" icon="panel-top">
        <template #breadcrumb>
          <NyBreadcrumb :items="crumbs" />
        </template>

        <template #desc>
          说明里可以放任意内容, 比如
          <NyTag status="info" size="sm">Beta</NyTag>
        </template>
      </NyPageHeader>
    </DemoBlock>

    <DemoBlock title="标签与操作区" desc="tags 紧跟在标题后面, actions 靠右对齐。" :code="codeActions">
      <NyPageHeader title="项目详情" desc="页头右侧放主操作">
        <template #tags>
          <NyTag status="success" size="sm">运行中</NyTag>
          <NyTag size="sm">私有</NyTag>
        </template>

        <template #actions>
          <NyButton size="sm" variant="primary" icon="plus">新建</NyButton>
          <NyButton size="sm" icon="download">导出</NyButton>
        </template>
      </NyPageHeader>
    </DemoBlock>

    <DemoBlock
      title="页签区"
      desc="footer 插槽常放 NyTabs, 页签状态由使用方维护。"
      :code="codeTabs"
      :value="`当前页签 = ${activeTab}`"
    >
      <NyStack :gap="12">
        <NyPageHeader title="项目详情" desc="页签切换交给使用方">
          <template #footer>
            <NyTabs v-model:active-key="activeTab" :items="tabs" />
          </template>
        </NyPageHeader>

        <div class="ex-box">当前页签: {{ activeTab }}</div>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="边框与返回"
      desc="bordered 给出边框与底色, back 显示返回按钮并抛出 back 事件。"
      :code="codeBordered"
      :value="`bordered = ${bordered}, back = ${showBack}, back 事件触发 ${backCount} 次`"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NySwitch v-model:checked="bordered" label="bordered" />
          <NySwitch v-model:checked="showBack" label="back" />
        </div>

        <NyPageHeader
          title="订单详情"
          desc="返回按钮只抛 back 事件, 跳转由使用方决定"
          :bordered="bordered"
          :back="showBack"
          @back="onBack"
        >
          内容区
        </NyPageHeader>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyPageHeader Props" :rows="apiProps" />
      <ApiTable title="NyPageHeader 事件" :rows="apiEvents" kind="events" />
      <ApiTable title="插槽" :rows="apiSlots" kind="slots" />
    </template>
  </DocPage>
</template>
