<script setup lang="ts">
import { ref } from 'vue'

import { NyAutoComplete, NyButton } from '@chengzhimeow/nyana-ui'
import type { NyOption } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const frameworks: NyOption<string>[] = [
  { label: 'Vue', value: 'vue', icon: 'layers' },
  { label: 'React', value: 'react', icon: 'globe' },
  { label: 'Svelte', value: 'svelte', icon: 'sparkles' },
  { label: 'Solid', value: 'solid', icon: 'shield' },
  { label: 'Angular', value: 'angular', icon: 'shield', disabled: true },
]

const basic = ref('')
const freeValue = ref('')
const strictValue = ref('')
const events = ref('')
const picked = ref('—')
const keyword = ref('')
const filtered = ref('')
const sized = ref('')
const soft = ref('')
const rejected = ref('')
const limited = ref('')
const methodValue = ref('')

const methodRef = ref<InstanceType<typeof NyAutoComplete> | null>(null)

function onSelect(payload: { value: string; option: NyOption<string> }) {
  picked.value = `${payload.option.label} (${payload.value})`
}

const codeBasic = `<NyAutoComplete v-model="basic" :options="frameworks" placeholder="输入框架名试试" />`

const codeFreeInput = `<NyAutoComplete v-model="freeValue" :options="frameworks" placeholder="可以随便填" />

<!-- freeInput 关闭后 Enter 只能选中候选里的项 -->
<NyAutoComplete v-model="strictValue" :options="frameworks" :free-input="false" placeholder="只能选候选" />`

const codeEvents = `<NyAutoComplete
  v-model="events"
  :options="frameworks"
  @select="onSelect"
  @search="keyword = $event"
/>`

const codeFilterable = `<NyAutoComplete v-model="filtered" :options="frameworks" :filterable="false" placeholder="不过滤, 全量候选" />

<!-- 搜不到时的空态文案 -->
<NyAutoComplete
  v-model="filtered"
  :options="frameworks"
  empty-text="没有这个框架"
  placeholder="搜一个不存在的框架"
/>`

const codeSize = `<NyAutoComplete v-model="sized" :options="frameworks" size="sm" />
<NyAutoComplete v-model="sized" :options="frameworks" size="lg" />
<NyAutoComplete v-model="soft" :options="frameworks" variant="soft" />
<NyAutoComplete v-model="rejected" :options="frameworks" invalid />
<NyAutoComplete v-model="limited" :options="frameworks" :max-length="6" :max-height="160" />`

const codeMethods = `<NyAutoComplete ref="methodRef" v-model="methodValue" :options="frameworks" />

<NyButton size="sm" @click="methodRef?.focus()">focus()</NyButton>
<NyButton size="sm" @click="methodRef?.open()">open()</NyButton>
<NyButton size="sm" @click="methodRef?.close()">close()</NyButton>
<NyButton size="sm" @click="methodRef?.clear()">clear()</NyButton>`

const apiProps = [
  { name: 'v-model', desc: '输入框里的文本, 选项之外的内容也能提交', type: 'string', default: "''" },
  { name: 'options', desc: '候选列表', type: 'NyOption<string>[]', default: '—' },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读, 不能展开面板', type: 'boolean', default: 'false' },
  { name: 'invalid', desc: '校验失败态由使用方决定', type: 'boolean', default: 'false' },
  { name: 'clearable', desc: '有值时显示清空按钮', type: 'boolean', default: 'true' },
  { name: 'placeholder', desc: '占位文案', type: 'string', default: "''" },
  { name: 'filterable', desc: '按 label 不区分大小写包含匹配, 关闭后候选保持全量', type: 'boolean', default: 'true' },
  { name: 'placement', desc: '面板相对触发器的位置', type: 'NyPlacement', default: "'bottom-start'" },
  { name: 'maxHeight', desc: '候选区域最大高度, 超出滚动', type: 'number', default: '240' },
  { name: 'maxLength', desc: '输入长度上限', type: 'number', default: '—' },
  { name: 'emptyText', desc: '没有匹配选项时的文案', type: 'string', default: "'无匹配选项'" },
  { name: 'freeInput', desc: '允许提交选项之外的值', type: 'boolean', default: 'true' },
]

const apiEvents = [
  { name: 'change', desc: '输入框文本变化(输入 / 选中 / 清空 / Esc 还原)', type: 'string' },
  { name: 'select', desc: '选中某个候选项', type: '{ value: string; option: NyOption<string> }' },
  { name: 'search', desc: '输入框内容变化, 便于做远程搜索', type: 'string' },
]

