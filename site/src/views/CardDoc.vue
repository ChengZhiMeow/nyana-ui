<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyCard, NyGrid, NyList, NyRow, NyStack, NySwitch, NyTag } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const hoverable = ref(true)

const variant = ref<'outline' | 'raised' | 'plain'>('outline')

const variants: ('outline' | 'raised' | 'plain')[] = ['outline', 'raised', 'plain']

const divided = ref(true)

const activities: Record<string, unknown>[] = [
  { id: 'a1', title: '组件库文档站上线', time: '今天 09:20' },
  { id: 'a2', title: '暗色主题令牌调整', time: '昨天 16:40' },
  { id: 'a3', title: '表单校验规则合并', time: '周一 11:05' },
]

const codeBasic = `<NyCard title="项目概览" desc="一句话说明卡片内容">
  卡片是最常用的内容块, 有标题与说明时信息层次最清楚。
</NyCard>`

const codeCover = `<!-- 封面 + 标题 + 操作区 + 底部 -->
<NyCard title="设计令牌" desc="v0.1 已发布" divided>
  <template #cover>
    <div class="ex-tile ex-tile--tall">封面区</div>
  </template>

  <template #actions>
    <NyButton size="sm" variant="text" icon="edit">编辑</NyButton>
    <NyButton size="sm" variant="text" icon="trash">删除</NyButton>
  </template>

  整理颜色, 圆角与阴影, 深浅色只靠令牌切换。
  <template #footer>最后更新于 3 天前</template>
</NyCard>`

const codeVariant = `<NyCard
  title="悬浮卡片"
  desc="variant 决定投影强弱"
  :variant="variant"
  :hoverable="hoverable"
>
  鼠标移到卡片上看投影与描边的变化。
</NyCard>`

const codeDivided = `<NyCard title="分隔线" desc="divided 打开后头部与底部各有一条线" :divided="divided">
  内容区
  <template #footer>底部说明</template>
</NyCard>`

const codeFlush = `<!-- flush 配合 padding="none", 让列表或表格贴到卡片边缘 -->
<NyCard title="最近活动" padding="none" flush divided>
  <NyList :data="activities" :bordered="false" item-key="id">
    <template #default="{ item }">
      {{ item.title }} · {{ item.time }}
    </template>
  </NyList>
</NyCard>`

const apiProps = [
  { name: 'title', desc: '标题, 也可以用 #title 插槽', type: 'string', default: "''" },
  { name: 'desc', desc: '标题下方的说明, 也可以用 #desc 插槽', type: 'string', default: "''" },
  { name: 'padding', desc: '内边距档位, none 用于贴边内容', type: "'md' | 'sm' | 'none'", default: "'md'" },
  { name: 'variant', desc: '投影风格: 描边 / 抬升 / 无边框', type: "'outline' | 'raised' | 'plain'", default: "'outline'" },
  { name: 'hoverable', desc: '悬浮时抬起并换成主色描边', type: 'boolean', default: 'false' },
  { name: 'divided', desc: '头部与底部画分隔线', type: 'boolean', default: 'false' },
  { name: 'flush', desc: '内容区裁剪溢出, 让封面与贴边内容贴合圆角', type: 'boolean', default: 'false' },
]

const apiSlots = [
  { name: '#default', desc: '卡片主体内容', type: '—' },
  { name: '#title', desc: '自定义标题, 优先于 title', type: '—' },
  { name: '#desc', desc: '自定义说明, 优先于 desc', type: '—' },
  { name: '#cover', desc: '顶部封面区, 有内容时自动画底部分隔线', type: '—' },
  { name: '#actions', desc: '标题右侧的操作区', type: '—' },
  { name: '#footer', desc: '底部区, 默认带一条上分隔线', type: '—' },
]
</script>

