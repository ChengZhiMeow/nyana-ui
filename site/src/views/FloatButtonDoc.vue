<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyFloatButton, NyIcon, NyRow } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const basicCount = ref(0)
const basicLast = ref('未点击')
const linkCount = ref(0)
const cornerCount = ref(0)

const circleSizes: { value: 'sm' | 'md' | 'lg'; label: string }[] = [
  { value: 'sm', label: '小' },
  { value: 'md', label: '中' },
  { value: 'lg', label: '大' },
]

const corners: { value: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'; label: string }[] = [
  { value: 'topRight', label: '右上' },
  { value: 'topLeft', label: '左上' },
  { value: 'bottomRight', label: '右下' },
  { value: 'bottomLeft', label: '左下' },
]

const cornerOffsets: { label: string; value: [number, number] }[] = [
  { label: '[24, 96]', value: [24, 96] },
  { label: '[24, 24]', value: [24, 24] },
]

const corner = ref<'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'>('bottomRight')
const cornerOffsetIndex = ref(0)
const cornerVisible = ref(true)

const cornerOffset = computed(() => cornerOffsets[cornerOffsetIndex.value].value)

const basicInfo = computed(() => `点击次数 = ${basicCount.value} · 最近点击 = ${basicLast.value}`)

const cornerInfo = computed(
  () => `target = ${corner.value} · offset = ${cornerOffsets[cornerOffsetIndex.value].label} · visible = ${cornerVisible.value}`,
)

function onClickBasic(variant: string) {
  basicCount.value += 1
  basicLast.value = variant
}

const codeBasic = `<!-- variant 决定配色, size 决定直径, 都可以在浮出与禁用状态下复用 -->
<div class="ex-group">
  <NyFloatButton icon="plus" @click="onClickBasic('default')" />
  <NyFloatButton variant="primary" icon="plus" @click="onClickBasic('primary')" />
  <NyFloatButton variant="solid" icon="check" @click="onClickBasic('solid')" />
</div>

function onClickBasic(variant: string) {
  basicCount += 1
  basicLast = variant
}`

const codeSize = `<div class="ex-group">
  <!-- 圆形三档直径: 40 / 48 / 56 -->
  <NyFloatButton size="sm" icon="plus" />
  <NyFloatButton icon="plus" />
  <NyFloatButton size="lg" icon="plus" />

  <!-- 传了 description 就是方形卡片 -->
  <NyFloatButton description="新建" icon="plus" />
  <NyFloatButton shape="square" size="sm" description="导出" icon="download" />
  <NyFloatButton shape="square" size="lg" description="发布" icon="upload" />
</div>`

const codeSlot = `<!-- 默认插槽覆盖图标区, #icon 优先于默认插槽, #description 优先于 description 属性 -->
<div class="ex-group">
  <NyFloatButton icon="plus" />

  <NyFloatButton>
    <template #icon>
      <NyIcon name="heart" :size="20" />
    </template>
  </NyFloatButton>

  <NyFloatButton>
    <NyIcon name="search" :size="20" />
  </NyFloatButton>

  <NyFloatButton description="帮助" icon="question-circle">
    <template #description>客服</template>
  </NyFloatButton>
</div>`

const codeBadge = `<div class="ex-group">
  <!-- 数字走 NyBadge 的 count, 超过 99 显示成 99+ -->
  <NyFloatButton icon="bell" badge="5" tooltip="待办通知" />
  <NyFloatButton variant="primary" icon="mail" :badge="120" tooltip="未读私信" />

  <!-- 字符串走 NyBadge 的 text, 适合 "新" 这类短标记 -->
  <NyFloatButton icon="question-circle" badge="新" tooltip="帮助中心" />
</div>`

const codeLink = `<div class="ex-group">
  <!-- 有 href 就渲染成 a 标签, 键盘回车同样能跳 -->
  <NyFloatButton href="#float-button-links" icon="link" tooltip="页内跳转" />
  <NyFloatButton href="#float-button-links" description="文档" icon="book" />

  <!-- 禁用后既不抛 click 也不跳转 -->
  <NyFloatButton disabled icon="plus" tooltip="已禁用" />
  <NyFloatButton disabled href="#float-button-links" description="不可点" icon="ban" />
</div>`

