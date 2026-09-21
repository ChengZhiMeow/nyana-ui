<script setup lang="ts">
import { computed, ref } from 'vue'

import { nyNotification, NyButton } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NyNotificationPlacement } from '@chengzhimeow/nyana-ui'

const loadingId = ref<number | null>(null)
const lastId = ref(0)
const lastType = ref('未调用')
const lastPlacement = ref<NyNotificationPlacement>('topRight')
const lastCall = ref('还没有调用')

const configPlacement = ref<NyNotificationPlacement>('topRight')
const configOffset = ref(24)
const configDuration = ref(4.5)
const configMax = ref(5)
const configWidth = ref(340)

const placements: { value: NyNotificationPlacement; label: string }[] = [
  { value: 'topRight', label: '右上' },
  { value: 'topLeft', label: '左上' },
  { value: 'bottomRight', label: '右下' },
  { value: 'bottomLeft', label: '左下' },
]

const configInfo = computed(
  () =>
    `placement = ${configPlacement.value} · offset = ${configOffset.value} · duration = ${configDuration.value}s · maxCount = ${configMax.value} · width = ${configWidth.value}`,
)

function openType(type: 'info' | 'success' | 'warning' | 'error') {
  const id = nyNotification[type]({
    title: `${type} 通知`,
    desc: 'desc 是一段补充说明, 太长会自动换行。',
  })

  lastId.value = id
  lastType.value = type
}

function openAt(placement: NyNotificationPlacement) {
  const id = nyNotification.open({
    title: `出现在 ${placement}`,
    desc: 'placement 只影响这一条, 不改变全局配置。',
    type: 'info',
    placement,
  })

  lastId.value = id
  lastPlacement.value = placement
}

function openAuto() {
  lastId.value = nyNotification.success({ title: '两秒后自动关闭', desc: 'duration 单位是秒。', duration: 2 })
}

function openSticky() {
  lastId.value = nyNotification.warning({
    title: '常驻通知',
    desc: 'duration 传 0 就不会自动关闭, 需要用户自己点关闭。',
    duration: 0,
  })
}

function showLoading() {
  loadingId.value = nyNotification.loading({ title: '正在部署', desc: '常驻不自动关闭, 部署结束后用 close(id) 收尾。' })
}

function closeLoading() {
  if (loadingId.value === null) {
    return
  }

  nyNotification.close(loadingId.value)
  loadingId.value = null
}

function togglePlacement() {
  configPlacement.value = configPlacement.value === 'topRight' ? 'bottomLeft' : 'topRight'
  nyNotification.config({ placement: configPlacement.value })
}

function toggleOffset() {
  configOffset.value = configOffset.value === 24 ? 96 : 24
  nyNotification.config({ offset: configOffset.value })
}

function toggleDuration() {
  configDuration.value = configDuration.value === 4.5 ? 1 : 4.5
  nyNotification.config({ duration: configDuration.value })
}

function toggleMaxCount() {
  configMax.value = configMax.value === 5 ? 2 : 5
  nyNotification.config({ maxCount: configMax.value })
}

function toggleWidth() {
  configWidth.value = configWidth.value === 340 ? 420 : 340
  nyNotification.config({ width: configWidth.value })
}

function resetConfig() {
  configPlacement.value = 'topRight'
  configOffset.value = 24
  configDuration.value = 4.5
  configMax.value = 5
  configWidth.value = 340

  nyNotification.config({
    placement: configPlacement.value,
    offset: configOffset.value,
    duration: configDuration.value,
    maxCount: configMax.value,
    width: configWidth.value,
  })
}

function openThree() {
  nyNotification.success({ title: '第一条', desc: '按 id 顺序从新到旧排列。', placement: 'topRight' })
  nyNotification.info({ title: '第二条', desc: '同屏超过 maxCount 时最早的会被挤掉。', placement: 'topRight' })
  nyNotification.warning({ title: '第三条', desc: '下面这一下会把这些一起清掉。', placement: 'topRight' })

  lastCall.value = '连开三条'
}

function destroyAll() {
  nyNotification.destroy()
  loadingId.value = null
  lastCall.value = 'destroy() 已清空全部通知并卸载宿主节点'
}

const codeType = `// open 是通用入口, 用 type 指定类型; 四个语义方法只是它的简写
nyNotification.open({ title: '普通通知', desc: '一段补充说明', type: 'info' })
nyNotification.info({ title: 'info 通知', desc: '一段补充说明' })
nyNotification.success({ title: 'success 通知', desc: '一段补充说明' })
nyNotification.warning({ title: 'warning 通知', desc: '一段补充说明' })
nyNotification.error({ title: 'error 通知', desc: '一段补充说明' })`

