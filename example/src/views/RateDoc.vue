<script setup lang="ts">
import { ref } from 'vue'

import { NyRate } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const score = ref(3)
const halfScore = ref(2.5)
const textScore = ref(3)
const clearScore = ref(2)
const coloredScore = ref(4)
const readonlyScore = ref(4)
const disabledScore = ref(2)

const ratingTexts = ['很差', '一般', '还行', '不错', '非常好']

const codeBasic = '<NyRate v-model="score" />'

const codeHalf = '<NyRate v-model="halfScore" allow-half />'

const codeText = `<NyRate v-model="textScore" show-text :texts="ratingTexts" />

const ratingTexts = ['很差', '一般', '还行', '不错', '非常好']`

const codeClear = '<NyRate v-model="clearScore" clearable />'

const codeColor = `<NyRate v-model="coloredScore" size="lg" color="var(--ny-warning)" void-color="var(--ny-track)" />

<NyRate v-model="coloredScore" size="sm" color="var(--ny-secondary)" />`

const codeReadonly = `<NyRate v-model="readonlyScore" readonly />

<NyRate v-model="disabledScore" disabled />`

const apiProps = [
  { name: 'v-model', desc: '当前星级, 未评时为 0', type: 'number', default: '0' },
  { name: 'count', desc: '星星总数', type: 'number', default: '5' },
  { name: 'allowHalf', desc: '允许半星, 指针落在左半边取半颗', type: 'boolean', default: 'false' },
  { name: 'clearable', desc: '再点一次当前星级就清零', type: 'boolean', default: 'false' },
  { name: 'showText', desc: '在星星右侧显示 texts 里对应的文案', type: 'boolean', default: 'false' },
  { name: 'texts', desc: '每颗星对应的文案, 下标是星级减一', type: 'string[]', default: '[]' },
  { name: 'size', desc: '尺寸档, 决定星星大小', type: 'NySize', default: "'md'" },
  { name: 'color', desc: '选中色, 缺省用主色令牌', type: 'string', default: "''" },
  { name: 'voidColor', desc: '未选中色, 缺省用弱化文字令牌', type: 'string', default: "''" },
  { name: 'readonly', desc: '只读, 能聚焦能读到星级但改不了', type: 'boolean', default: 'false' },
  { name: 'disabled', desc: '禁用, 也不能聚焦', type: 'boolean', default: 'false' },
  { name: 'label', desc: '字段标题, 显示在星星上方', type: 'string', default: "''" },
  { name: 'hint', desc: '星星下方的提示文本', type: 'string', default: "''" },
]

const apiEvents = [
  { name: 'change', desc: '星级变化后触发', type: '(value: number) => void' },
]
</script>

<template>
  <DocPage title="Rate 评分" desc="星级评分, 支持半星与文案。">

    <DemoBlock
      title="基础用法"
      desc="点击星星选星级, 键盘方向键也能调。"
      :code="codeBasic"
      :value="`当前: ${score} 星`"
    >
      <NyRate v-model="score" />
    </DemoBlock>

    <DemoBlock
      title="半星"
      desc="allowHalf 打开后, 指针落在星星左半边就取半颗。"
      :code="codeHalf"
      :value="`当前: ${halfScore} 星`"
    >
      <NyRate v-model="halfScore" allow-half />
    </DemoBlock>

    <DemoBlock
      title="评分文案"
      desc="showText 配合 texts, 把星级翻译成一句话。"
      :code="codeText"
      :value="`当前: ${textScore} 星 - ${ratingTexts[Math.ceil(textScore) - 1] ?? '未评分'}`"
    >
      <NyRate v-model="textScore" show-text :texts="ratingTexts" />
    </DemoBlock>

    <DemoBlock
      title="清零"
      desc="clearable 允许再点一次当前星级把评分撤回。"
      :code="codeClear"
      :value="`当前: ${clearScore} 星`"
    >
      <NyRate v-model="clearScore" clearable />
    </DemoBlock>

    <DemoBlock
      title="尺寸与颜色"
      desc="size 决定星星大小, color 与 voidColor 覆盖选中与未选中的颜色。"
      :code="codeColor"
      :value="`当前: ${coloredScore} 星`"
    >
      <div class="ex-group">
        <NyRate v-model="coloredScore" size="lg" color="var(--ny-warning)" void-color="var(--ny-track)" />
        <NyRate v-model="coloredScore" size="sm" color="var(--ny-secondary)" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="只读与禁用"
      desc="只读保留评分展示与焦点, 禁用连焦点也不给。"
      :code="codeReadonly"
      :value="`只读: ${readonlyScore} 星 | 禁用: ${disabledScore} 星`"
    >
      <div class="ex-group">
        <NyRate v-model="readonlyScore" readonly />
        <NyRate v-model="disabledScore" disabled />
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyRate Props" :rows="apiProps" />
      <ApiTable title="NyRate 事件" :rows="apiEvents" kind="events" />
    </template>
  </DocPage>
</template>