const codeCorner = `const corner = ref('bottomRight')
const cornerOffset = ref<[number, number]>([24, 96])
const cornerVisible = ref(true)

<!-- 有 target 就 Teleport 到 body 并固定在那个角落, offset 是 [水平, 垂直] -->
<NyFloatButton
  :target="corner"
  :offset="cornerOffset"
  :visible="cornerVisible"
  icon="arrow-up"
  variant="primary"
  tooltip="固定在角落"
  @click="cornerCount += 1"
/>`

const apiProps = [
  { name: 'shape', desc: '外形, 传了 description 时按方形卡片排版', type: "'circle' | 'square'", default: "'circle'" },
  { name: 'size', desc: '圆形直径 40 / 48 / 56, 方形时是最小边长', type: 'NySize', default: "'md'" },
  { name: 'variant', desc: '配色风格', type: "'default' | 'primary' | 'solid'", default: "'default'" },
  { name: 'icon', desc: '图标名, 取自 icons.ts, 等价于写 <template #icon>', type: 'string', default: "''" },
  { name: 'description', desc: '图标下方的文案, 有值时按方形卡片排版', type: 'string', default: "''" },
  { name: 'badge', desc: '右上角徽标, 数字走 NyBadge 的 count, 字符串走 text', type: 'string | number', default: 'undefined' },
  { name: 'tooltip', desc: '悬浮与聚焦时出现的提示文案', type: 'string', default: "''" },
  { name: 'href', desc: '有值时渲染成 a 标签, 不再用 button', type: 'string', default: "''" },
  {
    name: 'target',
    desc: '固定在视口的哪个角落, 有值时 Teleport 到 body 并脱离文档流',
    type: "'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'",
    default: 'undefined',
  },
  { name: 'offset', desc: '距角落的偏移 [水平, 垂直] (px)', type: '[number, number]', default: '[24, 24]' },
  { name: 'disabled', desc: '禁用, 不抛 click 也不跳转', type: 'boolean', default: 'false' },
  { name: 'visible', desc: '是否显示, 适合做可以收起的常驻入口', type: 'boolean', default: 'true' },
]

const apiEvents = [{ name: 'click', desc: '点击按钮时触发, 禁用时不触发', type: 'MouseEvent' }]

const apiSlots = [
  { name: 'default', desc: '图标区内容, 覆盖 icon 属性', type: '—' },
  { name: 'icon', desc: '图标区内容, 优先于默认插槽', type: '—' },
  { name: 'description', desc: '方形卡片里图标下方的文案, 优先于 description 属性', type: '—' },
]
</script>