const codePlacement = `// 四个位置各来一条, placement 只作用于这一条
nyNotification.open({ title: '出现在 topRight', desc: '右上角', placement: 'topRight' })
nyNotification.open({ title: '出现在 topLeft', desc: '左上角', placement: 'topLeft' })
nyNotification.open({ title: '出现在 bottomRight', desc: '右下角', placement: 'bottomRight' })
nyNotification.open({ title: '出现在 bottomLeft', desc: '左下角', placement: 'bottomLeft' })`

const codeDuration = `// duration 单位是秒, 传 0 就常驻
nyNotification.success({ title: '两秒后自动关闭', desc: 'duration 单位是秒', duration: 2 })
nyNotification.warning({ title: '常驻通知', desc: '需要用户自己点关闭', duration: 0 })`

const codeLoading = `// loading 的 duration 固定为 0, 拿到返回的 id 后自己收尾
const id = nyNotification.loading({ title: '正在部署', desc: '部署结束后再关闭' })

nyNotification.close(id)`

const codeConfig = `// config 改的是默认值, 已经显示的通知不受影响
nyNotification.config({
  placement: 'bottomLeft',
  offset: 96,
  duration: 1,
  maxCount: 2,
  width: 420,
})

nyNotification.success({ title: '新的默认值生效了', desc: '包括位置, 偏移, 时长, 同屏数量与宽度' })`

const codeDestroy = `nyNotification.success({ title: '第一条', desc: '按 id 顺序从新到旧排列' })
nyNotification.info({ title: '第二条', desc: '同屏超过 maxCount 时最早的会被挤掉' })

// 清空全部通知, 并把挂到 body 上的宿主节点一起卸载
nyNotification.destroy()`

const apiMethods = [
  { name: 'open', desc: '通用入口, 用 options.type 指定类型', type: '(options: NyNotificationOptions) => number' },
  {
    name: 'info',
    desc: '信息通知',
    type: "(options: Omit<NyNotificationOptions, 'type'>) => number",
  },
  {
    name: 'success',
    desc: '成功通知',
    type: "(options: Omit<NyNotificationOptions, 'type'>) => number",
  },
  {
    name: 'warning',
    desc: '警告通知',
    type: "(options: Omit<NyNotificationOptions, 'type'>) => number",
  },
  {
    name: 'error',
    desc: '错误通知',
    type: "(options: Omit<NyNotificationOptions, 'type'>) => number",
  },
  {
    name: 'loading',
    desc: '常驻通知, duration 固定为 0, 不会自动关闭',
    type: "(options: Omit<NyNotificationOptions, 'type'>) => number",
  },
  { name: 'close', desc: '按 id 关闭某一条', type: '(id: number) => void' },
  { name: 'config', desc: '修改全局配置, 只覆盖传入的字段', type: '(options: Partial<NyNotificationConfig>) => void' },
  { name: 'destroy', desc: '清空全部通知并卸载宿主节点', type: '() => void' },
]

