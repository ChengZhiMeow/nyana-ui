<script setup lang="ts">
import { computed, ref } from 'vue'

import { NySpace, NyStack, NyText, NyUserCard } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const items = [
  { key: 'dashboard', label: '用户控制台', icon: 'dashboard' },
  { key: 'profile', label: '个人资料', icon: 'user' },
  { key: 'assets', label: '我的资源', icon: 'folder' },
  { divider: true, label: '' },
  { key: 'logout', label: '退出登录', icon: 'logout', danger: true },
]

const clickItems = [
  { key: 'setting', label: '账号设置', icon: 'sliders' },
  { key: 'help', label: '帮助文档', icon: 'book' },
  { key: 'import', label: '导入数据', icon: 'upload', disabled: true },
  { divider: true, label: '' },
  { key: 'logout', label: '退出登录', icon: 'logout', danger: true },
]

const picked = ref('还没有点过')
const clicked = ref('还没有点过')

const codeBasic = `const items = [
  { key: 'dashboard', label: '用户控制台', icon: 'dashboard' },
  { key: 'profile', label: '个人资料', icon: 'user' },
  { divider: true, label: '' },
  { key: 'logout', label: '退出登录', icon: 'logout', danger: true },
]

<NyUserCard name="橙汁喵喵" desc="超级管理员" avatar="/avatar.png" :items="items" @select="onSelect" />`

const codeTrigger = `<!-- trigger 默认 hover, 顶栏里通常用 click 更稳 -->
<NyUserCard name="橙汁喵喵" :items="items" trigger="click" @select="onSelect" />`

const codePlain = `<!-- 不给 items 就是一张纯展示的用户卡, 头像缺省取名字首字 -->
<NyUserCard name="喵喵" desc="设计" size="sm" />
<NyUserCard name="Nyana UI" desc="组件库" size="lg" />`

const codeEvent = `function onSelect({ key, item }) {
  if (key === 'logout') {
    return logout()
  }

  router.push(item.key)
}`

const apiProps = [
  { name: 'name', desc: '名字, 同时是缺省头像的文字', type: 'string' },
  { name: 'avatar', desc: '头像图片地址, 不传就用名字首字', type: 'string', default: "''" },
  { name: 'desc', desc: '名字下面的一行小字, 没有菜单时才会显示', type: 'string', default: "''" },
  { name: 'items', desc: '下拉菜单项, 字段与 NyDropdown 的 items 一致; 给空数组就是纯展示卡片', type: 'NyDropdownItem[]', default: '[]' },
  { name: 'trigger', desc: '菜单展开方式', type: "'hover' | 'click' | 'focus' | 'manual'", default: "'hover'" },
  { name: 'size', desc: '尺寸档, 同时决定头像大小', type: 'NySize', default: "'md'" },
  { name: 'nameWidth', desc: '名字最长多少像素, 超出省略', type: 'number', default: '110' },
]

const apiEvents = [
  { name: 'select', desc: '点菜单项触发, 禁用项不触发', type: '{ key: string; item: NyDropdownItem }' },
]

const code = computed(() => `当前选中: ${picked.value}`)
</script>

<template>
  <DocPage title="UserCard 用户卡片" desc="顶栏里的头像 + 名字入口, 菜单交给 NyDropdown">
    <DemoBlock
      title="基础用法"
      desc="头像, 名字与一个下拉菜单; 菜单项支持图标, 快捷键, 禁用, 分隔线与危险色。"
      :code="codeBasic"
      :value="`最近选择: ${picked}`"
    >
      <NyUserCard name="橙汁喵喵" desc="超级管理员" :items="items" @select="picked = $event.key" />
    </DemoBlock>

    <DemoBlock
      title="展开方式"
      desc="trigger 默认 hover, 顶栏里用 click 更稳, 触屏设备也没有悬浮态。"
      :code="codeTrigger"
      :value="`最近选择: ${clicked}`"
    >
      <NyUserCard name="Nyana 管理员" desc="管理员" :items="clickItems" trigger="click" @select="clicked = $event.key" />
    </DemoBlock>

    <DemoBlock
      title="纯展示与尺寸"
      desc="不给 items 就是一张纯展示的用户卡, 这时 desc 会显示在名字下面; size 同时管头像大小。"
      :code="codePlain"
    >
      <NySpace align="end">
        <NyUserCard name="喵喵" desc="设计" size="sm" />
        <NyUserCard name="Nyana UI" desc="组件库" size="md" />
        <NyUserCard name="橙汁喵喵" desc="全栈" size="lg" />
      </NySpace>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyUserCard Props" :rows="apiProps" />
      <ApiTable title="NyUserCard 事件" kind="events" :rows="apiEvents" />
    </template>

    <template #faq>
      <p class="ex-note">
        卡片只报意图, 跳哪去由页面决定: select 里按 key 分发就行 ({{ code }})。{{ '' }}
      </p>
      <p class="ex-note">
        代码里的分发写法:
      </p>
      <pre class="ex-code">{{ codeEvent }}</pre>
    </template>
  </DocPage>
</template>
