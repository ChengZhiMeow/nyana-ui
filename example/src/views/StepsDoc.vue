<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NySpace, NySteps } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const flowItems = [
  { title: '填写信息', desc: '账号与联系方式' },
  { title: '确认订单', desc: '核对商品与地址' },
  { title: '完成支付', desc: '选择支付方式' },
  { title: '开通完成', desc: '发送通知邮件' },
]

const current = ref(1)

const clickCurrent = ref(0)

const statusItems = [
  { title: '创建实例', desc: '已完成', status: 'finish' as const },
  { title: '上传镜像', desc: '校验失败, 请重新上传', status: 'error' as const },
  { title: '启动服务', desc: '正在启动, 预计 2 分钟', status: 'process' as const },
  { title: '健康检查', desc: '等待上一步完成', status: 'wait' as const },
]

const iconItems = [
  { title: '选择模板', icon: 'layers' },
  { title: '填写内容', icon: 'edit' },
  { title: '发布上线', icon: 'upload' },
]

function prev() {
  if (current.value > 0) {
    current.value -= 1
  }
}

function next() {
  if (current.value < flowItems.length - 1) {
    current.value += 1
  }
}

function onStepChange(index: number) {
  clickCurrent.value = index
}

const codeBasic = `const current = ref(1)

<NySteps :items="items" :current="current" />

<NyButton size="sm" @click="current -= 1">上一步</NyButton>
<NyButton size="sm" @click="current += 1">下一步</NyButton>`

const codeVertical = `<!-- 步骤多或标题长时用纵向, 描述文字有更多位置 -->
<NySteps :items="items" :current="2" direction="vertical" />`

const codeClickable = `<!-- clickable 打开点击, 用 change 事件回写下标 -->
<NySteps :items="items" :current="current" clickable @change="current = $event" />`

const codeStatus = `const items = [
  { title: '创建实例', desc: '已完成', status: 'finish' },
  { title: '上传镜像', desc: '校验失败, 请重新上传', status: 'error' },
  { title: '启动服务', desc: '正在启动, 预计 2 分钟', status: 'process' },
  { title: '健康检查', desc: '等待上一步完成', status: 'wait' },
]

<NySteps :items="items" :current="1" />`

const codeDot = `<!-- 圆点模式: 不画序号与图标, 只用状态色, 适合密集的流程概览 -->
<NySteps :items="items" :current="2" progress-dot />`

const codeSize = `const items = [
  { title: '选择模板', icon: 'layers' },
  { title: '填写内容', icon: 'edit' },
  { title: '发布上线', icon: 'upload' },
]

<!-- icon 只在 process 态的标记里显示 -->
<NySteps :items="items" :current="1" size="sm" />
<NySteps :items="items" :current="1" size="lg" />`

const apiProps = [
  { name: 'items', desc: '步骤数据, 每项支持 title / desc / icon / status', type: 'NyStepItem[]', default: '[]' },
  { name: 'current', desc: '当前步骤下标, 从 0 开始', type: 'number', default: '0' },
  { name: 'direction', desc: '横向或纵向排布', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
  { name: 'size', desc: '尺寸档位, 同时决定标记直径', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'clickable', desc: '允许点击标记与标题切换步骤', type: 'boolean', default: 'false' },
  { name: 'progressDot', desc: '圆点模式, 标记缩成状态色小圆点', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'change', desc: 'clickable 时点击非当前步骤触发, 携带目标下标', type: 'number' },
]
</script>

<template>
  <DocPage title="Steps 步骤条" desc="展示流程进度与当前步骤">

    <DemoBlock
      title="基础用法"
      desc="current 是受控的, 页面里只维护一个下标。"
      :code="codeBasic"
      :value="`当前步骤: ${current + 1} / ${flowItems.length} · ${flowItems[current].title}`"
    >
      <NySpace direction="vertical" align="start" block>
        <NySteps :items="flowItems" :current="current" />

        <NySpace>
          <NyButton size="sm" :disabled="current === 0" @click="prev">上一步</NyButton>
          <NyButton size="sm" variant="primary" :disabled="current === flowItems.length - 1" @click="next">
            下一步
          </NyButton>
        </NySpace>
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="纵向步骤条"
      desc="direction 换成 vertical, 标题与描述有更多横向位置, 适合长文案。"
      :code="codeVertical"
      :value="`当前步骤: 3 / ${flowItems.length} · ${flowItems[2].title}`"
    >
      <NySteps :items="flowItems" :current="2" direction="vertical" />
    </DemoBlock>

    <DemoBlock
      title="可点击切换"
      desc="clickable 打开后点标记或标题都会抛 change, 由使用方回写 current。"
      :code="codeClickable"
      :value="`当前步骤: ${clickCurrent + 1} / ${flowItems.length} · ${flowItems[clickCurrent].title}`"
    >
      <NySteps :items="flowItems" :current="clickCurrent" clickable @change="onStepChange" />
    </DemoBlock>

    <DemoBlock
      title="自定义状态"
      desc="item.status 写了就以它为准, 可以表达校验失败这类分支。"
      :code="codeStatus"
      :value="`第 2 步为 error 态, 第 3 步是 process 态`"
    >
      <NySteps :items="statusItems" :current="1" />
    </DemoBlock>

    <DemoBlock
      title="圆点模式"
      desc="progressDot 去掉序号与图标, 只用状态色区分, 适合在详情里做流程概览。"
      :code="codeDot"
      :value="`当前步骤: 3 / ${flowItems.length}`"
    >
      <NySteps :items="flowItems" :current="2" progress-dot />
    </DemoBlock>

    <DemoBlock
      title="尺寸与自定义图标"
      desc="size 同时决定标记直径与标题字号, item.icon 用在 process 态的标记里。"
      :code="codeSize"
      :value="`小号与大号, 当前步骤均为 2 / ${iconItems.length}`"
    >
      <NySpace direction="vertical" align="start" block>
        <NySteps :items="iconItems" :current="1" size="sm" />
        <NySteps :items="iconItems" :current="1" size="lg" />
      </NySpace>
    </DemoBlock>

    <template #api>
      <NySpace direction="vertical" align="start" size="lg" block>
        <ApiTable title="NySteps Props" :rows="apiProps" />
        <ApiTable title="NySteps 事件" kind="events" :rows="apiEvents" />
      </NySpace>

      <p class="ex-note">没有插槽与 v-model: 步骤文案由 items 描述, 状态由 current 与 item.status 决定。</p>
    </template>
  </DocPage>
</template>
