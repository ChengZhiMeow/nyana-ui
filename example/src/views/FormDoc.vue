<script setup lang="ts">
import { reactive, ref } from 'vue'

import { NyButton, NyForm, NyFormItem, NyInput, NyNumberInput, NySelect } from '@chengzhimeow/nyana-ui'
import type { NyFormRules, NyOption, NyValidateTrigger } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const basic = reactive({ username: '', email: '', age: null as number | null, city: null as string | null })
const basicRef = ref<InstanceType<typeof NyForm> | null>(null)
const basicResult = ref('尚未提交')
const basicFailed = ref('')

const ruleForm = reactive({ username: '', realName: '', code: '', nickname: '' })
const ruleRef = ref<InstanceType<typeof NyForm> | null>(null)
const ruleFailed = ref('')

const trigger = ref<NyValidateTrigger>('blur')
const triggerForm = reactive({ account: '', mail: '' })

const resetForm = reactive({ nickname: 'nyana', city: 'hangzhou' as string | null })
const resetRef = ref<InstanceType<typeof NyForm> | null>(null)
const resetResult = ref('尚未重置')

const horizontalForm = reactive({ name: '', mail: '' })
const inlineForm = reactive({ keyword: '', status: null as string | null })

const cityOptions: NyOption[] = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
]

const statusOptions: NyOption[] = [
  { label: '启用', value: 'active' },
  { label: '停用', value: 'disabled' },
]

const emailPattern = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/

const basicRules: NyFormRules = {
  username: [{ required: true }, { min: 4, max: 16, message: '用户名需要 4-16 个字符' }],
  email: [{ required: true }, { pattern: emailPattern, message: '邮箱格式不正确' }],
  age: [{ validator: (value) => (typeof value === 'number' && value < 18 ? '未满 18 岁不能注册' : null) }],
}

const ruleRules: NyFormRules = {
  username: [{ required: true }, { len: 6, message: '用户名必须是 6 个字符' }],
  realName: [{ min: 2, max: 8, message: '姓名长度需要 2-8 个字符' }],
  code: [{ required: true }, { pattern: /^\d{6}$/, message: '验证码是 6 位数字' }],
  nickname: [{ validator: (value) => (String(value ?? '') === 'admin' ? '昵称不能用 admin' : null) }],
}

const triggerRules: NyFormRules = {
  account: [{ required: true }, { min: 4, message: '账号至少 4 个字符' }],
  mail: [{ required: true }, { pattern: emailPattern, message: '邮箱格式不正确' }],
}

function failedFields(errors: Record<string, string | null>) {
  return Object.entries(errors)
    .filter(([, message]) => message !== null)
    .map(([name]) => name)
}

function onBasicValidate(payload: { valid: boolean; errors: Record<string, string | null> }) {
  basicFailed.value = payload.valid ? '' : failedFields(payload.errors).join(', ')
}

async function submitBasic() {
  const valid = await basicRef.value?.validate()

  basicResult.value = valid ? '校验通过, 已提交' : '校验未通过'
}

async function checkRules() {
  await ruleRef.value?.validate()

  ruleFailed.value = ''
}

function onRuleValidate(payload: { valid: boolean; errors: Record<string, string | null> }) {
  ruleFailed.value = payload.valid ? '' : failedFields(payload.errors).join(', ')
}

function resetDemo() {
  resetRef.value?.resetFields()
  resetResult.value = '已恢复到挂载时的值'
}

