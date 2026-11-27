<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyFlex, NyRow, NyStack } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const aligns = ['stretch', 'start', 'center', 'end'] as const
const align = ref<'stretch' | 'start' | 'center' | 'end'>('stretch')

const gaps = [8, 16, 24, 32]
const gap = ref(16)

const alignValue = computed(() => `align = '${align.value}'`)
const gapValue = computed(() => `gap = ${gap.value}`)

const codeBasic = `<NyStack :gap="16">
  <div class="ex-box">标题</div>
  <div class="ex-box">正文</div>
  <div class="ex-box">备注</div>
</NyStack>`

const codeGap = `<NyStack :gap="gap">
  <div class="ex-box">第一段</div>
  <div class="ex-box">第二段</div>
  <div class="ex-box">第三段</div>
</NyStack>`

const codeAlign = `<NyStack :align="align" :gap="12">
  <div class="ex-tile">一</div>
  <div class="ex-tile">二</div>
  <div class="ex-tile">三</div>
</NyStack>`

const codeFill = `<NyFlex :gap="12" align="stretch">
  <div class="ex-tile">固定列</div>

  <NyStack fill :gap="10">
    <div class="ex-box">fill: 占满剩余宽度</div>
    <div class="ex-box">两个块一起拉伸到同行高度</div>
  </NyStack>
</NyFlex>`

const codeCompose = `<NyStack :gap="10">
  <div class="ex-box">卡片标题</div>
  <div class="ex-box">卡片正文</div>

  <NyRow justify="end" :gap="8">
    <NyButton size="sm" variant="ghost">取消</NyButton>
    <NyButton size="sm" variant="primary">保存</NyButton>
  </NyRow>
</NyStack>`

const apiProps = [
  { name: 'gap', desc: '子元素之间的纵向间距', type: 'number', default: '16' },
  { name: 'align', desc: '交叉轴对齐', type: "'stretch' | 'start' | 'center' | 'end'", default: "'stretch'" },
  { name: 'fill', desc: '自身占满父级里的剩余空间', type: 'boolean', default: 'false' },
]

const apiSlots = [{ name: 'default', desc: '纵向堆叠的若干子元素' }]
</script>

<template>
  <DocPage title="Stack 纵向布局" desc="纵向堆叠, 可撑满剩余高度">

    <DemoBlock
      title="基础用法"
      desc="默认纵向排列, 子元素宽度拉伸对齐, 间距由 gap 统一给。"
      :code="codeBasic"
    >
      <NyStack :gap="16">
        <div class="ex-box">标题</div>
        <div class="ex-box">正文</div>
        <div class="ex-box">备注</div>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="间距"
      desc="gap 决定纵向节奏, 越大的值越像分组之间的留白。"
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

        <NyStack :gap="gap">
          <div class="ex-box">第一段</div>
          <div class="ex-box">第二段</div>
          <div class="ex-box">第三段</div>
        </NyStack>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="对齐"
      desc="align 控制横向对齐, stretch 拉伸撑满, 其余按内容宽度贴边或居中。"
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

        <NyStack :align="align" :gap="12">
          <div class="ex-tile">一</div>
          <div class="ex-tile">二</div>
          <div class="ex-tile">三</div>
        </NyStack>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="撑满剩余空间"
      desc="fill 让纵向布局在弹性父级里吃掉剩余空间, 高度也跟着同一行的伙伴对齐。"
      :code="codeFill"
    >
      <NyFlex :gap="12" align="stretch">
        <div class="ex-tile">固定列</div>

        <NyStack fill :gap="10">
          <div class="ex-box">fill: 占满剩余宽度</div>
          <div class="ex-box">两个块一起拉伸到同行高度</div>
        </NyStack>
      </NyFlex>
    </DemoBlock>

    <DemoBlock
      title="组合排布"
      desc="纵向分层配一行右对齐的操作按钮, 卡片内容基本就是这个结构。"
      :code="codeCompose"
    >
      <NyStack :gap="10">
        <div class="ex-box">卡片标题</div>
        <div class="ex-box">卡片正文</div>

        <NyRow justify="end" :gap="8">
          <NyButton size="sm" variant="ghost">取消</NyButton>
          <NyButton size="sm" variant="primary">保存</NyButton>
        </NyRow>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyStack Props" :rows="apiProps" />
      <ApiTable title="NyStack 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
