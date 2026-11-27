<script setup lang="ts">
import { ref } from 'vue'

import { NySpace, NyStack, NyText, NyThemeToggle } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const mode = ref<'light' | 'dark'>('light')

const lastChange = ref('—')

function onChange(next: 'light' | 'dark') {
  lastChange.value = next
}

const codeVariants = `const mode = ref('light')

<NyThemeToggle v-model:mode="mode" variant="icon" />
<NyThemeToggle v-model:mode="mode" variant="button" />
<NyThemeToggle v-model:mode="mode" variant="switch" />
<NyThemeToggle v-model:mode="mode" variant="segment" />`

const codeSize = `<NyThemeToggle v-model:mode="mode" variant="switch" size="sm" />
<NyThemeToggle v-model:mode="mode" variant="switch" size="md" />
<NyThemeToggle v-model:mode="mode" variant="switch" size="lg" />

<NyThemeToggle v-model:mode="mode" variant="button" size="sm" />
<NyThemeToggle v-model:mode="mode" variant="button" size="md" />
<NyThemeToggle v-model:mode="mode" variant="button" size="lg" />`

const codeLabel = `<!-- 两档的文案与图标都能换 -->
<NyThemeToggle
  v-model:mode="mode"
  variant="segment"
  :labels="{ light: '日间', dark: '夜间' }"
  light-icon="sun"
  dark-icon="star"
/>

<!-- 只要图标不要文字 -->
<NyThemeToggle v-model:mode="mode" variant="button" :show-label="false" />
<NyThemeToggle v-model:mode="mode" variant="switch" :show-label="false" />`

const codeDisabled = `<NyThemeToggle disabled variant="button" />`

const apiProps = [  { name: 'v-model:mode', desc: "当前主题, 'light' | 'dark'", type: 'string', default: "'light'" },
  { name: 'variant', desc: '形态: 单图标 / 图标加文字 / 开关 / 两段控制', type: "'icon' | 'button' | 'switch' | 'segment'", default: "'icon'" },
  { name: 'size', desc: '尺寸档', type: 'NySize', default: "'md'" },
  { name: 'showLabel', desc: 'button 与 switch 形态是否带文字', type: 'boolean', default: 'true' },
  { name: 'labels', desc: '两档的文案, 浅色在左深色在右', type: '{ light: string; dark: string }', default: "{ light: '浅色', dark: '深色' }" },
  { name: 'lightIcon', desc: '浅色档的图标名', type: 'string', default: "'sun'" },
  { name: 'darkIcon', desc: '深色档的图标名', type: 'string', default: "'moon'" },
  { name: 'disabled', desc: '禁用', type: 'boolean', default: 'false' },
  { name: 'apply', desc: '由组件自己把主题写到 html 的 data-theme 上并记进 localStorage', type: 'boolean', default: 'false' },
  { name: 'storageKey', desc: 'apply 打开时用的存储键', type: 'string', default: "'nyana-theme'" },
]

const apiEvents = [
  { name: 'change', desc: '切换后触发, 参数是切换到的主题', type: "'light' | 'dark'" },
]
</script>

<template>
  <DocPage title="ThemeToggle 主题切换" desc="四种样式的深浅色切换, 颜色全部走主题令牌">
    <DemoBlock
      title="四种形态"
      desc="icon 只留图标, button 图标配文字, switch 是带滑块的开关, segment 是两段控制; 四个演示共用一份状态, 点任意一个其它几个一起变。"
      :code="codeVariants"
      :value="`当前: ${mode} · 最近切换: ${lastChange}`"
    >
      <NySpace>
        <NyThemeToggle v-model:mode="mode" variant="icon" @change="onChange" />
        <NyThemeToggle v-model:mode="mode" variant="button" @change="onChange" />
        <NyThemeToggle v-model:mode="mode" variant="switch" @change="onChange" />
        <NyThemeToggle v-model:mode="mode" variant="segment" @change="onChange" />
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="尺寸"
      desc="三档尺寸与其它控件对齐, 放在顶栏里用 sm, 独立成块用 md 或 lg。"
      :code="codeSize"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyThemeToggle v-model:mode="mode" variant="switch" size="sm" />
          <NyThemeToggle v-model:mode="mode" variant="switch" size="md" />
          <NyThemeToggle v-model:mode="mode" variant="switch" size="lg" />
        </div>

        <div class="ex-group">
          <NyThemeToggle v-model:mode="mode" variant="button" size="sm" />
          <NyThemeToggle v-model:mode="mode" variant="button" size="md" />
          <NyThemeToggle v-model:mode="mode" variant="button" size="lg" />
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="文案与图标"
      desc="labels 换两档文案, lightIcon 与 darkIcon 换图标; showLabel 关掉就只剩图标。"
      :code="codeLabel"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyThemeToggle
            v-model:mode="mode"
            variant="segment"
            :labels="{ light: '日间', dark: '夜间' }"
            light-icon="sun"
            dark-icon="star"
          />
        </div>

        <div class="ex-group">
          <NyThemeToggle v-model:mode="mode" variant="button" :show-label="false" />
          <NyThemeToggle v-model:mode="mode" variant="switch" :show-label="false" />
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="禁用"
      desc="disabled 时不响应点击, 图标也降到弱化色。"
      :code="codeDisabled"
    >
      <NySpace>
        <NyThemeToggle disabled variant="icon" />
        <NyThemeToggle disabled variant="button" />
        <NyThemeToggle disabled variant="switch" />
        <NyThemeToggle disabled variant="segment" />
      </NySpace>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyThemeToggle Props" :rows="apiProps" />
      <ApiTable title="NyThemeToggle 事件" kind="events" :rows="apiEvents" />
    </template>

    <template #faq>
      <p class="ex-note">
        组件自己不管主题存在哪, 只认 v-model:mode 这一份状态; 接到自己的状态管理上就行,
        例如 <NyText code>@update:mode="setTheme"</NyText>。站点主题怎么落地(写
        <NyText code>data-theme</NyText>、存 localStorage、跟随系统)由业务自己决定。
      </p>
      <p class="ex-note">
        单个页面里懒得再接一套状态, 直接开 <NyText code>apply</NyText>: 组件挂载时读
        <NyText code>storage-key</NyText> 里记住的值, 之后每次切换都把
        <NyText code>data-theme</NyText> 写到 <NyText code>&lt;html&gt;</NyText> 上并回写存储,
        写法就是 <NyText code>&lt;NyThemeToggle apply storage-key="my-app-theme" /&gt;</NyText>。
      </p>
    </template>
  </DocPage>
</template>
