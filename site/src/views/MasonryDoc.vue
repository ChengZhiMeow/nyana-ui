<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyCard, NyMasonry, NyRow, NyStack } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const columns = ref(0)

const gap = ref(16)

const rowUnit = ref(8)

const blocks = [
  { id: 1, tall: false },
  { id: 2, tall: true },
  { id: 3, tall: false },
  { id: 4, tall: true },
  { id: 5, tall: false },
  { id: 6, tall: true },
]

const notes = [
  { id: 'n1', title: '布局约定', desc: '排版', text: '间距用 gap, 不用 margin。' },
  { id: 'n2', title: '令牌', desc: '主题', text: '颜色与圆角一律走 CSS 变量, 深浅色只靠令牌切换, 组件里不写主题分支。' },
  { id: 'n3', title: '无障碍', desc: '交互', text: '可点击元素用 button, 输入控件补 aria-*。' },
  { id: 'n4', title: '验证', desc: '流程', text: '改完跑一次 typecheck 与 build, 交互改动还要在示例站点里点一遍。' },
]

const codeAuto = `<!-- 列数按最小列宽自动算, 窗口变窄会自己减列 -->
<NyMasonry :min-column-width="200" :gap="16">
  <div v-for="item in blocks" :key="item.id" class="ex-tile" :class="{ 'ex-tile--tall': item.tall }">
    {{ item.id }}
  </div>
</NyMasonry>`

const codeColumns = `<!-- 0 表示自动, 大于 0 时固定列数 -->
<NyMasonry :columns="columns" :gap="16">
  <div v-for="item in blocks" :key="item.id" class="ex-tile" :class="{ 'ex-tile--tall': item.tall }">
    {{ item.id }}
  </div>
</NyMasonry>`

const codeGap = `<NyMasonry :columns="3" :gap="gap">
  <div v-for="item in blocks" :key="item.id" class="ex-tile" :class="{ 'ex-tile--tall': item.tall }">
    {{ item.id }}
  </div>
</NyMasonry>`

const codeRowUnit = `<!-- rowUnit 是高度换算的步进, 越小越贴合真实高度 -->
<NyMasonry :columns="3" :gap="16" :row-unit="rowUnit">
  <div v-for="item in blocks" :key="item.id" class="ex-tile" :class="{ 'ex-tile--tall': item.tall }">
    {{ item.id }}
  </div>
</NyMasonry>`

const codeCards = `<NyMasonry :columns="2" :gap="16">
  <NyCard v-for="item in notes" :key="item.id" :title="item.title" :desc="item.desc" hoverable>
    {{ item.text }}
  </NyCard>
</NyMasonry>`

const apiProps = [
  { name: 'columns', desc: '固定列数, 0 表示按最小列宽自动计算', type: 'number', default: '0' },
  { name: 'minColumnWidth', desc: 'columns 为 0 时的最小列宽 (px)', type: 'number', default: '240' },
  { name: 'gap', desc: '行间距与列间距 (px)', type: 'number', default: '16' },
  { name: 'rowUnit', desc: '行高步进, 越小越贴合真实高度', type: 'number', default: '8' },
]

const apiSlots = [
  { name: '#default', desc: '每个直接子节点当成一项, v-for 会被摊平成多项, 高度按内容量测', type: '—' },
]
</script>

<template>
  <DocPage title="Masonry 瀑布流" desc="不等高内容的列式排布">

    <DemoBlock
      title="自动列宽"
      desc="不给 columns 时按最小列宽算列数, 拖动窗口宽度会自动增减列。"
      :code="codeAuto"
    >
      <NyMasonry :min-column-width="200" :gap="16">
        <div
          v-for="item in blocks"
          :key="item.id"
          class="ex-tile"
          :class="{ 'ex-tile--tall': item.tall }"
        >
          {{ item.id }}
        </div>
      </NyMasonry>
    </DemoBlock>

    <DemoBlock
      title="固定列数"
      desc="columns 给正数时列数固定, 0 交回自动计算。"
      :code="codeColumns"
      :value="`columns = ${columns === 0 ? '0 (自动)' : columns}`"
    >
      <NyStack :gap="14">
        <NyRow :gap="8">
          <NyButton
            v-for="item in [0, 2, 3, 4]"
            :key="item"
            size="sm"
            :variant="columns === item ? 'primary' : 'default'"
            @click="columns = item"
          >
            {{ item === 0 ? '自动' : `${item} 列` }}
          </NyButton>
        </NyRow>

        <NyMasonry :columns="columns" :gap="16">
          <div
            v-for="item in blocks"
            :key="item.id"
            class="ex-tile"
            :class="{ 'ex-tile--tall': item.tall }"
          >
            {{ item.id }}
          </div>
        </NyMasonry>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="间距" desc="gap 同时作用于行间距与列间距。" :code="codeGap" :value="`gap = ${gap}`">
      <NyStack :gap="14">
        <NyRow :gap="8">
          <NyButton
            v-for="item in [8, 16, 28]"
            :key="item"
            size="sm"
            :variant="gap === item ? 'primary' : 'default'"
            @click="gap = item"
          >
            gap = {{ item }}
          </NyButton>
        </NyRow>

        <NyMasonry :columns="3" :gap="gap">
          <div
            v-for="item in blocks"
            :key="item.id"
            class="ex-tile"
            :class="{ 'ex-tile--tall': item.tall }"
          >
            {{ item.id }}
          </div>
        </NyMasonry>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="行高步进"
      desc="每项的高度按 rowUnit 换算成行数, 步进越小排布越贴合内容。"
      :code="codeRowUnit"
      :value="`row-unit = ${rowUnit}`"
    >
      <NyStack :gap="14">
        <NyRow :gap="8">
          <NyButton
            v-for="item in [4, 8, 16]"
            :key="item"
            size="sm"
            :variant="rowUnit === item ? 'primary' : 'default'"
            @click="rowUnit = item"
          >
            row-unit = {{ item }}
          </NyButton>
        </NyRow>

        <NyMasonry :columns="3" :gap="16" :row-unit="rowUnit">
          <div
            v-for="item in blocks"
            :key="item.id"
            class="ex-tile"
            :class="{ 'ex-tile--tall': item.tall }"
          >
            {{ item.id }}
          </div>
        </NyMasonry>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="卡片墙" desc="子节点可以直接是组件, 高度由内容决定。" :code="codeCards">
      <NyMasonry :columns="2" :gap="16">
        <NyCard v-for="item in notes" :key="item.id" :title="item.title" :desc="item.desc" hoverable>
          {{ item.text }}
        </NyCard>
      </NyMasonry>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyMasonry Props" :rows="apiProps" />
      <ApiTable title="插槽" :rows="apiSlots" kind="slots" />
    </template>
  </DocPage>
</template>
