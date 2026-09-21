<script setup lang="ts">
import { ref } from 'vue'

import { NyAlert, NyButton, NyIcon } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const closableVisible = ref(true)
const bannerVisible = ref(true)

const codeType = `<NyAlert type="info" desc="订单已进入审核队列。" />
<NyAlert type="success" desc="保存成功, 两分钟后同步到线上。" />
<NyAlert type="warning" desc="该操作会覆盖同名文件。" />
<NyAlert type="danger" desc="连接已断开, 请检查网络后重试。" />`

const codeTitle = `<NyAlert type="warning" title="配额不足" desc="本月的调用次数已用掉 92%。" />
<NyAlert type="success" title="发布完成" :show-icon="false" desc="直接给标题与描述, 不放图标。" />`

const codeVariant = `<NyAlert variant="soft" type="info" title="soft (默认)" desc="状态浅底配状态深色文字。" />
<NyAlert variant="outline" type="info" title="outline" desc="只留描边, 正文用常规文字色。" />`

const codeClosable = `<NyAlert v-if="closableVisible" type="info" closable desc="点右侧的叉关掉。" @close="closableVisible = false" />
<NyButton size="sm" @click="closableVisible = true">重新显示</NyButton>`

const codeBanner = `<NyAlert v-if="bannerVisible" banner type="warning" action="查看详情" closable @action="onAction">
  服务将于今晚 23:00 维护, 预计 30 分钟。
</NyAlert>`

const codeSlots = `<NyAlert type="success" title="自定义图标">
  <!-- 图标, 标题与描述都可以用具名插槽替换 -->
  <template #icon>
    <NyIcon name="star" :size="18" />
  </template>
  描述内容
</NyAlert>`

const apiProps = [
  { name: 'type', desc: '状态色, 只认这四种, 其余值落回 info', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'" },
  { name: 'title', desc: '标题, 也可以用 #title 插槽', type: 'string', default: "''" },
  { name: 'desc', desc: '描述正文, 也可以用默认插槽', type: 'string', default: "''" },
  { name: 'variant', desc: '样式形态: 状态浅底 / 只留描边', type: "'soft' | 'outline'", default: "'soft'" },
  { name: 'showIcon', desc: '是否显示左侧状态图标', type: 'boolean', default: 'true' },
  { name: 'closable', desc: '显示关闭按钮, 关闭由组件内部先隐藏', type: 'boolean', default: 'false' },
  { name: 'banner', desc: '通栏样式, 去掉圆角并加重顶部边框', type: 'boolean', default: 'false' },
  { name: 'action', desc: '右下角文字按钮的文案, 也可以用 #action 插槽', type: 'string', default: "''" },
]

const apiEvents = [
  { name: 'close', desc: '点击关闭按钮, 收到原始鼠标事件', type: 'MouseEvent' },
  { name: 'action', desc: '点击右下角的操作按钮', type: 'void' },
]

const apiSlots = [
  { name: 'default', desc: '描述正文, 优先级高于 desc' },
  { name: 'title', desc: '标题, 优先级高于 title' },
  { name: 'icon', desc: '替换左侧图标' },
  { name: 'action', desc: '替换右下角操作按钮的内容' },
]

function onAction() {
  bannerVisible.value = false
}
</script>

<template>
  <DocPage title="Alert 警告提示" desc="页面内的状态提示条">

    <DemoBlock title="四种状态" desc="type 决定状态浅底与图标, 传入其他值一律落回 info。" :code="codeType" backdrop="muted">
      <div class="ex-stack">
        <NyAlert type="info" desc="订单已进入审核队列。" />
        <NyAlert type="success" desc="保存成功, 两分钟后同步到线上。" />
        <NyAlert type="warning" desc="该操作会覆盖同名文件。" />
        <NyAlert type="danger" desc="连接已断开, 请检查网络后重试。" />
      </div>
    </DemoBlock>

    <DemoBlock title="标题与描述" desc="title 加粗显示, showIcon 关掉后只剩文字。" :code="codeTitle" backdrop="muted">
      <div class="ex-stack">
        <NyAlert type="warning" title="配额不足" desc="本月的调用次数已用掉 92%。" />
        <NyAlert type="success" title="发布完成" :show-icon="false" desc="直接给标题与描述, 不放图标。" />
      </div>
    </DemoBlock>

    <DemoBlock title="soft 与 outline" desc="soft 用状态浅底, outline 只留描边, 前者更醒目。" :code="codeVariant" backdrop="muted">
      <div class="ex-stack">
        <NyAlert variant="soft" type="info" title="soft (默认)" desc="状态浅底配状态深色文字。" />
        <NyAlert variant="outline" type="info" title="outline" desc="只留描边, 正文用常规文字色。" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="可关闭"
      desc="点关闭时组件自己先隐藏并抛 close, 使用方控制它何时回来。"
      :code="codeClosable"
      :value="`closableVisible: ${closableVisible}`"
      backdrop="muted"
    >
      <div class="ex-stack">
        <NyAlert
          v-if="closableVisible"
          type="info"
          closable
          desc="点右侧的叉关掉。"
          @close="closableVisible = false"
        />
        <div><NyButton size="sm" @click="closableVisible = true">重新显示</NyButton></div>
      </div>
    </DemoBlock>

    <DemoBlock title="通栏与插槽" desc="banner 适合贴顶的公告条, #icon 可以换成别的图标。" :code="codeBanner" backdrop="muted">
      <div class="ex-stack">
        <NyAlert
          v-if="bannerVisible"
          banner
          type="warning"
          action="查看详情"
          closable
          @action="onAction"
        >
          服务将于今晚 23:00 维护, 预计 30 分钟。
        </NyAlert>

        <NyAlert type="success" title="自定义图标">
          <template #icon>
            <NyIcon name="star" :size="18" />
          </template>
          图标, 标题与描述都可以用具名插槽替换。
        </NyAlert>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyAlert Props" :rows="apiProps" />
      <ApiTable title="NyAlert 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyAlert 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
