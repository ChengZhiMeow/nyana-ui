<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NySplit, NyStack } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const width = ref(260)
const collapsed = ref(false)

const widthValue = computed(() => `width = ${width.value}px`)
const collapsedValue = computed(() => `collapsed = ${collapsed.value}`)

const codeBasic = `<NySplit>
  <template #side>
    <NyStack :gap="8">
      <div class="ex-tile">列表项一</div>
      <div class="ex-tile">列表项二</div>
      <div class="ex-tile">列表项三</div>
    </NyStack>
  </template>

  <div class="ex-box">主区: 选中项的内容</div>
</NySplit>`

const codeResizable = `<NySplit v-model:width="width" resizable :min="180" :max="420">
  <template #side>
    <div class="ex-box">侧栏 {{ width }}px</div>
  </template>

  <div class="ex-box">主区</div>
</NySplit>`

const codeEnd = `<NySplit side="end" :gap="20" :width="220">
  <template #side>
    <div class="ex-box">属性面板</div>
  </template>

  <div class="ex-box">主区在左侧</div>
</NySplit>`

const codeCollapsible = `<NySplit v-model:collapsed="collapsed" collapsible :width="240">
  <template #side>
    <div class="ex-box">侧栏</div>
  </template>

  <div class="ex-box">主区右上角的按钮收回侧栏</div>
</NySplit>`

const codeFill = `<div class="ex-preview">
  <NySplit fill :width="200">
    <template #side>
      <NyStack :gap="10">
        <div class="ex-tile">条目一</div>
        <div class="ex-tile">条目二</div>
        <div class="ex-tile">条目三</div>
        <div class="ex-tile">条目四</div>
        <div class="ex-tile">条目五</div>
      </NyStack>
    </template>

    <div class="ex-box">主区</div>
  </NySplit>
</div>`

const apiProps = [
  { name: 'side', desc: '侧栏在哪一侧', type: "'start' | 'end'", default: "'start'" },
  { name: 'min', desc: '拖拽时的最小宽度', type: 'number', default: '180' },
  { name: 'max', desc: '拖拽时的最大宽度', type: 'number', default: '520' },
  { name: 'resizable', desc: '显示分隔条, 可拖拽或用方向键调宽', type: 'boolean', default: 'false' },
  { name: 'collapsible', desc: '显示主区右上角的收起按钮', type: 'boolean', default: 'false' },
  { name: 'collapseBelow', desc: '小于该宽度时两栏改成上下堆叠', type: 'number', default: '768' },
  { name: 'gap', desc: '两栏之间的间距', type: 'number', default: '16' },
  { name: 'fill', desc: '撑满父容器高度, 适合固定高度的面板', type: 'boolean', default: 'false' },
  { name: 'v-model:width', desc: '侧栏宽度', type: 'number', default: '280' },
  { name: 'v-model:collapsed', desc: '侧栏是否收起', type: 'boolean', default: 'false' },
]

const apiSlots = [
  { name: 'side', desc: '侧栏内容' },
  { name: 'default', desc: '主区内容' },
]

const apiEvents = [
  { name: 'update:width', desc: '拖拽或键盘调整后抛出的新宽度', type: 'number' },
  { name: 'update:collapsed', desc: '收起状态变化', type: 'boolean' },
]
</script>

<template>
  <DocPage title="Split 分栏" desc="主从两栏, 可拖拽调宽与收起">

    <DemoBlock
      title="基础用法"
      desc="侧栏在主区左侧, 宽度默认 280px, 窄屏会自动改成上下堆叠。"
      :code="codeBasic"
    >
      <NySplit>
        <template #side>
          <NyStack :gap="8">
            <div class="ex-tile">列表项一</div>
            <div class="ex-tile">列表项二</div>
            <div class="ex-tile">列表项三</div>
          </NyStack>
        </template>

        <div class="ex-box">主区: 选中项的内容</div>
      </NySplit>
    </DemoBlock>

    <DemoBlock
      title="拖拽调宽"
      desc="打开 resizable 后拖分隔条即可调宽, 也可以聚焦分隔条后用左右方向键调整。"
      :code="codeResizable"
      :value="widthValue"
    >
      <NySplit v-model:width="width" resizable :min="180" :max="420">
        <template #side>
          <div class="ex-box">侧栏 {{ width }}px</div>
        </template>

        <div class="ex-box">主区</div>
      </NySplit>
    </DemoBlock>

    <DemoBlock
      title="侧栏在右侧"
      desc="用 side='end' 把侧栏换到右边, 顺带演示 gap 控制两栏间距。"
      :code="codeEnd"
    >
      <NySplit side="end" :gap="20" :width="220">
        <template #side>
          <div class="ex-box">属性面板</div>
        </template>

        <div class="ex-box">主区在左侧</div>
      </NySplit>
    </DemoBlock>

    <DemoBlock
      title="收起侧栏"
      desc="打开 collapsible, 主区右上角出现收起按钮, 收起后两栏不再留空隙。"
      :code="codeCollapsible"
      :value="collapsedValue"
    >
      <NySplit v-model:collapsed="collapsed" collapsible :width="240">
        <template #side>
          <div class="ex-box">侧栏</div>
        </template>

        <div class="ex-box">主区右上角的按钮收回侧栏</div>
      </NySplit>
    </DemoBlock>

    <DemoBlock
      title="撑满高度"
      desc="打开 fill 后分栏高度撑满父容器, 适合放在固定高度的面板里。"
      :code="codeFill"
      backdrop="muted"
    >
      <div class="ex-preview">
        <NySplit fill :width="200">
          <template #side>
            <NyStack :gap="10">
              <div class="ex-tile">条目一</div>
              <div class="ex-tile">条目二</div>
              <div class="ex-tile">条目三</div>
              <div class="ex-tile">条目四</div>
              <div class="ex-tile">条目五</div>
            </NyStack>
          </template>

          <div class="ex-box">主区</div>
        </NySplit>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NySplit Props" :rows="apiProps" />
      <ApiTable title="NySplit 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable title="NySplit 事件" kind="events" :rows="apiEvents" />
    </template>
  </DocPage>
</template>
