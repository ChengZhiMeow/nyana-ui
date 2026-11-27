<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyCarousel, NySlider, NySwitch } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const slides = ['第 1 屏 春夏新品已经上架', '第 2 屏 限时活动还剩两天', '第 3 屏 看看别人怎么用']

const basic = ref(0)
const fade = ref(0)
const manual = ref(0)
const auto = ref(0)
const loop = ref(0)
const custom = ref(0)

const autoplay = ref(true)
const speed = ref<number | [number, number]>(4000)

function step(offset: number) {
  manual.value = (manual.value + offset + slides.length) % slides.length
}

const basicText = computed(() => `当前第 ${basic.value + 1} / ${slides.length} 张`)

const fadeText = computed(() => `当前第 ${fade.value + 1} / ${slides.length} 张`)

const manualText = computed(() => `当前第 ${manual.value + 1} / ${slides.length} 张`)

const autoText = computed(() => `autoplay: ${autoplay.value} | interval: ${Number(speed.value)} ms`)

const loopText = computed(() => {
  const edge = loop.value === 0 ? ', 上一张已禁用' : loop.value === slides.length - 1 ? ', 下一张已禁用' : ''

  return `当前第 ${loop.value + 1} / ${slides.length} 张${edge}`
})

const customText = computed(() => `当前第 ${custom.value + 1} / ${slides.length} 张`)

const codeBasic = `<NyCarousel v-model:active-index="basic" :height="112">
  <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
</NyCarousel>

const slides = ['第 1 屏 春夏新品已经上架', '第 2 屏 限时活动还剩两天', '第 3 屏 看看别人怎么用']
const basic = ref(0)`

const codeFade = `<NyCarousel v-model:active-index="fade" effect="fade" :height="112">
  <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
</NyCarousel>`

const codeManual = `<NyCarousel
  v-model:active-index="manual"
  :autoplay="false"
  :dots="false"
  :arrows="false"
  :height="112"
>
  <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
</NyCarousel>

<NyButton size="sm" @click="step(-1)">上一张</NyButton>
<NyButton size="sm" variant="primary" @click="step(1)">下一张</NyButton>

function step(offset: number) {
  manual.value = (manual.value + offset + slides.length) % slides.length
}`

const codeAutoplay = `<NySwitch v-model:checked="autoplay" checked-text="自动播放" unchecked-text="手动" />

<NySlider v-model="speed" :min="1000" :max="8000" :step="500" />

<NyCarousel v-model:active-index="auto" :autoplay="autoplay" :interval="Number(speed)" :height="112">
  <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
</NyCarousel>`

const codeLoop = `<NyCarousel v-model:active-index="loop" :loop="false" :height="112">
  <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
</NyCarousel>`

const codeCustom = `<NyCarousel v-model:active-index="custom" :height="112">
  <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>

  <template #dots="{ index, count }">
    <span class="ex-value">{{ index + 1 }} / {{ count }}</span>
  </template>
</NyCarousel>`

const apiProps = [
  { name: 'v-model:active-index', desc: '当前幻灯片索引', type: 'number', default: '0' },
  { name: 'autoplay', desc: '是否自动播放', type: 'boolean', default: 'true' },
  { name: 'interval', desc: '自动播放间隔, 单位 ms', type: 'number', default: '4000' },
  { name: 'dots', desc: '是否显示指示点', type: 'boolean', default: 'true' },
  { name: 'arrows', desc: '是否显示左右箭头', type: 'boolean', default: 'true' },
  { name: 'effect', desc: '切换效果', type: "'slide' | 'fade'", default: "'slide'" },
  { name: 'pauseOnHover', desc: '鼠标悬浮时暂停自动播放', type: 'boolean', default: 'true' },
  { name: 'loop', desc: '是否循环, 关掉后到边界即停', type: 'boolean', default: 'true' },
  { name: 'height', desc: '组件高度, 数字按 px 处理', type: 'number | string', default: '220' },
  { name: 'draggable', desc: '是否支持指针拖拽切换', type: 'boolean', default: 'true' },
]

