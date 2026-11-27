<script setup lang="ts">
import { reactive, ref } from 'vue'

import { NyButton, NyIcon, NySpace, NyStack, NyTabs } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const basicItems = [
  { key: 'overview', label: '概览' },
  { key: 'usage', label: '用法' },
  { key: 'api', label: 'API' },
]

const activeKey = ref('overview')

const modeItems = [
  { key: 'a', label: '面板 A' },
  { key: 'b', label: '面板 B' },
]

const ifKey = ref('a')
const showKey = ref('a')

const pillItems = [
  { key: 'day', label: '按天' },
  { key: 'week', label: '按周' },
  { key: 'month', label: '按月' },
]

const pillKey = ref('day')
const refreshCount = ref(0)

const closableItems = ref([
  { key: 'one', label: '标签一' },
  { key: 'two', label: '标签二' },
  { key: 'three', label: '标签三' },
])

const closableKey = ref('one')

const featureItems = [
  { key: 'inbox', label: '收件箱', icon: 'inbox', badge: 5 },
  { key: 'star', label: '收藏', icon: 'star', badge: 12 },
  { key: 'history', label: '历史', icon: 'history' },
]

const featureKey = ref('inbox')

const disabledItems = [
  { key: 'a', label: '基础信息' },
  { key: 'b', label: '权限设置', disabled: true },
  { key: 'c', label: '通知设置' },
]

const disabledKey = ref('a')

const alignItems = [
  { key: 'all', label: '全部' },
  { key: 'mine', label: '我的' },
  { key: 'shared', label: '共享' },
]

const alignKey = ref('all')

function refresh() {
  refreshCount.value += 1
}

function onClose(key: string) {
  const index = closableItems.value.findIndex((item) => item.key === key)

  if (index < 0) {
    return
  }

  closableItems.value.splice(index, 1)

  if (closableKey.value === key && closableItems.value.length > 0) {
    const next = closableItems.value[Math.min(index, closableItems.value.length - 1)]

    closableKey.value = next.key
  }
}

function resetTabs() {
  closableItems.value = [
    { key: 'one', label: '标签一' },
    { key: 'two', label: '标签二' },
    { key: 'three', label: '标签三' },
  ]
  closableKey.value = 'one'
}

const shapeTypes = ['line', 'plain', 'soft', 'card', 'segment', 'pill'] as const

type ShapeType = (typeof shapeTypes)[number]

const shapes: { type: ShapeType, label: string }[] = [
  { type: 'line', label: 'line 下划线: 头部有分隔线, 指示条跟着选中项滑动。' },
  { type: 'plain', label: 'plain 纯文字: 去掉线与底, 只靠颜色和字重区分。' },
  { type: 'soft', label: 'soft 浅底块: 每个页签自带浅底, 选中的换成主色浅底。' },
  { type: 'card', label: 'card 卡片式: 页签顶部圆角相连, 选中项白底与面板连成一体。' },
  { type: 'segment', label: 'segment 分段实底: 整条一个槽, 选中项铺主色实底。' },
  { type: 'pill', label: 'pill 胶囊槽: 槽是胶囊, 选中项白底浮起。' },
]

const shapeItems = [
  { key: 'res', label: '资源', badge: 6 },
  { key: 'talk', label: '讨论', badge: 12 },
  { key: 'set', label: '合集' },
]

const shapeKey = reactive<Record<ShapeType, string>>({
  line: 'res',
  plain: 'res',
  soft: 'res',
  card: 'res',
  segment: 'res',
  pill: 'res',
})

const codeShapes = `const items = [
  { key: 'res', label: '资源', badge: 6 },
  { key: 'talk', label: '讨论', badge: 12 },
  { key: 'set', label: '合集' },
]

<!-- 同一份 items, 只换 type -->
<NyTabs v-model:active-key="key" :items="items" type="line" />
<NyTabs v-model:active-key="key" :items="items" type="plain" />
<NyTabs v-model:active-key="key" :items="items" type="soft" />
<NyTabs v-model:active-key="key" :items="items" type="card" />
<NyTabs v-model:active-key="key" :items="items" type="segment" />
<NyTabs v-model:active-key="key" :items="items" type="pill" />`

const codeBasic = `<NyTabs v-model:active-key="activeKey" :items="items">
  <!-- 作用域插槽给出当前键, 面板自己决定渲染什么 -->
  <template #default="{ activeKey: key }">
    <p v-if="key === 'overview'">概览面板</p>
    <p v-else-if="key === 'usage'">用法面板</p>
    <p v-else>API 面板</p>
  </template>
</NyTabs>`

