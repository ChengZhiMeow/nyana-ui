<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyStack, NyTagInput, NyText } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const basic = ref<string[]>(['鲜花', '香薰'])

const limited = ref<string[]>(['护理', '礼盒'])

const hotTags = ['鲜花', '香薰', '护理', '礼盒', '绿植', '花器', '永生花', '多肉']

async function search(keyword: string) {
  await new Promise((resolve) => setTimeout(resolve, 120))

  return hotTags.filter((tag) => tag.includes(keyword))
}

const suggestValue = ref<string[]>([])

const sized = ref<string[]>(['标签'])
const disabledValue = ref<string[]>(['不可编辑'])

const lastEvent = ref('—')

const valueText = computed(() => (basic.value.length > 0 ? basic.value.join(' / ') : '空'))

const codeBasic = `const tags = ref(['鲜花', '香薰'])

<NyTagInput v-model="tags" placeholder="回车添加标签" />`

const codeLimit = `<NyTagInput v-model="tags" :max="3" :maxlength="8" placeholder="最多三个" />`

const codeSuggest = `// 候选可以直接给数组, 也可以给一个按关键词取数的函数
<NyTagInput v-model="tags" :suggest="hotTags" placeholder="输入或点候选" />

<NyTagInput v-model="tags" :suggest="search" :debounce="200" placeholder="边输边搜" />`

const codeState = `<NyTagInput v-model="tags" size="sm" />
<NyTagInput v-model="tags" size="md" />
<NyTagInput v-model="tags" size="lg" />

<NyTagInput v-model="tags" invalid />
<NyTagInput v-model="tags" disabled />`

const apiProps = [
  { name: 'v-model', desc: '标签数组, 组件不直接改它, 全部通过 update 回传', type: 'string[]', default: '[]' },
  { name: 'max', desc: '最多几个标签, 到上限后不再接收新值', type: 'number', default: '8' },
  { name: 'maxlength', desc: '单个标签的最大字数', type: 'number', default: '20' },
  { name: 'placeholder', desc: '没有标签时输入框里的占位文案', type: 'string', default: "''" },
  { name: 'suggest', desc: '候选联想, 传数组按关键词过滤, 传函数则自己取数', type: 'string[] | ((keyword: string) => string[] | Promise<string[]>)', default: '—' },
  { name: 'debounce', desc: '联想取数的防抖毫秒数', type: 'number', default: '180' },
  { name: 'size', desc: '尺寸档', type: 'NySize', default: "'md'" },
  { name: 'invalid', desc: '校验失败态, 只改描边颜色', type: 'boolean', default: 'false' },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'add', desc: '新增一个标签后触发, 同名标签不会重复加', type: 'string' },
  { name: 'remove', desc: '移除一个标签后触发', type: 'string' },
  { name: 'change', desc: '值变化后触发, 参数是新的标签数组', type: 'string[]' },
]

const apiMethods = [
  { name: 'focus()', desc: '把焦点放进输入框', type: '—' },
]
</script>

<template>
  <DocPage title="TagInput 标签输入" desc="回车成胶囊的标签编辑框, 支持去重, 上限与候选联想">
    <DemoBlock
      title="基础用法"
      desc="回车, 逗号或失焦都会把当前输入提交成一颗胶囊; 点胶囊上的叉删掉它。"
      :code="codeBasic"
      :value="`当前 ${basic.length} 个: ${valueText} · 最近事件: ${lastEvent}`"
    >
      <NyTagInput
        v-model="basic"
        placeholder="回车添加标签"
        @add="lastEvent = `add ${$event}`"
        @remove="lastEvent = `remove ${$event}`"
      />
    </DemoBlock>

    <DemoBlock
      title="上限与去重"
      desc="max 到顶后不再接收新标签, 同名标签只留一个; maxlength 管单个标签的字数。"
      :code="codeLimit"
      :value="`${limited.length} / 3`"
    >
      <NyTagInput v-model="limited" :max="3" :maxlength="8" placeholder="最多三个" />

      <p class="ex-note">输入框为空时按退格会删掉最后一个标签, 与常见的标签输入一致。</p>
    </DemoBlock>

    <DemoBlock
      title="候选联想"
      desc="suggest 传数组时按关键词本地过滤, 传函数时按 debounce 防抖取数, 上下键选择, 回车确认。"
      :code="codeSuggest"
      :value="`已选: ${suggestValue.length > 0 ? suggestValue.join(' / ') : '空'}`"
    >
      <NyStack :gap="14">
        <NyTagInput v-model="suggestValue" :suggest="hotTags" placeholder="输入或点候选" />

        <NyText type="muted" size="sm">下面这个走的是模拟接口(120ms), 输入两个字母以上就能看到候选。</NyText>

        <NyTagInput v-model="suggestValue" :suggest="search" placeholder="边输边搜" />
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="尺寸与状态"
      desc="三档尺寸与其它控件对齐, invalid 只改描边, disabled 之后整块不可编辑。"
      :code="codeState"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyTagInput v-model="sized" size="sm" placeholder="sm" />
          <NyTagInput v-model="sized" size="md" placeholder="md" />
          <NyTagInput v-model="sized" size="lg" placeholder="lg" />
        </div>

        <div class="ex-group">
          <NyTagInput v-model="sized" invalid placeholder="校验失败" />
          <NyTagInput v-model="disabledValue" disabled />
          <NyButton size="sm">提交</NyButton>
        </div>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTagInput Props" :rows="apiProps" />
      <ApiTable title="NyTagInput 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyTagInput 方法" kind="methods" :rows="apiMethods" />
    </template>

    <template #faq>
      <p class="ex-note">
        组件只认 v-model 那一份数组, 加与删都通过 update 回传, 想拦一道 (比如禁用词, 后端查重)
        就在 @add 里判断, 不满意就自己改数组, 组件不会越权。
      </p>
    </template>
  </DocPage>
</template>
