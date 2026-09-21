<script setup lang="ts">
import { ref } from 'vue'

import { NyButton, NyMentions } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const members = [
  { value: 'chen', label: '陈思远', icon: 'user' },
  { value: 'lin', label: '林未', icon: 'sparkles' },
  { value: 'zhao', label: '赵一鸣', icon: 'shield' },
  { value: 'wang', label: '王馥', icon: 'heart' },
]

const tags = [
  { value: 'bug', label: '缺陷', icon: 'alert' },
  { value: 'feature', label: '新功能', icon: 'sparkles' },
  { value: 'docs', label: '文档', icon: 'book' },
]

const basic = ref('')
const picked = ref('—')
const keyword = ref('')
const tagged = ref('')
const fixed = ref('')
const autosized = ref('')
const counted = ref('')
const rejected = ref('')
const disabledValue = ref('@林未 帮忙看一下这个用例')
const methodValue = ref('')

const methodRef = ref<InstanceType<typeof NyMentions> | null>(null)

function onSelect(payload: { value: string; label: string }) {
  picked.value = `${payload.label} (${payload.value})`
}

const codeBasic = `<NyMentions
  v-model="basic"
  :options="members"
  placeholder="输入 @ 唤出成员"
  @select="onSelect"
  @search="keyword = $event"
/>`

const codePrefix = `<NyMentions v-model="tagged" :options="tags" prefix="#" placeholder="输入 # 唤出标签" />`

const codeRows = `<NyMentions v-model="fixed" :options="members" :rows="2" placeholder="固定两行" />

<!-- autosize: 内容变多时自动长高, 上限 8 行 -->
<NyMentions v-model="autosized" :options="members" autosize placeholder="自适应高度" />`

const codeCount = `<NyMentions v-model="counted" :options="members" show-count :max-length="60" placeholder="最多 60 个字" />`

const codeState = `<NyMentions v-model="rejected" :options="members" invalid placeholder="校验失败态" />

<NyMentions v-model="disabledValue" :options="members" disabled />

<!-- 关键词匹配不到成员时显示空态 -->
<NyMentions v-model="rejected" :options="members" empty-text="没有这个成员" placeholder="输入 @zzz" />`

const codeMethods = `<NyMentions ref="methodRef" v-model="methodValue" :options="members" placeholder="输入 @ 唤出成员" />

<NyButton size="sm" @click="methodRef?.focus()">focus()</NyButton>
<NyButton size="sm" @click="methodRef?.blur()">blur()</NyButton>`

