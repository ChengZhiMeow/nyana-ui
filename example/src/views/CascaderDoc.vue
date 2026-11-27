<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyCascader } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

interface CascaderOption {
  value: string | number
  label: string
  disabled?: boolean
  children?: CascaderOption[]
}

const regions: CascaderOption[] = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区' },
        ],
      },
      {
        value: 'ningbo',
        label: '宁波',
        children: [
          { value: 'haishu', label: '海曙区' },
          { value: 'yinzhou', label: '鄞州区' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          { value: 'xuanwu', label: '玄武区' },
          { value: 'gulou', label: '鼓楼区' },
        ],
      },
      { value: 'wuxi', label: '无锡', disabled: true },
    ],
  },
  {
    value: 'shanghai',
    label: '上海',
    children: [{ value: 'pudong', label: '浦东新区' }],
  },
]

const emptyOptions: CascaderOption[] = []

const basic = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const hoverTrigger = ref<(string | number)[]>([])
const clickTrigger = ref<(string | number)[]>([])
const anyLevel = ref<(string | number)[]>(['jiangsu'])
const sized = ref<(string | number)[]>([])
const disabledValue = ref<(string | number)[]>([])
const emptyValue = ref<(string | number)[]>([])
const methodValue = ref<(string | number)[]>([])

const cascaderRef = ref<InstanceType<typeof NyCascader> | null>(null)
const lastChange = ref('')

function show(path: (string | number)[]) {
  return path.length ? path.join(' / ') : '空'
}

const basicText = computed(() => `当前路径: ${show(basic.value)}`)

const triggerText = computed(
  () => `hover: ${show(hoverTrigger.value)} | click: ${show(clickTrigger.value)}`,
)

const anyLevelText = computed(
  () => `当前路径: ${show(anyLevel.value)} | 最近一次: ${lastChange.value || '—'}`,
)

const sizedText = computed(
  () => `sm: ${show(sized.value)} | soft: ${show(sized.value)} | 禁用: ${show(disabledValue.value)}`,
)

const emptyText = computed(() => `当前路径: ${show(emptyValue.value)}`)

function onCascaderChange(payload: { value: (string | number)[]; selectedOptions: unknown[] }) {
  lastChange.value = payload.value.length ? payload.value.join(' / ') : '空'
}

const codeBasic = `<NyCascader v-model:value="basic" :options="regions" />`

const codeTrigger = `<NyCascader v-model:value="hoverTrigger" :options="regions" expand-trigger="hover" />
<NyCascader v-model:value="clickTrigger" :options="regions" expand-trigger="click" />`

const codeAnyLevel = `<NyCascader
  v-model:value="anyLevel"
  :options="regions"
  change-on-select
  separator=" > "
  @change="onCascaderChange"
/>`

const codeSize = `<NyCascader v-model:value="sized" :options="regions" size="sm" />
<NyCascader v-model:value="sized" :options="regions" variant="soft" clearable />
<NyCascader v-model:value="disabledValue" :options="regions" disabled placeholder="已禁用" />`

const codeEmpty = `<NyCascader v-model:value="emptyValue" :options="emptyOptions" empty-text="没有可选的地区" />`

const codeMethods = `<NyCascader ref="cascaderRef" v-model:value="methodValue" :options="regions" />

<NyButton size="sm" @click="cascaderRef?.open()">open()</NyButton>
<NyButton size="sm" @click="cascaderRef?.close()">close()</NyButton>
<NyButton size="sm" @click="cascaderRef?.focus()">focus()</NyButton>
<NyButton size="sm" @click="cascaderRef?.clear()">clear()</NyButton>`

