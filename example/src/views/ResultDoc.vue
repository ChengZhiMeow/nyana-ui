<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyIcon, NyResult } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const custom = ref(false)

const codeStatus = `<NyResult status="success" title="提交成功" desc="工单号 #2048, 处理结果会通过站内信通知你。" />`

const codeActions = `<NyResult status="error" title="提交失败" desc="网络连接超时, 请稍后重试。">
  <NyButton variant="primary">重新提交</NyButton>
  <NyButton>查看日志</NyButton>
</NyResult>`

const codeSize = `<NyResult size="sm" status="warning" title="证书即将过期" desc="还有 7 天到期。" />
<NyResult size="lg" status="info" title="正在审核" desc="预计一个工作日内给出结果。" />`

const codeSlots = `<NyResult status="success" title="已邀请">
  <template #icon>
    <NyIcon name="star" :size="48" />
  </template>
  <template #desc>
    链接有效期 <strong>24 小时</strong>, 过期后需要重新生成。
  </template>
  <NyButton variant="primary">复制链接</NyButton>
</NyResult>`

const codeCustom = `<!-- status 换成完整占位内容就是自定义结果页 -->
<NyResult :status="custom ? 'warning' : '403'" :title="custom ? '权限即将到期' : '没有访问权限'" :desc="custom ? '还有 3 天到期, 请及时续期。' : '请联系管理员开通。'" />`

const codeCode = `<NyResult status="404" title="页面走丢了" desc="地址可能已经变更, 回首页看看。">
  <NyButton variant="primary">回到首页</NyButton>
</NyResult>`

const apiProps = [
  { name: 'status', desc: '结果状态, 404 / 403 用中性色圈住状态码', type: "'success' | 'error' | 'warning' | 'info' | '404' | '403'", default: "'info'" },
  { name: 'title', desc: '标题, 也可以用 #title 插槽', type: 'string', default: "''" },
  { name: 'desc', desc: '补充说明, 也可以用 #desc 插槽', type: 'string', default: "''" },
  { name: 'size', desc: '尺寸档, 同时缩放插画与标题', type: "'sm' | 'md' | 'lg'", default: "'md'" },
]

const apiSlots = [
  { name: 'default', desc: '操作区, 通常放一到两个按钮' },
  { name: 'icon', desc: '替换插画' },
  { name: 'title', desc: '替换标题' },
  { name: 'desc', desc: '替换补充说明' },
]

function toggleCustom() {
  custom.value = !custom.value
}
</script>

<template>
  <DocPage title="Result 结果页" desc="操作结果的整页反馈">

    <DemoBlock
      title="四种状态"
      desc="status 决定插画与语义色, 插画全部是内联 SVG, 不引外部图片。"
      :code="codeStatus"
      backdrop="muted"
    >
      <div class="ex-stack ex-stack--tight">
        <NyResult status="success" title="提交成功" desc="工单号 #2048, 处理结果会通过站内信通知你。" />
        <NyResult status="error" title="提交失败" desc="网络连接超时, 请稍后重试。" />
        <NyResult status="warning" title="配额不足" desc="本月调用次数已用掉 92%。" />
        <NyResult status="info" title="正在审核" desc="预计一个工作日内给出结果。" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="带操作按钮"
      desc="默认插槽就是操作区, 放几个按钮由使用方决定。"
      :code="codeActions"
      backdrop="muted"
    >
      <NyResult status="error" title="提交失败" desc="网络连接超时, 请稍后重试。">
        <NyButton variant="primary">重新提交</NyButton>
        <NyButton>查看日志</NyButton>
      </NyResult>
    </DemoBlock>

    <DemoBlock
      title="三档尺寸"
      desc="size 只影响插画大小与标题字号, 排版结构不变。"
      :code="codeSize"
      backdrop="muted"
    >
      <div class="ex-stack ex-stack--tight">
        <NyResult size="sm" status="warning" title="证书即将过期" desc="还有 7 天到期。" />
        <NyResult size="lg" status="info" title="正在审核" desc="预计一个工作日内给出结果。" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="插槽定制"
      desc="#icon 换插画, #desc 放富文本, 默认插槽放操作。"
      :code="codeSlots"
      backdrop="muted"
    >
      <NyResult status="success" title="已邀请">
        <template #icon>
          <NyIcon name="star" :size="48" />
        </template>

        <template #desc>
          链接有效期 <strong>24 小时</strong>, 过期后需要重新生成。
        </template>

        <NyButton variant="primary">复制链接</NyButton>
      </NyResult>
    </DemoBlock>

    <DemoBlock
      title="错误码"
      desc="404 与 403 没有对应的语义色, 用弱化文字色圈住状态码。"
      :code="codeCode"
      backdrop="muted"
    >
      <NyResult status="404" title="页面走丢了" desc="地址可能已经变更, 回首页看看。">
        <NyButton variant="primary">回到首页</NyButton>
      </NyResult>
    </DemoBlock>

    <DemoBlock
      title="受控切换状态"
      desc="status 与文案都可以由状态驱动, 切换时很轻, 适合做空状态兜底。"
      :code="codeCustom"
      :value="`custom: ${custom}`"
      backdrop="muted"
    >
      <div class="ex-group ex-group--center">
        <NyButton size="sm" @click="toggleCustom">切换状态</NyButton>
      </div>

      <NyResult
        :status="custom ? 'warning' : '403'"
        :title="custom ? '权限即将到期' : '没有访问权限'"
        :desc="custom ? '还有 3 天到期, 请及时续期。' : '请联系管理员开通。'"
      />
    </DemoBlock>

    <template #api>
      <ApiTable title="NyResult Props" :rows="apiProps" />
      <ApiTable title="NyResult 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
