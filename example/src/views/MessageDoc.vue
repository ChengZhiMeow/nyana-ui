<script setup lang="ts">
import { ref } from 'vue'

import { nyMessage, NyButton } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const loadingId = ref<number | null>(null)
const top = ref(24)

const codeType = `nyMessage.info('已加入队列')
nyMessage.success('保存成功')
nyMessage.warning('磁盘剩余空间不足 10%')
nyMessage.error('网络连接超时, 请稍后重试')`

const codeDuration = `// 第二个参数可以覆盖单条的时长与关闭按钮
nyMessage.success('两秒后自动关闭', { duration: 2 })
nyMessage.info('需要自己点关闭', { duration: 0, closable: true })`

const codeLoading = `const id = nyMessage.loading('提交中')
// 常驻不自动关闭, 拿到 id 后自己收尾
nyMessage.close(id)`

const codeConfig = `// 全局配置: 距顶部距离 / 默认时长 / 同屏最大条数
nyMessage.config({ top: 80, duration: 2, maxCount: 4 })
nyMessage.success('配置已生效')`

const codeClosable = `nyMessage.info('这条要自己关掉', { closable: true, duration: 0 })`

const apiMethods = [
  { name: 'open', desc: '通用入口, 用 options.type 指定类型', type: '(content: string, options?: NyMessageOptions) => number' },
  { name: 'info', desc: '信息提示', type: "(content: string, options?: Omit<NyMessageOptions, 'type'>) => number" },
  { name: 'success', desc: '成功提示', type: "(content: string, options?: Omit<NyMessageOptions, 'type'>) => number" },
  { name: 'warning', desc: '警告提示', type: "(content: string, options?: Omit<NyMessageOptions, 'type'>) => number" },
  { name: 'error', desc: '错误提示', type: "(content: string, options?: Omit<NyMessageOptions, 'type'>) => number" },
  { name: 'loading', desc: '加载中, duration 固定为 0, 不会自动关闭', type: "(content: string, options?: Omit<NyMessageOptions, 'type'>) => number" },
  { name: 'close', desc: '按 id 关闭某一条', type: '(id: number) => void' },
  { name: 'config', desc: '修改全局配置, 只覆盖传入的字段', type: '(options: Partial<NyMessageConfig>) => void' },
  { name: 'destroy', desc: '清空全部提示并卸载宿主节点', type: '() => void' },
]

const apiOptions = [
  { name: 'type', desc: '提示类型', type: "'info' | 'success' | 'warning' | 'error' | 'loading'", default: "'info'" },
  { name: 'duration', desc: '自动关闭的秒数, 0 表示不自动关闭', type: 'number', default: '3' },
  { name: 'closable', desc: '是否显示右侧关闭按钮', type: 'boolean', default: 'false' },
]

const apiConfig = [
  { name: 'top', desc: '提示距离视口顶部的距离', type: 'number', default: '24' },
  { name: 'duration', desc: '默认自动关闭秒数', type: 'number', default: '3' },
  { name: 'maxCount', desc: '同屏最多显示的条数, 超出时移除最早的', type: 'number', default: '6' },
]

const apiNotes = [
  {
    name: '宿主',
    desc: '首次调用时在 document.body 下创建 .ny-message-root 并 render 宿主组件, 层级用 --ny-z-message, 使用方不需要放任何节点',
  },
  {
    name: '时长',
    desc: 'duration 单位是秒, 由宿主里的定时器统一管理; 手动 close 时对应定时器会一起清掉',
  },
]

function showInfo() {
  nyMessage.info('已加入队列')
}

function showSuccess() {
  nyMessage.success('保存成功')
}

function showWarning() {
  nyMessage.warning('磁盘剩余空间不足 10%')
}

function showError() {
  nyMessage.error('网络连接超时, 请稍后重试')
}

function showShort() {
  nyMessage.success('两秒后自动关闭', { duration: 2 })
}

function showSticky() {
  nyMessage.info('需要自己点关闭', { duration: 0, closable: true })
}

function showLoading() {
  loadingId.value = nyMessage.loading('提交中')
}

function closeLoading() {
  if (loadingId.value === null) {
    return
  }

  nyMessage.close(loadingId.value)
  loadingId.value = null
}

function applyTop() {
  top.value = top.value === 24 ? 80 : 24
  nyMessage.config({ top: top.value })
  nyMessage.success(`top 已改为 ${top.value}px`)
}

function applyShortDuration() {
  nyMessage.config({ duration: 1 })
  nyMessage.info('默认时长已改为 1 秒')
}

function showClosable() {
  nyMessage.info('这条要自己关掉', { closable: true, duration: 0 })
}

function destroyAll() {
  nyMessage.destroy()
}
</script>

<template>
  <DocPage title="Message 全局提示" desc="命令式轻提示 nyMessage.success()">

    <DemoBlock
      title="四种类型"
      desc="nyMessage 是命令式 API, 宿主节点由它首次调用时懒挂载, 使用方不需要在页面里放任何组件。"
      :code="codeType"
    >
      <div class="ex-group">
        <NyButton @click="showInfo">信息</NyButton>
        <NyButton @click="showSuccess">成功</NyButton>
        <NyButton @click="showWarning">警告</NyButton>
        <NyButton @click="showError">错误</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock title="时长与常驻" desc="duration 单位是秒, 传 0 就一直留在屏幕上, 需要自己关闭。" :code="codeDuration">
      <div class="ex-group">
        <NyButton @click="showShort">2 秒自动关闭</NyButton>
        <NyButton @click="showSticky">常驻提示</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="加载中"
      desc="loading 固定不自动关闭, 拿到返回的 id 后调 nyMessage.close(id) 收尾。"
      :code="codeLoading"
      :value="`loadingId: ${loadingId === null ? 'null' : loadingId}`"
    >
      <div class="ex-group">
        <NyButton variant="primary" @click="showLoading">开始提交</NyButton>
        <NyButton :disabled="loadingId === null" @click="closeLoading">结束提交</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="全局配置"
      desc="config 改的是后续所有提示的默认值, 已经显示的提示不受影响。"
      :code="codeConfig"
      :value="`当前 top: ${top}px`"
    >
      <div class="ex-group">
        <NyButton @click="applyTop">top 切到 {{ top === 24 ? '80' : '24' }}px</NyButton>
        <NyButton @click="applyShortDuration">默认时长改为 1 秒</NyButton>
      </div>

      <p class="ex-note">top 指提示距视口顶部的距离, 与页面的滚动位置无关。</p>
    </DemoBlock>

    <DemoBlock title="手动关闭" desc="closable 只在单条上生效, 适合内容较长需要用户看完的提示。" :code="codeClosable">
      <div class="ex-group">
        <NyButton @click="showClosable">带关闭按钮</NyButton>
        <NyButton variant="danger" @click="destroyAll">全部清空</NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="nyMessage 方法" kind="methods" :rows="apiMethods" />
      <ApiTable title="NyMessageOptions" :rows="apiOptions" />
      <ApiTable title="NyMessageConfig" :rows="apiConfig" />
      <ApiTable title="nyMessage 说明" kind="methods" compact :rows="apiNotes" />
    </template>
  </DocPage>
</template>
