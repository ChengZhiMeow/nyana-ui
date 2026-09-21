<script setup lang="ts">
import { ref } from 'vue'

import { nyMessage, NyButton, NyModal } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const open = ref(false)
const footerOpen = ref(false)
const loadingOpen = ref(false)
const centeredOpen = ref(false)
const flushOpen = ref(false)
const manualOpen = ref(false)
const scrollOpen = ref(false)

const submitting = ref(false)

const codeBasic = `<NyModal v-model:open="open" title="重命名分支" @ok="onOk">
  内容区放一句话说明, 底部按钮由组件给出。
</NyModal>`

const codeFooter = `<NyModal v-model:open="footerOpen" title="自定义页脚" :show-footer="false">
  内容
  <template #footer>
    <NyButton @click="footerOpen = false">再想想</NyButton>
    <NyButton variant="primary" @click="footerOpen = false">确认发布</NyButton>
  </template>
</NyModal>`

const codeLoading = `<NyModal v-model:open="loadingOpen" title="提交审核" :confirm-loading="submitting" @ok="submit">
  确定后按钮进入加载态, 提交结束再自己关闭。
</NyModal>`

const codeWidth = `<NyModal v-model:open="centeredOpen" title="居中对话框" :width="640" centered>
  较宽的对话框适合放表单, centered 让它垂直居中。
</NyModal>`

const codeFlush = `<NyModal v-model:open="flushOpen" title="成员列表" body-flush>
  <div>贴边内容, 没有左右内边距</div>
</NyModal>`

const codeManual = `<NyModal v-model:open="manualOpen" title="不会自动关闭" :close-on-ok="false" @ok="onSubmit">
  点确定后对话框留着, 由使用方决定什么时候关。
</NyModal>`

const codeScroll = `<NyModal v-model:open="scrollOpen" title="服务条款" :max-height="220">
  很长的内容, 超出 220px 后内容区自己滚动。
</NyModal>`

const apiProps = [
  { name: 'open', desc: '是否显示, 配合 v-model:open 双向绑定', type: 'boolean', default: 'false' },
  { name: 'title', desc: '标题, 也可以用 #title 插槽', type: 'string', default: "''" },
  { name: 'width', desc: '面板宽度, 数字按 px 处理', type: 'number | string', default: '520' },
  { name: 'centered', desc: '垂直居中, 关闭时贴顶留出 10vh', type: 'boolean', default: 'false' },
  { name: 'closable', desc: '显示右上角关闭按钮', type: 'boolean', default: 'true' },
  { name: 'maskClosable', desc: '点击遮罩关闭', type: 'boolean', default: 'true' },
  { name: 'keyboard', desc: 'Esc 关闭', type: 'boolean', default: 'true' },
  { name: 'showFooter', desc: '显示底部按钮区', type: 'boolean', default: 'true' },
  { name: 'showCancel', desc: '默认页脚里显示取消按钮', type: 'boolean', default: 'true' },
  { name: 'okText', desc: '确定按钮文案', type: 'string', default: "'确定'" },
  { name: 'cancelText', desc: '取消按钮文案', type: 'string', default: "'取消'" },
  { name: 'okVariant', desc: '确定按钮风格', type: "'primary' | 'danger'", default: "'primary'" },
  { name: 'confirmLoading', desc: '确定按钮进入加载态并禁用', type: 'boolean', default: 'false' },
  { name: 'closeOnOk', desc: '点确定后是否自动关闭', type: 'boolean', default: 'true' },
  { name: 'maxHeight', desc: '内容区最大高度, 超出后内容区滚动', type: 'number', default: 'undefined' },
  { name: 'bodyFlush', desc: '内容区不留内边距, 用于表格与列表', type: 'boolean', default: 'false' },
  { name: 'zIndex', desc: '面板层级, 默认走 --ny-z-modal', type: 'number', default: 'undefined' },
]

const apiEvents = [
  { name: 'ok', desc: '点击确定按钮, 关闭之前触发', type: 'void' },
  { name: 'cancel', desc: '取消按钮 / 遮罩 / Esc 都归到这里', type: 'void' },
  { name: 'close', desc: '离场动画结束后触发, 适合在这里重置表单', type: 'void' },
]

const apiSlots = [
  { name: 'default', desc: '对话框内容' },
  { name: 'title', desc: '替换标题' },
  { name: 'footer', desc: '整体替换底部按钮区' },
]

