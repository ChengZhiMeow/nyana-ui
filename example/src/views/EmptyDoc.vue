<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyCard, NyEmpty, NyGrid, NyIcon } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const size = ref<'sm' | 'md' | 'lg'>('md')

const sizeText = computed(() => `size: ${size.value}`)

const codeBasic = `<NyEmpty />`

const codeImage = `<NyEmpty image="simple" title="搜索无结果" desc="换个关键词再试试。" />`

const codeIcon = `<NyEmpty icon="search" title="没有匹配的商品" desc="试试更短的关键词。" />`

const codeActions = `<NyEmpty title="还没有订单" desc="下单后可以在这里查看物流进度。">
  <NyButton size="sm" variant="primary">去下单</NyButton>
  <NyButton size="sm">查看帮助</NyButton>
</NyEmpty>`

const codeSlotImage = `<NyEmpty title="服务暂不可用" desc="请稍后再试。">
  <template #image>
    <NyIcon name="shield" :size="42" />
  </template>
</NyEmpty>`

const codeSize = `<NyEmpty size="sm" title="暂无数据" />
<NyEmpty size="md" title="暂无数据" />
<NyEmpty size="lg" title="暂无数据" />`

const apiProps = [
  { name: 'title', desc: '主标题, 传空字符串可隐藏', type: 'string', default: "'暂无数据'" },
  { name: 'desc', desc: '补充说明, 缺省时不渲染', type: 'string', default: "''" },
  { name: 'size', desc: '尺寸档, 同时影响插画与标题字号', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'image', desc: '内置插画样式, simple 是更简的一张', type: "'default' | 'simple'", default: "'default'" },
  { name: 'icon', desc: 'NyIcon 图标名, 有值时用图标顶替插画', type: 'string', default: "''" },
]

const apiSlots = [
  { name: 'image', desc: '自定义插画, 顶替内置的两张图', type: '—' },
  { name: 'default', desc: '操作区, 一般放主次按钮', type: '—' },
]
</script>

<template>
  <DocPage title="Empty 空状态" desc="无数据时的占位与引导">

    <DemoBlock title="基础用法" desc="不传任何 props 时就是默认插画加“暂无数据”。" :code="codeBasic">
      <NyEmpty />
    </DemoBlock>

    <DemoBlock title="内置插画" desc="image 切换到 simple, 线条更少, 适合小区域。" :code="codeImage">
      <NyGrid :columns="2" :gap="16">
        <NyCard flush>
          <NyEmpty image="default" title="文件夹是空的" desc="拖一份文件进来试试。" />
        </NyCard>

        <NyCard flush>
          <NyEmpty image="simple" title="搜索无结果" desc="换个关键词再试试。" />
        </NyCard>
      </NyGrid>
    </DemoBlock>

    <DemoBlock title="图标形态" desc="icon 有值时用图标顶替插画, 图标跟随 currentColor。" :code="codeIcon">
      <NyEmpty icon="search" title="没有匹配的商品" desc="试试更短的关键词。" />
    </DemoBlock>

    <DemoBlock title="带操作按钮" desc="默认插槽是操作区, 主按钮给一条明确的出路。" :code="codeActions">
      <NyEmpty title="还没有订单" desc="下单后可以在这里查看物流进度。">
        <NyButton size="sm" variant="primary">去下单</NyButton>
        <NyButton size="sm">查看帮助</NyButton>
      </NyEmpty>
    </DemoBlock>

    <DemoBlock title="自定义插画" desc="image 插槽可以放自己的插画或图标。" :code="codeSlotImage">
      <NyEmpty title="服务暂不可用" desc="请稍后再试。">
        <template #image>
          <NyIcon name="shield" :size="42" />
        </template>
      </NyEmpty>
    </DemoBlock>

    <DemoBlock title="三档尺寸" desc="size 同时缩放插画与标题。" :code="codeSize" :value="sizeText">
      <div class="ex-group">
        <NyButton size="sm" :variant="size === 'sm' ? 'primary' : 'default'" @click="size = 'sm'">sm</NyButton>
        <NyButton size="sm" :variant="size === 'md' ? 'primary' : 'default'" @click="size = 'md'">md</NyButton>
        <NyButton size="sm" :variant="size === 'lg' ? 'primary' : 'default'" @click="size = 'lg'">lg</NyButton>
      </div>

      <NyEmpty :size="size" title="暂无数据" desc="这里会显示筛选后的结果。" />
    </DemoBlock>

    <template #api>
      <ApiTable title="NyEmpty Props" :rows="apiProps" />
      <ApiTable title="NyEmpty 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
