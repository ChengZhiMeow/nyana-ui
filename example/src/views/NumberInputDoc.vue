<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyNumberInput } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const ranged = ref<number | null>(50)
const loose = ref<number | null>(150)
const precise = ref<number | null>(12.5)
const money = ref<number | null>(1234567.5)
const stepped = ref<number | null>(10)
const plain = ref<number | null>(10)
const wheeled = ref<number | null>(5)
const keyless = ref<number | null>(5)
const negative = ref<number | null>(-5)
const positive = ref<number | null>(5)
const empty = ref<number | null>(null)
const called = ref<number | null>(3)

const calledRef = ref<InstanceType<typeof NyNumberInput> | null>(null)

function show(value: number | null) {
  return value === null ? '空' : String(value)
}

const codeClamp = `<NyNumberInput v-model="ranged" :min="0" :max="100" />
<NyNumberInput v-model="loose" :min="0" :max="100" :clamp="false" />`

const codePrecision = `<NyNumberInput v-model="precise" :precision="2" :step="0.1" />`

const codeThousands = `<NyNumberInput v-model="money" :thousands="true" :precision="2" :step="1000" />`

const codeStep = `<NyNumberInput v-model="stepped" :step="5" :min="0" :max="50" />
<NyNumberInput v-model="plain" :step="5" :stepper="false" />`

const codeWheel = `<NyNumberInput v-model="wheeled" :wheel="true" />
<NyNumberInput v-model="keyless" :keyboard="false" />`

const codeNegative = `<NyNumberInput v-model="negative" :min="-10" :max="10" />
<NyNumberInput v-model="positive" :min="0" :max="10" />`

const codeRequired = `<NyNumberInput v-model="empty" required clearable />`

const codeMethods = `<NyNumberInput ref="calledRef" v-model="called" :min="0" :max="10" :step="2" />

<NyButton size="sm" @click="calledRef?.stepUp()">stepUp()</NyButton>
<NyButton size="sm" @click="calledRef?.stepDown()">stepDown()</NyButton>
<NyButton size="sm" @click="calledRef?.clamp()">clamp()</NyButton>`

const apiProps = [
  { name: 'v-model', desc: '绑定的数值, 空值为 null', type: 'number | null', default: 'null' },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'placeholder', desc: '占位文案', type: 'string', default: "''" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读, 不禁用步进按钮', type: 'boolean', default: 'false' },
  { name: 'clearable', desc: '有值时显示清空按钮', type: 'boolean', default: 'false' },
  { name: 'label', desc: '字段标签', type: 'string', default: "''" },
  { name: 'hint', desc: '字段提示, 优先于自动生成的提示', type: 'string', default: "''" },
  { name: 'autoHint', desc: '未填 hint 时按区间与精度生成提示', type: 'boolean', default: 'true' },
  { name: 'required', desc: '必填, 空值失焦后提示', type: 'boolean', default: 'false' },
  { name: 'min', desc: '最小值', type: 'number', default: '—' },
  { name: 'max', desc: '最大值', type: 'number', default: '—' },
  { name: 'step', desc: '步进量, 步进按钮与方向键使用', type: 'number', default: '1' },
  { name: 'precision', desc: '小数位, 超出部分四舍五入', type: 'number', default: '—' },
  { name: 'thousands', desc: '显示千分位, 模型值仍是数字', type: 'boolean', default: 'false' },
  { name: 'allowNegative', desc: '允许负数, min 不为负数时自动关闭', type: 'boolean', default: 'true' },
  { name: 'clamp', desc: '失焦时收敛到区间与精度', type: 'boolean', default: 'true' },
  { name: 'stepper', desc: '显示加减按钮', type: 'boolean', default: 'true' },
  { name: 'wheel', desc: '允许滚轮改值', type: 'boolean', default: 'false' },
  { name: 'keyboard', desc: '允许上下方向键改值', type: 'boolean', default: 'true' },
  { name: 'validateOn', desc: '校验时机', type: "'blur' | 'input'", default: "'blur'" },
  { name: 'name', desc: '原生 name 属性', type: 'string', default: '—' },
  { name: 'controlId', desc: '覆盖内部生成的控件 id', type: 'string', default: '—' },
]

const apiEvents = [
  { name: 'validate', desc: '校验完成, 提交后与失焦时触发', type: 'NyValidateResult' },
  { name: 'change', desc: '数值确定变化, 失焦与步进时触发', type: 'number | null' },
  { name: 'input', desc: '输入过程中解析出数值时触发', type: 'number | null' },
  { name: 'clear', desc: '点击清空按钮', type: '—' },
  { name: 'focus', desc: '获得焦点', type: 'FocusEvent' },
  { name: 'blur', desc: '失去焦点', type: 'number | null' },
]

const apiSlots = [
  { name: 'label', desc: '自定义标签', type: '—' },
  { name: 'hint', desc: '自定义提示', type: '—' },
  { name: 'prefix', desc: '输入框前缀, 如货币符号', type: '—' },
  { name: 'suffix', desc: '输入框后缀, stepper 为 false 时可用', type: '—' },
]

