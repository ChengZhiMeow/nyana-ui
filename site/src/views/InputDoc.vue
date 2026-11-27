<script setup lang="ts">
import { ref } from 'vue'

import { NyInput } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const length = ref('')
const allowed = ref('')
const denied = ref('')
const lower = ref('')
const upper = ref('')
const trimmed = ref('')
const patterned = ref('')
const validated = ref('')
const counted = ref('')
const secret = ref('')
const smValue = ref('')
const mdValue = ref('')
const lgValue = ref('')
const softValue = ref('')
const ghostValue = ref('')

const allowWord = /[a-z0-9]/
const denySymbol = /[^\w-]/
const ticketPattern = /^WO-\d{6}$/

function noAdmin(value: string) {
  return value.toLowerCase().includes('admin') ? '不能包含 admin' : null
}

const codeLength = `<NyInput v-model="length" :max-length="10" :min-length="4" placeholder="4-10 个字符" />`

const codeAllowed = `<NyInput v-model="allowed" :allowed-chars="/[a-z0-9]/" placeholder="只允许小写字母与数字" />`

const codeDenied = `<NyInput v-model="denied" :deny-chars="/[^\\w-]/" placeholder="不允许空格与符号" />`

const codeCase = `<NyInput v-model="lower" lowercase placeholder="自动转小写" />
<NyInput v-model="upper" uppercase placeholder="自动转大写" />
<NyInput v-model="trimmed" trim placeholder="失焦去掉首尾空格" />`

const codePattern = `<NyInput v-model="patterned" :pattern="/^WO-\\d{6}$/" pattern-message="格式应为 WO-123456" />`

const codeValidator = `<NyInput v-model="validated" :validator="noAdmin" placeholder="试试输入 admin" />`

const codeCount = `<NyInput v-model="counted" :max-length="20" show-count clearable placeholder="最多 20 个字符" />
<NyInput v-model="secret" type="password" password-toggle placeholder="密码" clearable />`

const codeSize = `<NyInput v-model="smValue" size="sm" placeholder="sm" />
<NyInput v-model="mdValue" placeholder="md" />
<NyInput v-model="lgValue" size="lg" placeholder="lg" />

<NyInput v-model="softValue" variant="soft" placeholder="soft" />
<NyInput v-model="ghostValue" variant="ghost" placeholder="ghost" />`

const apiProps = [
  { name: 'v-model', desc: '输入内容', type: 'string', default: "''" },
  { name: 'type', desc: '原生输入类型', type: "'text' | 'password' | 'email' | 'search' | 'tel' | 'url'", default: "'text'" },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'placeholder', desc: '占位文案', type: 'string', default: "''" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读', type: 'boolean', default: 'false' },
  { name: 'clearable', desc: '有值时显示清空按钮', type: 'boolean', default: 'false' },
  { name: 'passwordToggle', desc: 'type 为 password 时提供明文切换', type: 'boolean', default: 'false' },
  { name: 'showCount', desc: '右下角字数统计', type: 'boolean', default: 'false' },
  { name: 'label', desc: '字段标签', type: 'string', default: "''" },
  { name: 'hint', desc: '字段提示, 优先于自动生成的提示', type: 'string', default: "''" },
  { name: 'autoHint', desc: '未填 hint 时按长度限制生成提示', type: 'boolean', default: 'true' },
  { name: 'required', desc: '必填, 空值失焦后提示', type: 'boolean', default: 'false' },
  { name: 'trim', desc: '失焦时去掉首尾空格', type: 'boolean', default: 'false' },
  { name: 'lowercase', desc: '输入时统一转小写', type: 'boolean', default: 'false' },
  { name: 'uppercase', desc: '输入时统一转大写', type: 'boolean', default: 'false' },
  { name: 'allowedChars', desc: '白名单: 只保留匹配的字符', type: 'RegExp', default: '—' },
  { name: 'denyChars', desc: '黑名单: 删除匹配的字符', type: 'RegExp', default: '—' },
  { name: 'minLength', desc: '最少字符数, 校验阶段提示', type: 'number', default: '—' },
  { name: 'maxLength', desc: '最多字符数, 输入阶段直接截断', type: 'number', default: '—' },
  { name: 'pattern', desc: '正则限制, 默认整体匹配', type: 'string | RegExp', default: '—' },
  { name: 'patternFlags', desc: 'pattern 为字符串时使用的标记', type: 'string', default: "''" },
  { name: 'patternMessage', desc: '正则不匹配时的提示', type: 'string', default: "''" },
  { name: 'validator', desc: '自定义校验, 返回提示文本表示不通过', type: '(value: string) => string | null | undefined', default: '—' },
  { name: 'validateOn', desc: '校验时机', type: "'blur' | 'input'", default: "'blur'" },
  { name: 'autocomplete', desc: '原生 autocomplete', type: 'string', default: "'off'" },
  { name: 'name', desc: '原生 name 属性', type: 'string', default: '—' },
  { name: 'controlId', desc: '覆盖内部生成的控件 id', type: 'string', default: '—' },
]

const apiEvents = [
  { name: 'validate', desc: '校验完成, 失焦时触发', type: 'NyValidateResult' },
  { name: 'input', desc: '输入并过滤之后的文本', type: 'string' },
  { name: 'enter', desc: '按下回车', type: 'string' },
  { name: 'clear', desc: '点击清空按钮', type: '—' },
  { name: 'focus', desc: '获得焦点', type: 'FocusEvent' },
  { name: 'blur', desc: '失去焦点', type: 'string' },
]

const apiSlots = [
  { name: 'label', desc: '自定义标签', type: '—' },
  { name: 'hint', desc: '自定义提示', type: '—' },
  { name: 'prefix', desc: '输入框前缀', type: '—' },
  { name: 'suffix', desc: '输入框后缀, 与密码切换按钮并存', type: '—' },
]

