<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyIcon, NyTooltip } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

import type { NyPlacement } from '@chengzhimeow/nyana-ui'

const TOP_PLACEMENTS: NyPlacement[] = ['top', 'top-start', 'top-end']
const BOTTOM_PLACEMENTS: NyPlacement[] = ['bottom', 'bottom-start', 'bottom-end']
const SIDE_PLACEMENTS: NyPlacement[] = [
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
]

const theme = ref<'dark' | 'light'>('dark')
const themeInfo = computed(() => `theme = ${theme.value}`)

const codeBasic = `<NyTooltip content="这是提示文字">
  <NyButton>悬浮看提示</NyButton>
</NyTooltip>

<NyTooltip content="包裹图标也可以">
  <NyIcon name="info" :size="18" />
</NyTooltip>`

const codePlacement = `const placements = ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end']

<div class="ex-group">
  <NyTooltip
    v-for="placement in placements"
    :key="placement"
    :content="placement"
    :placement="placement"
  >
    <NyButton size="sm">{{ placement }}</NyButton>
  </NyTooltip>
</div>`

const codeTrigger = `<div class="ex-group">
  <NyTooltip content="悬停进来, 80ms 后浮出">
    <NyButton>hover 触发</NyButton>
  </NyTooltip>

  <NyTooltip content="键盘 Tab 到这里也会浮出" trigger="focus">
    <NyButton>focus 触发</NyButton>
  </NyTooltip>
</div>`

const codeContent = `<NyTooltip :max-width="360">
  <NyButton>较宽的限制</NyButton>

  <template #content>
    默认插槽放触发器, content 插槽放浮层内容,
    这里可以写多行文字, 超过 maxWidth 自动换行。
  </template>
</NyTooltip>`

const codeTheme = `const theme = ref<'dark' | 'light'>('dark')

<div class="ex-group">
  <NyTooltip content="浮层跟随主题变量" :theme="theme">
    <NyButton>悬浮看当前主题</NyButton>
  </NyTooltip>

  <NyButton size="sm" variant="text" @click="theme = theme === 'dark' ? 'light' : 'dark'">
    切换主题
  </NyButton>

  <NyTooltip content="间距拉开一点, 浅色浮层" theme="light" :offset="16">
    <NyButton>浅色 + 偏移 16</NyButton>
  </NyTooltip>

  <NyTooltip content="禁用后不浮出" disabled>
    <NyButton>禁用</NyButton>
  </NyTooltip>
</div>`

const apiProps = [
  { name: 'content', desc: '提示文字, 也可以用 content 插槽放更自由的内容', type: 'string', default: "''" },
  { name: 'placement', desc: '浮层相对触发器的位置', type: 'NyPlacement', default: "'top'" },
  { name: 'trigger', desc: '触发方式, 只实现了 hover 与 focus, 其余取值按 focus 处理', type: "'hover' | 'focus'", default: "'hover'" },
  { name: 'maxWidth', desc: '浮层最大宽度, 超出就换行', type: 'number', default: '260' },
  { name: 'theme', desc: '浮层底色', type: "'dark' | 'light'", default: "'dark'" },
  { name: 'offset', desc: '与触发元素的间距', type: 'number', default: '6' },
  { name: 'disabled', desc: '禁用, 不响应 hover 与 focus', type: 'boolean', default: 'false' },
]

const apiSlots = [
  { name: 'default', desc: '触发元素, hover 与 focus 都挂在它外面那层 span 上' },
  { name: 'content', desc: '浮层内容, 优先于 content 属性' },
]
</script>

<template>
  <DocPage title="Tooltip 文字提示" desc="悬浮时出现的轻量说明">

    <DemoBlock title="基础用法" desc="content 给文字, 默认插槽给触发元素。" :code="codeBasic">
      <div class="ex-group">
        <NyTooltip content="这是提示文字">
          <NyButton>悬浮看提示</NyButton>
        </NyTooltip>

        <NyTooltip content="包裹图标也可以">
          <NyIcon name="info" :size="18" />
        </NyTooltip>
      </div>
    </DemoBlock>

    <DemoBlock
      title="十二种方位"
      desc="placement 控制浮层贴在触发元素的哪一侧, -start / -end 是另一轴的对齐方式。"
      :code="codePlacement"
      backdrop="muted"
    >
      <div class="ex-group">
        <NyTooltip
          v-for="placement in TOP_PLACEMENTS"
          :key="placement"
          :content="placement"
          :placement="placement"
        >
          <NyButton size="sm">{{ placement }}</NyButton>
        </NyTooltip>
      </div>

      <div class="ex-group">
        <NyTooltip
          v-for="placement in BOTTOM_PLACEMENTS"
          :key="placement"
          :content="placement"
          :placement="placement"
        >
          <NyButton size="sm">{{ placement }}</NyButton>
        </NyTooltip>
      </div>

      <div class="ex-group">
        <NyTooltip
          v-for="placement in SIDE_PLACEMENTS"
          :key="placement"
          :content="placement"
          :placement="placement"
        >
          <NyButton size="sm">{{ placement }}</NyButton>
        </NyTooltip>
      </div>
    </DemoBlock>

    <DemoBlock
      title="触发方式"
      desc="hover 是默认, focus 让键盘用户也能看到提示。"
      :code="codeTrigger"
    >
      <div class="ex-group">
        <NyTooltip content="悬停进来, 80ms 后浮出">
          <NyButton>hover 触发</NyButton>
        </NyTooltip>

        <NyTooltip content="键盘 Tab 到这里也会浮出" trigger="focus">
          <NyButton>focus 触发</NyButton>
        </NyTooltip>
      </div>
    </DemoBlock>

    <DemoBlock
      title="自定义内容与宽度"
      desc="content 插槽能写多行, maxWidth 限制换行宽度。"
      :code="codeContent"
    >
      <div class="ex-group">
        <NyTooltip :max-width="360">
          <NyButton>maxWidth 360</NyButton>

          <template #content>
            默认插槽放触发器, content 插槽放浮层内容, 这里可以写多行文字, 超过 maxWidth
            自动换行。
          </template>
        </NyTooltip>

        <NyTooltip :max-width="120">
          <NyButton>maxWidth 120</NyButton>

          <template #content>窄一些, 很快就要换行</template>
        </NyTooltip>
      </div>
    </DemoBlock>

    <DemoBlock
      title="主题, 偏移与禁用"
      desc="深色浮层是默认, 浅色适合叠在白色卡片上; offset 调间距。"
      :code="codeTheme"
      :value="themeInfo"
    >
      <div class="ex-group">
        <NyTooltip content="浮层跟随主题变量" :theme="theme">
          <NyButton>悬浮看当前主题</NyButton>
        </NyTooltip>

        <NyButton size="sm" variant="text" @click="theme = theme === 'dark' ? 'light' : 'dark'">
          切换主题
        </NyButton>

        <NyTooltip content="间距拉开一点, 浅色浮层" theme="light" :offset="16">
          <NyButton>浅色 + 偏移 16</NyButton>
        </NyTooltip>

        <NyTooltip content="禁用后不浮出" disabled>
          <NyButton>禁用</NyButton>
        </NyTooltip>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTooltip Props" :rows="apiProps" />
      <ApiTable title="NyTooltip 插槽" kind="slots" compact :rows="apiSlots" />
    </template>
  </DocPage>
</template>