const apiProps = [
  { name: 'v-model', desc: '正文内容, 插入的成员以文本形式留在里面', type: 'string', default: "''" },
  { name: 'options', desc: '成员候选, value 是使用方自己的标识', type: '{ value: string; label: string; icon?: string }[]', default: '—' },
  { name: 'rows', desc: '文本域行数, autosize 时作为最小行数', type: 'number', default: '3' },
  { name: 'autosize', desc: '高度跟随内容, 上限 8 行', type: 'boolean', default: 'false' },
  { name: 'prefix', desc: '唤起候选的触发字符', type: 'string', default: "'@'" },
  { name: 'placeholder', desc: '占位文案', type: 'string', default: "''" },
  { name: 'size', desc: '尺寸档', type: "'sm' | 'md' | 'lg'", default: "'md'" },
  { name: 'variant', desc: '外观', type: "'outline' | 'soft' | 'ghost'", default: "'outline'" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', desc: '只读', type: 'boolean', default: 'false' },
  { name: 'invalid', desc: '校验失败态由使用方决定', type: 'boolean', default: 'false' },
  { name: 'filterable', desc: '关键词匹配 label 或 value, 不区分大小写', type: 'boolean', default: 'true' },
  { name: 'maxLength', desc: '正文长度上限', type: 'number', default: '—' },
  { name: 'showCount', desc: '右下角显示字数', type: 'boolean', default: 'false' },
  { name: 'emptyText', desc: '没有匹配成员时的文案', type: 'string', default: "'无匹配成员'" },
]

const apiEvents = [
  { name: 'change', desc: '正文变化(输入或插入成员)', type: 'string' },
  { name: 'select', desc: '插入某个成员', type: '{ value: string; label: string }' },
  { name: 'search', desc: '关键词变化, 面板打开时才会抛', type: 'string' },
]

const apiMethods = [
  { name: 'focus', desc: '让文本域获得焦点', type: 'void' },
  { name: 'blur', desc: '让文本域失焦并收起面板', type: 'void' },
]

const apiOption = [
  { name: 'value', desc: '成员标识, 通过 select 事件抛出', type: 'string', default: '—' },
  { name: 'label', desc: '插入正文与候选里显示的名字', type: 'string', default: '—' },
  { name: 'icon', desc: '候选里的 NyIcon 图标名, 缺省用 user', type: 'string', default: "'user'" },
]
</script>

<template>
  <DocPage title="Mentions 提及" desc="输入 @ 唤出人员候选, 插入的是纯文本">

    <DemoBlock
      title="基础用法"
      desc="光标前是 @ 加关键词时在组件下方展开候选, 上下键选择, Enter 或 Tab 插入, Esc 关闭。"
      :code="codeBasic"
      :value="`正文: ${basic || '空'} | 上次插入: ${picked} | 关键词: ${keyword || '—'}`"
    >
      <NyMentions
        v-model="basic"
        :options="members"
        placeholder="输入 @ 唤出成员"
        @select="onSelect"
        @search="keyword = $event"
      />
    </DemoBlock>

    <DemoBlock
      title="自定义前缀"
      desc="prefix 换成别的字符, 候选与插入规则完全一致, 适合标签这一类场景。"
      :code="codePrefix"
      :value="`正文: ${tagged || '空'}`"
    >
      <NyMentions v-model="tagged" :options="tags" prefix="#" placeholder="输入 # 唤出标签" />
    </DemoBlock>

    <DemoBlock
      title="行数与自适应高度"
      desc="rows 决定固定行数, autosize 打开后高度跟随内容, 到 8 行才出现滚动条。"
      :code="codeRows"
      :value="`固定行数: ${fixed || '空'} | 自适应: ${autosized || '空'}`"
    >
      <div class="ex-stack">
        <NyMentions v-model="fixed" :options="members" :rows="2" placeholder="固定两行" />
        <NyMentions v-model="autosized" :options="members" autosize placeholder="自适应高度" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="字数统计与长度上限"
      desc="showCount 在右下角显示字数, maxLength 兜住正文长度, 超出的字符直接不落进内容里。"
      :code="codeCount"
      :value="`正文: ${counted || '空'} | 字数: ${counted.length}`"
    >
      <NyMentions v-model="counted" :options="members" show-count :max-length="60" placeholder="最多 60 个字" />
    </DemoBlock>

    <DemoBlock
      title="失败态, 禁用与空态"
      desc="invalid 只负责描边, 校验交给使用方; 关键词匹配不到成员时展示 emptyText。"
      :code="codeState"
      :value="`invalid: ${rejected || '空'} | disabled: ${disabledValue}`"
    >
      <div class="ex-stack">
        <NyMentions v-model="rejected" :options="members" invalid placeholder="校验失败态" />
        <NyMentions v-model="disabledValue" :options="members" disabled />
        <NyMentions v-model="rejected" :options="members" empty-text="没有这个成员" placeholder="输入 @zzz" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="调用组件方法"
      desc="通过 ref 调用 focus / blur, 用于外部按钮驱动输入。"
      :code="codeMethods"
      :value="`当前值: ${methodValue || '空'}`"
    >
      <div class="ex-stack ex-stack--tight">
        <NyMentions ref="methodRef" v-model="methodValue" :options="members" placeholder="输入 @ 唤出成员" />

        <div class="ex-group">
          <NyButton size="sm" @click="methodRef?.focus()">focus()</NyButton>
          <NyButton size="sm" @click="methodRef?.blur()">blur()</NyButton>
        </div>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyMentions Props" :rows="apiProps" />
      <ApiTable title="NyMentions 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyMentions 方法 (ref)" kind="methods" :rows="apiMethods" />
      <ApiTable title="options 成员字段" :rows="apiOption" />
    </template>
  </DocPage>
</template>
