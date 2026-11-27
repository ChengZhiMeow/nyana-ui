<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyIcon, NyTag } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NyStatus } from '@chengzhimeow/nyana-ui'

const statuses: { value: NyStatus; label: string }[] = [
  { value: 'default', label: '草稿' },
  { value: 'primary', label: '进行中' },
  { value: 'info', label: '待评审' },
  { value: 'success', label: '已完成' },
  { value: 'warning', label: '有风险' },
  { value: 'danger', label: '已驳回' },
]

const variants: { value: 'soft' | 'outline' | 'solid'; label: string }[] = [
  { value: 'soft', label: '软底' },
  { value: 'outline', label: '描边' },
  { value: 'solid', label: '实底' },
]

const sizes: { value: 'sm' | 'md' | 'lg'; label: string }[] = [
  { value: 'sm', label: '小' },
  { value: 'md', label: '中' },
  { value: 'lg', label: '大' },
]

const options = ['前端', '后端', '设计', '测试']
const selected = ref<Record<string, boolean>>({ 前端: true, 后端: false, 设计: false, 测试: false })
const picked = computed(() => options.filter((name) => selected.value[name]))

const INITIAL_TAGS = ['Vue 3', 'TypeScript', 'Vite', 'SCSS']
const tags = ref([...INITIAL_TAGS])

function removeTag(tag: string) {
  tags.value = tags.value.filter((item) => item !== tag)
}

function resetTags() {
  tags.value = [...INITIAL_TAGS]
}

const pickedInfo = computed(() => `已选中: ${picked.value.join(' / ') || '无'}`)
const tagsInfo = computed(() => `剩余标签: ${tags.value.join(' / ') || '无'}`)

const codeStatus = `const statuses = [
  { value: 'default', label: '草稿' },
  { value: 'primary', label: '进行中' },
  { value: 'info', label: '待评审' },
  { value: 'success', label: '已完成' },
  { value: 'warning', label: '有风险' },
  { value: 'danger', label: '已驳回' },
]

<div class="ex-group">
  <NyTag v-for="item in statuses" :key="item.value" :status="item.value">{{ item.label }}</NyTag>
</div>`

const codeVariant = `<div class="ex-group">
  <NyTag variant="soft" status="primary">软底</NyTag>
  <NyTag variant="outline" status="primary">描边</NyTag>
  <NyTag variant="solid" status="primary">实底</NyTag>
</div>`

const codeSize = `<div class="ex-group">
  <NyTag size="sm">小尺寸</NyTag>
  <NyTag size="md">中尺寸</NyTag>
  <NyTag size="lg">大尺寸</NyTag>
  <NyTag round status="success">胶囊</NyTag>
</div>`

const codeCheckable = `const options = ['前端', '后端', '设计', '测试']
const selected = ref({ 前端: true, 后端: false, 设计: false, 测试: false })

<div class="ex-group">
  <NyTag
    v-for="name in options"
    :key="name"
    v-model:checked="selected[name]"
    checkable
  >
    {{ name }}
  </NyTag>
</div>`

const codeClosable = `const tags = ref(['Vue 3', 'TypeScript', 'Vite', 'SCSS'])

<div class="ex-group">
  <NyTag
    v-for="tag in tags"
    :key="tag"
    closable
    status="info"
    @close="tags = tags.filter((item) => item !== tag)"
  >
    {{ tag }}
  </NyTag>
</div>`

const codeIcon = `<div class="ex-group">
  <NyTag icon="check-circle" status="success">已验证</NyTag>
  <NyTag icon="clock" status="warning">待处理</NyTag>
  <NyTag icon="user" status="primary">负责人</NyTag>
  <NyTag disabled>禁用标签</NyTag>
  <NyTag closable disabled status="danger">不可关闭</NyTag>
</div>`

