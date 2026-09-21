<script setup lang="ts">
import { ref } from 'vue'

import { NyRadio, NyRadioGroup } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NyOption } from '@chengzhimeow/nyana-ui'

const picked = ref<string | number | null>('card')
const sizeValue = ref<string | number | null>('md')
const city = ref<string | number | null>('beijing')
const disabledGroup = ref<string | number | null>('draft')
const partlyDisabled = ref<string | number | null>('sms')
const solo = ref<string | number | null>('left')

const payOptions: NyOption[] = [
  { label: '银行卡', value: 'card' },
  { label: '微信支付', value: 'wechat' },
  { label: '支付宝', value: 'alipay' },
  { label: '余额', value: 'balance', disabled: true },
]

const sizeOptions: NyOption[] = [
  { label: '小号', value: 'sm' },
  { label: '标准', value: 'md' },
  { label: '大号', value: 'lg' },
]

const cityOptions: NyOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai', desc: '含江浙沪次日达' },
  { label: '广州', value: 'guangzhou' },
]

const stateOptions: NyOption[] = [
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
]

const noticeOptions: NyOption[] = [
  { label: '邮件', value: 'mail' },
  { label: '短信', value: 'sms' },
  { label: '站内信', value: 'inbox', disabled: true },
]

const codeBasic = '<NyRadioGroup v-model="picked" :options="payOptions" />'

const codeButton = `<NyRadioGroup v-model="sizeValue" :options="sizeOptions" button />

<NyRadioGroup v-model="picked" :options="payOptions" button size="sm" />`

const codeVertical = `<NyRadioGroup v-model="city" :options="cityOptions" direction="vertical" />

<NyRadioGroup v-model="city" label="收货城市">
  <NyRadio value="beijing" label="北京" />
  <NyRadio value="shanghai" label="上海" />
</NyRadioGroup>`

const codeDisabled = `<NyRadioGroup v-model="disabledGroup" :options="stateOptions" disabled />

<NyRadioGroup v-model="partlyDisabled" :options="noticeOptions" />`

const codeSolo = `<NyRadio v-model="solo" value="left" label="左对齐" />
<NyRadio v-model="solo" value="center" label="居中" />
<NyRadio v-model="solo" value="right" label="右对齐" size="lg" />`

const radioProps = [
  { name: 'v-model', desc: '独立使用时的选中值', type: 'string | number | null', default: 'null' },
  {
    name: 'value',
    desc: '选项的值, 与 group 配合时必须给',
    type: 'string | number',
    default: 'undefined',
  },
  { name: 'label', desc: '选项文案, 也可以写默认插槽', type: 'string', default: "''" },
  { name: 'disabled', desc: '禁用, 组禁用时同样生效', type: 'boolean', default: 'false' },
  { name: 'size', desc: '尺寸, 在组内跟随组', type: 'NySize', default: "'md'" },
]

const radioEvents = [
  { name: 'change', desc: '选中该项时触发', type: '(value: string | number) => void' },
]

const radioSlots = [{ name: 'default', desc: '选项文案, 缺省时用 label', type: '文案内容' }]

const groupProps = [
  { name: 'v-model', desc: '选中项的值, 未选中时为 null', type: 'string | number | null', default: 'null' },
  {
    name: 'options',
    desc: '选项数据, 与手写的子项可以混用',
    type: 'NyOption[]',
    default: '[]',
  },
  { name: 'button', desc: '胶囊按钮形态, 适合少量互斥选项', type: 'boolean', default: 'false' },
  {
    name: 'direction',
    desc: '排列方向, vertical 时每项独占一行',
    type: 'NyDirection',
    default: "'horizontal'",
  },
  { name: 'disabled', desc: '整组禁用', type: 'boolean', default: 'false' },
  { name: 'size', desc: '整组尺寸, 下发到每个子项', type: 'NySize', default: "'md'" },
  { name: 'label', desc: '组标题, 显示在选项上方', type: 'string', default: "''" },
  { name: 'hint', desc: '组下方的提示文本', type: 'string', default: "''" },
  { name: 'invalid', desc: '校验失败态', type: 'boolean', default: 'false' },
]

const groupEvents = [
  { name: 'change', desc: '选中项变化时触发', type: '(value: string | number) => void' },
]

const groupSlots = [{ name: 'default', desc: '手写的 NyRadio 子项', type: 'NyRadio' }]
</script>

<template>
  <DocPage title="Radio 单选框" desc="单选组与胶囊按钮形态。">

    <DemoBlock
      title="基础用法"
      desc="一组互斥选项, 值只有一个。"
      :code="codeBasic"
      :value="`当前: ${picked ?? '未选择'}`"
    >
      <NyRadioGroup v-model="picked" :options="payOptions" />
    </DemoBlock>

    <DemoBlock
      title="胶囊按钮"
      desc="button 形态把选项做成按钮, 适合工具栏里的即时切换。"
      :code="codeButton"
      :value="`尺寸: ${sizeValue ?? '未选择'} | 支付: ${picked ?? '未选择'}`"
    >
      <div class="ex-group">
        <NyRadioGroup v-model="sizeValue" :options="sizeOptions" button />
      </div>

      <div class="ex-group">
        <NyRadioGroup v-model="picked" :options="payOptions" button size="sm" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="纵向排列"
      desc="选项带补充说明或文案较长时改成纵向。"
      :code="codeVertical"
      :value="`当前: ${city ?? '未选择'}`"
    >
      <NyRadioGroup v-model="city" :options="cityOptions" direction="vertical" />

      <div class="ex-group">
        <NyRadioGroup v-model="city" label="收货城市">
          <NyRadio value="beijing" label="北京" />
          <NyRadio value="shanghai" label="上海" />
        </NyRadioGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      title="禁用状态"
      desc="整组禁用可以让所有子项一起停用, 也可以只禁用其中一个选项。"
      :code="codeDisabled"
      :value="`整组: ${disabledGroup ?? '未选择'} | 单项: ${partlyDisabled ?? '未选择'}`"
    >
      <div class="ex-group">
        <NyRadioGroup v-model="disabledGroup" :options="stateOptions" disabled />
      </div>

      <p class="ex-note">上面整组禁用, 下面只禁用了站内信。</p>

      <div class="ex-group">
        <NyRadioGroup v-model="partlyDisabled" :options="noticeOptions" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="独立使用"
      desc="不放在组里时, 单个 NyRadio 自己绑定 v-model。"
      :code="codeSolo"
      :value="`当前: ${solo ?? '未选择'}`"
    >
      <div class="ex-group">
        <NyRadio v-model="solo" value="left" label="左对齐" />
        <NyRadio v-model="solo" value="center" label="居中" />
        <NyRadio v-model="solo" value="right" label="右对齐" size="lg" />
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyRadio Props" :rows="radioProps" />
      <ApiTable title="NyRadio 事件" :rows="radioEvents" kind="events" />
      <ApiTable title="NyRadio 插槽" :rows="radioSlots" kind="slots" />
      <ApiTable title="NyRadioGroup Props" :rows="groupProps" />
      <ApiTable title="NyRadioGroup 事件" :rows="groupEvents" kind="events" />
      <ApiTable title="NyRadioGroup 插槽" :rows="groupSlots" kind="slots" />
    </template>
  </DocPage>
</template>