const codeBasic = `<NyForm ref="basicRef" :model="basic" :rules="basicRules" @validate="onBasicValidate" @submit="submitBasic">
  <NyFormItem label="用户名" name="username">
    <template #default="{ controlId }">
      <NyInput v-model="basic.username" :control-id="controlId" placeholder="4-16 位字母或数字" />
    </template>
  </NyFormItem>

  <NyFormItem label="邮箱" name="email">
    <NyInput v-model="basic.email" placeholder="name@example.com" />
  </NyFormItem>

  <NyFormItem label="年龄" name="age">
    <NyNumberInput v-model="basic.age" :min="0" :max="120" />
  </NyFormItem>

  <NyFormItem label="城市" name="city">
    <NySelect v-model="basic.city" :options="cityOptions" />
  </NyFormItem>

  <template #actions>
    <NyButton variant="primary" type="submit">提交</NyButton>
    <NyButton @click="basicRef?.resetFields()">重置</NyButton>
  </template>
</NyForm>`

const codeRules = `const ruleRules: NyFormRules = {
  username: [{ required: true }, { len: 6, message: '用户名必须是 6 个字符' }],
  realName: [{ min: 2, max: 8, message: '姓名长度需要 2-8 个字符' }],
  code: [{ required: true }, { pattern: /^\\d{6}$/, message: '验证码是 6 位数字' }],
  nickname: [{ validator: (value) => (String(value ?? '') === 'admin' ? '昵称不能用 admin' : null) }],
}

<NyForm ref="ruleRef" :model="ruleForm" :rules="ruleRules" @validate="onRuleValidate">
  <NyFormItem label="用户名" name="username">
    <NyInput v-model="ruleForm.username" hint="正好 6 个字符" />
  </NyFormItem>

  <NyFormItem label="姓名" name="realName">
    <NyInput v-model="ruleForm.realName" />
  </NyFormItem>

  <NyFormItem label="验证码" name="code">
    <NyInput v-model="ruleForm.code" :max-length="6" />
  </NyFormItem>

  <NyFormItem label="昵称" name="nickname">
    <NyInput v-model="ruleForm.nickname" />
  </NyFormItem>

  <template #actions>
    <NyButton variant="primary" @click="checkRules">校验</NyButton>
  </template>
</NyForm>`

const codeTrigger = `<NyButton :variant="trigger === 'blur' ? 'primary' : 'default'" @click="trigger = 'blur'">blur</NyButton>
<NyButton :variant="trigger === 'input' ? 'primary' : 'default'" @click="trigger = 'input'">input</NyButton>

<NyForm :model="triggerForm" :rules="triggerRules" :validate-on="trigger">
  <NyFormItem label="账号" name="account">
    <NyInput v-model="triggerForm.account" />
  </NyFormItem>

  <NyFormItem label="邮箱" name="mail">
    <NyInput v-model="triggerForm.mail" />
  </NyFormItem>
</NyForm>`

const codeReset = `<NyForm ref="resetRef" :model="resetForm" :rules="{ nickname: [{ required: true }] }">
  <NyFormItem label="昵称" name="nickname">
    <NyInput v-model="resetForm.nickname" />
  </NyFormItem>

  <NyFormItem label="城市" name="city">
    <NySelect v-model="resetForm.city" :options="cityOptions" />
  </NyFormItem>

  <template #actions>
    <NyButton @click="resetDemo">resetFields()</NyButton>
    <NyButton variant="text" @click="resetRef?.clearValidate()">clearValidate()</NyButton>
  </template>
</NyForm>`

const codeHorizontal = `<NyForm :model="horizontalForm" layout="horizontal" :label-width="96" label-align="end">
  <NyFormItem label="姓名" name="name" required>
    <NyInput v-model="horizontalForm.name" placeholder="请输入姓名" />
  </NyFormItem>

  <NyFormItem label="邮箱" name="mail" :rules="[{ pattern: emailPattern, message: '邮箱格式不正确' }]">
    <NyInput v-model="horizontalForm.mail" placeholder="name@example.com" />
  </NyFormItem>
</NyForm>`

const codeInline = `<NyForm :model="inlineForm" layout="inline" :gap="12">
  <NyFormItem label="关键词" name="keyword">
    <NyInput v-model="inlineForm.keyword" placeholder="组件名" />
  </NyFormItem>

  <NyFormItem label="状态" name="status">
    <NySelect v-model="inlineForm.status" :options="statusOptions" placeholder="全部" />
  </NyFormItem>

  <template #actions>
    <NyButton variant="primary">查询</NyButton>
  </template>
</NyForm>`

