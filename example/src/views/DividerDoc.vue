<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyDivider, NyRow, NyStack, NyText } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const spacingOptions = [0, 16, 32]
const spacing = ref(16)

const codeBasic = `<NyStack :gap="0">
  <NyText>上方内容</NyText>
  <NyDivider />
  <NyText>下方内容</NyText>
</NyStack>`

const codeText = `<NyStack :gap="0">
  <NyDivider>居中文字</NyDivider>
  <NyDivider align="start">靠左文字</NyDivider>
  <NyDivider align="end">靠右文字</NyDivider>
</NyStack>`

const codeDashed = `<NyStack :gap="0">
  <NyText type="muted">虚线用于弱分隔, 不打断阅读节奏。</NyText>
  <NyDivider :dashed="true" />
  <NyDivider :dashed="true">OR</NyDivider>
  <NyText type="muted">结束</NyText>
</NyStack>`

const codeVertical = `<NyRow :gap="0" align="stretch">
  <NyText>编辑</NyText>
  <NyDivider direction="vertical" />
  <NyText>复制</NyText>
  <NyDivider direction="vertical" />
  <NyText type="muted">删除</NyText>
</NyRow>`

const codeSpacing = `<div class="ex-group">
  <NyButton
    v-for="item in spacingOptions"
    :key="item"
    size="sm"
    :variant="item === spacing ? 'primary' : 'default'"
    @click="spacing = item"
  >
    {{ item }}
  </NyButton>
</div>

<div>
  <NyText type="muted">上方内容</NyText>
  <NyDivider :spacing="spacing" />
  <NyText type="muted">下方内容</NyText>
</div>`

const apiProps = [
  { name: 'direction', desc: '横向分隔两块内容, 纵向分隔并排元素', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
  { name: 'dashed', desc: '虚线, 用于弱分隔', type: 'boolean', default: 'false' },
  { name: 'align', desc: '文字在横线上的位置', type: "'start' | 'center' | 'end'", default: "'center'" },
  { name: 'spacing', desc: '横向分割线的上下留白, 单位 px, 纵向不生效', type: 'number', default: '16' },
]

const apiSlots = [
  { name: 'default', desc: '横线中间的文字, 不传则是一条完整横线' },
]
</script>

<template>
  <DocPage title="Divider 分割线" desc="横向与纵向分隔, 可带文字与虚线">

    <DemoBlock title="基础用法" desc="横向分割线自带上下留白, 不需要再包一层间距容器。" :code="codeBasic">
      <NyStack :gap="0">
        <NyText>上方内容</NyText>
        <NyDivider />
        <NyText>下方内容</NyText>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="带文字的分割线" desc="默认插槽放文字, align 决定文字在横线上的位置。" :code="codeText">
      <NyStack :gap="0">
        <NyText type="muted">文字居中</NyText>
        <NyDivider>居中文字</NyDivider>
        <NyText type="muted">文字靠左</NyText>
        <NyDivider align="start">靠左文字</NyDivider>
        <NyText type="muted">文字靠右</NyText>
        <NyDivider align="end">靠右文字</NyDivider>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="虚线" desc="dashed 把实线换成虚线, 适合更轻的分隔。" :code="codeDashed">
      <NyStack :gap="0">
        <NyText type="muted">虚线用于弱分隔, 不打断阅读节奏。</NyText>
        <NyDivider :dashed="true" />
        <NyDivider :dashed="true">OR</NyDivider>
        <NyText type="muted">结束</NyText>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="纵向分割线" desc="direction 为 vertical 时高度由父级拉伸决定, 常配 align 为 stretch 的排布容器。" :code="codeVertical">
      <NyRow :gap="0" align="stretch">
        <NyText>编辑</NyText>
        <NyDivider direction="vertical" />
        <NyText>复制</NyText>
        <NyDivider direction="vertical" />
        <NyText type="muted">删除</NyText>
      </NyRow>
    </DemoBlock>

    <DemoBlock
      title="上下留白"
      desc="spacing 控制横向分割线的上下外边距, 单位 px。"
      :code="codeSpacing"
      :value="'当前 spacing: ' + spacing"
    >
      <NyStack :gap="12">
        <div class="ex-group">
          <NyButton
            v-for="item in spacingOptions"
            :key="item"
            size="sm"
            :variant="item === spacing ? 'primary' : 'default'"
            @click="spacing = item"
          >
            {{ item }}
          </NyButton>
        </div>

        <div>
          <NyText type="muted">上方内容</NyText>
          <NyDivider :spacing="spacing" />
          <NyText type="muted">下方内容</NyText>
        </div>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyDivider Props" :rows="apiProps" />
      <ApiTable title="NyDivider 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
