<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyIcon, NyStack, nyMessage } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
const size = ref<'sm' | 'md' | 'lg'>('md')

const count = ref(0)
const loading = ref(false)

function submit() {
  loading.value = true

  window.setTimeout(() => {
    loading.value = false
    nyMessage.success('提交完成')
  }, 1200)
}

function notify() {
  nyMessage.success('已保存')
}

const codeVariant = `<div class="ex-group">
  <NyButton>默认按钮</NyButton>
  <NyButton variant="primary">主要按钮</NyButton>
  <NyButton variant="secondary">次要按钮</NyButton>
  <NyButton variant="ghost">幽灵按钮</NyButton>
  <NyButton variant="danger">危险按钮</NyButton>
  <NyButton variant="text">文字按钮</NyButton>
</div>`

const codeSize = `<div class="ex-group">
  <NyButton
    v-for="item in sizes"
    :key="item"
    size="sm"
    :variant="item === size ? 'primary' : 'default'"
    @click="size = item"
  >
    {{ item }}
  </NyButton>
</div>

<div class="ex-group">
  <NyButton :size="size">方形</NyButton>
  <NyButton :size="size" variant="primary" shape="round">胶囊</NyButton>
  <NyButton :size="size" variant="secondary" shape="circle" icon-only icon="plus"></NyButton>
</div>`

const codeIcon = `<div class="ex-group">
  <NyButton variant="primary" icon="plus">新建</NyButton>

  <NyButton>
    <template #icon>
      <NyIcon name="download" :size="15" />
    </template>
    下载
  </NyButton>

  <NyButton icon-only icon="search"></NyButton>
  <NyButton icon-only icon="more-horizontal" shape="circle"></NyButton>
  <NyButton variant="text" icon-only icon="edit"></NyButton>
</div>`

const codeLoading = `<div class="ex-group">
  <NyButton variant="primary" :loading="loading" @click="submit">
    {{ loading ? '提交中' : '提交' }}
  </NyButton>

  <NyButton :loading="true">加载中</NyButton>
  <NyButton :disabled="true">禁用</NyButton>
  <NyButton variant="primary" :disabled="true">禁用主按钮</NyButton>
</div>`

const codeEvent = `<div class="ex-group">
  <NyButton variant="primary" icon="check" @click="count += 1">点击计数</NyButton>
  <NyButton variant="text" @click="count = 0">清零</NyButton>
</div>

<NyButton variant="secondary" :block="true" @click="notify">通栏按钮</NyButton>`

const apiProps = [
  { name: 'variant', desc: '按钮风格, 决定强调程度', type: "'default' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'text'", default: "'default'" },
  { name: 'size', desc: '尺寸档, 对应三档控件高度', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'shape', desc: '外形, circle 只在纯图标按钮上用', type: "'default' | 'round' | 'circle'", default: "'default'" },
  { name: 'type', desc: '原生 button 的 type', type: "'button' | 'submit' | 'reset'", default: "'button'" },
  { name: 'icon', desc: '左侧图标名, 等价于 #icon 插槽', type: 'string', default: "''" },
  { name: 'disabled', desc: '禁用, 不可点击', type: 'boolean', default: 'false' },
  { name: 'loading', desc: '显示旋转图标并屏蔽点击', type: 'boolean', default: 'false' },
  { name: 'block', desc: '撑满父级宽度', type: 'boolean', default: 'false' },
  { name: 'iconOnly', desc: '纯图标按钮, 固定正方形宽度', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'click', desc: '点击按钮时触发, 加载与禁用状态下不触发', type: 'MouseEvent' },
]

const apiSlots = [
  { name: 'default', desc: '按钮文字, 与 #icon 同时存在时排在图标右侧' },
  { name: 'icon', desc: '自定义左侧图标, 与 icon 属性二选一' },
]
</script>

<template>
  <DocPage title="Button 按钮" desc="触发一个即时操作, 六种风格与三档尺寸">

    <DemoBlock title="按钮类型" desc="variant 决定强调程度, primary 之外都属于次级操作。" :code="codeVariant">
      <div class="ex-group">
        <NyButton>默认按钮</NyButton>
        <NyButton variant="primary">主要按钮</NyButton>
        <NyButton variant="secondary">次要按钮</NyButton>
        <NyButton variant="ghost">幽灵按钮</NyButton>
        <NyButton variant="danger">危险按钮</NyButton>
        <NyButton variant="text">文字按钮</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸与外形"
      desc="size 控制三档高度, shape 控制圆角外形。"
      :code="codeSize"
      :value="'当前尺寸: ' + size"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton
            v-for="item in sizes"
            :key="item"
            size="sm"
            :variant="item === size ? 'primary' : 'default'"
            @click="size = item"
          >
            {{ item }}
          </NyButton>
        </div>

        <div class="ex-group">
          <NyButton :size="size">方形</NyButton>
          <NyButton :size="size" variant="primary" shape="round">胶囊</NyButton>
          <NyButton :size="size" variant="secondary" shape="circle" icon-only icon="plus"></NyButton>
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock title="图标按钮" desc="icon 属性最省事, 需要自定义图标时用 #icon 插槽。" :code="codeIcon">
      <div class="ex-group">
        <NyButton variant="primary" icon="plus">新建</NyButton>

        <NyButton>
          <template #icon>
            <NyIcon name="download" :size="15" />
          </template>
          下载
        </NyButton>

        <NyButton icon-only icon="search"></NyButton>
        <NyButton icon-only icon="more-horizontal" shape="circle"></NyButton>
        <NyButton variant="text" icon-only icon="edit"></NyButton>
      </div>
    </DemoBlock>

    <DemoBlock title="加载与禁用" desc="点击提交按钮进入加载态, 1.2 秒后恢复并弹出提示。" :code="codeLoading">
      <div class="ex-group">
        <NyButton variant="primary" :loading="loading" @click="submit">
          {{ loading ? '提交中' : '提交' }}
        </NyButton>

        <NyButton :loading="true">加载中</NyButton>
        <NyButton :disabled="true">禁用</NyButton>
        <NyButton variant="primary" :disabled="true">禁用主按钮</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="事件与通栏"
      desc="click 抛原生 MouseEvent; block 让按钮撑满父级宽度。"
      :code="codeEvent"
      :value="'点击次数: ' + count"
    >
      <NyStack :gap="12">
        <div class="ex-group">
          <NyButton variant="primary" icon="check" @click="count += 1">点击计数</NyButton>
          <NyButton variant="text" @click="count = 0">清零</NyButton>
        </div>

        <NyButton variant="secondary" :block="true" @click="notify">通栏按钮</NyButton>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyButton Props" :rows="apiProps" />
      <ApiTable title="NyButton 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyButton 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