const apiProps = [
  { name: 'model', desc: '表单数据对象, 用 reactive 定义, 校验与重置都直接读写它', type: 'Record<string, unknown>', default: '—' },
  { name: 'rules', desc: '按字段名登记的校验规则', type: 'NyFormRules', default: '{}' },
  { name: 'size', desc: '下发到所有控件的尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'disabled', desc: '整体禁用', type: 'boolean', default: 'false' },
  { name: 'layout', desc: '布局: 上下 / 左右 / 行内', type: "'vertical' | 'horizontal' | 'inline'", default: "'vertical'" },
  { name: 'labelWidth', desc: '标签列宽, 数字按 px 处理', type: 'string | number', default: "'auto'" },
  { name: 'labelAlign', desc: '标签对齐', type: "'start' | 'end'", default: "'start'" },
  { name: 'validateOn', desc: '默认校验时机, 规则自带 trigger 时以规则为准', type: "'blur' | 'input'", default: "'blur'" },
  { name: 'gap', desc: '表单项之间的间距', type: 'number', default: '18' },
]

const apiEvents = [
  { name: 'validate', desc: '整体校验完成', type: '{ valid: boolean; errors: Record<string, string | null> }' },
  { name: 'submit', desc: '表单提交, 不会自动校验', type: 'Record<string, unknown>' },
  { name: 'reset', desc: 'resetFields 恢复完成后触发', type: '—' },
]

const apiSlots = [
  { name: 'default', desc: '表单项列表', type: '—' },
  { name: 'actions', desc: '底部操作区, inline 布局下与表单项同排', type: '—' },
]

const apiMethods = [
  { name: 'validate', desc: '校验全部字段, 串行执行', type: 'Promise<boolean>' },
  { name: 'validateField', desc: '校验单个字段', type: 'Promise<boolean>' },
  { name: 'resetFields', desc: '值恢复到挂载时并清空校验状态', type: 'void' },
  { name: 'clearValidate', desc: '只清空校验状态, 不动值', type: 'void' },
  { name: 'scrollToField', desc: '把指定字段滚进视野', type: 'void' },
  { name: 'getFields', desc: '已登记的字段名列表', type: 'string[]' },
]

const apiItemProps = [
  { name: 'name', desc: '字段名, 与 model 的 key 对应; 不传则不注册也不校验', type: 'string', default: '—' },
  { name: 'label', desc: '标签文字', type: 'string', default: "''" },
  { name: 'rules', desc: '单项规则, 与表单的同名字段规则合并', type: 'NyFormRule | NyFormRule[]', default: '—' },
  { name: 'required', desc: '必填, 点亮星号并真的参与校验', type: 'boolean', default: '—' },
  { name: 'hint', desc: '提示文案, 有错误时被错误顶掉', type: 'string', default: "''" },
  { name: 'labelWidth', desc: '覆盖表单的 labelWidth', type: 'string | number', default: '—' },
  { name: 'labelAlign', desc: '覆盖表单的 labelAlign', type: "'start' | 'end'", default: '—' },
  { name: 'validateOn', desc: '覆盖表单的校验时机', type: "'blur' | 'input'", default: '—' },
  { name: 'layout', desc: '覆盖表单的布局', type: "'vertical' | 'horizontal'", default: '—' },
  { name: 'extra', desc: '右下角补充信息, 如字数统计', type: 'string', default: "''" },
]

const apiItemEvents = [
  { name: 'validate', desc: '单项校验完成', type: '{ name: string; valid: boolean; message: string | null }' },
]

const apiItemSlots = [
  { name: 'default', desc: '控件, 回传 { controlId, messageId, invalid, error }', type: '—' },
  { name: 'label', desc: '自定义标签', type: '—' },
  { name: 'hint', desc: '自定义提示', type: '—' },
  { name: 'help', desc: '自定义错误展示, 回传 { error }', type: '—' },
  { name: 'extra', desc: '右下角补充信息', type: '—' },
]

const apiItemMethods = [
  { name: 'validate', desc: '立即校验本项', type: 'Promise<NyValidateResult>' },
  { name: 'reset', desc: '恢复到挂载时的值并清空校验', type: 'void' },
  { name: 'clear', desc: '只清空校验状态', type: 'void' },
]
</script>

<template>
  <DocPage title="Form 表单" desc="字段注册, 规则校验与统一布局">

    <DemoBlock
      title="基础表单与提交校验"
      desc="字段按 name 注册到表单, 点提交先 validate 再决定是否放行; 校验不通过时错误出现在各字段下方。"
      :code="codeBasic"
      :value="`提交结果: ${basicResult}${basicFailed ? ` | 未通过: ${basicFailed}` : ''}`"
    >
      <NyForm ref="basicRef" :model="basic" :rules="basicRules" @validate="onBasicValidate" @submit="submitBasic">
        <NyFormItem label="用户名" name="username">
          <template #default="{ controlId }">
            <NyInput v-model="basic.username" :control-id="controlId" placeholder="4-16 位字母或数字" />
          </template>
        </NyFormItem>

        <NyFormItem label="邮箱" name="email">
          <NyInput v-model="basic.email" placeholder="name@example.com" />
        </NyFormItem>

        <NyFormItem label="年龄" name="age">
          <NyNumberInput v-model="basic.age" :min="0" :max="120" placeholder="需要满 18 岁" />
        </NyFormItem>

        <NyFormItem label="城市" name="city">
          <NySelect v-model="basic.city" :options="cityOptions" placeholder="请选择城市" />
        </NyFormItem>

        <template #actions>
          <NyButton variant="primary" type="submit">提交</NyButton>
          <NyButton @click="basicRef?.resetFields()">重置</NyButton>
        </template>
      </NyForm>
    </DemoBlock>

    <DemoBlock
      title="规则校验"
      desc="覆盖 required / len / min / max / pattern / validator 六种规则, 一条失败就返回它就绪的那条提示。"
      :code="codeRules"
      :value="`未通过字段: ${ruleFailed || '无'}`"
    >
      <NyForm ref="ruleRef" :model="ruleForm" :rules="ruleRules" @validate="onRuleValidate">
        <NyFormItem label="用户名" name="username">
          <NyInput v-model="ruleForm.username" hint="正好 6 个字符" />
        </NyFormItem>

        <NyFormItem label="姓名" name="realName">
          <NyInput v-model="ruleForm.realName" hint="2-8 个字符, 可以留空" />
        </NyFormItem>

        <NyFormItem label="验证码" name="code">
          <NyInput v-model="ruleForm.code" :max-length="6" hint="6 位数字" />
        </NyFormItem>

        <NyFormItem label="昵称" name="nickname">
          <NyInput v-model="ruleForm.nickname" hint="试试填 admin" />
        </NyFormItem>

        <template #actions>
          <NyButton variant="primary" @click="checkRules">校验</NyButton>
        </template>
      </NyForm>
    </DemoBlock>

    <DemoBlock
      title="校验时机"
      desc="blur 是失焦后才开始提示, input 边输边提示; 规则里单独写 trigger 时以规则为准。"
      :code="codeTrigger"
      :value="`当前时机: ${trigger}`"
    >
      <div class="ex-group">
        <NyButton
          size="sm"
          :variant="trigger === 'blur' ? 'primary' : 'default'"
          @click="trigger = 'blur'"
        >
          blur
        </NyButton>

        <NyButton
          size="sm"
          :variant="trigger === 'input' ? 'primary' : 'default'"
          @click="trigger = 'input'"
        >
          input
        </NyButton>
      </div>

      <NyForm :model="triggerForm" :rules="triggerRules" :validate-on="trigger">
        <NyFormItem label="账号" name="account">
          <NyInput v-model="triggerForm.account" placeholder="至少 4 个字符" />
        </NyFormItem>

        <NyFormItem label="邮箱" name="mail">
          <NyInput v-model="triggerForm.mail" placeholder="name@example.com" />
        </NyFormItem>
      </NyForm>
    </DemoBlock>

    <DemoBlock
      title="重置与清空校验"
      desc="resetFields 把值恢复到挂载时的那一份, clearValidate 只擦掉错误提示。"
      :code="codeReset"
      :value="`昵称: ${resetForm.nickname} | 城市: ${resetForm.city ?? '空'} | ${resetResult}`"
    >
      <NyForm ref="resetRef" :model="resetForm" :rules="{ nickname: [{ required: true }] }">
        <NyFormItem label="昵称" name="nickname">
          <NyInput v-model="resetForm.nickname" />
        </NyFormItem>

        <NyFormItem label="城市" name="city">
          <NySelect v-model="resetForm.city" :options="cityOptions" />
        </NyFormItem>

        <template #actions>
          <NyButton @click="resetDemo">resetFields()</NyButton>
          <NyButton variant="text" @click="resetRef?.clearValidate()">clearValidate()</NyButton>
        </template>
      </NyForm>
    </DemoBlock>

    <DemoBlock
      title="左右布局与标签宽度"
      desc="layout 为 horizontal 时标签与控件排成两列, labelWidth 定列宽, labelAlign 决定标签贴哪边; 单项也能各自覆盖。"
      :code="codeHorizontal"
      :value="`姓名: ${horizontalForm.name || '空'} | 邮箱: ${horizontalForm.mail || '空'}`"
    >
      <NyForm :model="horizontalForm" layout="horizontal" :label-width="96" label-align="end">
        <NyFormItem label="姓名" name="name" required>
          <NyInput v-model="horizontalForm.name" placeholder="请输入姓名" />
        </NyFormItem>

        <NyFormItem
          label="邮箱"
          name="mail"
          :rules="[{ pattern: emailPattern, message: '邮箱格式不正确' }]"
          hint="规则可以直接写在表单项上"
        >
          <NyInput v-model="horizontalForm.mail" placeholder="name@example.com" />
        </NyFormItem>
      </NyForm>
    </DemoBlock>

    <DemoBlock
      title="行内布局"
      desc="layout 为 inline 时表单项与操作区排在同一行, 空间不够自动换行, 适合列表页顶部的筛选条。"
      :code="codeInline"
      :value="`关键词: ${inlineForm.keyword || '空'} | 状态: ${inlineForm.status ?? '全部'}`"
    >
      <NyForm :model="inlineForm" layout="inline" :gap="12">
        <NyFormItem label="关键词" name="keyword">
          <NyInput v-model="inlineForm.keyword" placeholder="组件名" />
        </NyFormItem>

        <NyFormItem label="状态" name="status">
          <NySelect v-model="inlineForm.status" :options="statusOptions" placeholder="全部" />
        </NyFormItem>

        <template #actions>
          <NyButton variant="primary">查询</NyButton>
        </template>
      </NyForm>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyForm Props" :rows="apiProps" />
      <ApiTable title="NyForm 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyForm 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable title="NyForm 方法 (ref)" kind="methods" :rows="apiMethods" />
      <ApiTable title="NyFormItem Props" :rows="apiItemProps" />
      <ApiTable title="NyFormItem 事件" kind="events" :rows="apiItemEvents" />
      <ApiTable title="NyFormItem 插槽" kind="slots" :rows="apiItemSlots" />
      <ApiTable title="NyFormItem 方法 (ref)" kind="methods" :rows="apiItemMethods" />
    </template>
  </DocPage>
</template>