const apiOptions = [
  { name: 'title', desc: '标题', type: 'string', default: "''" },
  { name: 'desc', desc: '正文说明, 太长会自动换行', type: 'string', default: "''" },
  { name: 'type', desc: '通知类型, 决定图标与颜色', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'" },
  { name: 'duration', desc: '自动关闭的秒数, 0 表示不自动关闭', type: 'number', default: '4.5' },
  { name: 'closable', desc: '是否显示右上角关闭按钮', type: 'boolean', default: 'true' },
  {
    name: 'placement',
    desc: '出现的位置, 缺省跟随全局配置',
    type: "'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'",
    default: "'topRight'",
  },
]

const apiConfig = [
  {
    name: 'placement',
    desc: '默认出现的位置',
    type: "'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'",
    default: "'topRight'",
  },
  { name: 'offset', desc: '距视口上/下边缘的距离 (px)', type: 'number', default: '24' },
  { name: 'duration', desc: '默认自动关闭秒数, 0 表示不自动关闭', type: 'number', default: '4.5' },
  { name: 'maxCount', desc: '同屏最多显示的条数, 超出时移除最早的', type: 'number', default: '5' },
  { name: 'width', desc: '卡片宽度 (px)', type: 'number', default: '340' },
]

const apiNotes = [
  {
    name: '宿主',
    desc: '首次调用时在 document.body 下创建 .ny-notification-root 并 render 宿主组件, 使用方不需要放任何节点',
  },
  { name: '层级', desc: '宿主用 --ny-z-message, 与 Message 同层, 都在 Modal 与 Drawer 之上' },
  { name: '位置', desc: '四个角落各自一列, 同一时刻的通知可以出现在不同位置, 互不影响' },
  { name: '时长', desc: 'duration 单位是秒, 由宿主里的定时器统一管理, 手动 close 会一起清掉' },
]
</script>

<template>
  <DocPage title="Notification 通知提醒" desc="命令式通知卡片 nyNotification.open()">

    <DemoBlock
      title="四种类型"
      desc="nyNotification 是命令式 API, 宿主节点由首次调用懒挂载, 使用方不用在页面里放任何组件。"
      :code="codeType"
      :value="`最近一次 id = ${lastId || '(未调用)'} · 类型 = ${lastType}`"
    >
      <div class="ex-group">
        <NyButton @click="openType('info')">信息</NyButton>
        <NyButton @click="openType('success')">成功</NyButton>
        <NyButton @click="openType('warning')">警告</NyButton>
        <NyButton @click="openType('error')">错误</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="四个位置"
      desc="placement 只作用于这一条通知, 四个角落各自一列, 可以同时出现。"
      :code="codePlacement"
      :value="`最近一次 placement = ${lastPlacement}`"
    >
      <div class="ex-group">
        <NyButton v-for="item in placements" :key="item.value" @click="openAt(item.value)">
          {{ item.label }}
        </NyButton>
      </div>

      <p class="ex-note">四类各点一次就能看到它们各自占一个角, 互不挤占。</p>
    </DemoBlock>

    <DemoBlock
      title="时长与常驻"
      desc="duration 单位是秒; 传 0 就一直留在屏幕上, 卡片底部会走一条倒计时进度条。"
      :code="codeDuration"
      :value="`最近一次 id = ${lastId || '(未调用)'} · 两条的 duration 分别是 2 与 0`"
    >
      <div class="ex-group">
        <NyButton @click="openAuto">2 秒自动关闭</NyButton>
        <NyButton @click="openSticky">常驻通知</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="加载中与手动关闭"
      desc="loading 固定不自动关闭, 拿到返回的 id 后调 nyNotification.close(id) 收尾。"
      :code="codeLoading"
      :value="`loadingId = ${loadingId === null ? 'null' : loadingId}`"
    >
      <div class="ex-group">
        <NyButton variant="primary" @click="showLoading">开始部署</NyButton>
        <NyButton :disabled="loadingId === null" @click="closeLoading">结束部署</NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="全局配置"
      desc="config 改的是后续通知的默认值, 已经显示的通知不受影响; 点下面的按钮切着看效果。"
      :code="codeConfig"
      :value="configInfo"
    >
      <div class="ex-group">
        <NyButton @click="togglePlacement">位置切到 {{ configPlacement === 'topRight' ? 'bottomLeft' : 'topRight' }}</NyButton>
        <NyButton @click="toggleOffset">offset 切到 {{ configOffset === 24 ? '96' : '24' }}</NyButton>
        <NyButton @click="toggleDuration">duration 切到 {{ configDuration === 4.5 ? '1' : '4.5' }}s</NyButton>
        <NyButton @click="toggleMaxCount">maxCount 切到 {{ configMax === 5 ? '2' : '5' }}</NyButton>
        <NyButton @click="toggleWidth">width 切到 {{ configWidth === 340 ? '420' : '340' }}</NyButton>
        <NyButton @click="resetConfig">恢复默认</NyButton>
      </div>

      <div class="ex-group">
        <NyButton variant="primary" @click="openType('success')">用新配置发一条</NyButton>
      </div>

      <p class="ex-note">maxCount 调成 2 之后连开三条, 最早的那条会被挤掉; 宽度与偏移能直接在这条通知上看到。</p>
    </DemoBlock>

    <DemoBlock
      title="清空与销毁"
      desc="destroy 会清空全部通知并卸载挂到 body 上的宿主节点, 下次调用时会重新懒挂载。"
      :code="codeDestroy"
      :value="`最近一次调用: ${lastCall}`"
    >
      <div class="ex-group">
        <NyButton @click="openThree">连开三条</NyButton>
        <NyButton variant="danger" @click="destroyAll">全部销毁</NyButton>
      </div>

      <p class="ex-note">销毁之后再点一次任意演示按钮, 会发现宿主又被重新建了出来, 使用方不需要管这件事。</p>
    </DemoBlock>

    <template #api>
      <ApiTable title="nyNotification 方法" kind="methods" :rows="apiMethods" />
      <ApiTable title="NyNotificationOptions" :rows="apiOptions" />
      <ApiTable title="NyNotificationConfig" :rows="apiConfig" />
      <ApiTable title="nyNotification 说明" kind="methods" compact :rows="apiNotes" />
    </template>
  </DocPage>
</template>
