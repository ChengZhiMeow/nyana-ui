<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyRow, NyStack, type NyAlign, type NyJustify } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const gaps = [8, 12, 20, 32]
const gap = ref(12)

const aligns: NyAlign[] = ['start', 'center', 'end', 'baseline', 'stretch']
const align = ref<NyAlign>('center')

const justifies: NyJustify[] = ['start', 'center', 'end', 'between', 'around', 'evenly']
const justify = ref<NyJustify>('between')

const gapValue = computed(() => `gap = ${gap.value}`)
const alignValue = computed(() => `align = '${align.value}'`)
const justifyValue = computed(() => `justify = '${justify.value}'`)

const codeBasic = `<NyRow :gap="12">
  <NyButton variant="primary">保存</NyButton>
  <NyButton>另存为草稿</NyButton>
  <NyButton variant="ghost">取消</NyButton>
</NyRow>`

const codeGap = `<NyRow :gap="gap">
  <div class="ex-tile">一</div>
  <div class="ex-tile">二</div>
  <div class="ex-tile">三</div>
</NyRow>`

const codeAlign = `<NyRow :align="align" :gap="12">
  <div class="ex-tile">一</div>
  <div class="ex-tile ex-tile--tall">二</div>
  <div class="ex-tile">三</div>
</NyRow>`

const codeJustify = `<NyRow :justify="justify" :gap="12">
  <div class="ex-tile">一</div>
  <div class="ex-tile">二</div>
  <div class="ex-tile">三</div>
</NyRow>`

const codeWrap = `<NyRow :gap="10" wrap>
  <NyButton size="sm">总览</NyButton>
  <NyButton size="sm">订单</NyButton>
  <NyButton size="sm">商品</NyButton>
  <NyButton size="sm">库存</NyButton>
  <NyButton size="sm">财务</NyButton>
  <NyButton size="sm">设置</NyButton>
</NyRow>

<p>
  共 12 条
  <NyRow inline :gap="8">
    <NyButton size="sm" variant="text">刷新</NyButton>
    <NyButton size="sm" variant="text">导出</NyButton>
  </NyRow>
</p>`

const apiProps = [
  { name: 'gap', desc: '子元素之间的间距', type: 'number', default: '12' },
  { name: 'align', desc: '交叉轴对齐', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'center'" },
  { name: 'justify', desc: '主轴分布', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'" },
  { name: 'wrap', desc: '宽度不够时换行', type: 'boolean', default: 'false' },
  { name: 'inline', desc: '行内元素形式, 与文字并排', type: 'boolean', default: 'false' },
]

const apiSlots = [{ name: 'default', desc: '横向排布的若干子元素' }]
</script>

<template>
  <DocPage title="Row 横向布局" desc="按钮组与表单项最常用的横向排布">

    <DemoBlock
      title="基础用法"
      desc="默认横向排列并垂直居中, 写按钮组最省事。"
      :code="codeBasic"
    >
      <NyRow :gap="12">
        <NyButton variant="primary">保存</NyButton>
        <NyButton>另存为草稿</NyButton>
        <NyButton variant="ghost">取消</NyButton>
      </NyRow>
    </DemoBlock>

    <DemoBlock
      title="间距"
      desc="gap 一次控制所有子元素的间距, 不用给谁加 margin。"
      :code="codeGap"
      :value="gapValue"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton
            v-for="item in gaps"
            :key="item"
            size="sm"
            :variant="gap === item ? 'primary' : 'ghost'"
            @click="gap = item"
          >
            {{ item }}
          </NyButton>
        </div>

        <NyRow :gap="gap">
          <div class="ex-tile">一</div>
          <div class="ex-tile">二</div>
          <div class="ex-tile">三</div>
        </NyRow>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="对齐"
      desc="align 控制交叉轴, baseline 让文字基线对齐, stretch 把矮的项拉到同高。"
      :code="codeAlign"
      :value="alignValue"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton
            v-for="item in aligns"
            :key="item"
            size="sm"
            :variant="align === item ? 'primary' : 'ghost'"
            @click="align = item"
          >
            {{ item }}
          </NyButton>
        </div>

        <NyRow :align="align" :gap="12">
          <div class="ex-tile">一</div>
          <div class="ex-tile ex-tile--tall">二</div>
          <div class="ex-tile">三</div>
        </NyRow>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="分布"
      desc="justify 控制主轴分布, 两端对齐最常用于把操作按钮推到最右侧。"
      :code="codeJustify"
      :value="justifyValue"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton
            v-for="item in justifies"
            :key="item"
            size="sm"
            :variant="justify === item ? 'primary' : 'ghost'"
            @click="justify = item"
          >
            {{ item }}
          </NyButton>
        </div>

        <NyRow :justify="justify" :gap="12">
          <div class="ex-tile">一</div>
          <div class="ex-tile">二</div>
          <div class="ex-tile">三</div>
        </NyRow>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="换行与行内"
      desc="wrap 让内容放不下时折到下一行, inline 让整行跟文字排在一起。"
      :code="codeWrap"
    >
      <NyStack :gap="14">
        <NyRow :gap="10" wrap>
          <NyButton size="sm">总览</NyButton>
          <NyButton size="sm">订单</NyButton>
          <NyButton size="sm">商品</NyButton>
          <NyButton size="sm">库存</NyButton>
          <NyButton size="sm">财务</NyButton>
          <NyButton size="sm">设置</NyButton>
        </NyRow>

        <p>
          共 12 条
          <NyRow inline :gap="8">
            <NyButton size="sm" variant="text">刷新</NyButton>
            <NyButton size="sm" variant="text">导出</NyButton>
          </NyRow>
        </p>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyRow Props" :rows="apiProps" />
      <ApiTable title="NyRow 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
