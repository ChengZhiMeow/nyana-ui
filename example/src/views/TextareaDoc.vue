<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyInputShell, NyTextarea } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const basic = ref('')
const auto = ref('')
const bounded = ref('')
const counted = ref('')
const limited = ref('')
const fixed = ref('')
const dragVertical = ref('')
const dragHorizontal = ref('')
const dragBoth = ref('')
const sized = ref('')
const soft = ref('')
const driven = ref('')

const areaRef = ref<InstanceType<typeof NyTextarea> | null>(null)

const denyAngle = /[<>]/
const sentencePattern = /\p{Script=Han}/u

const codeBasic = `<NyTextarea v-model="basic" :rows="4" placeholder="写点什么" />`

const codeAutosize = `<NyTextarea v-model="auto" autosize placeholder="高度跟着内容长" />
<NyTextarea v-model="bounded" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="最多长到 5 行" />`

const codeCount = `<NyTextarea v-model="counted" :max-length="40" show-count placeholder="最多 40 个字符" />`

const codeLimit = `<NyTextarea v-model="limited" :deny-chars="/[<>]/" :pattern="/\\p{Script=Han}/u" pattern-message="至少写一个中文" />`

const codeResize = `<NyTextarea v-model="fixed" resize="none" :rows="2" />
<NyTextarea v-model="dragVertical" resize="vertical" :rows="2" />
<NyTextarea v-model="dragHorizontal" resize="horizontal" :rows="2" />
<NyTextarea v-model="dragBoth" resize="both" :rows="2" />`

const codeSize = `<NyTextarea v-model="sized" size="sm" :rows="2" placeholder="sm" />
<NyTextarea v-model="soft" variant="soft" :rows="3" placeholder="soft" />

<NyTextarea ref="areaRef" v-model="driven" :rows="3" />
<NyButton size="sm" @click="areaRef?.focus()">focus()</NyButton>
<NyButton size="sm" @click="areaRef?.resize()">resize()</NyButton>
<NyButton size="sm" @click="areaRef?.clear()">clear()</NyButton>`

