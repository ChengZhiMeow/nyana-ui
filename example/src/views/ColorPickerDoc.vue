<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyColorPicker, nyPalette, nyPaletteColor } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const brandPresets = nyPalette.map((item) => item.value)

const basic = ref(nyPaletteColor('sky'))
const custom = ref('')
const compact = ref(nyPaletteColor('teal'))
const sized = ref('')
const soft = ref('')
const empty = ref('')
const rejected = ref('')
const disabledValue = ref(nyPaletteColor('orange'))
const readonlyValue = ref(nyPaletteColor('violet'))
const events = ref(nyPaletteColor('bamboo'))
const lastEvent = ref('—')
const methodValue = ref(nyPaletteColor('red'))

const methodRef = ref<InstanceType<typeof NyColorPicker> | null>(null)

function onChange(value: string) {
  events.value = value
  lastEvent.value = `change: ${value}`
}

const codeBasic = `<NyColorPicker v-model="basic" />`

const codePresets = `<NyColorPicker v-model="custom" :presets="brandPresets" empty-text="从色卡里挑一个" />`

const codePanel = `<NyColorPicker v-model="compact" :show-input="false" placement="top-start" />

<!-- 面板里的 hex 输入框, 合法才写入, 非法只描红 -->
<NyColorPicker v-model="compact" />`

const codeState = `<NyColorPicker v-model="sized" size="sm" />
<NyColorPicker v-model="sized" size="lg" />
<NyColorPicker v-model="soft" variant="soft" />
<NyColorPicker v-model="empty" empty-text="未选择" />
<NyColorPicker v-model="rejected" invalid />
<NyColorPicker v-model="disabledValue" disabled />
<NyColorPicker v-model="readonlyValue" readonly />`

const codeEvents = `<NyColorPicker v-model="events" @change="onChange" @clear="lastEvent = 'clear'" />`

const codeMethods = `<NyColorPicker ref="methodRef" v-model="methodValue" />

<NyButton size="sm" @click="methodRef?.focus()">focus()</NyButton>
<NyButton size="sm" @click="methodRef?.open()">open()</NyButton>
<NyButton size="sm" @click="methodRef?.close()">close()</NyButton>
<NyButton size="sm" @click="methodRef?.clear()">clear()</NyButton>`

const apiProps = [
  { name: 'v-model', desc: '当前颜色, hex 字符串, 未选是空串', type: 'string', default: "''" },
  { name: 'presets', desc: '预设色板, 面板里按 6 列排布', type: 'string[]', default: '12 个内置色' },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读, 不能展开面板', type: 'boolean', default: 'false' },
  { name: 'invalid', desc: '校验失败态由使用方决定', type: 'boolean', default: 'false' },
  { name: 'clearable', desc: '有值时显示清空按钮', type: 'boolean', default: 'true' },
  { name: 'placement', desc: '面板相对触发器的位置', type: 'NyPlacement', default: "'bottom-start'" },
  { name: 'showInput', desc: '面板里的 hex 输入框', type: 'boolean', default: 'true' },
  { name: 'format', desc: '色值格式, 目前只做 hex 校验不做转换', type: "'hex'", default: "'hex'" },
  { name: 'emptyText', desc: '未选颜色时触发器与面板上的文案', type: 'string', default: "'未选择'" },
]

const apiEvents = [
  { name: 'change', desc: '色值变化(预设, 取色器, hex 输入, 复制前的写入都算)', type: 'string' },
  { name: 'clear', desc: '点击清空按钮', type: '—' },
]

const apiMethods = [
  { name: 'focus', desc: '让触发器获得焦点', type: 'void' },
  { name: 'open', desc: '展开面板, 禁用与只读时不生效', type: 'void' },
  { name: 'close', desc: '收起面板', type: 'void' },
  { name: 'clear', desc: '清空色值并触发 change 与 clear', type: 'void' },
]
</script>

<template>
  <DocPage title="ColorPicker 颜色选择器" desc="预设色板, 原生取色器与 hex 输入">

    <DemoBlock
      title="基础用法"
      desc="触发器左侧是当前颜色的色块, 点开后可以选预设, 取色或输入 hex; 非法的 hex 只描红, 不会写进 v-model。"
      :code="codeBasic"
      :value="`当前色值: ${basic || '空'}`"
    >
      <div class="ex-grid ex-grid--3">
        <div class="ex-stack ex-stack--tight">
          <NyColorPicker v-model="basic" />
          <div class="ex-swatch" :style="{ background: basic || 'transparent' }" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="自定义预设色板"
      desc="presets 传自己的色板, 面板按 6 列排布, 当前色带描边与勾选标记。"
      :code="codePresets"
      :value="`当前色值: ${custom || '空'}`"
    >
      <div class="ex-grid ex-grid--3">
        <div class="ex-stack ex-stack--tight">
          <NyColorPicker v-model="custom" :presets="brandPresets" empty-text="从色卡里挑一个" />
          <div class="ex-swatch" :style="{ background: custom || 'transparent' }" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="面板内容与位置"
      desc="showInput 关掉后只剩预设与原生取色器; placement 可以把面板翻到上方。"
      :code="codePanel"
      :value="`当前色值: ${compact || '空'}`"
    >
      <div class="ex-group">
        <NyColorPicker v-model="compact" :show-input="false" placement="top-start" />
        <NyColorPicker v-model="compact" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸, 外观与各种状态"
      desc="尺寸与描边和 NyInput 一致; emptyText 负责未选时的文案, readonly 打不开面板。"
      :code="codeState"
      :value="`sm/lg: ${sized || '空'} | soft: ${soft || '空'} | 空态: ${empty || '空'} | invalid: ${rejected || '空'}`"
    >
      <div class="ex-group">
        <NyColorPicker v-model="sized" size="sm" />
        <NyColorPicker v-model="sized" size="lg" />
        <NyColorPicker v-model="soft" variant="soft" />
        <NyColorPicker v-model="empty" empty-text="未选择" />
        <NyColorPicker v-model="rejected" invalid />
        <NyColorPicker v-model="disabledValue" disabled />
        <NyColorPicker v-model="readonlyValue" readonly />
      </div>
    </DemoBlock>

    <DemoBlock
      title="事件"
      desc="每次写入都会抛 change, 点清空抛 clear 并同时把色值置空。"
      :code="codeEvents"
      :value="`当前色值: ${events || '空'} | 最近事件: ${lastEvent}`"
    >
      <div class="ex-group">
        <NyColorPicker v-model="events" @change="onChange" @clear="lastEvent = 'clear'" />

        <p class="ex-note">面板底部还有复制色值按钮, 走的是 navigator.clipboard。</p>
      </div>
    </DemoBlock>

    <DemoBlock
      title="调用组件方法"
      desc="通过 ref 调用 focus / open / close / clear, 用于外部按钮驱动面板。"
      :code="codeMethods"
      :value="`当前色值: ${methodValue || '空'}`"
    >
      <div class="ex-group">
        <NyColorPicker ref="methodRef" v-model="methodValue" />

        <NyButton size="sm" @click="methodRef?.focus()">focus()</NyButton>
        <NyButton size="sm" @click="methodRef?.open()">open()</NyButton>
        <NyButton size="sm" @click="methodRef?.close()">close()</NyButton>
        <NyButton size="sm" @click="methodRef?.clear()">clear()</NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyColorPicker Props" :rows="apiProps" />
      <ApiTable title="NyColorPicker 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyColorPicker 方法 (ref)" kind="methods" :rows="apiMethods" />
    </template>
  </DocPage>
</template>
