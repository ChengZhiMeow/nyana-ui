<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NySelect } from '@chengzhimeow/nyana-ui'
import type { NyOption } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

type SelectValue = string | number | (string | number)[] | null

const frameworks: NyOption[] = [
  { label: 'Vue', value: 'vue', icon: 'layers', desc: '渐进式框架' },
  { label: 'React', value: 'react', icon: 'globe', desc: '组件化视图库' },
  { label: 'Svelte', value: 'svelte', icon: 'sparkles', desc: '编译期优化' },
  { label: 'Solid', value: 'solid', icon: 'shield', desc: '细粒度响应式' },
]

const cities: NyOption[] = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '广州', value: 'guangzhou', disabled: true },
  { label: '成都', value: 'chengdu' },
  { label: '南京', value: 'nanjing' },
]

const single = ref<SelectValue>('vue')
const multiple = ref<SelectValue>(['hangzhou', 'shanghai', 'beijing'])
const searchable = ref<SelectValue>(null)
const keyword = ref('')
const disabledOptions = ref<SelectValue>(null)
const sized = ref<SelectValue>(null)
const soft = ref<SelectValue>(null)
const rejected = ref<SelectValue>(null)
const loadingValue = ref<SelectValue>(null)
const methodValue = ref<SelectValue>(null)

const methodRef = ref<InstanceType<typeof NySelect> | null>(null)

function show(value: SelectValue) {
  if (value === null) {
    return '空'
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '空'
  }

  return String(value)
}

const codeSingle = `<NySelect v-model="single" :options="frameworks" placeholder="请选择框架" />`

const codeMultiple = `<NySelect v-model="multiple" :options="cities" multiple :max-tag-count="2" />`

const codeFilterable = `<NySelect
  v-model="searchable"
  :options="cities"
  filterable
  filter-placeholder="搜索城市"
  @search="keyword = $event"
/>`

const codeDisabled = `<NySelect v-model="disabledOptions" :options="cities" placeholder="广州不可选" />

<!-- 搜索关键词匹配不到任何选项时展示空态 -->
<NySelect v-model="disabledOptions" :options="cities" filterable empty-text="没有这个城市" />`

const codeSize = `<NySelect v-model="sized" :options="cities" size="sm" />
<NySelect v-model="sized" :options="cities" size="lg" />
<NySelect v-model="soft" :options="cities" variant="soft" clearable />
<NySelect v-model="rejected" :options="cities" invalid />`

const codeLoading = `<NySelect v-model="loadingValue" :options="cities" loading placement="top-start" :max-height="160" />`

const codeMethods = `<NySelect ref="methodRef" v-model="methodValue" :options="frameworks" />

<NyButton size="sm" @click="methodRef?.open()">open()</NyButton>
<NyButton size="sm" @click="methodRef?.close()">close()</NyButton>
<NyButton size="sm" @click="methodRef?.clear()">clear()</NyButton>`

const apiProps = [
  { name: 'v-model', desc: '选中值, 多选时为数组, 未选为 null', type: 'string | number | (string | number)[] | null', default: 'null' },
  { name: 'options', desc: '选项列表', type: 'NyOption[]', default: '—' },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读, 不能展开面板', type: 'boolean', default: 'false' },
  { name: 'invalid', desc: '校验失败态由使用方决定', type: 'boolean', default: 'false' },
  { name: 'clearable', desc: '有值时显示清空按钮', type: 'boolean', default: 'true' },
  { name: 'placeholder', desc: '未选中时的占位文案', type: 'string', default: "'请选择'" },
  { name: 'multiple', desc: '多选, 面板保持展开', type: 'boolean', default: 'false' },
  { name: 'filterable', desc: '面板顶部带搜索框', type: 'boolean', default: 'false' },
  { name: 'filterPlaceholder', desc: '搜索框占位文案', type: 'string', default: "'搜索'" },
  { name: 'maxTagCount', desc: '多选时最多平铺几个标签, 其余收成 +N', type: 'number', default: '2' },
  { name: 'emptyText', desc: '没有匹配选项时的文案', type: 'string', default: "'无匹配选项'" },
  { name: 'placement', desc: '面板相对触发器的位置', type: 'NyPlacement', default: "'bottom-start'" },
  { name: 'maxHeight', desc: '选项区域最大高度, 超出滚动', type: 'number', default: '260' },
  { name: 'loading', desc: '加载中, 触发器前缀显示旋转图标', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'change', desc: '选中或取消选中某项', type: 'string | number | (string | number)[] | null' },
  { name: 'clear', desc: '点击清空按钮', type: '—' },
  { name: 'search', desc: '搜索框输入变化', type: 'string' },
]