const apiMethods = [
  { name: 'focus', desc: '聚焦输入框', type: 'void' },
  { name: 'clear', desc: '清空并触发 clear', type: 'void' },
  { name: 'validate', desc: '立即校验一次', type: 'NyValidateResult' },
  { name: 'reset', desc: '清空校验状态', type: 'void' },
  { name: 'inputRef', desc: '内部 input 元素', type: 'Ref<HTMLInputElement | null>' },
  { name: 'error', desc: '当前错误文案', type: 'Ref<string | null>' },
  { name: 'touched', desc: '是否已经失焦过', type: 'Ref<boolean>' },
  { name: 'value', desc: '当前文本', type: 'Ref<string>' },
]
</script>

<template>
  <DocPage title="Input 输入框" desc="文本限制: 长度, 字符白名单, 正则">

    <DemoBlock
      title="长度限制"
      desc="maxLength 在输入阶段就截断, 多打的字进不来; minLength 属于校验阶段, 失焦后才提示。"
      :code="codeLength"
      :value="`当前值: ${length || '空'} (${length.length} 个字符)`"
    >
      <NyInput v-model="length" :max-length="10" :min-length="4" placeholder="4-10 个字符" />
    </DemoBlock>

    <DemoBlock
      title="白名单 allowedChars"
      desc="只保留匹配的字符, 其他字符敲进去也会立刻消失。"
      :code="codeAllowed"
      :value="`当前值: ${allowed || '空'}`"
    >
      <NyInput v-model="allowed" :allowed-chars="allowWord" placeholder="只允许小写字母与数字" />
    </DemoBlock>

    <DemoBlock
      title="黑名单 denyChars"
      desc="匹配到的字符在输入时直接删掉, 适合禁掉空格与特殊符号。"
      :code="codeDenied"
      :value="`当前值: ${denied || '空'}`"
    >
      <NyInput v-model="denied" :deny-chars="denySymbol" placeholder="不允许空格与符号" />
    </DemoBlock>

    <DemoBlock
      title="trim 与大小写转换"
      desc="lowercase / uppercase 边输边转; trim 只在失焦时生效, 所以方括号里的空格要多点一下别处才消失。"
      :code="codeCase"
      :value="`lowercase: ${lower || '空'} | uppercase: ${upper || '空'} | trim: [${trimmed}]`"
    >
      <div class="ex-group">
        <NyInput v-model="lower" lowercase placeholder="自动转小写" />
        <NyInput v-model="upper" uppercase placeholder="自动转大写" />
        <NyInput v-model="trimmed" trim placeholder="失焦去掉首尾空格" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="正则限制"
      desc="pattern 默认整体匹配, 不用自己写 ^$; 失焦不通过时显示 patternMessage。"
      :code="codePattern"
      :value="`当前值: ${patterned || '空'}`"
    >
      <NyInput
        v-model="patterned"
        :pattern="ticketPattern"
        pattern-message="格式应为 WO-123456"
        placeholder="WO-123456"
      />
    </DemoBlock>

    <DemoBlock
      title="自定义校验"
      desc="validator 在长度与正则都通过之后再跑, 返回字符串就是错误文案。"
      :code="codeValidator"
      :value="`当前值: ${validated || '空'}`"
    >
      <NyInput v-model="validated" :validator="noAdmin" placeholder="试试输入 admin" />
    </DemoBlock>

    <DemoBlock
      title="字数统计, 清空与密码切换"
      desc="showCount 的计数按码点算, 表情算一个字符; clearable 与 passwordToggle 都挂在输入框右侧。"
      :code="codeCount"
      :value="`统计: ${counted || '空'} | 密码长度: ${secret.length}`"
    >
      <div class="ex-group">
        <NyInput v-model="counted" :max-length="20" show-count clearable placeholder="最多 20 个字符" />
        <NyInput v-model="secret" type="password" password-toggle clearable placeholder="密码" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸与外观"
      desc="size 三档对应三档控件高度, variant 控制描边与底色, 三者可以自由组合。"
      :code="codeSize"
      :value="`sm: ${smValue || '空'} | md: ${mdValue || '空'} | lg: ${lgValue || '空'}`"
    >
      <div class="ex-group">
        <NyInput v-model="smValue" size="sm" placeholder="sm" />
        <NyInput v-model="mdValue" placeholder="md" />
        <NyInput v-model="lgValue" size="lg" placeholder="lg" />
      </div>

      <div class="ex-group">
        <NyInput v-model="softValue" variant="soft" placeholder="soft" />
        <NyInput v-model="ghostValue" variant="ghost" placeholder="ghost" />
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyInput Props" :rows="apiProps" />
      <ApiTable title="NyInput 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyInput 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable title="NyInput 方法 (ref)" kind="methods" :rows="apiMethods" />
    </template>

    <template #faq>
      <ul>
        <li>限制分两层: 输入阶段由 sanitizeText 硬过滤(白名单, 黑名单, 大小写, 超长截断), 校验阶段由 validateText 给出长度, 正则与自定义校验的提示。</li>
        <li>硬过滤是"打不进去", 校验提示是"能打进去但会报错"。要拦输入用 allowedChars / denyChars / maxLength, 要提示用 minLength / pattern / validator。</li>
        <li>pattern 传字符串时要自己注意转义, 传正则字面量更省事; 需要包含匹配而不是整体匹配时用 NyRegexInput 的 match="partial"。</li>
        <li>trim 在失焦时才改值, 所以 :value 看到的空格要等一次失焦才会消失。</li>
      </ul>
    </template>
  </DocPage>
</template>