async function submit() {
  submitting.value = true

  window.setTimeout(() => {
    submitting.value = false
    loadingOpen.value = false
  }, 1200)
}

function onSubmit() {
  nyMessage.success('已提交, 对话框由你决定何时关闭')
}
</script>

<template>
  <DocPage title="Modal 对话框" desc="需要打断当前流程的浮层">

    <DemoBlock
      title="基础用法"
      desc="用 v-model:open 控制显隐, 点确定会抛 ok 并自动关闭。"
      :code="codeBasic"
      :value="`open: ${open}`"
    >
      <NyButton variant="primary" @click="open = true">打开对话框</NyButton>

      <NyModal v-model:open="open" title="重命名分支">
        内容区放一句话说明, 底部按钮由组件给出。
      </NyModal>
    </DemoBlock>

    <DemoBlock
      title="自定义页脚"
      desc="show-footer 关掉默认按钮区, 再用 #footer 放进自己的按钮。"
      :code="codeFooter"
      :value="`footerOpen: ${footerOpen}`"
    >
      <NyButton @click="footerOpen = true">打开对话框</NyButton>

      <NyModal v-model:open="footerOpen" title="自定义页脚" :show-footer="false">
        内容区可以随便排, 页脚按钮自己给。
        <template #footer>
          <div class="ex-group">
            <NyButton @click="footerOpen = false">再想想</NyButton>
            <NyButton variant="primary" @click="footerOpen = false">确认发布</NyButton>
          </div>
        </template>
      </NyModal>
    </DemoBlock>

    <DemoBlock
      title="提交中的确定按钮"
      desc="confirm-loading 让确定按钮转圈并禁用, 提交结束后由使用方关闭。"
      :code="codeLoading"
      :value="`submitting: ${submitting}`"
    >
      <NyButton @click="loadingOpen = true">打开对话框</NyButton>

      <NyModal
        v-model:open="loadingOpen"
        title="提交审核"
        :confirm-loading="submitting"
        @ok="submit"
      >
        确定后按钮进入加载态, 提交结束再自己关闭。
      </NyModal>
    </DemoBlock>

    <DemoBlock
      title="宽度与居中"
      desc="width 传数字按 px 处理, centered 让面板垂直居中。"
      :code="codeWidth"
      :value="`centeredOpen: ${centeredOpen}`"
    >
      <NyButton @click="centeredOpen = true">打开宽对话框</NyButton>

      <NyModal v-model:open="centeredOpen" title="居中对话框" :width="640" centered>
        较宽的对话框适合放表单, centered 让它垂直居中。
      </NyModal>
    </DemoBlock>

    <DemoBlock
      title="去掉内容内边距"
      desc="body-flush 让内容贴边, 表格与列表这类自带内边距的内容用它。"
      :code="codeFlush"
      :value="`flushOpen: ${flushOpen}`"
    >
      <NyButton @click="flushOpen = true">打开对话框</NyButton>

      <NyModal v-model:open="flushOpen" title="成员列表" body-flush>
        <div class="ex-box ex-box--flush">贴边内容, 没有左右内边距</div>
      </NyModal>
    </DemoBlock>

    <DemoBlock
      title="不自动关闭"
      desc="close-on-ok 设为 false 后点确定不会关闭, 需要自己控制 open。"
      :code="codeManual"
      :value="`manualOpen: ${manualOpen}`"
    >
      <NyButton @click="manualOpen = true">打开对话框</NyButton>

      <NyModal
        v-model:open="manualOpen"
        title="不会自动关闭"
        :close-on-ok="false"
        @ok="onSubmit"
      >
        点确定后对话框留着, 由使用方决定什么时候关。
      </NyModal>
    </DemoBlock>

    <DemoBlock
      title="内容区滚动"
      desc="max-height 只限制内容区, 标题与页脚固定在上下两端。"
      :code="codeScroll"
      :value="`scrollOpen: ${scrollOpen}`"
    >
      <NyButton @click="scrollOpen = true">打开长内容对话框</NyButton>

      <NyModal v-model:open="scrollOpen" title="服务条款" :max-height="220">
        <p v-for="index in 12" :key="index">第 {{ index }} 条: 这一段只是为了把内容撑长, 方便看滚动效果。</p>
      </NyModal>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyModal Props" :rows="apiProps" />
      <ApiTable title="NyModal 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyModal 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable
        title="NyModal v-model"
        :rows="[{ name: 'open', desc: '是否显示对话框', type: 'boolean', default: 'false' }]"
      />
    </template>
  </DocPage>
</template>
