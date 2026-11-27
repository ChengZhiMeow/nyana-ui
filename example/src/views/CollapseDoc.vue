<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyCollapse, NyCollapseItem, NyIcon } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const activeKeys = ref<(string | number)[]>(['design'])
const activeInfo = computed(() => `activeKeys = [${activeKeys.value.join(', ')}]`)

const defaultKeys = ref<(string | number)[]>(['notice', 'log'])

const accordionKeys = ref<(string | number)[]>(['a'])
const accordionInfo = computed(() => `activeKeys = [${accordionKeys.value.join(', ')}]`)

const codeBasic = `const activeKeys = ref<(string | number)[]>(['design'])

<NyCollapse v-model:activeKeys="activeKeys">
  <NyCollapseItem item-key="design" title="设计稿">
    展开态由容器统一管理, 子项只上报"我要切换"。
  </NyCollapseItem>

  <NyCollapseItem item-key="spec" title="接口约定">
    itemKey 是子项与 activeKeys 匹配的标识, 不传时组件内部用 useId 兜底。
  </NyCollapseItem>

  <NyCollapseItem item-key="faq" title="常见问题">
    key 是数组里的值, 所以同时可以展开多项。
  </NyCollapseItem>
</NyCollapse>`

const codeDefault = `const defaultKeys = ref<(string | number)[]>(['notice', 'log'])

<NyCollapse v-model:activeKeys="defaultKeys">
  <NyCollapseItem item-key="notice" title="公告">默认展开的一项。</NyCollapseItem>
  <NyCollapseItem item-key="log" title="更新日志">也是默认展开的。</NyCollapseItem>
  <NyCollapseItem item-key="about" title="关于">默认收起。</NyCollapseItem>
</NyCollapse>`

const codeAccordion = `const accordionKeys = ref<(string | number)[]>(['a'])

<NyCollapse v-model:activeKeys="accordionKeys" accordion>
  <NyCollapseItem item-key="a" title="第一步">展开新的一项时, 旧的一项自动收起。</NyCollapseItem>
  <NyCollapseItem item-key="b" title="第二步">activeKeys 里永远只有一个元素。</NyCollapseItem>
  <NyCollapseItem item-key="c" title="第三步">再点一次当前项就全部收起。</NyCollapseItem>
</NyCollapse>`

const codeDisabled = `<NyCollapse v-model:activeKeys="activeKeys">
  <NyCollapseItem item-key="plan" title="套餐说明">正常展开。</NyCollapseItem>

  <NyCollapseItem item-key="bill" title="账单设置" disabled>
    这一项点不动, 键盘也进不去。
  </NyCollapseItem>

  <NyCollapseItem item-key="log" title="操作日志">正常展开。</NyCollapseItem>
</NyCollapse>`

const codeCustom = `<NyCollapse v-model:activeKeys="activeKeys">
  <NyCollapseItem item-key="icon" icon="bell" title="带图标的标题">
    标题前的图标来自 icon 属性。
  </NyCollapseItem>

  <NyCollapseItem item-key="slots">
    <template #title>
      <NyIcon name="check-circle" :size="14" />
      用 title 插槽拼的标题
    </template>

    <template #extra>3 条</template>

    标题与右侧附加文案都能换成插槽。
  </NyCollapseItem>

  <NyCollapseItem item-key="extra" title="只要 extra" extra="可展开">
    extra 只传字符串也能用。
  </NyCollapseItem>
</NyCollapse>`

const codePlain = `<div class="ex-group">
  <NyCollapse v-model:activeKeys="activeKeys" :bordered="false">
    <NyCollapseItem item-key="plain-1" title="无边框">去掉容器描边, 只留分隔线。</NyCollapseItem>
    <NyCollapseItem item-key="plain-2" title="第二项">适合嵌在卡片里。</NyCollapseItem>
  </NyCollapse>

  <NyCollapse v-model:activeKeys="activeKeys" ghost>
    <NyCollapseItem item-key="ghost-1" title="ghost">无边框无底色, 做次级分组。</NyCollapseItem>
    <NyCollapseItem item-key="ghost-2" title="第二项">悬浮才有一点底色。</NyCollapseItem>
  </NyCollapse>
</div>`

const apiProps = [
  { name: 'accordion', desc: '同时只允许展开一个, 展开新项时自动收起旧项', type: 'boolean', default: 'false' },
  { name: 'bordered', desc: '容器描边与底色', type: 'boolean', default: 'true' },
  { name: 'ghost', desc: '无边框无底色, 用于嵌在卡片里做次级分组', type: 'boolean', default: 'false' },
  { name: 'activeKeys', desc: '展开项的 key 集合, 支持 v-model:activeKeys 双向绑定', type: '(string | number)[]', default: '[]' },
]

const apiEvents = [
  { name: 'change', desc: '展开集合变化时触发, 参数是下一次的完整集合', type: '(string | number)[]' },
]

const apiItemProps = [
  { name: 'itemKey', desc: '与容器的 activeKeys 匹配的标识, 缺省时用组件内 useId 兜底', type: 'string | number', default: '—' },
  { name: 'title', desc: '标题文字, 也可以用 title 插槽', type: 'string', default: "''" },
  { name: 'icon', desc: '标题前的图标名, 取自 icons.ts', type: 'string', default: "''" },
  { name: 'extra', desc: '标题右侧的附加文案, 也可以用 extra 插槽', type: 'string', default: "''" },
  { name: 'disabled', desc: '禁用这一项, 不可点击也不可聚焦', type: 'boolean', default: 'false' },
]

