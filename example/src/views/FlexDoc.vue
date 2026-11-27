<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyFlex, NyStack, type NyAlign, type NyJustify } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const directions = ['row', 'column', 'row-reverse', 'column-reverse'] as const
const direction = ref<'row' | 'column' | 'row-reverse' | 'column-reverse'>('row')

const aligns: NyAlign[] = ['start', 'center', 'end', 'stretch', 'baseline']
const align = ref<NyAlign>('center')

const justifies: NyJustify[] = ['start', 'center', 'end', 'between', 'around', 'evenly']
const justify = ref<NyJustify>('between')

const wraps = ['nowrap', 'wrap'] as const
const wrap = ref<'nowrap' | 'wrap' | 'wrap-reverse'>('wrap')

const directionValue = computed(() => `direction = '${direction.value}'`)
const alignValue = computed(() => `justify = '${justify.value}', align = '${align.value}'`)
const wrapValue = computed(() => `wrap = '${wrap.value}', rowGap = 16, columnGap = 8`)

const codeBasic = `<NyFlex :gap="12">
  <div class="ex-tile">一</div>
  <div class="ex-tile">二</div>
  <div class="ex-tile">三</div>
</NyFlex>`

const codeDirection = `<NyFlex :direction="direction" :gap="12">
  <div class="ex-tile">一</div>
  <div class="ex-tile">二</div>
  <div class="ex-tile">三</div>
</NyFlex>`

const codeAlign = `<NyFlex :justify="justify" :align="align" :gap="12">
  <div class="ex-tile">一</div>
  <div class="ex-tile ex-tile--tall">二</div>
  <div class="ex-tile">三</div>
</NyFlex>`

const codeWrap = `<NyFlex :wrap="wrap" :row-gap="16" :column-gap="8">
  <div class="ex-tile">一</div>
  <div class="ex-tile">二</div>
  <div class="ex-tile">三</div>
  <div class="ex-tile">四</div>
  <div class="ex-tile">五</div>
  <div class="ex-tile">六</div>
</NyFlex>`

const codeFill = `<NyFlex :gap="10">
  <div class="ex-tile">固定列</div>

  <NyFlex fill direction="column" :gap="10">
    <div class="ex-box">fill: 占满固定列之外的宽度</div>
    <div class="ex-box">纵向排列, 两个块都跟着拉伸</div>
  </NyFlex>
</NyFlex>`

const apiProps = [
  { name: 'direction', desc: '主轴方向', type: "'row' | 'column' | 'row-reverse' | 'column-reverse'", default: "'row'" },
  { name: 'align', desc: '交叉轴对齐', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", default: "'stretch'" },
  { name: 'justify', desc: '主轴分布', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'" },
  { name: 'wrap', desc: '换行方式', type: "'nowrap' | 'wrap' | 'wrap-reverse'", default: "'nowrap'" },
  { name: 'gap', desc: '行间距与列间距同时生效', type: 'number', default: '12' },
  { name: 'rowGap', desc: '行间距, 覆盖 gap', type: 'number', default: 'gap' },
  { name: 'columnGap', desc: '列间距, 覆盖 gap', type: 'number', default: 'gap' },
  { name: 'inline', desc: '行内元素形式, 与文字并排', type: 'boolean', default: 'false' },
  { name: 'fill', desc: '自身占满父级里的剩余空间', type: 'boolean', default: 'false' },
]

const apiSlots = [{ name: 'default', desc: '参与伸缩的子元素' }]
</script>

<template>
  <DocPage title="Flex 弹性布局" desc="flex 的薄封装, 精确控制伸缩与对齐">

    <DemoBlock
      title="基础用法"
      desc="默认横向排列, 子元素按内容宽度, 间距用 gap 一次给全。"
      :code="codeBasic"
    >
      <NyFlex :gap="12">
        <div class="ex-tile">一</div>
        <div class="ex-tile">二</div>
        <div class="ex-tile">三</div>
      </NyFlex>
    </DemoBlock>

    <DemoBlock
      title="方向"
      desc="direction 支持四个方向, 反向排列时子元素顺序不变, 起点换到另一端。"
      :code="codeDirection"
      :value="directionValue"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton
            v-for="item in directions"
            :key="item"
            size="sm"
            :variant="direction === item ? 'primary' : 'ghost'"
            @click="direction = item"
          >
            {{ item }}
          </NyButton>
        </div>

        <NyFlex :direction="direction" :gap="12">
          <div class="ex-tile">一</div>
          <div class="ex-tile">二</div>
          <div class="ex-tile">三</div>
        </NyFlex>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="对齐与分布"
      desc="justify 管主轴分布, align 管交叉轴对齐, 用一条高矮不齐的项看得最清楚。"
      :code="codeAlign"
      :value="alignValue"
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

        <NyFlex :justify="justify" :align="align" :gap="12">
          <div class="ex-tile">一</div>
          <div class="ex-tile ex-tile--tall">二</div>
          <div class="ex-tile">三</div>
        </NyFlex>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="换行与轴向间距"
      desc="wrap 控制换行, rowGap 与 columnGap 分别覆盖行, 列间距。"
      :code="codeWrap"
      :value="wrapValue"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton
            v-for="item in wraps"
            :key="item"
            size="sm"
            :variant="wrap === item ? 'primary' : 'ghost'"
            @click="wrap = item"
          >
            {{ item }}
          </NyButton>
        </div>

        <NyFlex :wrap="wrap" :row-gap="16" :column-gap="8">
          <div class="ex-tile">一</div>
          <div class="ex-tile">二</div>
          <div class="ex-tile">三</div>
          <div class="ex-tile">四</div>
          <div class="ex-tile">五</div>
          <div class="ex-tile">六</div>
        </NyFlex>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="占满剩余空间与行内"
      desc="fill 让这一项吃掉剩余空间, inline 让它跟文字排在同一行。"
      :code="codeFill"
    >
      <NyStack :gap="14">
        <NyFlex :gap="10">
          <div class="ex-tile">固定列</div>

          <NyFlex fill direction="column" :gap="10">
            <div class="ex-box">fill: 占满固定列之外的宽度</div>
            <div class="ex-box">纵向排列, 两个块都跟着拉伸</div>
          </NyFlex>
        </NyFlex>

        <p>
          状态:
          <NyFlex inline :gap="6">
            <span class="ex-value">进行中</span>
            <span class="ex-value">已归档</span>
          </NyFlex>
        </p>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyFlex Props" :rows="apiProps" />
      <ApiTable title="NyFlex 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
