<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyLayout, NyStack, type NyNavGroup, type NyNavItem } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const navGroups: NyNavGroup[] = [
  {
    title: '工作台',
    items: [
      { key: 'overview', label: '总览', icon: 'dashboard' },
      { key: 'orders', label: '订单', icon: 'list', badge: 12 },
    ],
  },
  {
    title: '设置',
    items: [
      {
        key: 'account',
        label: '账号',
        icon: 'user',
        children: [
          { key: 'profile', label: '基本资料' },
          { key: 'security', label: '安全设置' },
        ],
      },
      { key: 'audit', label: '审计日志', icon: 'history', disabled: true },
    ],
  },
]

const activeKey = ref('overview')
const collapsed = ref(false)
const drawerOpen = ref(false)

const inlineBreakpoint = 0

const maxOptions = ['full', 'lg', 'sm'] as const
const contentMax = ref<'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'>('lg')

const activeValue = computed(() => `activeKey = '${activeKey.value}'`)
const collapsedValue = computed(() => `collapsed = ${collapsed.value}`)
const drawerValue = computed(
  () => `drawer = ${drawerOpen.value}, breakpoint = 4000 (强制走抽屉分支)`,
)
const contentMaxValue = computed(() => `contentMax = '${contentMax.value}'`)

function onNavSelect(item: NyNavItem) {
  activeKey.value = item.key ?? item.label
}

const codeSide = `<NyLayout
  :nav="navGroups"
  :active-key="activeKey"
  :breakpoint="0"
  :sidebar-width="220"
  @select="onNavSelect"
>
  <template #brand>Nyana Admin</template>

  <template #header-right>
    <NyButton size="sm" variant="ghost">通知</NyButton>
  </template>

  <div class="ex-box">内容区</div>
</NyLayout>`

const codeTop = `<NyLayout
  mode="top"
  :nav="navGroups"
  :active-key="activeKey"
  :breakpoint="0"
  @select="onNavSelect"
>
  <template #brand>Nyana Admin</template>

  <template #header-right>
    <NyButton size="sm" variant="ghost" icon="user">账号</NyButton>
  </template>

  <div class="ex-box">内容区: 顶栏只有一层</div>
</NyLayout>`

const codeMix = `<NyLayout
  mode="mix"
  :nav="navGroups"
  :active-key="activeKey"
  :content-max="contentMax"
  :breakpoint="0"
  @select="onNavSelect"
>
  <template #brand>Nyana Admin</template>

  <div class="ex-box">内容区: 内容宽度 {{ contentMax }}</div>

  <template #footer>Nyana UI · 内容宽度 {{ contentMax }}</template>
</NyLayout>`

const codeBlank = `<NyLayout mode="blank" content-max="sm">
  <NyStack :gap="12" align="center">
    <div class="ex-box">登录卡片</div>
    <div class="ex-box">表单放在这里</div>
  </NyStack>
</NyLayout>`

const codeCollapsed = `<NyButton size="sm" @click="collapsed = !collapsed">切换侧栏</NyButton>

<NyLayout
  v-model:collapsed="collapsed"
  :nav="navGroups"
  :breakpoint="0"
  :sidebar-width="220"
>
  <div class="ex-box">内容区</div>
</NyLayout>`

const codeDrawer = `<NyLayout
  v-model:drawer="drawerOpen"
  :nav="navGroups"
  :breakpoint="4000"
  :sidebar-width="220"
>
  <div class="ex-box">顶栏左侧的菜单按钮打开抽屉</div>
</NyLayout>`

