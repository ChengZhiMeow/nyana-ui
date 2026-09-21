<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyIcon, NyPopover } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NyPlacement } from '@chengzhimeow/nyana-ui'

const TOP_PLACEMENTS: NyPlacement[] = ['top', 'top-start', 'top-end']
const BOTTOM_PLACEMENTS: NyPlacement[] = ['bottom', 'bottom-start', 'bottom-end']
const SIDE_PLACEMENTS: NyPlacement[] = [
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
]

const open = ref(false)
const events = ref<string[]>([])

function record(name: string) {
  events.value = [...events.value, name].slice(-3)
}

const openInfo = computed(
  () => `open = ${open.value}, 最近事件: ${events.value.join(' → ') || '暂无'}`,
)

const codeBasic = `<NyPopover title="标题" content="这是气泡卡片里的正文内容。">
  <NyButton>点击展开</NyButton>
</NyPopover>

<NyPopover trigger="hover" content="悬停展开的轻量气泡">
  <NyButton>悬停展开</NyButton>
</NyPopover>`

const codePlacement = `const placements = ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end']

<div class="ex-group">
  <NyPopover
    v-for="placement in placements"
    :key="placement"
    :title="placement"
    content="点击看方位"
    :placement="placement"
    trigger="click"
  >
    <NyButton size="sm">{{ placement }}</NyButton>
  </NyPopover>
</div>`

const codeTrigger = `<div class="ex-group">
  <NyPopover trigger="click" title="click" content="点击触发器开合, 点外面或按 Esc 收起">
    <NyButton>click 触发</NyButton>
  </NyPopover>

  <NyPopover trigger="hover" title="hover" content="鼠标移开一小会儿才收起, 方便移到浮层上">
    <NyButton>hover 触发</NyButton>
  </NyPopover>
</div>`

const codeSlots = `<NyPopover trigger="click">
  <NyButton variant="primary">自定义内容</NyButton>

  <template #title>
    <NyIcon name="info" :size="14" />
    带图标的标题
  </template>

  <template #content>
    <p>content 插槽可以放列表, 表单或任何组件。</p>
    <p>宽度由 width 控制, 超出 maxHeight 时内部滚动。</p>
  </template>

  <template #footer>
    <NyButton size="sm" variant="text">取消</NyButton>
    <NyButton size="sm" variant="primary">确定</NyButton>
  </template>
</NyPopover>`

const codeControlled = `const open = ref(false)

<div class="ex-group">
  <NyPopover
    v-model:open="open"
    trigger="click"
    title="受控气泡"
    content="外部按钮也能开关这个浮层"
    @open="record('open')"
    @close="record('close')"
  >
    <NyButton>点我切换</NyButton>
  </NyPopover>

  <NyButton size="sm" variant="text" @click="open = !open">外部切换</NyButton>
</div>`

const codeScroll = `<NyPopover trigger="click" title="较长的内容" :width="320" :max-height="120">
  <NyButton>宽度 320, 限高 120</NyButton>

  <template #content>
    内容区超过 maxHeight 之后自己滚动, 不会把浮层撑出屏幕。
    多写几行文字就能看到滚动条。
  </template>
</NyPopover>`

const apiProps = [
  { name: 'title', desc: '标题文字, 也可以用 title 插槽', type: 'string', default: "''" },
  { name: 'content', desc: '正文文字, 也可以用 content 插槽', type: 'string', default: "''" },
  { name: 'placement', desc: '浮层相对触发器的位置', type: 'NyPlacement', default: "'bottom'" },
  { name: 'trigger', desc: '触发方式, click 与 hover 两种', type: "'hover' | 'click'", default: "'hover'" },
  { name: 'width', desc: '浮层宽度', type: 'number', default: '240' },
  { name: 'maxHeight', desc: '内容区最大高度, 超出部分滚动', type: 'number', default: '320' },
  { name: 'open', desc: '开合状态, 支持 v-model:open 双向绑定', type: 'boolean', default: 'false' },
  { name: 'disabled', desc: '禁用, 点击与悬停都不展开', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'open', desc: '由用户操作展开时触发, 外部通过 v-model 改 open 不触发', type: '—' },
  { name: 'close', desc: '由用户操作收起时触发, 外部改 open 或 disabled 不触发', type: '—' },
]

const apiSlots = [
  { name: 'default', desc: '触发元素' },
  { name: 'title', desc: '标题区, 优先于 title 属性' },
  { name: 'content', desc: '正文区, 优先于 content 属性' },
  { name: 'footer', desc: '底部操作区, 给了才渲染, 常见放两个按钮' },
]
</script>