const apiEvents = [
  {
    name: 'change',
    desc: '索引变化后触发, 自动播放与拖拽也算',
    type: '(payload: { index: number; prevIndex: number }) => void',
  },
  { name: 'update:activeIndex', desc: 'defineModel 回传的索引', type: '(value: number) => void' },
]

const apiSlots = [
  { name: 'default', desc: '幻灯片, 每个子节点一张, 顺序即展示顺序', type: '—' },
  {
    name: 'dots',
    desc: '自定义指示点内容, 顶替默认圆点',
    type: '{ index: number; count: number; go: (index: number) => void }',
  },
]
</script>

<template>
  <DocPage title="Carousel 走马灯" desc="轮播一组内容, 支持自动播放与指示点。">

    <DemoBlock
      title="基础用法"
      desc="默认插槽的每个子节点就是一张幻灯片, 顺序即展示顺序; 默认自动播放, 有指示点与箭头。"
      :code="codeBasic"
      :value="basicText"
    >
      <NyCarousel v-model:active-index="basic" :height="112">
        <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
      </NyCarousel>
    </DemoBlock>

    <DemoBlock
      title="淡入淡出"
      desc="effect 换成 fade 后幻灯片叠放在一起, 用透明度切换, 适合文案类的轻内容。"
      :code="codeFade"
      :value="fadeText"
    >
      <NyCarousel v-model:active-index="fade" effect="fade" :height="112">
        <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
      </NyCarousel>
    </DemoBlock>

    <DemoBlock
      title="手动控制"
      desc="指示点与箭头都能关掉, 用 v-model:active-index 自己接管翻页。"
      :code="codeManual"
      :value="manualText"
    >
      <NyCarousel
        v-model:active-index="manual"
        :autoplay="false"
        :dots="false"
        :arrows="false"
        :height="112"
      >
        <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
      </NyCarousel>

      <div class="ex-group">
        <NyButton size="sm" @click="step(-1)">上一张</NyButton>
        <NyButton size="sm" variant="primary" @click="step(1)">下一张</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="自动播放与间隔"
      desc="interval 决定停留时长; 鼠标移到轮播上会暂停, 移开继续, 这是 pauseOnHover 的默认行为。"
      :code="codeAutoplay"
      :value="autoText"
    >
      <div class="ex-group">
        <NySwitch v-model:checked="autoplay" checked-text="自动播放" unchecked-text="手动" />
      </div>

      <NySlider v-model="speed" :min="1000" :max="8000" :step="500" />

      <NyCarousel
        v-model:active-index="auto"
        :autoplay="autoplay"
        :interval="Number(speed)"
        :height="112"
      >
        <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
      </NyCarousel>
    </DemoBlock>

    <DemoBlock
      title="不循环与拖拽"
      desc="loop 关掉后停在两端, 箭头随之禁用; 按住幻灯片左右拖动同样可以切换, 位移超过 40px 才算数。"
      :code="codeLoop"
      :value="loopText"
    >
      <NyCarousel v-model:active-index="loop" :loop="false" :height="112">
        <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>
      </NyCarousel>
    </DemoBlock>

    <DemoBlock
      title="自定义指示点"
      desc="dots 插槽接在默认指示点的位置上, 可以换成自己的进度写法。"
      :code="codeCustom"
      :value="customText"
    >
      <NyCarousel v-model:active-index="custom" :height="112">
        <div v-for="item in slides" :key="item" class="ex-tile ex-tile--tall">{{ item }}</div>

        <template #dots="{ index, count }">
          <span class="ex-value">{{ index + 1 }} / {{ count }}</span>
        </template>
      </NyCarousel>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyCarousel Props" :rows="apiProps" />
      <ApiTable title="NyCarousel 事件" :rows="apiEvents" kind="events" />
      <ApiTable title="NyCarousel 插槽" :rows="apiSlots" kind="slots" />
    </template>
  </DocPage>
</template>