const apiMethods = [
  { name: 'focus', desc: '让输入框获得焦点', type: 'void' },
  { name: 'open', desc: '展开面板, 禁用与只读时不生效', type: 'void' },
  { name: 'close', desc: '收起面板, 保留当前文本', type: 'void' },
  { name: 'clear', desc: '清空文本', type: 'void' },
]
</script>

<template>
  <DocPage title="AutoComplete 自动完成" desc="输入时给出候选, 也可以自由输入">

    <DemoBlock
      title="基础用法"
      desc="输入时按 label 不区分大小写过滤候选, 匹配到的片段会加重显示, 键盘上下键加回车也能选中。"
      :code="codeBasic"
      :value="`当前值: ${basic || '空'}`"
    >
      <NyAutoComplete v-model="basic" :options="frameworks" placeholder="输入框架名试试" />
    </DemoBlock>

    <DemoBlock
      title="自由输入与仅限候选"
      desc="freeInput 默认开启, 选项之外的内容可以直接提交; 关闭后 Enter 只会选中高亮项, 选不中就把值还原。"
      :code="codeFreeInput"
      :value="`freeInput: ${freeValue || '空'} | 仅候选: ${strictValue || '空'}`"
    >
      <div class="ex-group">
        <NyAutoComplete v-model="freeValue" :options="frameworks" placeholder="可以随便填" />
        <NyAutoComplete v-model="strictValue" :options="frameworks" :free-input="false" placeholder="只能选候选" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="事件"
      desc="select 抛出选项原文, change 跟随输入框文本, search 用来做远程搜索。"
      :code="codeEvents"
      :value="`当前值: ${events || '空'} | 上次选中: ${picked} | 搜索: ${keyword || '—'}`"
    >
      <NyAutoComplete
        v-model="events"
        :options="frameworks"
        placeholder="输入框架名试试"
        @select="onSelect"
        @search="keyword = $event"
      />
    </DemoBlock>

    <DemoBlock
      title="禁用项, 关闭过滤与空态"
      desc="Angular 不可选, 键盘上下键会跳过它; filterable 关闭后展开的是全量候选, 搜不到时显示 emptyText。"
      :code="codeFilterable"
      :value="`当前值: ${filtered || '空'}`"
    >
      <div class="ex-group">
        <NyAutoComplete v-model="filtered" :options="frameworks" placeholder="Angular 不可选" />
        <NyAutoComplete
          v-model="filtered"
          :options="frameworks"
          :filterable="false"
          empty-text="没有这个框架"
          placeholder="不过滤, 全量候选"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸, 外观与上限"
      desc="尺寸与描边和 NyInput 完全一致; maxLength 限制输入长度, maxHeight 限制候选区高度。"
      :code="codeSize"
      :value="`sm/lg: ${sized || '空'} | soft: ${soft || '空'} | invalid: ${rejected || '空'} | 限长: ${limited || '空'}`"
    >
      <div class="ex-group">
        <NyAutoComplete v-model="sized" :options="frameworks" size="sm" placeholder="sm" />
        <NyAutoComplete v-model="sized" :options="frameworks" size="lg" placeholder="lg" />
        <NyAutoComplete v-model="soft" :options="frameworks" variant="soft" placeholder="soft" />
        <NyAutoComplete v-model="rejected" :options="frameworks" invalid placeholder="invalid" />
        <NyAutoComplete v-model="limited" :options="frameworks" :max-length="6" :max-height="160" placeholder="最多 6 个字" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="调用组件方法"
      desc="通过 ref 调用 focus / open / close / clear, 用于外部按钮驱动面板。"
      :code="codeMethods"
      :value="`当前值: ${methodValue || '空'}`"
    >
      <div class="ex-group">
        <NyAutoComplete ref="methodRef" v-model="methodValue" :options="frameworks" placeholder="输入框架名试试" />

        <NyButton size="sm" @click="methodRef?.focus()">focus()</NyButton>
        <NyButton size="sm" @click="methodRef?.open()">open()</NyButton>
        <NyButton size="sm" @click="methodRef?.close()">close()</NyButton>
        <NyButton size="sm" @click="methodRef?.clear()">clear()</NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyAutoComplete Props" :rows="apiProps" />
      <ApiTable title="NyAutoComplete 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyAutoComplete 方法 (ref)" kind="methods" :rows="apiMethods" />
    </template>
  </DocPage>
</template>
