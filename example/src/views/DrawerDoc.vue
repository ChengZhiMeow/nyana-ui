<script setup lang="ts">
import { ref } from 'vue'

import { nyMessage, NyButton, NyDrawer } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const openRight = ref(false)
const openLeft = ref(false)
const openTop = ref(false)
const openBottom = ref(false)
const openSize = ref(false)
const openFooter = ref(false)
const openFlush = ref(false)

const codePlacement = `<!-- 四个方向各一个, 组件自己管遮罩与滑入动画 -->
<NyDrawer v-model:open="openRight" title="右侧 (默认)" placement="right">…</NyDrawer>
<NyDrawer v-model:open="openLeft" title="左侧" placement="left">…</NyDrawer>
<NyDrawer v-model:open="openTop" title="顶部" placement="top" :height="200">…</NyDrawer>
<NyDrawer v-model:open="openBottom" title="底部" placement="bottom" :height="200">…</NyDrawer>`

const codeSize = `<!-- left / right 读 width, top / bottom 读 height -->
<NyDrawer v-model:open="openSize" title="宽抽屉" :width="640">…</NyDrawer>`

const codeFooter = `<NyDrawer v-model:open="openFooter" title="发布设置" show-footer @ok="onOk">
  内容
</NyDrawer>`

const codeFlush = `<NyDrawer v-model:open="openFlush" title="成员列表" body-flush>
  <div>贴边内容, 没有内边距</div>
</NyDrawer>`

const apiProps = [
  { name: 'open', desc: '是否显示, 配合 v-model:open 双向绑定', type: 'boolean', default: 'false' },
  { name: 'title', desc: '标题, 也可以用 #title 插槽', type: 'string', default: "''" },
  { name: 'placement', desc: '从哪一侧滑出', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'" },
  { name: 'width', desc: 'left / right 时的宽度, 数字按 px 处理', type: 'number | string', default: '380' },
  { name: 'height', desc: 'top / bottom 时的高度, 数字按 px 处理', type: 'number | string', default: '320' },
  { name: 'closable', desc: '显示右上角关闭按钮', type: 'boolean', default: 'true' },
  { name: 'maskClosable', desc: '点击遮罩关闭', type: 'boolean', default: 'true' },
  { name: 'keyboard', desc: 'Esc 关闭', type: 'boolean', default: 'true' },
  { name: 'showFooter', desc: '显示底部按钮区', type: 'boolean', default: 'false' },
  { name: 'okText', desc: '确定按钮文案', type: 'string', default: "'确定'" },
  { name: 'cancelText', desc: '取消按钮文案', type: 'string', default: "'取消'" },
  { name: 'okVariant', desc: '确定按钮风格', type: "'primary' | 'danger'", default: "'primary'" },
  { name: 'confirmLoading', desc: '确定按钮进入加载态并禁用', type: 'boolean', default: 'false' },
  { name: 'closeOnOk', desc: '点确定后是否自动关闭', type: 'boolean', default: 'true' },
  { name: 'bodyFlush', desc: '内容区不留内边距, 用于表格与列表', type: 'boolean', default: 'false' },
  { name: 'zIndex', desc: '面板层级, 默认走 --ny-z-drawer', type: 'number', default: 'undefined' },
]

const apiEvents = [
  { name: 'ok', desc: '点击确定按钮, 关闭之前触发', type: 'void' },
  { name: 'cancel', desc: '取消按钮 / 遮罩 / Esc 都归到这里', type: 'void' },
  { name: 'close', desc: '离场动画结束后触发', type: 'void' },
]

const apiSlots = [
  { name: 'default', desc: '抽屉内容' },
  { name: 'title', desc: '替换标题' },
  { name: 'footer', desc: '替换底部按钮区' },
]

function onOk() {
  nyMessage.success('已保存发布设置')
}
</script>

<template>
  <DocPage title="Drawer 抽屉" desc="从四侧滑出的面板">

    <DemoBlock
      title="四个方向"
      desc="placement 决定滑入方向, 顶部与底部按 height 取尺寸。"
      :code="codePlacement"
      :value="`right: ${openRight} / left: ${openLeft} / top: ${openTop} / bottom: ${openBottom}`"
    >
      <div class="ex-group">
        <NyButton @click="openRight = true">右侧 (默认)</NyButton>
        <NyButton @click="openLeft = true">左侧</NyButton>
        <NyButton @click="openTop = true">顶部</NyButton>
        <NyButton @click="openBottom = true">底部</NyButton>
      </div>

      <NyDrawer v-model:open="openRight" title="右侧" placement="right">
        默认从右侧滑出, 宽度由 width 决定。
      </NyDrawer>

      <NyDrawer v-model:open="openLeft" title="左侧" placement="left">
        左侧一般放导航与筛选。
      </NyDrawer>

      <NyDrawer v-model:open="openTop" title="顶部" placement="top" :height="200">
        顶部适合公告与轻量表单。
      </NyDrawer>

      <NyDrawer v-model:open="openBottom" title="底部" placement="bottom" :height="200">
        底部在移动端很常见。
      </NyDrawer>
    </DemoBlock>

    <DemoBlock
      title="尺寸"
      desc="left / right 读 width, top / bottom 读 height, 数字按 px 处理。"
      :code="codeSize"
      :value="`openSize: ${openSize}`"
    >
      <NyButton @click="openSize = true">打开宽抽屉</NyButton>

      <NyDrawer v-model:open="openSize" title="宽抽屉" :width="640">
        640px 宽, 放表单刚好。
      </NyDrawer>
    </DemoBlock>

    <DemoBlock
      title="页脚按钮"
      desc="show-footer 打开默认页脚, 点确定会抛 ok 并自动关闭。"
      :code="codeFooter"
      :value="`openFooter: ${openFooter}`"
    >
      <NyButton @click="openFooter = true">打开抽屉</NyButton>

      <NyDrawer v-model:open="openFooter" title="发布设置" show-footer @ok="onOk">
        默认页脚给了取消与确定两个按钮, 点确定后提示一条消息。
      </NyDrawer>
    </DemoBlock>

    <DemoBlock
      title="去掉内容内边距"
      desc="body-flush 让内容贴边, 用于表格与列表。"
      :code="codeFlush"
      :value="`openFlush: ${openFlush}`"
    >
      <NyButton @click="openFlush = true">打开抽屉</NyButton>

      <NyDrawer v-model:open="openFlush" title="成员列表" body-flush>
        <div class="ex-box ex-box--flush">贴边内容, 没有内边距</div>
      </NyDrawer>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyDrawer Props" :rows="apiProps" />
      <ApiTable title="NyDrawer 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyDrawer 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable
        title="NyDrawer v-model"
        :rows="[{ name: 'open', desc: '是否显示抽屉', type: 'boolean', default: 'false' }]"
      />
    </template>
  </DocPage>
</template>