const apiProps = [
  { name: 'status', desc: '语义状态色', type: 'NyStatus', default: "'default'" },
  { name: 'variant', desc: '观感, 软底 / 描边 / 实底', type: "'soft' | 'outline' | 'solid'", default: "'soft'" },
  { name: 'size', desc: '尺寸档', type: 'NySize', default: "'md'" },
  { name: 'round', desc: '胶囊外形', type: 'boolean', default: 'false' },
  { name: 'icon', desc: '左侧图标名, 取自 icons.ts', type: 'string', default: "''" },
  { name: 'checkable', desc: '可点击或回车切换选中态', type: 'boolean', default: 'false' },
  { name: 'checked', desc: '选中态, 支持 v-model:checked 双向绑定', type: 'boolean', default: 'false' },
  { name: 'closable', desc: '显示关闭按钮', type: 'boolean', default: 'false' },
  { name: 'disabled', desc: '禁用, 不可选中也不可关闭', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'change', desc: 'checkable 标签的选中态变化时触发', type: 'boolean' },
  { name: 'close', desc: '点击关闭按钮时触发', type: 'MouseEvent' },
]

const apiSlots = [{ name: 'default', desc: '标签文字, 与 icon 图标同排' }]
</script>

<template>
  <DocPage title="Tag 标签" desc="状态标记与可选中标签">

    <DemoBlock title="状态标签" desc="status 决定颜色, 文案写业务语义。" :code="codeStatus">
      <div class="ex-group">
        <NyTag v-for="item in statuses" :key="item.value" :status="item.value">
          {{ item.label }}
        </NyTag>
      </div>
    </DemoBlock>

    <DemoBlock
      title="三种观感"
      desc="同一组颜色换观感: 软底最轻, 实底最重。"
      :code="codeVariant"
      backdrop="muted"
    >
      <div class="ex-group">
        <NyTag v-for="item in variants" :key="item.value" :variant="item.value" status="primary">
          {{ item.label }}
        </NyTag>
      </div>

      <div class="ex-group">
        <NyTag v-for="item in variants" :key="item.value" :variant="item.value" status="danger">
          {{ item.label }}
        </NyTag>
      </div>
    </DemoBlock>

    <DemoBlock title="尺寸与外形" desc="三档尺寸, round 切成胶囊。" :code="codeSize">
      <div class="ex-group">
        <NyTag v-for="item in sizes" :key="item.value" :size="item.value">
          {{ item.label }}尺寸
        </NyTag>

        <NyTag round status="success">胶囊</NyTag>
      </div>
    </DemoBlock>

    <DemoBlock
      title="可选中标签"
      desc="checkable 打开后点击或回车切换, v-model:checked 一个个绑。"
      :code="codeCheckable"
      :value="pickedInfo"
    >
      <div class="ex-group">
        <NyTag
          v-for="name in options"
          :key="name"
          v-model:checked="selected[name]"
          checkable
          status="primary"
        >
          {{ name }}
        </NyTag>
      </div>
    </DemoBlock>

    <DemoBlock
      title="可关闭标签"
      desc="close 事件里把该项从数组里删掉, 下面的按钮可以重置。"
      :code="codeClosable"
      :value="tagsInfo"
    >
      <div class="ex-group">
        <NyTag
          v-for="tag in tags"
          :key="tag"
          closable
          status="info"
          @close="removeTag(tag)"
        >
          {{ tag }}
        </NyTag>

        <span v-if="!tags.length" class="ex-note">标签已经全部关掉了</span>
      </div>

      <div class="ex-group">
        <NyButton size="sm" variant="text" :disabled="!tags.length" @click="resetTags">
          重置标签
        </NyButton>
      </div>
    </DemoBlock>

    <DemoBlock title="图标与禁用" desc="icon 给左侧图标, disabled 之后不可选中也不可关闭。" :code="codeIcon">
      <div class="ex-group">
        <NyTag icon="check-circle" status="success">已验证</NyTag>
        <NyTag icon="clock" status="warning">待处理</NyTag>
        <NyTag icon="user" status="primary">负责人</NyTag>
        <NyTag disabled>禁用标签</NyTag>
        <NyTag closable disabled status="danger">不可关闭</NyTag>
      </div>

      <div class="ex-group">
        <NyTag checkable disabled status="primary">禁用选中</NyTag>

        <span class="ex-note">
          <NyIcon name="info" :size="12" />
          禁用态的选中标签点不动, 键盘也进不去
        </span>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTag Props" :rows="apiProps" />
      <ApiTable title="NyTag 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="NyTag 插槽" kind="slots" compact :rows="apiSlots" />
    </template>
  </DocPage>
</template>
