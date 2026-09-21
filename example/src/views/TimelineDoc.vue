<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyGrid, NyTimeline } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

type Node = {
  title?: string
  desc?: string
  time?: string
  icon?: string
  status?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

const basicItems: Node[] = [
  { title: '提交订单', time: '2024-07-18 09:12', desc: '订单已创建, 等待仓库确认库存。' },
  { title: '仓库出库', time: '2024-07-18 14:05', desc: '快递单号 SF1234567890, 预计次日送达。' },
  { title: '运输中', time: '2024-07-19 08:30', desc: '包裹已到达本地分拨中心。' },
  { title: '已签收', time: '2024-07-19 16:42' },
]

const statusItems: Node[] = [
  { title: '已创建', time: '09:12', status: 'default' },
  { title: '进行中', time: '10:40', status: 'primary' },
  { title: '已通过', time: '11:05', status: 'success' },
  { title: '待确认', time: '13:20', status: 'warning' },
  { title: '已驳回', time: '15:08', status: 'danger' },
]

const iconItems: Node[] = [
  { title: '上传素材', time: '10:02', icon: 'upload', status: 'primary' },
  { title: '审核完成', time: '10:36', icon: 'check-circle', status: 'success' },
  { title: '库存告警', time: '11:14', icon: 'alert', status: 'warning' },
  { title: '定时任务', time: '12:00', icon: 'clock' },
]

const mode = ref<'left' | 'right' | 'alternate'>('left')

const modeText = computed(() => `mode: ${mode.value}`)

const reverse = ref(false)

const reverseText = computed(() => `reverse: ${reverse.value}`)

const codeBasic = `<NyTimeline :items="basicItems" />`

const codeStatus = `<NyTimeline :items="statusItems" />`

const codeIcon = `<NyTimeline :items="iconItems" />`

const codeMode = `<NyTimeline :items="basicItems" :mode="mode" />`

const codeReverse = `<NyTimeline :items="basicItems" :reverse="reverse" />`

const codeSize = `<NyTimeline size="sm" :items="basicItems" />`

const apiProps = [
  { name: 'items', desc: '节点列表, 每项字段见下一张表', type: 'NyTimelineItem[]' },
  { name: 'mode', desc: '对齐方式, alternate 在 768px 以下退回 left', type: "'left' | 'right' | 'alternate'", default: "'left'" },
  { name: 'reverse', desc: '倒序渲染, 最新的排在视觉最上方', type: 'boolean', default: 'false' },
  { name: 'size', desc: '尺寸档, lg 只放大标题字号', type: "'sm' | 'md' | 'lg'", default: "'md'" },
]

const apiItem = [
  { name: 'title', desc: '节点标题, 加粗显示' },
  { name: 'desc', desc: '节点补充说明' },
  { name: 'time', desc: '时间文案, 排在标题下方' },
  { name: 'icon', desc: 'NyIcon 图标名, 有值时标记里显示图标而不是圆点' },
  { name: 'status', desc: '标记颜色', type: "'default' | 'primary' | 'success' | 'warning' | 'danger'", default: "'default'" },
]
</script>

<template>
  <DocPage title="Timeline 时间轴" desc="按时间顺序呈现事件流">

    <DemoBlock title="基础用法" desc="items 传数组, 每项的 title / time / desc 依次排布。" :code="codeBasic">
      <NyTimeline :items="basicItems" />
    </DemoBlock>

    <DemoBlock title="状态色" desc="status 给标记上色, 五档语义色与其它组件一致。" :code="codeStatus">
      <NyTimeline :items="statusItems" />
    </DemoBlock>

    <DemoBlock title="图标节点" desc="给 item.icon 后, 标记里显示图标而不是圆点。" :code="codeIcon">
      <NyTimeline :items="iconItems" />
    </DemoBlock>

    <DemoBlock
      title="对齐方式"
      desc="left 靠左, right 把标记与文字换到右侧, alternate 在宽屏下左右交替。"
      :code="codeMode"
      :value="modeText"
    >
      <div class="ex-group">
        <NyButton size="sm" :variant="mode === 'left' ? 'primary' : 'default'" @click="mode = 'left'">
          left
        </NyButton>
        <NyButton size="sm" :variant="mode === 'right' ? 'primary' : 'default'" @click="mode = 'right'">
          right
        </NyButton>
        <NyButton
          size="sm"
          :variant="mode === 'alternate' ? 'primary' : 'default'"
          @click="mode = 'alternate'"
        >
          alternate
        </NyButton>
      </div>

      <NyTimeline :items="basicItems" :mode="mode" />
    </DemoBlock>

    <DemoBlock
      title="倒序"
      desc="reverse 为真时整体倒序, 视觉上最后一项依然不画连接线。"
      :code="codeReverse"
      :value="reverseText"
    >
      <NyButton size="sm" @click="reverse = !reverse">切换倒序</NyButton>

      <NyTimeline :items="basicItems" :reverse="reverse" />
    </DemoBlock>

    <DemoBlock title="三档尺寸" desc="size 控制正文与标题字号, 用于嵌套在卡片里的小时间轴。" :code="codeSize">
      <NyGrid :columns="3" :gap="20">
        <div>
          <p class="ex-note">sm</p>
          <NyTimeline size="sm" :items="basicItems" />
        </div>

        <div>
          <p class="ex-note">md</p>
          <NyTimeline size="md" :items="basicItems" />
        </div>

        <div>
          <p class="ex-note">lg</p>
          <NyTimeline size="lg" :items="basicItems" />
        </div>
      </NyGrid>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTimeline Props" :rows="apiProps" />
      <ApiTable title="NyTimeline items 项配置" :rows="apiItem" />
    </template>
  </DocPage>
</template>
