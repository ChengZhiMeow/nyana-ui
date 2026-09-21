<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyCheckbox, NyCheckboxGroup } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NyOption } from '@chengzhimeow/nyana-ui'

const agreed = ref(false)

const fruitOptions: NyOption[] = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '樱桃', value: 'cherry' },
]

const picked = ref<(string | number)[]>(['apple'])
const allPicked = computed(() => picked.value.length === fruitOptions.length)
const halfPicked = computed(
  () => picked.value.length > 0 && picked.value.length < fruitOptions.length,
)

function toggleAll(checked: boolean) {
  picked.value = checked ? fruitOptions.map((option) => option.value) : []
}

const hobbies = ref<(string | number)[]>(['reading'])
const notices = ref<(string | number)[]>(['mail'])
const limited = ref<(string | number)[]>(['run'])
const disabledAll = ref<(string | number)[]>(['apple', 'cherry'])
const partlyDisabled = ref<(string | number)[]>(['apple'])
const vertical = ref<(string | number)[]>(['sms'])

const hobbyOptions: NyOption[] = [
  { label: '阅读', value: 'reading' },
  { label: '跑步', value: 'run' },
  { label: '音乐', value: 'music' },
]

const limitOptions: NyOption[] = [
  { label: '跑步', value: 'run' },
  { label: '游泳', value: 'swim' },
  { label: '骑行', value: 'ride' },
  { label: '攀岩', value: 'climb' },
]

const mixedOptions: NyOption[] = [
  { label: '标准', value: 'md' },
  { label: '大号', value: 'lg', disabled: true },
  { label: '小号', value: 'sm' },
]

const codeBasic = '<NyCheckbox v-model:checked="agreed">我已阅读并同意用户协议</NyCheckbox>'

const codeIndeterminate = `<NyCheckbox
  :checked="allPicked"
  :indeterminate="halfPicked"
  @change="toggleAll"
>
  全选
</NyCheckbox>

<NyCheckboxGroup v-model="picked" :options="fruitOptions" />`

const codeGroup = `<NyCheckboxGroup v-model="hobbies" :options="hobbyOptions" />

<NyCheckboxGroup v-model="notices" label="通知方式">
  <NyCheckbox value="mail" label="邮件" />
  <NyCheckbox value="sms" label="短信" />
</NyCheckboxGroup>`

const codeLimit = '<NyCheckboxGroup v-model="limited" :options="limitOptions" :min="1" :max="2" />'

const codeDisabled = `<NyCheckboxGroup v-model="disabledAll" :options="fruitOptions" disabled />

<NyCheckboxGroup v-model="partlyDisabled" :options="mixedOptions" />`

const codeVertical = `<NyCheckboxGroup
  v-model="vertical"
  :options="hobbyOptions"
  direction="vertical"
/>`

const checkboxProps = [
  { name: 'v-model:checked', desc: '是否勾选', type: 'boolean', default: 'false' },
  { name: 'label', desc: '选项文案, 也可以写默认插槽', type: 'string', default: "''" },
  {
    name: 'value',
    desc: '在组内代表该选项的值, 放进组里时必须给',
    type: 'string | number',
    default: 'undefined',
  },
  { name: 'indeterminate', desc: '半选态, 由父级单向控制', type: 'boolean', default: 'false' },
  { name: 'disabled', desc: '禁用, 组禁用时同样生效', type: 'boolean', default: 'false' },
  { name: 'size', desc: '尺寸, 在组内跟随组', type: 'NySize', default: "'md'" },
  { name: 'hint', desc: '控件下方的提示文本', type: 'string', default: "''" },
  { name: 'invalid', desc: '校验失败态, 只改描边与颜色', type: 'boolean', default: 'false' },
]

const checkboxEvents = [
  { name: 'change', desc: '勾选状态变化时触发', type: '(checked: boolean) => void' },
]

const checkboxSlots = [{ name: 'default', desc: '选项文案, 缺省时用 label', type: '文案内容' }]

