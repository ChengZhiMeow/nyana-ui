<script setup lang="ts">
import { ref } from 'vue'

import { NyRegexInput } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const mobile = ref('')
const email = ref('')
const idcard = ref('')
const site = ref('')
const fullMatch = ref('')
const partialMatch = ref('')
const custom = ref('')
const statusOn = ref('')
const statusOff = ref('')
const presetMessage = ref('')
const customMessage = ref('')
const counted = ref('')

const ticketPattern = /^WO-\d{6}$/
const digitsPattern = /\d{6}/

const codePreset = `<NyRegexInput v-model="mobile" preset="mobile" />
<NyRegexInput v-model="email" preset="email" />`

const codeMorePresets = `<NyRegexInput v-model="idcard" preset="idcard" />
<NyRegexInput v-model="site" preset="url" />`

const codeMatch = `<NyRegexInput v-model="fullMatch" :pattern="/\\d{6}/" match="full" />
<NyRegexInput v-model="partialMatch" :pattern="/\\d{6}/" match="partial" />`

const codeCustom = `<NyRegexInput
  v-model="custom"
  :pattern="/^WO-\\d{6}$/"
  message="工单号需要 WO- 前缀加 6 位数字"
  placeholder="WO-123456"
/>`

const codeStatus = `<NyRegexInput v-model="statusOn" preset="email" />
<NyRegexInput v-model="statusOff" preset="email" :show-status="false" />`

const codeMessage = `<NyRegexInput v-model="presetMessage" preset="mobile" />
<NyRegexInput v-model="customMessage" preset="mobile" message="请填 11 位大陆手机号" />`

const codeCount = `<NyRegexInput v-model="counted" preset="username" show-count clearable />`

const apiProps = [
  { name: 'v-model', desc: '输入内容', type: 'string', default: "''" },
  { name: 'preset', desc: '内置格式预设, 未显式传入的规则沿用预设的值', type: "'username' | 'email' | 'mobile' | 'tel' | 'url' | 'ipv4' | 'idcard' | 'postalCode' | 'integer' | 'decimal' | 'hexColor' | 'date' | 'time'", default: '—' },
  { name: 'pattern', desc: '自定义正则, 优先于预设', type: 'string | RegExp', default: '—' },
  { name: 'patternFlags', desc: 'pattern 为字符串时使用的标记', type: 'string', default: "''" },
  { name: 'match', desc: 'full 整体匹配, partial 包含匹配', type: "'full' | 'partial'", default: "'full'" },
  { name: 'message', desc: '不匹配时的提示, 缺省用预设自带的文案', type: 'string', default: "''" },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'placeholder', desc: '占位文案, 缺省用预设的占位', type: 'string', default: "''" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读', type: 'boolean', default: 'false' },
  { name: 'clearable', desc: '有值时显示清空按钮', type: 'boolean', default: 'false' },
  { name: 'showCount', desc: '右下角字数统计', type: 'boolean', default: 'false' },
  { name: 'showStatus', desc: '右侧显示匹配状态图标', type: 'boolean', default: 'true' },
  { name: 'label', desc: '字段标签', type: 'string', default: "''" },
  { name: 'hint', desc: '字段提示, 优先于自动生成的提示', type: 'string', default: "''" },
  { name: 'autoHint', desc: '未填 hint 时按长度与预设生成提示', type: 'boolean', default: 'true' },
  { name: 'required', desc: '必填, 空值失焦后提示', type: 'boolean', default: 'false' },
  { name: 'trim', desc: '失焦时去掉首尾空格', type: 'boolean', default: 'false' },
  { name: 'allowedChars', desc: '白名单, 缺省用预设的字符集', type: 'RegExp', default: '—' },
  { name: 'denyChars', desc: '黑名单: 删除匹配的字符', type: 'RegExp', default: '—' },
  { name: 'minLength', desc: '最少字符数', type: 'number', default: '—' },
  { name: 'maxLength', desc: '最多字符数, 缺省用预设的长度', type: 'number', default: '—' },
  { name: 'validator', desc: '自定义校验, 返回提示文本表示不通过', type: '(value: string) => string | null | undefined', default: '—' },
  { name: 'validateOn', desc: '校验时机', type: "'blur' | 'input'", default: "'input'" },
  { name: 'autocomplete', desc: '原生 autocomplete', type: 'string', default: "'off'" },
  { name: 'name', desc: '原生 name 属性', type: 'string', default: '—' },
  { name: 'controlId', desc: '覆盖内部生成的控件 id', type: 'string', default: '—' },
]

const apiEvents = [
  { name: 'validate', desc: '校验完成, 输入与失焦时都会触发', type: 'NyValidateResult' },
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
  { name: 'suffix', desc: '输入框后缀, 与状态图标并存', type: '—' },
]

