<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NySpace, NyStack, type NyJustify, type NySize } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const sizes: { label: string; value: NySize | number | [number, number] }[] = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
  { label: '20', value: 20 },
  { label: '12 / 24', value: [12, 24] },
]

const size = ref<NySize | number | [number, number]>('md')

const justifies: NyJustify[] = ['start', 'center', 'end', 'between', 'around', 'evenly']
const justify = ref<NyJustify>('between')

const sizeValue = computed(() => {
  const hit = sizes.find((item) => item.value === size.value)

  return `size = ${hit?.label ?? String(size.value)}`
})

const justifyValue = computed(() => `justify = '${justify.value}'`)

const codeBasic = `<NySpace>
  <div class="ex-tile">标签一</div>
  <div class="ex-tile">标签二</div>
  <div class="ex-tile">标签三</div>
</NySpace>`

const codeSize = `<NySpace :size="size" wrap>
  <div class="ex-tile">一</div>
  <div class="ex-tile">二</div>
  <div class="ex-tile">三</div>
  <div class="ex-tile">四</div>
</NySpace>`

const codeVertical = `<NySpace direction="vertical" :size="10" align="stretch">
  <div class="ex-box">第一段</div>
  <div class="ex-box">第二段</div>
  <div class="ex-box">第三段</div>
</NySpace>`

const codeJustify = `<NySpace block :justify="justify" :size="12">
  <div class="ex-tile">一</div>
  <div class="ex-tile">二</div>
  <div class="ex-tile">三</div>
</NySpace>`

const codeSplit = `<NySpace split :size="14">
  <span>总览</span>
  <span>订单</span>
  <span>设置</span>
</NySpace>

<p>操作记录: <NySpace inline split :size="10">
  <span>创建</span>
  <span>提交审核</span>
  <span>驳回</span>
</NySpace></p>`

const apiProps = [
  { name: 'direction', desc: '主轴方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
  { name: 'size', desc: '间距, 语义档位或像素, 元组分别控制行与列', type: 'NySize | number | [number, number]', default: "'md'" },
  { name: 'align', desc: '交叉轴对齐', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'center'" },
  { name: 'justify', desc: '主轴分布', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'" },
  { name: 'wrap', desc: '子元素超出宽度时换行', type: 'boolean', default: 'false' },
  { name: 'block', desc: '撑满父容器宽度', type: 'boolean', default: 'false' },
  { name: 'inline', desc: '行内元素形式, 与文字并排', type: 'boolean', default: 'false' },
  { name: 'split', desc: '相邻子元素之间画一条分隔线', type: 'boolean', default: 'false' },
]

const apiSlots = [{ name: 'default', desc: '需要排布的若干子元素' }]
</script>

<template>
  <DocPage title="Space 间距" desc="一维间距容器, 用 gap 统一节奏">

    <DemoBlock
      title="基础用法"
      desc="默认水平方向, md 档间距是 14px, 只负责间距不管换行。"
      :code="codeBasic"
    >
      <NySpace>
        <div class="ex-tile">标签一</div>
        <div class="ex-tile">标签二</div>
        <div class="ex-tile">标签三</div>
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="间距档位"
      desc="size 传语义档位或像素, 传元组时第一个是行间距, 第二个是列间距, 配合 wrap 看得最清楚。"
      :code="codeSize"
      :value="sizeValue"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton
            v-for="item in sizes"
            :key="item.label"
            size="sm"
            :variant="item.value === size ? 'primary' : 'ghost'"
            @click="size = item.value"
          >
            {{ item.label }}
          </NyButton>
        </div>

        <NySpace :size="size" wrap>
          <div class="ex-tile">一</div>
          <div class="ex-tile">二</div>
          <div class="ex-tile">三</div>
          <div class="ex-tile">四</div>
          <div class="ex-tile">五</div>
          <div class="ex-tile">六</div>
          <div class="ex-tile">七</div>
          <div class="ex-tile">八</div>
        </NySpace>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="垂直方向"
      desc="direction='vertical' 变成纵向排布, align='stretch' 让子元素撑满宽度。"
      :code="codeVertical"
    >
      <NySpace direction="vertical" :size="10" align="stretch">
        <div class="ex-box">第一段</div>
        <div class="ex-box">第二段</div>
        <div class="ex-box">第三段</div>
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="对齐与分布"
      desc="justify 控制主轴分布, block 让容器先撑满宽度, 分布效果才看得出来。"
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

        <NySpace block :justify="justify" :size="12">
          <div class="ex-tile">一</div>
          <div class="ex-tile">二</div>
          <div class="ex-tile">三</div>
        </NySpace>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="分隔线与行内"
      desc="split 在相邻子元素之间补一条细线, inline 让它跟文字排在同一行里。"
      :code="codeSplit"
    >
      <NyStack :gap="14">
        <NySpace split :size="14">
          <span>总览</span>
          <span>订单</span>
          <span>设置</span>
        </NySpace>

        <p>
          操作记录:
          <NySpace inline split :size="10">
            <span>创建</span>
            <span>提交审核</span>
            <span>驳回</span>
          </NySpace>
        </p>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NySpace Props" :rows="apiProps" />
      <ApiTable title="NySpace 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