const apiProps = [
  { name: 'options', desc: '级联数据, 每一层是同一份结构, children 递归下去', type: 'CascaderOption[]', default: '—' },
  { name: 'size', desc: '尺寸档, 与 NyInput 一致', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'disabled', desc: '禁用, 不能展开面板', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读, 不能展开面板', type: 'boolean', default: 'false' },
  { name: 'invalid', desc: '校验失败态由使用方决定', type: 'boolean', default: 'false' },
  { name: 'clearable', desc: '有值时显示清空按钮', type: 'boolean', default: 'true' },
  { name: 'placeholder', desc: '没有值时的占位文案', type: 'string', default: "'请选择'" },
  { name: 'placement', desc: '面板相对触发器的位置', type: 'NyPlacement', default: "'bottom-start'" },
  { name: 'maxHeight', desc: '每一列的最大高度, 超出滚动', type: 'number', default: '260' },
  { name: 'expandTrigger', desc: '展开下一列的方式', type: "'click' | 'hover'", default: "'hover'" },
  { name: 'separator', desc: '触发器上路径文字的连接符', type: 'string', default: "' / '" },
  { name: 'changeOnSelect', desc: '任意一级都可以落值, 关闭时只选叶子节点', type: 'boolean', default: 'false' },
  { name: 'emptyText', desc: 'options 为空时的文案', type: 'string', default: "'暂无数据'" },
  { name: 'v-model:value', desc: '选中的路径, 从根到叶逐级的 value', type: '(string | number)[]', default: '[]' },
]

const apiEvents = [
  { name: 'change', desc: '选中一条路径后触发, selectedOptions 是对应的选项对象', type: '{ value: (string | number)[]; selectedOptions: unknown[] }' },
  { name: 'clear', desc: '点击清空按钮', type: '—' },
]

const apiMethods = [
  { name: 'focus', desc: '让触发器获得焦点', type: 'void' },
  { name: 'open', desc: '展开面板, 禁用与只读时不生效', type: 'void' },
  { name: 'close', desc: '收起面板', type: 'void' },
  { name: 'clear', desc: '清空选中路径并触发 clear', type: 'void' },
]

const apiOption = [
  { name: 'value', desc: '选项值, 出现在 v-model 的路径里', type: 'string | number' },
  { name: 'label', desc: '选项文字', type: 'string' },
  { name: 'disabled', desc: '禁用项不可展开也不可选', type: 'boolean' },
  { name: 'children', desc: '下一级的选项数组, 结构与本项相同, 递归下去', type: 'CascaderOption[]' },
]
</script>

<template>
  <DocPage title="Cascader 级联选择" desc="多级联动选择, 从根到叶逐级展开">

    <DemoBlock
      title="基础用法"
      desc="v-model 是路径数组, 长度就是选到了第几级; 默认悬停展开下一列, 点叶子节点写入路径并关闭面板。"
      :code="codeBasic"
      :value="basicText"
    >
      <div class="ex-group">
        <NyCascader v-model:value="basic" :options="regions" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="展开方式"
      desc="expandTrigger 决定下一列怎么出现: hover 悬停即展开, click 需要点一下父节点, 两种方式下键盘的左右键都能在列之间进出。"
      :code="codeTrigger"
      :value="triggerText"
    >
      <div class="ex-group">
        <NyCascader v-model:value="hoverTrigger" :options="regions" expand-trigger="hover" />
        <NyCascader v-model:value="clickTrigger" :options="regions" expand-trigger="click" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="任意一级可选"
      desc="changeOnSelect 打开后, 点到哪一级就把哪一级的路径写进 v-model; separator 用来改路径文字的连接符。"
      :code="codeAnyLevel"
      :value="anyLevelText"
    >
      <div class="ex-group">
        <NyCascader
          v-model:value="anyLevel"
          :options="regions"
          change-on-select
          separator=" > "
          @change="onCascaderChange"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸, 外观与禁用"
      desc="尺寸与描边和 NyInput 完全一致; 江苏下面的无锡是禁用项, 不可展开也不可选。"
      :code="codeSize"
      :value="sizedText"
    >
      <div class="ex-group">
        <NyCascader v-model:value="sized" :options="regions" size="sm" />
        <NyCascader v-model:value="sized" :options="regions" variant="soft" clearable />
        <NyCascader v-model:value="disabledValue" :options="regions" disabled placeholder="已禁用" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="空数据"
      desc="options 为空时面板里展示 emptyText。"
      :code="codeEmpty"
      :value="emptyText"
    >
      <div class="ex-group">
        <NyCascader v-model:value="emptyValue" :options="emptyOptions" empty-text="没有可选的地区" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="调用组件方法"
      desc="通过 ref 调用 open / close / focus / clear, 用于外部按钮驱动面板。"
      :code="codeMethods"
      :value="`当前路径: ${show(methodValue)}`"
    >
      <div class="ex-group">
        <NyCascader ref="cascaderRef" v-model:value="methodValue" :options="regions" />

        <NyButton size="sm" @click="cascaderRef?.open()">open()</NyButton>
        <NyButton size="sm" @click="cascaderRef?.close()">close()</NyButton>
        <NyButton size="sm" @click="cascaderRef?.focus()">focus()</NyButton>
        <NyButton size="sm" @click="cascaderRef?.clear()">clear()</NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyCascader Props" :rows="apiProps" />
      <ApiTable title="NyCascader 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyCascader 方法 (ref)" kind="methods" :rows="apiMethods" />
      <ApiTable title="CascaderOption 选项字段" :rows="apiOption" />
    </template>
  </DocPage>
</template>