const apiMethods = [
  { name: 'focus', desc: '让触发器获得焦点', type: 'void' },
  { name: 'open', desc: '展开面板, 禁用与只读时不生效', type: 'void' },
  { name: 'close', desc: '收起面板', type: 'void' },
  { name: 'clear', desc: '清空选中值并触发 clear', type: 'void' },
]

const apiOption = [
  { name: 'label', desc: '选项显示文字', type: 'string', default: '—' },
  { name: 'value', desc: '选项值, 与 v-model 比较', type: 'string | number', default: '—' },
  { name: 'disabled', desc: '不可选中', type: 'boolean', default: 'false' },
  { name: 'icon', desc: '选项左侧的 NyIcon 图标名', type: 'string', default: '—' },
  { name: 'desc', desc: '选项下方的补充说明', type: 'string', default: '—' },
]
</script>

<template>
  <DocPage title="Select 选择器" desc="单选, 多选与可搜索">

    <DemoBlock
      title="基础单选"
      desc="选中后收起面板并把焦点还给触发器, 键盘也能用方向键加回车选择。"
      :code="codeSingle"
      :value="`当前值: ${show(single)}`"
    >
      <div class="ex-group">
        <NySelect v-model="single" :options="frameworks" placeholder="请选择框架" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="多选与标签折叠"
      desc="multiple 下点击选项不会收起面板, 超出 maxTagCount 的选中项收成 +N。"
      :code="codeMultiple"
      :value="`当前值: ${show(multiple)}`"
    >
      <div class="ex-group">
        <NySelect v-model="multiple" :options="cities" multiple :max-tag-count="2" placeholder="请选择城市" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="可搜索"
      desc="filterable 打开面板时自动聚焦搜索框, 搜索关键词会通过 search 事件抛出来。"
      :code="codeFilterable"
      :value="`当前值: ${show(searchable)} | 搜索: ${keyword || '—'}`"
    >
      <div class="ex-group">
        <NySelect
          v-model="searchable"
          :options="cities"
          filterable
          filter-placeholder="搜索城市"
          placeholder="请选择城市"
          @search="keyword = $event"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="禁用选项与空数据"
      desc="选项带 disabled 时不可选中, 键盘上下键会跳过它; 搜索不到内容时展示 emptyText。"
      :code="codeDisabled"
      :value="`当前值: ${show(disabledOptions)}`"
    >
      <div class="ex-group">
        <NySelect v-model="disabledOptions" :options="cities" placeholder="广州不可选" />
        <NySelect
          v-model="disabledOptions"
          :options="cities"
          filterable
          empty-text="没有这个城市"
          placeholder="搜一个不存在的城市"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="尺寸, 外观与失败态"
      desc="尺寸与描边和 NyInput 完全一致; invalid 由使用方控制, 选择器自己不跑校验。"
      :code="codeSize"
      :value="`sm/lg: ${show(sized)} | soft: ${show(soft)} | invalid: ${show(rejected)}`"
    >
      <div class="ex-group">
        <NySelect v-model="sized" :options="cities" size="sm" placeholder="sm" />
        <NySelect v-model="sized" :options="cities" size="lg" placeholder="lg" />
        <NySelect v-model="soft" :options="cities" variant="soft" placeholder="soft" />
        <NySelect v-model="rejected" :options="cities" invalid placeholder="invalid" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="加载中与浮层参数"
      desc="loading 在触发器左侧显示旋转图标; placement 与 maxHeight 控制面板的位置和滚动高度。"
      :code="codeLoading"
      :value="`当前值: ${show(loadingValue)}`"
    >
      <div class="ex-group">
        <NySelect
          v-model="loadingValue"
          :options="cities"
          loading
          placement="top-start"
          :max-height="160"
          placeholder="加载中"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="调用组件方法"
      desc="通过 ref 调用 open / close / clear, 用于外部按钮驱动面板。"
      :code="codeMethods"
      :value="`当前值: ${show(methodValue)}`"
    >
      <div class="ex-group">
        <NySelect ref="methodRef" v-model="methodValue" :options="frameworks" placeholder="请选择框架" />

        <NyButton size="sm" @click="methodRef?.open()">open()</NyButton>
        <NyButton size="sm" @click="methodRef?.close()">close()</NyButton>
        <NyButton size="sm" @click="methodRef?.clear()">clear()</NyButton>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NySelect Props" :rows="apiProps" />
      <ApiTable title="NySelect 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NySelect 方法 (ref)" kind="methods" :rows="apiMethods" />
      <ApiTable title="NyOption 选项字段" :rows="apiOption" />
    </template>
  </DocPage>
</template>