<template>
  <DocPage title="FloatButton 悬浮按钮" desc="固定在角落的操作按钮与按钮组">

    <DemoBlock
      title="基础用法"
      desc="variant 决定配色, size 决定直径; 没有 target 时它就待在文档流里, 跟着排布走。"
      :code="codeBasic"
      :value="basicInfo"
    >
      <div class="ex-group">
        <NyFloatButton icon="plus" @click="onClickBasic('default')" />
        <NyFloatButton variant="primary" icon="plus" @click="onClickBasic('primary')" />
        <NyFloatButton variant="solid" icon="check" @click="onClickBasic('solid')" />
      </div>

      <p class="ex-note">点一下任意一个按钮, 上面的计数会加一, 并记下最近点的是哪一种配色。</p>
    </DemoBlock>

    <DemoBlock
      title="尺寸与形状"
      desc="圆形三档直径是 40 / 48 / 56; 传了 description 就自动变成方形卡片, 不用再写 shape。"
      :code="codeSize"
      :value="`三档尺寸: ${circleSizes.map((item) => item.label).join(' / ')} · 方形卡片最小边长与同档圆形一致`"
    >
      <div class="ex-group">
        <NyFloatButton v-for="item in circleSizes" :key="item.value" :size="item.value" icon="plus" />

        <NyFloatButton description="新建" icon="plus" />
        <NyFloatButton shape="square" size="sm" description="导出" icon="download" />
        <NyFloatButton shape="square" size="lg" description="发布" icon="upload" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="图标与插槽"
      desc="icon 属性最省事; 要放任意内容就用插槽, #icon 与默认插槽都覆盖图标区, #description 覆盖文案。"
      :code="codeSlot"
    >
      <div class="ex-group">
        <NyFloatButton icon="plus" />

        <NyFloatButton>
          <template #icon>
            <NyIcon name="heart" :size="20" />
          </template>
        </NyFloatButton>

        <NyFloatButton>
          <NyIcon name="search" :size="20" />
        </NyFloatButton>

        <NyFloatButton description="帮助" icon="question-circle">
          <template #description>客服</template>
        </NyFloatButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="徽标与提示"
      desc="badge 直接透传给 NyBadge: 数字走 count 并受 max 限制, 字符串走 text; tooltip 走 NyTooltip。"
      :code="codeBadge"
    >
      <div class="ex-group">
        <NyFloatButton icon="bell" badge="5" tooltip="待办通知" />
        <NyFloatButton variant="primary" icon="mail" :badge="120" tooltip="未读私信" />
        <NyFloatButton icon="question-circle" badge="新" tooltip="帮助中心" />
      </div>

      <p class="ex-note">鼠标移到按钮上会浮出提示; 徽标默认贴在图标的右上角。</p>
    </DemoBlock>

    <DemoBlock
      title="链接与禁用"
      desc="有 href 时渲染成 a 标签; disabled 之后既不抛 click 也不跳转, 键盘也进不去。"
      :code="codeLink"
      :value="`点击次数 = ${linkCount}`"
    >
      <div id="float-button-links" class="ex-panel">
        <div class="ex-group">
          <NyFloatButton href="#float-button-links" icon="link" tooltip="页内跳转" @click="linkCount += 1" />
          <NyFloatButton href="#float-button-links" description="文档" icon="book" @click="linkCount += 1" />
          <NyFloatButton disabled icon="plus" tooltip="已禁用" />
          <NyFloatButton disabled href="#float-button-links" description="不可点" icon="ban" />
        </div>

        <p class="ex-note">演示里 href 用的是本页的锚点, 免得点一下把文档站整页替换掉。</p>
      </div>
    </DemoBlock>

    <DemoBlock
      title="固定在视口角落"
      desc="给了 target 就 Teleport 到 body 并固定在那个角落; 它会盖在页面右下角, 所以默认演示把 offset 往上抬, 避开文档站自己的入口按钮。"
      :code="codeCorner"
      :value="cornerInfo"
    >
      <NyRow :gap="8">
        <NyButton
          v-for="item in corners"
          :key="item.value"
          size="sm"
          :variant="corner === item.value ? 'primary' : 'default'"
          @click="corner = item.value"
        >
          {{ item.label }}
        </NyButton>

        <NyButton
          v-for="(item, index) in cornerOffsets"
          :key="item.label"
          size="sm"
          :variant="cornerOffsetIndex === index ? 'primary' : 'default'"
          @click="cornerOffsetIndex = index"
        >
          offset {{ item.label }}
        </NyButton>

        <NyButton size="sm" :variant="cornerVisible ? 'primary' : 'default'" @click="cornerVisible = !cornerVisible">
          {{ cornerVisible ? '隐藏按钮' : '显示按钮' }}
        </NyButton>
      </NyRow>

      <p class="ex-note">
        蓝色按钮此时固定在视口角落, 位置与文档流无关: 上下滚动页面它会跟着视口走,
        点 hide 能把它收起来。层级是 calc(var(--ny-z-popup) - 20), 压在页面内容之上, 但仍在 Tooltip 与 Popover 之下。
      </p>

      <NyFloatButton
        :target="corner"
        :offset="cornerOffset"
        :visible="cornerVisible"
        icon="arrow-up"
        variant="primary"
        tooltip="固定在角落"
        @click="cornerCount += 1"
      />

      <p class="ex-note">点击次数 = {{ cornerCount }}</p>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyFloatButton Props" :rows="apiProps" />
      <ApiTable title="NyFloatButton 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyFloatButton 插槽" kind="slots" compact :rows="apiSlots" />
    </template>
  </DocPage>
</template>