const apiSlots = [
  { name: 'default (NyCollapse)', desc: '一组 NyCollapseItem' },
  { name: 'default (NyCollapseItem)', desc: '展开后显示的内容' },
  { name: 'title', desc: 'NyCollapseItem 的标题, 优先于 title 属性' },
  { name: 'extra', desc: 'NyCollapseItem 标题右侧的附加内容' },
]
</script>

<template>
  <DocPage title="Collapse 折叠面板" desc="分组收纳内容, 支持手风琴">

    <DemoBlock
      title="基础用法"
      desc="展开态收敛在容器上, 子项只管上报切换。"
      :code="codeBasic"
      :value="activeInfo"
    >
      <NyCollapse v-model:activeKeys="activeKeys">
        <NyCollapseItem item-key="design" title="设计稿">
          展开态由容器统一管理, 子项只上报"我要切换"。
        </NyCollapseItem>

        <NyCollapseItem item-key="spec" title="接口约定">
          itemKey 是子项与 activeKeys 匹配的标识, 不传时组件内部用 useId 兜底。
        </NyCollapseItem>

        <NyCollapseItem item-key="faq" title="常见问题">
          key 是数组里的值, 所以同时可以展开多项。
        </NyCollapseItem>
      </NyCollapse>
    </DemoBlock>

    <DemoBlock title="默认展开" desc="初始值里带上要展开的 key。" :code="codeDefault">
      <NyCollapse v-model:activeKeys="defaultKeys">
        <NyCollapseItem item-key="notice" title="公告">默认展开的一项。</NyCollapseItem>
        <NyCollapseItem item-key="log" title="更新日志">也是默认展开的。</NyCollapseItem>
        <NyCollapseItem item-key="about" title="关于">默认收起。</NyCollapseItem>
      </NyCollapse>
    </DemoBlock>

    <DemoBlock
      title="手风琴"
      desc="accordion 打开后, 展开新项会自动收起旧项。"
      :code="codeAccordion"
      :value="accordionInfo"
      backdrop="muted"
    >
      <NyCollapse v-model:activeKeys="accordionKeys" accordion>
        <NyCollapseItem item-key="a" title="第一步">
          展开新的一项时, 旧的一项自动收起。
        </NyCollapseItem>
        <NyCollapseItem item-key="b" title="第二步">
          activeKeys 里永远只有一个元素。
        </NyCollapseItem>
        <NyCollapseItem item-key="c" title="第三步">再点一次当前项就全部收起。</NyCollapseItem>
      </NyCollapse>
    </DemoBlock>

    <DemoBlock title="禁用项" desc="disabled 的项点不动, 键盘也进不去。" :code="codeDisabled">
      <NyCollapse v-model:activeKeys="activeKeys">
        <NyCollapseItem item-key="plan" title="套餐说明">正常展开。</NyCollapseItem>

        <NyCollapseItem item-key="bill" title="账单设置" disabled>
          这一项点不动, 键盘也进不去。
        </NyCollapseItem>

        <NyCollapseItem item-key="log" title="操作日志">正常展开。</NyCollapseItem>
      </NyCollapse>
    </DemoBlock>

    <DemoBlock
      title="自定义标题与 extra"
      desc="icon 给标题前图标, title 与 extra 插槽能放组件。"
      :code="codeCustom"
    >
      <NyCollapse v-model:activeKeys="activeKeys">
        <NyCollapseItem item-key="icon" icon="bell" title="带图标的标题">
          标题前的图标来自 icon 属性。
        </NyCollapseItem>

        <NyCollapseItem item-key="slots">
          <template #title>
            <NyIcon name="check-circle" :size="14" />
            用 title 插槽拼的标题
          </template>

          <template #extra>3 条</template>

          标题与右侧附加文案都能换成插槽。
        </NyCollapseItem>

        <NyCollapseItem item-key="extra" title="只要 extra" extra="可展开">
          extra 只传字符串也能用。
        </NyCollapseItem>
      </NyCollapse>

      <div class="ex-group">
        <NyButton size="sm" variant="text" @click="activeKeys = []">全部收起</NyButton>
        <NyButton size="sm" variant="text" @click="activeKeys = ['icon', 'slots', 'extra']">
          全部展开
        </NyButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="无边框与 ghost"
      desc="bordered 去掉描边与底色, ghost 连分隔线一起让掉。"
      :code="codePlain"
    >
      <NyCollapse v-model:activeKeys="activeKeys" :bordered="false">
        <NyCollapseItem item-key="plain-1" title="无边框">去掉容器描边, 只留分隔线。</NyCollapseItem>
        <NyCollapseItem item-key="plain-2" title="第二项">适合嵌在卡片里。</NyCollapseItem>
      </NyCollapse>

      <NyCollapse v-model:activeKeys="activeKeys" ghost>
        <NyCollapseItem item-key="ghost-1" title="ghost">
          无边框无底色, 做次级分组。
        </NyCollapseItem>
        <NyCollapseItem item-key="ghost-2" title="第二项">悬浮才有一点底色。</NyCollapseItem>
      </NyCollapse>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyCollapse Props" :rows="apiProps" />
      <ApiTable title="NyCollapse 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyCollapseItem Props" :rows="apiItemProps" />
      <ApiTable title="插槽" kind="slots" compact :rows="apiSlots" />
    </template>
  </DocPage>
</template>
