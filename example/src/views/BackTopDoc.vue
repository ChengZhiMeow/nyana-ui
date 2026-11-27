<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { NyBackTop, NyIcon, NySpace } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const scroller = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const clickCount = ref(0)

function onScroll() {
  scrollTop.value = scroller.value?.scrollTop ?? 0
}

function onBackTopClick() {
  clickCount.value += 1
}

function stateText(height: number) {
  const shown = scrollTop.value > height ? '按钮已出现' : '按钮未出现'

  return `内容区 scrollTop ${scrollTop.value}px · 阈值 ${height}px · ${shown}`
}

onMounted(() => {
  scroller.value = document.querySelector<HTMLElement>('.ny-layout__main')
  scroller.value?.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  scroller.value?.removeEventListener('scroll', onScroll)
})

const codeBasic = `<!-- 缺省 target 监听 window: 内部取 document.scrollingElement -->
<!-- 内容区自己滚动时把选择器传给 target, 位置用 right / bottom 微调 -->
<NyBackTop target=".ny-layout__main" :bottom="92" />`

const codeHeight = `<!-- 阈值调小, 比默认的 240px 更早浮出按钮 -->
<NyBackTop target=".ny-layout__main" :visibility-height="200" :bottom="148" />`

const codePosition = `<!-- right / bottom 是相对视口的偏移量, 用来避开其他固定元素 -->
<NyBackTop target=".ny-layout__main" :right="84" :bottom="32" />`

const codeSlot = `<!-- 默认插槽换内容, size 只改按钮直径 -->
<NyBackTop target=".ny-layout__main" size="sm" :right="144" />

<NyBackTop target=".ny-layout__main" :right="200">
  <NyIcon name="arrow-up" :size="22" />
</NyBackTop>

<NyBackTop target=".ny-layout__main" size="lg" :right="256">顶</NyBackTop>`

const codeClick = `<NyBackTop target=".ny-layout__main" :right="312" @click="onClick" />

function onClick(event: MouseEvent) {
  console.log('回到顶部', event.timeStamp)
}`

const apiProps = [
  { name: 'target', desc: '滚动容器的选择器或元素; 缺省监听 window, 内部取 document.scrollingElement', type: 'string | HTMLElement', default: "''" },
  { name: 'visibilityHeight', desc: '滚动超过多少像素后浮出按钮', type: 'number', default: '240' },
  { name: 'right', desc: '距视口右侧的距离 (px)', type: 'number', default: '24' },
  { name: 'bottom', desc: '距视口底部的距离 (px)', type: 'number', default: '32' },
  { name: 'size', desc: '尺寸档位, 决定按钮直径', type: "'sm' | 'md' | 'lg'", default: "'md'" },
]

const apiEvents = [
  { name: 'click', desc: '点击按钮后触发, 平滑滚动已经在组件里发起', type: 'MouseEvent' },
]

const apiSlots = [
  { name: 'default', desc: '自定义按钮内容, 缺省是箭头图标; 按钮直径固定, 内容别超长', type: '—' },
]
</script>

<template>
  <DocPage title="BackTop 回到顶部" desc="滚动后出现的一键回顶按钮">

    <DemoBlock
      title="基础用法"
      desc="缺省监听 window; 文档站的内容区是内部滚动容器 .ny-layout__main, 所以演示把 target 指向它, 并用 bottom 与页面右下角的全局按钮错开。"
      :code="codeBasic"
      :value="stateText(240)"
    >
      <NySpace direction="vertical" align="start">
        <span class="ex-note">向下滚动本页内容区超过 240px, 右下角会浮出按钮; 点击后平滑回到顶部。</span>
        <span class="ex-note">按钮通过 Teleport 挂到 body, 是 fixed 定位, 所以它会跟着视口而不是跟着演示块。</span>
      </NySpace>

      <NyBackTop target=".ny-layout__main" :bottom="92" />
    </DemoBlock>

    <DemoBlock
      title="自定义阈值"
      desc="visibilityHeight 调小, 滚动一点点就会浮出按钮; 这个演示给 200px, 比默认的 240px 略早一点。"
      :code="codeHeight"
      :value="stateText(200)"
    >
      <span class="ex-note">阈值 200px: 页面刚滚一点点不会冒出来, 免得刚进来就有一堆按钮飘在右下角。</span>

      <NyBackTop target=".ny-layout__main" :visibility-height="200" :bottom="148" />
    </DemoBlock>

    <DemoBlock
      title="自定义位置"
      desc="right 与 bottom 是相对视口的偏移量, 用来避开聊天入口这类固定在右下角的东西。"
      :code="codePosition"
      :value="stateText(240)"
    >
      <span class="ex-note">这个按钮往左挪到 right 84px, 与页面右下角的全局按钮并排。</span>

      <NyBackTop target=".ny-layout__main" :right="84" :bottom="32" />
    </DemoBlock>

    <DemoBlock
      title="自定义内容与尺寸"
      desc="默认插槽可以换成任意图标或文字, size 只改按钮直径。"
      :code="codeSlot"
      :value="`三档尺寸: sm / md / lg · ${stateText(240)}`"
    >
      <span class="ex-note">从左到右: 小号默认图标、中号自定义图标、大号文字。</span>

      <NyBackTop target=".ny-layout__main" size="sm" :right="144" :bottom="32" />

      <NyBackTop target=".ny-layout__main" :right="200" :bottom="32">
        <NyIcon name="arrow-up" :size="22" />
      </NyBackTop>

      <NyBackTop target=".ny-layout__main" size="lg" :right="256" :bottom="32">顶</NyBackTop>
    </DemoBlock>

    <DemoBlock
      title="点击事件"
      desc="点击后先发起平滑滚动, 再抛 click, 可以在里面做埋点或收起其他浮层。"
      :code="codeClick"
      :value="`点击次数: ${clickCount} · ${stateText(240)}`"
    >
      <span class="ex-note">点一下右侧这个按钮, 计数会加一, 同时内容区滚回顶部。</span>

      <NyBackTop target=".ny-layout__main" :right="312" :bottom="32" @click="onBackTopClick" />
    </DemoBlock>

    <template #api>
      <NySpace direction="vertical" align="start" size="lg" block>
        <ApiTable title="NyBackTop Props" :rows="apiProps" />
        <ApiTable title="NyBackTop 事件" kind="events" :rows="apiEvents" />
        <ApiTable title="NyBackTop 插槽" kind="slots" :rows="apiSlots" />
      </NySpace>

      <p class="ex-note">其余属性透传到内部 button 上 (inheritAttrs: false), 可以补 title 或 aria-label。</p>
    </template>
  </DocPage>
</template>
