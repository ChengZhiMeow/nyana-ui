<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NySpin } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const spinning = ref(true)
const syncing = ref(true)

const codeBasic = `<NySpin />
<NySpin size="lg" />`

const codeSize = `<NySpin size="sm" />
<NySpin size="md" />
<NySpin size="lg" />
<NySpin :size="44" />`

const codeWrap = `<!-- 有默认插槽时包裹内容: 指示器浮在内容上层 -->
<NySpin>
  <div>内容区</div>
</NySpin>`

const codeToggle = `<NySpin v-if="spinning">
  <div>内容区</div>
</NySpin>
<div v-else>内容区</div>

<NyButton @click="spinning = !spinning">切换 spinning</NyButton>`

const codeTip = `<NySpin tip="正在加载订单数据" size="lg" />`

const codeBlur = `<NySpin :spinning="syncing" blur tip="同步中">
  <div>内容区</div>
</NySpin>`

const apiProps = [
  { name: 'size', desc: '尺寸档或直接给像素值', type: "'sm' | 'md' | 'lg' | number", default: "'md'" },
  { name: 'spinning', desc: '是否显示加载指示, false 时只渲染内容', type: 'boolean', default: 'true' },
  { name: 'tip', desc: '指示器下方的提示文案, 也可以用 #tip 插槽', type: 'string', default: "''" },
  { name: 'blur', desc: '包裹模式下给内容盖一层半透明底', type: 'boolean', default: 'false' },
  { name: 'label', desc: '读屏播报的文案, 视觉上不出现', type: 'string', default: "'加载中'" },
]

const apiSlots = [
  { name: 'default', desc: '被包裹的内容, 不传时就是一个独立的小圈' },
  { name: 'tip', desc: '替换指示器下方的提示内容' },
]

function sync() {
  syncing.value = true

  window.setTimeout(() => (syncing.value = false), 1600)
}

function resetSync() {
  syncing.value = true
}
</script>

<template>
  <DocPage title="Spin 加载中" desc="加载指示器与内容包裹">

    <DemoBlock title="基础用法" desc="不传插槽时它就是一个独立的小圈, 只占自身尺寸。" :code="codeBasic">
      <div class="ex-group">
        <NySpin />
        <NySpin size="lg" />
      </div>
    </DemoBlock>

    <DemoBlock title="三档尺寸" desc="size 支持 sm / md / lg, 也可以直接给像素值。" :code="codeSize">
      <div class="ex-group">
        <NySpin size="sm" />
        <NySpin size="md" />
        <NySpin size="lg" />
        <NySpin :size="44" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="包裹内容"
      desc="传入默认插槽后尺寸由内容决定, 指示器浮在内容上层。"
      :code="codeWrap"
      backdrop="muted"
    >
      <NySpin>
        <div class="ex-box">内容区: 表格 / 列表 / 卡片都行</div>
      </NySpin>
    </DemoBlock>

    <DemoBlock
      title="切换 spinning"
      desc="spinning 为 false 时组件只渲染插槽内容, 不留下任何指示器节点。"
      :code="codeToggle"
      :value="`spinning: ${spinning}`"
      backdrop="muted"
    >
      <div class="ex-group">
        <NyButton size="sm" @click="spinning = !spinning">
          切换 spinning 为 {{ !spinning }}
        </NyButton>
      </div>

      <NySpin v-if="spinning">
        <div class="ex-box">内容区: 接口回来后换成可见内容</div>
      </NySpin>
      <div v-else class="ex-box">内容区: 接口已返回</div>
    </DemoBlock>

    <DemoBlock title="提示文案" desc="tip 显示在指示器下方, 读屏依旧只播报 label。" :code="codeTip" backdrop="muted">
      <div class="ex-group">
        <NySpin tip="正在加载订单数据" size="lg" />
        <NySpin tip="正在校验" size="sm" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="半透明底"
      desc="blur 在内容与指示器之间垫一层半透明底, 内容还能透出来但不抢注意力。"
      :code="codeBlur"
      :value="`syncing: ${syncing}`"
      backdrop="muted"
    >
      <div class="ex-group">
        <NyButton size="sm" variant="primary" :disabled="syncing" @click="sync">重新同步</NyButton>
        <NyButton size="sm" @click="resetSync">回到同步中</NyButton>
      </div>

      <NySpin :spinning="syncing" blur tip="同步中">
        <div class="ex-box">内容区: 同步期间盖一层半透明底</div>
      </NySpin>
    </DemoBlock>

    <template #api>
      <ApiTable title="NySpin Props" :rows="apiProps" />
      <ApiTable title="NySpin 插槽" kind="slots" :rows="apiSlots" />
    </template>
  </DocPage>
</template>