const apiProps = [
  { name: 'v-model', desc: '输入内容', type: 'string', default: "''" },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'placeholder', desc: '占位文案', type: 'string', default: "''" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读', type: 'boolean', default: 'false' },
  { name: 'label', desc: '字段标签', type: 'string', default: "''" },
  { name: 'hint', desc: '字段提示, 优先于自动生成的提示', type: 'string', default: "''" },
  { name: 'autoHint', desc: '未填 hint 时按长度限制生成提示', type: 'boolean', default: 'true' },
  { name: 'rows', desc: '默认显示行数', type: 'number', default: '3' },
  { name: 'autosize', desc: '自适应高度, 也可以写成 { minRows, maxRows }', type: 'boolean | { minRows?: number; maxRows?: number }', default: 'false' },
  { name: 'resize', desc: '拖拽缩放方向, 自适应高度时固定为 none', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'" },
  { name: 'showCount', desc: '右下角字数统计', type: 'boolean', default: 'false' },
  { name: 'required', desc: '必填, 空值失焦后提示', type: 'boolean', default: 'false' },
  { name: 'trim', desc: '失焦时去掉首尾空格', type: 'boolean', default: 'false' },
  { name: 'lowercase', desc: '输入时统一转小写', type: 'boolean', default: 'false' },
  { name: 'uppercase', desc: '输入时统一转大写', type: 'boolean', default: 'false' },
  { name: 'allowedChars', desc: '白名单: 只保留匹配的字符', type: 'RegExp', default: '—' },
  { name: 'denyChars', desc: '黑名单: 删除匹配的字符', type: 'RegExp', default: '—' },
  { name: 'minLength', desc: '最少字符数', type: 'number', default: '—' },
  { name: 'maxLength', desc: '最多字符数, 输入阶段直接截断', type: 'number', default: '—' },
  { name: 'pattern', desc: '正则限制, 默认整体匹配', type: 'string | RegExp', default: '—' },
  { name: 'patternFlags', desc: 'pattern 为字符串时使用的标记', type: 'string', default: "''" },
  { name: 'patternMessage', desc: '正则不匹配时的提示', type: 'string', default: "''" },
  { name: 'validator', desc: '自定义校验, 返回提示文本表示不通过', type: '(value: string) => string | null | undefined', default: '—' },
  { name: 'validateOn', desc: '校验时机', type: "'blur' | 'input'", default: "'blur'" },
  { name: 'name', desc: '原生 name 属性', type: 'string', default: '—' },
  { name: 'controlId', desc: '覆盖内部生成的控件 id', type: 'string', default: '—' },
]

const apiEvents = [
  { name: 'validate', desc: '校验完成, 失焦时触发', type: 'NyValidateResult' },
  { name: 'input', desc: '输入并过滤之后的文本', type: 'string' },
  { name: 'clear', desc: '点击清空按钮', type: '—' },
  { name: 'focus', desc: '获得焦点', type: 'FocusEvent' },
  { name: 'blur', desc: '失去焦点', type: 'string' },
]

const apiSlots = [
  { name: 'label', desc: '自定义标签', type: '—' },
  { name: 'hint', desc: '自定义提示', type: '—' },
]

const apiMethods = [
  { name: 'focus', desc: '聚焦文本域', type: 'void' },
  { name: 'clear', desc: '清空并触发 clear', type: 'void' },
  { name: 'resize', desc: '重新按内容量一次高度', type: 'void' },
  { name: 'validate', desc: '立即校验一次', type: 'NyValidateResult' },
  { name: 'reset', desc: '清空校验状态', type: 'void' },
  { name: 'textareaRef', desc: '内部 textarea 元素', type: 'Ref<HTMLTextAreaElement | null>' },
  { name: 'error', desc: '当前错误文案', type: 'Ref<string | null>' },
  { name: 'value', desc: '当前文本', type: 'Ref<string>' },
]
</script>

<template>
  <DocPage title="Textarea 多行文本" desc="自适应高度与字数统计">

    <DemoBlock
      title="基础多行输入"
      desc="rows 决定初始行数, 默认允许纵向拖拽改高。"
      :code="codeBasic"
      :value="`当前值: ${basic || '空'}`"
    >
      <NyTextarea v-model="basic" :rows="4" placeholder="写点什么" />
    </DemoBlock>

    <DemoBlock
      title="自适应高度"
      desc="autosize 打开后高度跟着内容长, 上下限由 rows 与 { minRows, maxRows } 控制, 超出后内部滚动。"
      :code="codeAutosize"
      :value="`自适应: ${auto.length} 字 | 限定行数: ${bounded.length} 字`"
    >
      <NyTextarea v-model="auto" autosize placeholder="高度跟着内容长, 最多 8 行" />

      <NyTextarea
        v-model="bounded"
        :autosize="{ minRows: 2, maxRows: 5 }"
        placeholder="最多长到 5 行"
      />
    </DemoBlock>

    <DemoBlock
      title="字数统计与截断"
      desc="maxLength 在输入阶段就截断, showCount 把用掉的字数显示在右下角。"
      :code="codeCount"
      :value="`当前值: ${counted || '空'} (${counted.length}/40)`"
    >
      <NyTextarea v-model="counted" :max-length="40" show-count placeholder="最多 40 个字符" />
    </DemoBlock>

    <DemoBlock
      title="输入限制与校验"
      desc="denyChars 在输入阶段删字符, pattern 在失焦时给提示, 与 NyInput 是同一套两层模型。"
      :code="codeLimit"
      :value="`当前值: ${limited || '空'}`"
    >
      <NyTextarea
        v-model="limited"
        :deny-chars="denyAngle"
        :pattern="sentencePattern"
        pattern-message="至少写一个中文"
        :rows="3"
        placeholder="试试输入 <b> 或纯英文"
      />
    </DemoBlock>

    <DemoBlock
      title="拖拽缩放方向"
      desc="resize 决定右下角能不能拖, 开了 autosize 之后统一固定为 none, 免得两套高度逻辑打架。"
      :code="codeResize"
      :value="`none: ${fixed || '空'} | both: ${dragBoth || '空'}`"
    >
      <div class="ex-group">
        <NyTextarea v-model="fixed" resize="none" :rows="2" placeholder="none" />
        <NyTextarea v-model="dragVertical" resize="vertical" :rows="2" placeholder="vertical" />
        <NyTextarea v-model="dragHorizontal" resize="horizontal" :rows="2" placeholder="horizontal" />
        <NyTextarea v-model="dragBoth" resize="both" :rows="2" placeholder="both" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸, 外观与方法"
      desc="尺寸与外观走和输入框同一套令牌; ref 上暴露了 focus / resize / clear, 外部按钮也能驱动。"
      :code="codeSize"
      :value="`sm: ${sized || '空'} | soft: ${soft || '空'} | 外部驱动: ${driven || '空'}`"
    >
      <div class="ex-group">
        <NyTextarea v-model="sized" size="sm" :rows="2" placeholder="sm" />
        <NyTextarea v-model="soft" variant="soft" :rows="3" placeholder="soft" />
      </div>

      <NyTextarea ref="areaRef" v-model="driven" :rows="3" placeholder="点下面的按钮试试" />

      <div class="ex-group">
        <NyButton size="sm" @click="areaRef?.focus()">focus()</NyButton>
        <NyButton size="sm" @click="areaRef?.resize()">resize()</NyButton>
        <NyButton size="sm" @click="areaRef?.clear()">clear()</NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTextarea Props" :rows="apiProps" />
      <ApiTable title="NyTextarea 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyTextarea 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable title="NyTextarea 方法 (ref)" kind="methods" :rows="apiMethods" />
    </template>
  </DocPage>
</template>