const codeMode = `<!-- v-if: 切走就卸载, 面板里的状态与请求下次进来要重来一遍 -->
<NyTabs v-model:active-key="ifKey" :items="items">
  <p v-if="ifKey === 'a'">面板 A 的内容</p>
  <p v-if="ifKey === 'b'">面板 B 的内容</p>
</NyTabs>

<!-- v-show: 面板始终在, 只切显隐, 适合有内部状态的表单或图表 -->
<NyTabs v-model:active-key="showKey" :items="items">
  <p v-show="showKey === 'a'">面板 A 的内容</p>
  <p v-show="showKey === 'b'">面板 B 的内容</p>
</NyTabs>`

const codePill = `<NyTabs v-model:active-key="pillKey" type="pill" :items="items">
  <template #extra>
    <NyButton size="sm" variant="ghost" @click="refresh">刷新</NyButton>
  </template>

  <p>{{ pillKey }} 的数据</p>
</NyTabs>`

const codeClosable = `function onClose(key: string) {
  items.value = items.value.filter((item) => item.key !== key)
}

<NyTabs v-model:active-key="activeKey" :items="items" closable @close="onClose" />`

const codeFeature = `const items = [
  { key: 'inbox', label: '收件箱', icon: 'inbox', badge: 5 },
  { key: 'star', label: '收藏', icon: 'star', badge: 12 },
  { key: 'history', label: '历史', icon: 'history' },
]

<NyTabs v-model:active-key="activeKey" :items="items" />`

const codeState = `const items = [
  { key: 'a', label: '基础信息' },
  { key: 'b', label: '权限设置', disabled: true },
  { key: 'c', label: '通知设置' },
]

<!-- 禁用项鼠标点不到, 方向键也会自动跳过它 -->
<NyTabs v-model:active-key="activeKey" :items="items" />

<NyTabs v-model:active-key="activeKey" :items="items" size="sm" align="center" />`

const apiProps = [
  { name: 'items', desc: '页签数据, 每项支持 key / label / icon / badge / disabled', type: 'NyTabItem[]', default: '[]' },
  { name: 'type', desc: '形态: line 下划线 / plain 纯文字 / soft 浅底块 / card 卡片 / segment 分段实底 / pill 胶囊槽', type: "'line' | 'plain' | 'soft' | 'card' | 'segment' | 'pill'", default: "'line'" },
  { name: 'size', desc: '尺寸档位', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'align', desc: '页签在头部里的对齐方式', type: "'start' | 'center' | 'end'", default: "'start'" },
  { name: 'closable', desc: '每个页签右侧显示关闭按钮', type: 'boolean', default: 'false' },
  { name: 'v-model:activeKey', desc: '当前选中的 key, 双向绑定', type: 'string', default: "''" },
]

const apiEvents = [
  { name: 'change', desc: '选中项变化时触发', type: 'string' },
  { name: 'close', desc: '点击关闭按钮时触发, 不会顺带切换页签', type: 'string' },
]

const apiSlots = [
  { name: 'default', desc: '面板内容, 作用域参数 activeKey 是当前选中键', type: '{ activeKey: string }' },
  { name: 'extra', desc: '头部右侧区域, 放刷新或筛选按钮', type: '—' },
]
</script>