const apiMethods = [
  { name: 'focus', desc: '聚焦输入框', type: 'void' },
  { name: 'clear', desc: '清空并触发 clear', type: 'void' },
  { name: 'setValue', desc: '直接写入数值与显示文本', type: 'void' },
  { name: 'stepUp', desc: '按 step 加一次', type: 'void' },
  { name: 'stepDown', desc: '按 step 减一次', type: 'void' },
  { name: 'clamp', desc: '把当前值收敛到 min / max', type: 'void' },
  { name: 'validate', desc: '立即校验一次', type: 'Promise<NyValidateResult>' },
  { name: 'reset', desc: '清空校验状态', type: 'void' },
  { name: 'inputRef', desc: '内部 input 元素', type: 'Ref<HTMLInputElement | null>' },
  { name: 'error', desc: '当前错误文案', type: 'Ref<string | null>' },
  { name: 'value', desc: '当前数值', type: 'Ref<number | null>' },
]
</script>

<template>
  <DocPage title="NumberInput 数字输入框" desc="区间, 精度, 步进与千分位">

    <DemoBlock
      title="区间限制与失焦收敛"
      desc="clamp 打开时失焦会把越界值拉回区间; 关闭后只在控件下方提示错误, 值保持原样。"
      :code="codeClamp"
      :value="`clamp: ${show(ranged)} | 关闭 clamp: ${show(loose)}`"
    >
      <div class="ex-group">
        <NyNumberInput v-model="ranged" :min="0" :max="100" placeholder="0 - 100" />
        <NyNumberInput v-model="loose" :min="0" :max="100" :clamp="false" placeholder="0 - 100, 不收敛" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="精度与四舍五入"
      desc="precision 决定小数位: 输入阶段多打的位数就被截掉, 失焦时再按精度四舍五入。"
      :code="codePrecision"
      :value="`当前值: ${show(precise)}`"
    >
      <NyNumberInput v-model="precise" :precision="2" :step="0.1" placeholder="最多两位小数" />
    </DemoBlock>

    <DemoBlock
      title="千分位显示"
      desc="thousands 只影响显示文本, v-model 拿到的仍是原始数字。"
      :code="codeThousands"
      :value="`当前值: ${show(money)}`"
    >
      <NyNumberInput v-model="money" :thousands="true" :precision="2" :step="1000" />
    </DemoBlock>

    <DemoBlock
      title="步进与加减按钮"
      desc="step 决定按钮与方向键一次走多少; stepper 为 false 时隐藏按钮, 键盘仍可用。"
      :code="codeStep"
      :value="`有按钮: ${show(stepped)} | 无按钮: ${show(plain)}`"
    >
      <div class="ex-group">
        <NyNumberInput v-model="stepped" :step="5" :min="0" :max="50" />
        <NyNumberInput v-model="plain" :step="5" :stepper="false" placeholder="stepper=false" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="滚轮与方向键"
      desc="wheel 默认关闭, 免得滚动页面时误改数值; keyboard 控制上下方向键。"
      :code="codeWheel"
      :value="`滚轮: ${show(wheeled)} | 禁用方向键: ${show(keyless)}`"
    >
      <div class="ex-group">
        <NyNumberInput v-model="wheeled" :wheel="true" hint="在控件上滚动可改值" />
        <NyNumberInput v-model="keyless" :keyboard="false" hint="方向键被忽略" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="负数与 min 联动"
      desc="allowNegative 默认为 true, 但 min 不为负数时会被自动关掉, 输入阶段连负号都打不进去。"
      :code="codeNegative"
      :value="`min=-10: ${show(negative)} | min=0: ${show(positive)}`"
    >
      <div class="ex-group">
        <NyNumberInput v-model="negative" :min="-10" :max="10" placeholder="min=-10" />
        <NyNumberInput v-model="positive" :min="0" :max="10" placeholder="min=0" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="空值与必填"
      desc="清空后模型值是 null; required 打开时失焦提示必填。"
      :code="codeRequired"
      :value="`当前值: ${show(empty)}`"
    >
      <NyNumberInput v-model="empty" required clearable placeholder="清空后失焦看看" />
    </DemoBlock>

    <DemoBlock
      title="调用组件方法"
      desc="通过 ref 拿到实例, 用按钮调用 stepUp / stepDown / clamp, 演示外部驱动的步进与收敛。"
      :code="codeMethods"
      :value="`当前值: ${show(called)}`"
    >
      <div class="ex-group">
        <NyNumberInput ref="calledRef" v-model="called" :min="0" :max="10" :step="2" :clamp="false" />

        <NyButton size="sm" @click="calledRef?.stepUp()">stepUp()</NyButton>
        <NyButton size="sm" @click="calledRef?.stepDown()">stepDown()</NyButton>
        <NyButton size="sm" @click="calledRef?.clamp()">clamp()</NyButton>
        <NyButton size="sm" variant="text" @click="calledRef?.clear()">clear()</NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyNumberInput Props" :rows="apiProps" />
      <ApiTable title="NyNumberInput 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyNumberInput 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable title="NyNumberInput 方法 (ref)" kind="methods" :rows="apiMethods" />
    </template>

    <template #faq>
      <ul>
        <li>限制分两层: 输入阶段由 sanitizeNumberText 硬过滤(负号, 小数点, 非数字字符), 校验阶段由 validateNumber 给出范围与精度提示。</li>
        <li>输入过程中的中间态('-', '1.')只留在文本缓冲里, 模型值仍然是数字, 不会被解析成 NaN。</li>
        <li>clamp 只在失焦时生效, 输入过程中越界不打断你, 但下方会出现范围提示。</li>
      </ul>
    </template>
  </DocPage>
</template>