<template>
  <DocPage title="Card 卡片" desc="带标题与操作区的内容块, 支持封面与悬浮">

    <DemoBlock title="基础卡片" desc="标题与说明直接用 props 传。" :code="codeBasic">
      <NyGrid :columns="2" :gap="16">
        <NyCard title="项目概览" desc="一句话说明卡片内容">
          卡片是最常用的内容块, 有标题与说明时信息层次最清楚。
        </NyCard>

        <NyCard title="最近更新" desc="没有说明时不渲染说明行">
          只给 title 也能用, 说明行会整行省略, 不会留出空白。
        </NyCard>
      </NyGrid>
    </DemoBlock>

    <DemoBlock title="封面与操作区" desc="封面走 #cover, 标题右侧的操作走 #actions。" :code="codeCover">
      <NyGrid :columns="2" :gap="16">
        <NyCard title="设计令牌" desc="v0.1 已发布" divided>
          <template #cover>
            <div class="ex-tile ex-tile--tall">封面区</div>
          </template>

          <template #actions>
            <NyButton size="sm" variant="text" icon="edit">编辑</NyButton>
            <NyButton size="sm" variant="text" icon="trash">删除</NyButton>
          </template>

          整理颜色, 圆角与阴影, 深浅色只靠令牌切换。
          <template #footer>最后更新于 3 天前</template>
        </NyCard>

        <NyCard title="组件规范" desc="写作中" hoverable>
          <template #actions>
            <NyTag status="info" size="sm">草稿</NyTag>
          </template>

          约定组件的骨架, 类名与交互反馈, 新增组件时照抄。
          <template #footer>2 位作者参与</template>
        </NyCard>
      </NyGrid>
    </DemoBlock>

    <DemoBlock
      title="投影与悬浮"
      desc="variant 决定静态投影, hoverable 决定鼠标移上去的反应。"
      :code="codeVariant"
      :value="`variant = ${variant}, hoverable = ${hoverable}`"
    >
      <NyStack :gap="14">
        <NyRow :gap="10">
          <NyButton
            v-for="item in variants"
            :key="item"
            size="sm"
            :variant="variant === item ? 'primary' : 'default'"
            @click="variant = item"
          >
            {{ item }}
          </NyButton>

          <NySwitch v-model:checked="hoverable" label="hoverable" />
        </NyRow>

        <NyGrid :columns="2" :gap="16">
          <NyCard title="悬浮卡片" desc="variant 决定投影强弱" :variant="variant" :hoverable="hoverable">
            鼠标移到卡片上看投影与描边的变化。
          </NyCard>

          <NyCard title="普通卡片" desc="同上, 便于对比" :variant="variant" :hoverable="hoverable">
            两张卡片共用同一组参数, 方便并排比较。
          </NyCard>
        </NyGrid>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="分隔线"
      desc="divided 打开后头部与底部各有一条分隔线, 内容多时层次更清楚。"
      :code="codeDivided"
      :value="`divided = ${divided}`"
    >
      <NyStack :gap="14">
        <NySwitch v-model:checked="divided" label="divided" />

        <NyGrid :columns="2" :gap="16">
          <NyCard title="分隔线" desc="divided 打开" :divided="divided">
            内容区
            <template #footer>底部说明</template>
          </NyCard>

          <NyCard title="分隔线" desc="标题与底部都带线">
            头部与底部通过边框而不是留白区分, 信息块更像一张表。
            <template #footer>底部说明</template>
          </NyCard>
        </NyGrid>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="贴边内容" desc="padding 设为 none 并打开 flush, 列表或表格就能贴到卡片边缘。" :code="codeFlush">
      <NyGrid :columns="2" :gap="16">
        <NyCard title="最近活动" desc="内嵌 NyList" padding="none" flush divided>
          <NyList :data="activities" :bordered="false" item-key="id">
            <template #default="{ item }">
              {{ item.title }} · {{ item.time }}
            </template>
          </NyList>
        </NyCard>

        <NyCard title="说明" desc="贴边时头部与底部自带内边距" padding="none" flush divided>
          <div class="ex-box">贴边内容区</div>
          <template #footer>底部说明</template>
        </NyCard>
      </NyGrid>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyCard Props" :rows="apiProps" />
      <ApiTable title="插槽" :rows="apiSlots" kind="slots" />
    </template>
  </DocPage>
</template>