<template>
  <DocPage title="Tabs 标签页" desc="六种形态的页签切换: 下划线、纯文字、浅底、卡片、分段、胶囊">

    <DemoBlock
      title="基础用法"
      desc="受控在 activeKey, 面板用作用域插槽给出的当前键决定渲染。"
      :code="codeBasic"
      :value="`当前键: ${activeKey}`"
    >
      <NyTabs v-model:active-key="activeKey" :items="basicItems">
        <template #default="{ activeKey: key }">
          <p v-if="key === 'overview'" class="ex-note">概览面板: 一组指标与趋势。</p>
          <p v-else-if="key === 'usage'" class="ex-note">用法面板: 常见写法的代码片段。</p>
          <p v-else class="ex-note">API 面板: 属性与事件的完整表格。</p>
        </template>
      </NyTabs>
    </DemoBlock>

    <DemoBlock
      title="六种形态"
      desc="同一份 items 只换 type: 下划线、纯文字、浅底、卡片、分段、胶囊。"
      :code="codeShapes"
    >
      <NyStack :gap="18">
        <div v-for="shape in shapes" :key="shape.type">
          <p class="ex-note">{{ shape.label }}</p>

          <NyTabs v-model:active-key="shapeKey[shape.type]" :items="shapeItems" :type="shape.type">
            <p class="ex-note">当前 {{ shape.type }} · {{ shapeKey[shape.type] }}</p>
          </NyTabs>
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="面板切换方式"
      desc="v-if 会卸载旧面板, v-show 只切显隐; 面板内有状态时优先 v-show。"
      :code="codeMode"
      :value="`v-if: ${ifKey} · v-show: ${showKey}`"
    >
      <NySpace direction="vertical" align="stretch" block>
        <NyTabs v-model:active-key="ifKey" :items="modeItems" size="sm">
          <p v-if="ifKey === 'a'" class="ex-note">面板 A 用 v-if: 切到 B 时这里被卸载。</p>
          <p v-if="ifKey === 'b'" class="ex-note">面板 B 用 v-if: 每次进入都是新实例。</p>
        </NyTabs>

        <NyTabs v-model:active-key="showKey" :items="modeItems" size="sm">
          <p v-show="showKey === 'a'" class="ex-note">面板 A 用 v-show: 始终挂载, 只是藏起来。</p>
          <p v-show="showKey === 'b'" class="ex-note">面板 B 用 v-show: 内部的滚动位置与输入都留着。</p>
        </NyTabs>
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="胶囊形态与 extra 插槽"
      desc="type 换成 pill, 头部右侧用 extra 插槽放操作按钮。"
      :code="codePill"
      :value="`当前键: ${pillKey} · 已刷新 ${refreshCount} 次`"
    >
      <NyTabs v-model:active-key="pillKey" type="pill" :items="pillItems">
        <template #extra>
          <NyButton size="sm" variant="ghost" @click="refresh">
            <template #icon>
              <NyIcon name="refresh" :size="15" />
            </template>
            刷新
          </NyButton>
        </template>

        <p class="ex-note">{{ pillKey }} 粒度的数据, 面板内容按当前键渲染。</p>
      </NyTabs>
    </DemoBlock>

    <DemoBlock
      title="可关闭"
      desc="closable 打开关闭按钮, 关掉当前项时把选中键挪到相邻项。"
      :code="codeClosable"
      :value="`剩余 ${closableItems.length} 个页签 · 当前键: ${closableKey}`"
    >
      <NySpace v-if="closableItems.length > 0" direction="vertical" align="start">
        <NyTabs
          v-model:active-key="closableKey"
          :items="closableItems"
          size="sm"
          closable
          @close="onClose"
        />

        <span class="ex-note">面板内容: {{ closableKey }}</span>
      </NySpace>

      <NySpace v-else direction="vertical" align="start">
        <span class="ex-note">页签已全部关闭。</span>
        <NyButton size="sm" @click="resetTabs">重置页签</NyButton>
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="图标与徽标"
      desc="icon 走 NyIcon, badge 用来提示未读数量。"
      :code="codeFeature"
      :value="`当前键: ${featureKey}`"
    >
      <NyTabs v-model:active-key="featureKey" :items="featureItems">
        <p class="ex-note">{{ featureKey }} 的内容</p>
      </NyTabs>
    </DemoBlock>

    <DemoBlock
      title="禁用项、尺寸与对齐"
      desc="禁用项鼠标与方向键都会跳过; 尺寸与对齐只改头部排布。"
      :code="codeState"
      :value="`当前键: ${disabledKey} · 居中组: ${alignKey}`"
    >
      <NySpace direction="vertical" align="stretch" block>
        <NyTabs v-model:active-key="disabledKey" :items="disabledItems">
          <p class="ex-note">当前 {{ disabledKey }}, 权限设置项被禁用。</p>
        </NyTabs>

        <NyTabs v-model:active-key="alignKey" :items="alignItems" size="sm" align="center">
          <p class="ex-note">居中的小尺寸页签, 当前 {{ alignKey }}。</p>
        </NyTabs>
      </NySpace>
    </DemoBlock>

    <template #api>
      <NySpace direction="vertical" align="start" size="lg" block>
        <ApiTable title="NyTabs Props" :rows="apiProps" />
        <ApiTable title="NyTabs 事件" kind="events" :rows="apiEvents" />
        <ApiTable title="NyTabs 插槽" kind="slots" :rows="apiSlots" />
      </NySpace>
    </template>
  </DocPage>
</template>
