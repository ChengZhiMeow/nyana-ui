<script setup lang="ts">
import { NyGrid, NyMeter, NyMetricCard, NyPill } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const codeMetric = `<NyGrid :columns="2" :responsive="{ lg: 4 }">
  <NyMetricCard icon="users" label="在线玩家" value="15" unit="/ 40" :percent="38" foot="生存服 12 · 创造服 3" />
  <NyMetricCard icon="memory" label="内存" value="7.4" unit="/ 8 GB" :percent="92" foot="超过 80% 变黄" />
  <NyMetricCard icon="wallet" label="余额" value="¥86.50" foot="本月已消费 ¥113.50" />
  <NyMetricCard icon="mail" label="待回复工单" value="1" foot="#1042 服务器卡顿" />
</NyGrid>`

const codeMeter = `<NyMeter label="CPU" used="17%" total="400%" :percent="4" />
<NyMeter label="磁盘" used="34" total="40 GB" :percent="85" />
<NyMeter label="内存" used="5.2" total="8 GB" :percent="65" stack />`

const codePill = `<NyPill type="success">运行中</NyPill>
<NyPill type="warning">启动中</NyPill>
<NyPill type="primary">安装中</NyPill>
<NyPill>已停止</NyPill>
<NyPill type="danger">已崩溃</NyPill>
<NyPill type="success" :dot="false">流畅</NyPill>`
</script>

<template>
  <DocPage title="MetricCard 指标卡" desc="页面第一排的关键数字。只有带上限的数值 (用量 / 总量) 才显示进度条; 余额、待办数这类不显示。">
    <DemoBlock title="指标卡" desc="运行状况放前面, 账务与待办放后面。传 percent 才有进度条, 超过 80% 变黄, 95% 变红。" :code="codeMetric">
      <NyGrid :columns="2" :responsive="{ lg: 4 }">
        <NyMetricCard icon="users" label="在线玩家" value="15" unit="/ 40" :percent="38" foot="生存服 12 · 创造服 3" />
        <NyMetricCard icon="memory" label="内存" value="7.4" unit="/ 8 GB" :percent="92" foot="超过 80% 变黄" />
        <NyMetricCard icon="wallet" label="余额" value="¥86.50" foot="本月已消费 ¥113.50" />
        <NyMetricCard icon="mail" label="待回复工单" value="1" foot="#1042 服务器卡顿" />
      </NyGrid>
    </DemoBlock>

    <DemoBlock title="Meter 资源条" desc="更紧凑的用量条, 用在实例卡与侧栏里。窄卡片里加 stack 让标签和数值上下排。" :code="codeMeter">
      <NyGrid :columns="1" :responsive="{ sm: 3 }">
        <NyMeter label="CPU" used="17%" total="400%" :percent="4" />
        <NyMeter label="磁盘" used="34" total="40 GB" :percent="85" />
        <NyMeter label="内存" used="5.2" total="8 GB" :percent="65" stack />
      </NyGrid>
    </DemoBlock>

    <DemoBlock title="Pill 状态胶囊" desc="圆点 + 文字, 颜色和文字同时表达状态。" :code="codePill">
      <div class="ex-group">
        <NyPill type="success">运行中</NyPill>
        <NyPill type="warning">启动中</NyPill>
        <NyPill type="primary">安装中</NyPill>
        <NyPill>已停止</NyPill>
        <NyPill type="danger">已崩溃</NyPill>
        <NyPill type="success" :dot="false">流畅</NyPill>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable
        title="MetricCard Props"
        :rows="[
          { name: 'label', type: 'string', desc: '标签' },
          { name: 'value', type: 'string | number', desc: '数值' },
          { name: 'unit', type: 'string', desc: '数值后面的小号单位, 例如 / 8 GB' },
          { name: 'icon', type: 'string', desc: '标签前的图标' },
          { name: 'percent', type: 'number | null', default: 'null', desc: '进度; 不传就不显示进度条' },
          { name: 'status', type: `'auto' | 'primary' | 'success' | 'warning' | 'danger'`, default: `'auto'`, desc: 'auto 按 warn / danger 阈值自动变色' },
          { name: 'warn / danger', type: 'number', default: '80 / 95', desc: '变黄、变红的阈值' },
          { name: 'foot', type: 'string', desc: '底部说明行' },
        ]"
      />
      <ApiTable title="MetricCard Slots" kind="slots" :rows="[{ name: 'default', desc: '替换进度条, 例如放迷你折线' }, { name: 'extra', desc: '标签行右侧' }, { name: 'foot', desc: '底部说明' }]" />
      <ApiTable
        title="Meter Props"
        :rows="[
          { name: 'label', type: 'string', desc: '标签' },
          { name: 'used / total', type: 'string | number', desc: '显示用的用量与总量' },
          { name: 'percent', type: 'number', desc: '进度, 决定长度与颜色' },
          { name: 'stack', type: 'boolean', default: 'false', desc: '标签与数值上下排' },
        ]"
      />
      <ApiTable title="Pill Props" :rows="[{ name: 'type', type: `'default' | 'primary' | 'success' | 'warning' | 'danger'`, default: `'default'`, desc: '颜色' }, { name: 'dot', type: 'boolean', default: 'true', desc: '是否带圆点' }]" />
    </template>
  </DocPage>
</template>