const apiMethods = [
  { name: 'focus', desc: '聚焦输入框', type: 'void' },
  { name: 'clear', desc: '清空并触发 clear', type: 'void' },
  { name: 'validate', desc: '立即校验一次', type: 'NyValidateResult' },
  { name: 'reset', desc: '清空校验状态', type: 'void' },
  { name: 'inputRef', desc: '内部 input 元素', type: 'Ref<HTMLInputElement | null>' },
  { name: 'error', desc: '当前错误文案', type: 'Ref<string | null>' },
  { name: 'touched', desc: '是否已经失焦过', type: 'Ref<boolean>' },
  { name: 'state', desc: '匹配状态: valid / invalid / null', type: "Ref<'valid' | 'invalid' | null>" },
  { name: 'value', desc: '当前文本', type: 'Ref<string>' },
]
</script>

<template>
  <DocPage title="RegexInput 正则输入框" desc="13 个格式预设与实时匹配状态">

    <DemoBlock
      title="格式预设: 手机号与邮箱"
      desc="预设同时带来校验正则, 输入白名单, 最大长度, 占位文案与提示, 只需写 preset 一个属性。"
      :code="codePreset"
      :value="`手机号: ${mobile || '空'} | 邮箱: ${email || '空'}`"
    >
      <div class="ex-group">
        <NyRegexInput v-model="mobile" preset="mobile" />
        <NyRegexInput v-model="email" preset="email" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="格式预设: 身份证与网址"
      desc="预设里带示例的格式会显示在提示里, 输入时非白名单字符(比如身份证里的字母)会被直接丢掉。"
      :code="codeMorePresets"
      :value="`身份证: ${idcard || '空'} | 网址: ${site || '空'}`"
    >
      <div class="ex-group">
        <NyRegexInput v-model="idcard" preset="idcard" />
        <NyRegexInput v-model="site" preset="url" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="full 与 partial 的区别"
      desc="同一个正则: full 会包一层锚定, 必须整体匹配; partial 只要包含这一段就通过。输入 WO-123456 对比一下。"
      :code="codeMatch"
      :value="`full: ${fullMatch || '空'} | partial: ${partialMatch || '空'}`"
    >
      <div class="ex-group">
        <NyRegexInput v-model="fullMatch" :pattern="digitsPattern" match="full" placeholder="连续 6 位数字" />
        <NyRegexInput v-model="partialMatch" :pattern="digitsPattern" match="partial" placeholder="包含 6 位数字即可" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="自定义正则与文案"
      desc="pattern 优先于 preset, message 覆盖默认提示, 适合工单号这类自家格式。"
      :code="codeCustom"
      :value="`当前值: ${custom || '空'}`"
    >
      <NyRegexInput
        v-model="custom"
        :pattern="ticketPattern"
        message="工单号需要 WO- 前缀加 6 位数字"
        placeholder="WO-123456"
      />
    </DemoBlock>

    <DemoBlock
      title="实时匹配状态"
      desc="showStatus 默认打开: 触碰过且有内容后, 右侧出现对勾或警告图标; 关掉后只看下方文案。"
      :code="codeStatus"
      :value="`带图标: ${statusOn || '空'} | 不带图标: ${statusOff || '空'}`"
    >
      <div class="ex-group">
        <NyRegexInput v-model="statusOn" preset="email" />
        <NyRegexInput v-model="statusOff" preset="email" :show-status="false" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="默认文案与自定义文案"
      desc="左边用预设自带的提示, 右边用 message 换成人话, 两者使用同一个正则。"
      :code="codeMessage"
      :value="`默认文案: ${presetMessage || '空'} | 自定义文案: ${customMessage || '空'}`"
    >
      <div class="ex-group">
        <NyRegexInput v-model="presetMessage" preset="mobile" />
        <NyRegexInput v-model="customMessage" preset="mobile" message="请填 11 位大陆手机号" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="配合字数统计"
      desc="预设的 maxLength 会一起带进来, showCount 显示用的就是它, 输入阶段会先按这个长度截断。"
      :code="codeCount"
      :value="`当前值: ${counted || '空'} (${counted.length}/16)`"
    >
      <NyRegexInput v-model="counted" preset="username" show-count clearable />
    </DemoBlock>

    <template #api>
      <ApiTable title="NyRegexInput Props" :rows="apiProps" />
      <ApiTable title="NyRegexInput 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyRegexInput 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable title="NyRegexInput 方法 (ref)" kind="methods" :rows="apiMethods" />
    </template>

    <template #faq>
      <ul>
        <li>限制分两层: 输入阶段由 sanitizeText 按预设的白名单硬过滤, 校验阶段由 validateText 跑正则并给出提示。</li>
        <li>预设的 13 个名字: username / email / mobile / tel / url / ipv4 / idcard / postalCode / integer / decimal / hexColor / date / time。</li>
        <li>显式传入的属性优先于预设: 写了 maxLength 就用你的, 没写才用预设的。</li>
      </ul>
    </template>
  </DocPage>
</template>
