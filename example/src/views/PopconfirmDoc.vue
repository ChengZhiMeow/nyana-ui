<script setup lang="ts">
import { ref } from 'vue'

import { nyMessage, NyButton, NyPopconfirm } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const controlledOpen = ref(false)
const confirmCount = ref(0)
const cancelCount = ref(0)

const codeBasic = `<NyPopconfirm title="确认执行该操作？" @confirm="onConfirm">
  <NyButton>删除</NyButton>
</NyPopconfirm>`

const codeDesc = `<NyPopconfirm title="删除这条记录？" desc="删除后无法恢复。" ok-text="删除" cancel-text="取消" @confirm="onConfirm">
  <NyButton variant="danger">删除</NyButton>
</NyPopconfirm>`

const codePlacement = `<NyPopconfirm title="从上方弹出" placement="top">…</NyPopconfirm>
<NyPopconfirm title="从右侧弹出" placement="right">…</NyPopconfirm>
<NyPopconfirm title="从下方弹出" placement="bottom">…</NyPopconfirm>
<NyPopconfirm title="从左侧弹出" placement="left">…</NyPopconfirm>`

const codeHover = `<NyPopconfirm title="鼠标移入即确认" trigger="hover" placement="right">
  <NyButton>悬浮触发</NyButton>
</NyPopconfirm>`

const codeControlled = `<NyPopconfirm v-model:open="controlledOpen" title="由 v-model 控制" :width="280">
  <NyButton>点我切换</NyButton>
</NyPopconfirm>`

const codeDisabled = `<NyPopconfirm title="已禁用" disabled>
  <NyButton disabled>删除</NyButton>
</NyPopconfirm>`

const apiProps = [
  { name: 'open', desc: '是否显示, 配合 v-model:open 双向绑定', type: 'boolean', default: 'false' },
  { name: 'title', desc: '标题, 也可以用 #title 插槽', type: 'string', default: "'确认执行该操作？'" },
  { name: 'desc', desc: '补充说明, 也可以用 #desc 插槽', type: 'string', default: "''" },
  { name: 'placement', desc: '相对触发元素的弹出位置', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'", default: "'top'" },
  { name: 'trigger', desc: '触发方式', type: "'click' | 'hover'", default: "'click'" },
  { name: 'okText', desc: '确定按钮文案', type: 'string', default: "'确定'" },
  { name: 'cancelText', desc: '取消按钮文案', type: 'string', default: "'取消'" },
  { name: 'okVariant', desc: '确定按钮风格', type: "'primary' | 'danger'", default: "'primary'" },
  { name: 'icon', desc: '左侧图标名, 取自 NyIcon', type: 'string', default: "'question-circle'" },
  { name: 'width', desc: '浮层宽度', type: 'number', default: '240' },
  { name: 'disabled', desc: '禁用后不响应触发', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'confirm', desc: '点击确定, 之后浮层自动收起并把焦点还给触发元素', type: 'void' },
  { name: 'cancel', desc: '点击取消, 效果与确定一致', type: 'void' },
]

const apiSlots = [
  { name: 'default', desc: '触发元素, 通常放一个按钮' },
  { name: 'title', desc: '替换标题' },
  { name: 'desc', desc: '替换补充说明' },
]

function onConfirm() {
  confirmCount.value += 1
  nyMessage.success('已确认')
}

function onDelete() {
  cancelCount.value += 1
  nyMessage.success('已删除')
}
</script>

<template>
  <DocPage title="Popconfirm 气泡确认" desc="二次确认后再执行操作">

    <DemoBlock
      title="基础用法"
      desc="默认点触发元素展开, 点确定收起并抛 confirm。"
      :code="codeBasic"
      :value="`confirm 次数: ${confirmCount}`"
    >
      <NyPopconfirm title="确认执行该操作？" @confirm="onConfirm">
        <NyButton>删除</NyButton>
      </NyPopconfirm>
    </DemoBlock>

    <DemoBlock
      title="说明与危险操作"
      desc="desc 补一句后果, ok-variant 用 danger 让确定按钮也带上危险色。"
      :code="codeDesc"
    >
      <div class="ex-group">
        <NyPopconfirm
          title="删除这条记录？"
          desc="删除后无法恢复。"
          ok-text="删除"
          cancel-text="取消"
          ok-variant="danger"
          @confirm="onDelete"
        >
          <NyButton variant="danger">删除</NyButton>
        </NyPopconfirm>

        <NyPopconfirm
          title="确定要归档吗？"
          desc="归档后仍然可以在归档列表里找到。"
          ok-variant="danger"
        >
          <NyButton>归档</NyButton>
        </NyPopconfirm>
      </div>
    </DemoBlock>

    <DemoBlock
      title="四个方向"
      desc="placement 共 12 个取值, 这里列出四个主方向。"
      :code="codePlacement"
    >
      <div class="ex-group">
        <NyPopconfirm title="从上方弹出" placement="top">
          <NyButton>上</NyButton>
        </NyPopconfirm>

        <NyPopconfirm title="从右侧弹出" placement="right">
          <NyButton>右</NyButton>
        </NyPopconfirm>

        <NyPopconfirm title="从下方弹出" placement="bottom">
          <NyButton>下</NyButton>
        </NyPopconfirm>

        <NyPopconfirm title="从左侧弹出" placement="left">
          <NyButton>左</NyButton>
        </NyPopconfirm>
      </div>
    </DemoBlock>

    <DemoBlock
      title="悬浮触发"
      desc="trigger 设为 hover 后移入即展开, 移出自动收起。"
      :code="codeHover"
    >
      <NyPopconfirm title="鼠标移入即确认" trigger="hover" placement="right">
        <NyButton>悬浮触发</NyButton>
      </NyPopconfirm>
    </DemoBlock>

    <DemoBlock
      title="受控显示与禁用"
      desc="v-model:open 能读到展开状态; disabled 时浮层完全不响应触发。"
      :code="codeControlled"
      :value="`controlledOpen: ${controlledOpen}`"
    >
      <div class="ex-group">
        <NyPopconfirm v-model:open="controlledOpen" title="由 v-model 控制" :width="280">
          <NyButton>点我切换</NyButton>
        </NyPopconfirm>

        <NyPopconfirm title="已禁用, 不会弹出" disabled>
          <NyButton disabled>删除</NyButton>
        </NyPopconfirm>
      </div>

      <p class="ex-note">取消次数: {{ cancelCount }}</p>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyPopconfirm Props" :rows="apiProps" />
      <ApiTable title="NyPopconfirm 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyPopconfirm 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable
        title="NyPopconfirm v-model"
        :rows="[{ name: 'open', desc: '是否显示气泡', type: 'boolean', default: 'false' }]"
      />
    </template>
  </DocPage>
</template>