<template>
  <DocPage title="Popover 气泡卡片" desc="可放任意内容的气泡浮层">

    <DemoBlock
      title="基础用法"
      desc="title 与 content 给文字, 默认插槽给触发元素。"
      :code="codeBasic"
    >
      <div class="ex-group">
        <NyPopover title="标题" content="这是气泡卡片里的正文内容。" trigger="click">
          <NyButton>点击展开</NyButton>
        </NyPopover>

        <NyPopover title="悬停标题" content="悬停展开的轻量气泡" trigger="hover">
          <NyButton>悬停展开</NyButton>
        </NyPopover>
      </div>
    </DemoBlock>

    <DemoBlock
      title="十二种方位"
      desc="placement 与 NyTooltip 同一套取值, 默认是 bottom。"
      :code="codePlacement"
      backdrop="muted"
    >
      <div class="ex-group">
        <NyPopover
          v-for="placement in TOP_PLACEMENTS"
          :key="placement"
          :title="placement"
          content="点击看方位"
          :placement="placement"
          trigger="click"
        >
          <NyButton size="sm">{{ placement }}</NyButton>
        </NyPopover>
      </div>

      <div class="ex-group">
        <NyPopover
          v-for="placement in BOTTOM_PLACEMENTS"
          :key="placement"
          :title="placement"
          content="点击看方位"
          :placement="placement"
          trigger="click"
        >
          <NyButton size="sm">{{ placement }}</NyButton>
        </NyPopover>
      </div>

      <div class="ex-group">
        <NyPopover
          v-for="placement in SIDE_PLACEMENTS"
          :key="placement"
          :title="placement"
          content="点击看方位"
          :placement="placement"
          trigger="click"
        >
          <NyButton size="sm">{{ placement }}</NyButton>
        </NyPopover>
      </div>
    </DemoBlock>

    <DemoBlock
      title="触发方式"
      desc="click 干净利落; hover 离开时留了一点宽限时间, 鼠标能移到浮层上。"
      :code="codeTrigger"
    >
      <div class="ex-group">
        <NyPopover
          trigger="click"
          title="click"
          content="点击触发器开合, 点外面或按 Esc 收起"
        >
          <NyButton>click 触发</NyButton>
        </NyPopover>

        <NyPopover
          trigger="hover"
          title="hover"
          content="鼠标移开一小会儿才收起, 方便移到浮层上"
        >
          <NyButton>hover 触发</NyButton>
        </NyPopover>
      </div>
    </DemoBlock>

    <DemoBlock
      title="自定义内容与底部操作"
      desc="title / content / footer 三个插槽, footer 里放按钮。"
      :code="codeSlots"
    >
      <div class="ex-group">
        <NyPopover trigger="click">
          <NyButton variant="primary">自定义内容</NyButton>

          <template #title>
            <NyIcon name="info" :size="14" />
            带图标的标题
          </template>

          <template #content>
            <p>content 插槽可以放列表, 表单或任何组件。</p>
            <p>宽度由 width 控制, 超出 maxHeight 时内部滚动。</p>
          </template>

          <template #footer>
            <NyButton size="sm" variant="text">取消</NyButton>
            <NyButton size="sm" variant="primary">确定</NyButton>
          </template>
        </NyPopover>
      </div>
    </DemoBlock>

    <DemoBlock
      title="受控展开"
      desc="v-model:open 接管开合, open / close 只在用户操作时抛出。"
      :code="codeControlled"
      :value="openInfo"
      backdrop="muted"
    >
      <div class="ex-group">
        <NyPopover
          v-model:open="open"
          trigger="click"
          title="受控气泡"
          content="外部按钮也能开关这个浮层"
          @open="record('open')"
          @close="record('close')"
        >
          <NyButton>点我切换</NyButton>
        </NyPopover>

        <NyButton size="sm" variant="text" @click="open = !open">外部切换</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="宽度与滚动"
      desc="width 定宽, maxHeight 限高, 内容区用 ny-scroll 自己滚。"
      :code="codeScroll"
    >
      <div class="ex-group">
        <NyPopover trigger="click" title="较长的内容" :width="320" :max-height="120">
          <NyButton>宽度 320, 限高 120</NyButton>

          <template #content>
            内容区超过 maxHeight 之后自己滚动, 不会把浮层撑出屏幕。这里多写几行文字,
            打开后就能看到滚动条; 浮层与触发器之间留了 8px 空隙, 指针移过去不会消失。
          </template>
        </NyPopover>

        <NyPopover trigger="click" title="窄一点" :width="180" content="宽度只有 180">
          <NyButton>宽度 180</NyButton>
        </NyPopover>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyPopover Props" :rows="apiProps" />
      <ApiTable title="NyPopover 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyPopover 插槽" kind="slots" compact :rows="apiSlots" />
    </template>
  </DocPage>
</template>