const groupProps = [
  { name: 'v-model', desc: '已选项的值数组', type: '(string | number)[]', default: '[]' },
  {
    name: 'options',
    desc: '选项数据, 与手写的子项可以混用',
    type: 'NyOption[]',
    default: '[]',
  },
  {
    name: 'direction',
    desc: '排列方向, vertical 时每项独占一行',
    type: 'NyDirection',
    default: "'horizontal'",
  },
  { name: 'min', desc: '至少勾选几项, 达到后已选项不可取消', type: 'number', default: 'undefined' },
  { name: 'max', desc: '最多勾选几项, 达到后未选项自动锁定', type: 'number', default: 'undefined' },
  { name: 'disabled', desc: '整组禁用', type: 'boolean', default: 'false' },
  { name: 'size', desc: '整组尺寸, 下发到每个子项', type: 'NySize', default: "'md'" },
  { name: 'label', desc: '组标题, 显示在选项上方', type: 'string', default: "''" },
  { name: 'hint', desc: '组下方的提示文本', type: 'string', default: "''" },
  { name: 'invalid', desc: '校验失败态', type: 'boolean', default: 'false' },
]

const groupEvents = [
  {
    name: 'change',
    desc: '勾选集合变化时触发, 参数是变化后的完整数组',
    type: '(values: (string | number)[]) => void',
  },
]

const groupSlots = [{ name: 'default', desc: '手写的 NyCheckbox 子项', type: 'NyCheckbox' }]
</script>

<template>
  <DocPage title="Checkbox 多选框" desc="独立使用或配合多选组。">

    <DemoBlock
      title="基础用法"
      desc="独立使用时勾选状态就是一个布尔值。"
      :code="codeBasic"
      :value="`当前: ${agreed ? '已勾选' : '未勾选'}`"
    >
      <NyCheckbox v-model:checked="agreed">我已阅读并同意用户协议</NyCheckbox>
    </DemoBlock>

    <DemoBlock
      title="半选状态"
      desc="prop 传 indeterminate 表达部分选中, 父项只做全选与全清。"
      :code="codeIndeterminate"
      :value="`已选 ${picked.length} / ${fruitOptions.length} 项`"
    >
      <div class="ex-group">
        <NyCheckbox
          :checked="allPicked"
          :indeterminate="halfPicked"
          @change="toggleAll"
        >
          全选
        </NyCheckbox>
      </div>

      <div class="ex-group">
        <NyCheckboxGroup v-model="picked" :options="fruitOptions" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="多选组"
      desc="options 与手写子项两种写法都在组里读写同一份值。"
      :code="codeGroup"
      :value="`爱好: ${hobbies.join(', ') || '无'} | 通知: ${notices.join(', ') || '无'}`"
    >
      <NyCheckboxGroup v-model="hobbies" :options="hobbyOptions" />

      <div class="ex-group">
        <NyCheckboxGroup v-model="notices" label="通知方式">
          <NyCheckbox value="mail" label="邮件" />
          <NyCheckbox value="sms" label="短信" />
          <NyCheckbox value="push" label="应用内推送" />
        </NyCheckboxGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      title="限制勾选数量"
      desc="min 保证最少选够, max 到达上限后未选项不能再点。"
      :code="codeLimit"
      :value="`已选 ${limited.length} 项: ${limited.join(', ') || '无'}`"
    >
      <NyCheckboxGroup v-model="limited" :options="limitOptions" :min="1" :max="2" />
    </DemoBlock>

    <DemoBlock
      title="禁用状态"
      desc="整组禁用可以让所有子项一起停用, 也可以只禁用其中一个选项。"
      :code="codeDisabled"
      :value="`整组: ${disabledAll.join(', ')} | 单项: ${partlyDisabled.join(', ')}`"
    >
      <div class="ex-group">
        <NyCheckboxGroup v-model="disabledAll" :options="fruitOptions" disabled />
      </div>

      <p class="ex-note">上面整组禁用, 下面只禁用了中间一项。</p>

      <div class="ex-group">
        <NyCheckboxGroup v-model="partlyDisabled" :options="mixedOptions" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="纵向排列"
      desc="选项文案较长或选项很多时改成纵向。"
      :code="codeVertical"
      :value="`已选: ${vertical.join(', ') || '无'}`"
    >
      <NyCheckboxGroup v-model="vertical" :options="hobbyOptions" direction="vertical" />
    </DemoBlock>

    <template #api>
      <ApiTable title="NyCheckbox Props" :rows="checkboxProps" />
      <ApiTable title="NyCheckbox 事件" :rows="checkboxEvents" kind="events" />
      <ApiTable title="NyCheckbox 插槽" :rows="checkboxSlots" kind="slots" />
      <ApiTable title="NyCheckboxGroup Props" :rows="groupProps" />
      <ApiTable title="NyCheckboxGroup 事件" :rows="groupEvents" kind="events" />
      <ApiTable title="NyCheckboxGroup 插槽" :rows="groupSlots" kind="slots" />
    </template>
  </DocPage>
</template>
