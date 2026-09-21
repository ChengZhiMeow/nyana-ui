<script setup lang="ts">
import { ref } from 'vue'

import { NySwitch } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const checked = ref(true)
const small = ref(true)
const middle = ref(true)
const large = ref(false)
const notify = ref(true)
const disabledOn = ref(true)
const disabledOff = ref(false)
const readonlyValue = ref(true)
const loadingValue = ref(false)

const codeBasic = '<NySwitch v-model:checked="checked" />'

const codeSize = `<NySwitch v-model:checked="small" size="sm" />
<NySwitch v-model:checked="middle" size="md" />
<NySwitch v-model:checked="large" size="lg" />`

const codeText = `<NySwitch v-model:checked="notify" checked-text="已开启" unchecked-text="已关闭" />`

const codeDisabled = `<NySwitch v-model:checked="disabledOn" disabled />
<NySwitch v-model:checked="disabledOff" disabled />`

const codeReadonly = `<NySwitch v-model:checked="readonlyValue" readonly />
<NySwitch v-model:checked="loadingValue" loading />`

const apiProps = [
  { name: 'v-model:checked', desc: '开关是否打开', type: 'boolean', default: 'false' },
  { name: 'size', desc: '尺寸档', type: 'NySize', default: "'md'" },
  { name: 'disabled', desc: '禁用, 不能聚焦也不能切换', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读, 能聚焦能读到状态但改不了', type: 'boolean', default: 'false' },
  { name: 'loading', desc: '加载中, 显示旋转图标并拒绝切换', type: 'boolean', default: 'false' },
  { name: 'checkedText', desc: '打开时显示在开关右侧的文案', type: 'string', default: "''" },
  { name: 'uncheckedText', desc: '关闭时显示在开关右侧的文案', type: 'string', default: "''" },
  { name: 'label', desc: '字段标题, 显示在开关上方', type: 'string', default: "''" },
  { name: 'hint', desc: '开关下方的提示文本', type: 'string', default: "''" },
]

const apiEvents = [
  { name: 'change', desc: '切换后触发, 参数是切换后的状态', type: '(checked: boolean) => void' },
]
</script>

<template>
  <DocPage title="Switch 开关" desc="即时切换某个状态。">

    <DemoBlock
      title="基础用法"
      desc="开关的状态由一个布尔值双向绑定。"
      :code="codeBasic"
      :value="`当前: ${checked ? '开' : '关'}`"
    >
      <NySwitch v-model:checked="checked" />
    </DemoBlock>

    <DemoBlock
      title="尺寸"
      desc="三档尺寸用 --ny-*--<档> 类名落实, 默认 md。"
      :code="codeSize"
      :value="`sm: ${small ? '开' : '关'} | md: ${middle ? '开' : '关'} | lg: ${large ? '开' : '关'}`"
    >
      <div class="ex-group">
        <NySwitch v-model:checked="small" size="sm" />
        <NySwitch v-model:checked="middle" size="md" />
        <NySwitch v-model:checked="large" size="lg" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="开关文案"
      desc="文案跟随状态切换, 省掉一行说明。"
      :code="codeText"
      :value="`当前: ${notify ? '已开启' : '已关闭'}`"
    >
      <NySwitch
        v-model:checked="notify"
        checked-text="已开启"
        unchecked-text="已关闭"
      />
    </DemoBlock>

    <DemoBlock
      title="禁用"
      desc="禁用后既不能点击也不能聚焦。"
      :code="codeDisabled"
      :value="`开: ${disabledOn ? '开' : '关'} | 关: ${disabledOff ? '开' : '关'}`"
    >
      <div class="ex-group">
        <NySwitch v-model:checked="disabledOn" disabled />
        <NySwitch v-model:checked="disabledOff" disabled />
      </div>
    </DemoBlock>

    <DemoBlock
      title="只读与加载中"
      desc="只读保留状态展示, 加载中会拒绝切换并转起图标。"
      :code="codeReadonly"
      :value="`只读: ${readonlyValue ? '开' : '关'} | 加载: ${loadingValue ? '开' : '关'}`"
    >
      <div class="ex-group">
        <NySwitch v-model:checked="readonlyValue" readonly />
        <NySwitch v-model:checked="loadingValue" loading />
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NySwitch Props" :rows="apiProps" />
      <ApiTable title="NySwitch 事件" :rows="apiEvents" kind="events" />
    </template>
  </DocPage>
</template>
