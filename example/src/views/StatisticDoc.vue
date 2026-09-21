<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyGrid, NyStatistic } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const groupSeparator = ref(true)

const separatorText = computed(() => `groupSeparator: ${groupSeparator.value}`)

const codeBasic = `<NyStatistic title="今日订单" :value="1286" />
<NyStatistic title="活跃用户" :value="8642" />`

const codePrecision = `<NyStatistic title="客单价" :value="1286.5" :precision="2" />
<NyStatistic title="订单量" :value="1286" :group-separator="groupSeparator" />`

const codeAffix = `<NyStatistic title="本月销售额" :value="128640" prefix="￥" />
<NyStatistic title="库存" :value="3268" suffix="件" />`

const codeTrend = `<NyStatistic title="访问量" :value="24180" trend="up" trend-text="较上周 12.4%" />
<NyStatistic title="退货率" :value="2.8" suffix="%" trend="down" trend-text="较上周 0.6%" />`

const codeStatus = `<NyStatistic title="待付款" :value="128" status="warning" size="sm" />
<NyStatistic title="已支付" :value="2048" status="success" />`

const codeString = `<NyStatistic title="审计结果" value="保密" />
<NyStatistic title="补录金额" value="1286" :precision="2" />`

const apiProps = [
  { name: 'value', desc: '数值, 数字走千分位与精度, 字符串原样展示', type: 'number | string' },
  { name: 'title', desc: '数值上方的说明文案', type: 'string', default: "''" },
  { name: 'precision', desc: '小数位, 缺省时保留原值的小数', type: 'number', default: '—' },
  { name: 'prefix', desc: '数值前缀, 字号自动缩到 0.6em', type: 'string', default: "''" },
  { name: 'suffix', desc: '数值后缀, 字号自动缩到 0.6em', type: 'string', default: "''" },
  { name: 'groupSeparator', desc: '是否按千分位分组', type: 'boolean', default: 'true' },
  { name: 'trend', desc: '趋势方向, 有值时在下方显示箭头', type: "'up' | 'down'", default: '—' },
  { name: 'trendText', desc: '趋势箭头后面的说明', type: 'string', default: "''" },
  { name: 'status', desc: '数值语义色', type: "'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger'", default: "'default'" },
  { name: 'size', desc: '数值字号档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
]
</script>

<template>
  <DocPage title="Statistic 统计数值" desc="带前缀后缀与趋势的重点数字">

    <DemoBlock title="基础用法" desc="title 在上, value 在下, 数字用等宽字体对齐。" :code="codeBasic">
      <div class="ex-group">
        <NyStatistic title="今日订单" :value="1286" />
        <NyStatistic title="活跃用户" :value="8642" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="精度与千分位"
      desc="precision 固定小数位, groupSeparator 关闭后数字连排。"
      :code="codePrecision"
      :value="separatorText"
    >
      <div class="ex-group">
        <NyStatistic title="客单价" :value="1286.5" :precision="2" />
        <NyStatistic title="订单量" :value="1286" :group-separator="groupSeparator" />
      </div>

      <NyButton size="sm" @click="groupSeparator = !groupSeparator">切换千分位</NyButton>
    </DemoBlock>

    <DemoBlock title="前缀与后缀" desc="货币符号与单位走 prefix / suffix, 字号自动缩小。" :code="codeAffix">
      <div class="ex-group">
        <NyStatistic title="本月销售额" :value="128640" prefix="￥" />
        <NyStatistic title="库存" :value="3268" suffix="件" />
      </div>
    </DemoBlock>

    <DemoBlock title="趋势" desc="trend 为 up 时绿色上箭头, down 时红色下箭头。" :code="codeTrend">
      <div class="ex-group">
        <NyStatistic title="访问量" :value="24180" trend="up" trend-text="较上周 12.4%" />
        <NyStatistic title="退货率" :value="2.8" suffix="%" trend="down" trend-text="较上周 0.6%" />
      </div>
    </DemoBlock>

    <DemoBlock title="状态色与尺寸" desc="status 给数值上语义色, size 控制字号档。" :code="codeStatus">
      <NyGrid :columns="3" :gap="20">
        <NyStatistic title="待付款" :value="128" status="warning" size="sm" />
        <NyStatistic title="已支付" :value="2048" status="success" />
        <NyStatistic title="退款中" :value="32" status="danger" size="lg" />
      </NyGrid>
    </DemoBlock>

    <DemoBlock
      title="字符串数值"
      desc="非数字字符串原样展示; 能解析成数字的字符串带 precision 时也会被格式化。"
      :code="codeString"
    >
      <div class="ex-group">
        <NyStatistic title="审计结果" value="保密" />
        <NyStatistic title="补录金额" value="1286" :precision="2" />
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyStatistic Props" :rows="apiProps" />
    </template>
  </DocPage>
</template>