const apiProps = [
  { name: 'mode', desc: '内置布局方案', type: "'side' | 'top' | 'mix' | 'blank'", default: "'side'" },
  { name: 'nav', desc: '导航数据, 也可以改用 #nav 插槽自己渲染', type: 'NyNavGroup[]', default: '[]' },
  { name: 'linkComponent', desc: '导航项渲染用的组件, vue-router 下传 RouterLink', type: 'string | Component', default: "'a'" },
  { name: 'activeKey', desc: '当前选中的导航项, 与 key / href / to 匹配', type: 'string', default: "''" },
  { name: 'sidebarWidth', desc: '侧栏展开时的宽度', type: 'number', default: '248' },
  { name: 'collapsedWidth', desc: '侧栏收起后的宽度', type: 'number', default: '64' },
  { name: 'headerHeight', desc: '顶栏高度', type: 'number', default: '62' },
  { name: 'stickyHeader', desc: '页面整体滚动时把顶栏钉在顶部', type: 'boolean', default: 'true' },
  { name: 'fill', desc: '撑满父容器高度, 内容区自己滚动', type: 'boolean', default: 'true' },
  { name: 'contentMax', desc: '内容区与页脚的最大宽度', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'", default: "'full'" },
  { name: 'contentPadding', desc: '内容区上下留白', type: 'boolean', default: 'true' },
  { name: 'breakpoint', desc: '小于该宽度时侧栏转抽屉', type: 'number', default: '1024' },
  { name: 'showMenuButton', desc: '抽屉模式下显示顶栏的菜单按钮', type: 'boolean', default: 'true' },
  { name: 'v-model:collapsed', desc: '侧栏是否收起', type: 'boolean', default: 'false' },
  { name: 'v-model:drawer', desc: '窄屏抽屉是否打开', type: 'boolean', default: 'false' },
]

const apiSlots = [
  { name: 'default', desc: '内容区' },
  { name: 'brand', desc: '品牌区, side 模式在侧栏顶部, top / mix 模式在顶栏' },
  { name: 'nav', desc: '自定义导航内容, 传了就不再渲染 nav 数据' },
  { name: 'header-left', desc: '顶栏左侧, 排在品牌与导航之后' },
  { name: 'header-right', desc: '顶栏右侧的操作区' },
  { name: 'side-footer', desc: '侧栏底部, 与内置的收起按钮同排' },
  { name: 'footer', desc: '内容区下方的页脚' },
]

const apiEvents = [
  { name: 'update:collapsed', desc: '侧栏收起状态变化', type: 'boolean' },
  { name: 'update:drawer', desc: '抽屉开关状态变化', type: 'boolean' },
  { name: 'select', desc: '点中某个导航项', type: 'NyNavItem' },
]
</script>

<template>
  <DocPage title="Layout 布局" desc="side / top / mix / blank 四种内置外壳">

    <DemoBlock
      title="side 模式"
      desc="导航常驻左侧, 点分组里的父项可以展开子导航, 点导航项会更新选中值。"
      :code="codeSide"
      :value="activeValue"
      backdrop="muted"
    >
      <div class="ex-preview">
        <NyLayout
          :nav="navGroups"
          :active-key="activeKey"
          :breakpoint="inlineBreakpoint"
          :sidebar-width="220"
          @select="onNavSelect"
        >
          <template #brand>
            <span>Nyana Admin</span>
          </template>

          <template #header-right>
            <NyButton size="sm" variant="ghost">通知</NyButton>
          </template>

          <NyStack :gap="12">
            <div class="ex-box">内容区: 当前选中 {{ activeKey }}</div>
            <div class="ex-box">换个导航项, 上面的值会跟着变</div>
          </NyStack>
        </NyLayout>
      </div>

      <p class="ex-note">预览里把 breakpoint 设为 0, 窄屏下也不会切到抽屉。</p>
    </DemoBlock>

    <DemoBlock
      title="top 模式"
      desc="导航横向排在顶栏里, 不占用内容宽度。"
      :code="codeTop"
      backdrop="muted"
    >
      <div class="ex-preview">
        <NyLayout
          mode="top"
          :nav="navGroups"
          :active-key="activeKey"
          :breakpoint="inlineBreakpoint"
          @select="onNavSelect"
        >
          <template #brand>
            <span>Nyana Admin</span>
          </template>

          <template #header-right>
            <NyButton size="sm" variant="ghost" icon="user">账号</NyButton>
          </template>

          <div class="ex-box">内容区: 顶栏只有一层</div>
        </NyLayout>
      </div>
    </DemoBlock>

    <DemoBlock
      title="mix 模式"
      desc="顶栏通栏, 导航放在顶栏下方的侧栏里; 页脚与内容宽度跟随 contentMax。"
      :code="codeMix"
      :value="contentMaxValue"
      backdrop="muted"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton
            v-for="option in maxOptions"
            :key="option"
            size="sm"
            :variant="contentMax === option ? 'primary' : 'ghost'"
            @click="contentMax = option"
          >
            {{ option }}
          </NyButton>
        </div>

        <div class="ex-preview">
          <NyLayout
            mode="mix"
            :nav="navGroups"
            :active-key="activeKey"
            :content-max="contentMax"
            :breakpoint="inlineBreakpoint"
            @select="onNavSelect"
          >
            <template #brand>
              <span>Nyana Admin</span>
            </template>

            <div class="ex-box">内容区: 内容宽度 {{ contentMax }}</div>

            <template #footer>Nyana UI · 内容宽度 {{ contentMax }}</template>
          </NyLayout>
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="blank 模式"
      desc="没有顶栏与侧栏, 内容区撑满整个外壳, 版面完全交给页面自己。"
      :code="codeBlank"
      backdrop="muted"
    >
      <div class="ex-preview">
        <NyLayout mode="blank" content-max="sm">
          <NyStack :gap="12" align="center">
            <div class="ex-box">登录卡片</div>
            <div class="ex-box">表单放在这里</div>
          </NyStack>
        </NyLayout>
      </div>
    </DemoBlock>

    <DemoBlock
      title="侧栏收起"
      desc="用 v-model:collapsed 双向绑定, 收起后只留图标, 点图标会自动展开。"
      :code="codeCollapsed"
      :value="collapsedValue"
      backdrop="muted"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton size="sm" variant="primary" @click="collapsed = !collapsed">
            {{ collapsed ? '展开侧栏' : '收起侧栏' }}
          </NyButton>
        </div>

        <div class="ex-preview">
          <NyLayout
            v-model:collapsed="collapsed"
            :nav="navGroups"
            :active-key="activeKey"
            :breakpoint="inlineBreakpoint"
            :sidebar-width="220"
            @select="onNavSelect"
          >
            <template #brand>
              <span>Nyana Admin</span>
            </template>

            <div class="ex-box">侧栏底部的箭头按钮也能收起侧栏</div>
          </NyLayout>
        </div>
      </NyStack>
    </DemoBlock>

    <DemoBlock
      title="窄屏抽屉"
      desc="把 breakpoint 调到 4000 强制走抽屉分支, 侧栏脱离文档流滑出, 顶栏出现菜单按钮。"
      :code="codeDrawer"
      :value="drawerValue"
      backdrop="muted"
    >
      <NyStack :gap="14">
        <div class="ex-group">
          <NyButton size="sm" variant="primary" icon="menu" @click="drawerOpen = true">
            打开抽屉
          </NyButton>

          <NyButton size="sm" variant="ghost" @click="drawerOpen = false">关闭抽屉</NyButton>
        </div>

        <div class="ex-preview">
          <NyLayout
            v-model:drawer="drawerOpen"
            :nav="navGroups"
            :active-key="activeKey"
            :breakpoint="4000"
            :sidebar-width="220"
            @select="onNavSelect"
          >
            <template #brand>
              <span>Nyana Admin</span>
            </template>

            <div class="ex-box">顶栏左侧的菜单按钮也能打开抽屉</div>
          </NyLayout>
        </div>

        <p class="ex-note">抽屉与遮罩是 fixed 定位, 打开后会盖住整页, 点遮罩或点导航项即关闭。</p>
      </NyStack>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyLayout Props" :rows="apiProps" />
      <ApiTable title="NyLayout 插槽" kind="slots" :rows="apiSlots" />
      <ApiTable title="NyLayout 事件" kind="events" :rows="apiEvents" />
    </template>
  </DocPage>
</template>
