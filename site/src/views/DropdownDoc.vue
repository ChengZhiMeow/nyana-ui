<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyDropdown, NyIcon, NySpace } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const basicItems = [
  { key: 'profile', label: '个人中心', icon: 'user', shortcut: 'P' },
  { key: 'orders', label: '我的订单', icon: 'list' },
  { key: 'setting', label: '账号设置', icon: 'sliders', shortcut: 'S' },
  { divider: true, label: '' },
  { key: 'help', label: '帮助文档', icon: 'book' },
  { key: 'logout', label: '退出登录', icon: 'logout' },
]

const iconItems = [
  { key: 'edit', label: '编辑资料', icon: 'edit', shortcut: 'E' },
  { key: 'copy', label: '复制链接', icon: 'link', shortcut: 'Ctrl+C' },
  { key: 'share', label: '分享', icon: 'external-link', shortcut: 'Ctrl+S' },
  { divider: true, label: '' },
  { key: 'export', label: '导出数据', icon: 'download' },
  { key: 'import', label: '导入数据', icon: 'upload', disabled: true },
]

const viewItems = [
  { key: 'overview', label: '概览视图' },
  { key: 'list', label: '列表视图' },
  { key: 'chart', label: '图表视图' },
]

const dangerItems = [
  { key: 'archive', label: '归档项目', icon: 'inbox' },
  { key: 'transfer', label: '转移负责人', icon: 'user' },
  { divider: true, label: '' },
  { key: 'delete', label: '删除项目', icon: 'trash', danger: true },
]

const hoverPick = ref('还没有选择')
const clickPick = ref('还没有选择')
const menuPick = ref('还没有选择')
const dangerPick = ref('还没有选择')
const bottomPick = ref('还没有选择')

const clickOpen = ref(false)
const bottomOpen = ref(false)

const viewKey = ref('overview')

const viewLabel = computed(() => viewItems.find((item) => item.key === viewKey.value)?.label ?? '未选择')

function onHoverSelect(payload: { key: string }) {
  hoverPick.value = payload.key
}

function onClickSelect(payload: { key: string }) {
  clickPick.value = payload.key
}

function onMenuSelect(payload: { key: string }) {
  menuPick.value = payload.key
}

function onViewSelect(payload: { key: string }) {
  viewKey.value = payload.key
}

function onDangerSelect(payload: { key: string }) {
  dangerPick.value = payload.key
}

function onBottomSelect(payload: { key: string }) {
  bottomPick.value = payload.key
}

const codeHover = `<NyDropdown :items="items" @select="onSelect">
  <NyButton>
    <template #icon>
      <NyIcon name="user" :size="16" />
    </template>
    账户
  </NyButton>
</NyDropdown>`

const codeClick = `<NyDropdown v-model:open="open" trigger="click" :items="items" @select="onSelect">
  <NyButton>点击展开</NyButton>
</NyDropdown>`

const codeMenu = `const items = [
  { key: 'edit', label: '编辑资料', icon: 'edit', shortcut: 'E' },
  { key: 'import', label: '导入数据', icon: 'upload', disabled: true },
  { divider: true, label: '' },
  { key: 'export', label: '导出数据', icon: 'download' },
]

<NyDropdown :items="items" :max-height="200" @select="onSelect">
  <NyButton>更多操作</NyButton>
</NyDropdown>`

const codeSelected = `const selected = ref(['overview'])

<NyDropdown :items="items" :selected-keys="selected" @select="onSelect">
  <NyButton>{{ 当前视图 }}</NyButton>
</NyDropdown>`

const codeDanger = `const items = [
  { key: 'archive', label: '归档项目', icon: 'inbox' },
  { divider: true, label: '' },
  { key: 'delete', label: '删除项目', icon: 'trash', danger: true },
]

<NyDropdown :items="items" @select="onSelect">
  <NyButton>项目操作</NyButton>
</NyDropdown>

<!-- 整组禁用: 触发器不响应点击与键盘 -->
<NyDropdown disabled :items="items">
  <NyButton disabled>不可用</NyButton>
</NyDropdown>`

const codeBottom = `<NyDropdown
  v-model:open="open"
  trigger="click"
  placement="bottom-end"
  :items="items"
  :close-on-select="false"
  @select="onSelect"
>
  <NyButton>连续操作</NyButton>

  <!-- 面板底部插槽: 放统计或说明, 不参与选中 -->
  <template #panel-bottom>选择后菜单保持展开</template>
</NyDropdown>`

const apiProps = [
  { name: 'items', desc: '菜单数据, 每项支持 label / key / icon / shortcut / disabled / danger / divider', type: 'NyDropdownItem[]', default: '[]' },
  { name: 'trigger', desc: '展开方式, hover 移出后延迟收起', type: "'hover' | 'click' | 'focus' | 'manual'", default: "'hover'" },
  { name: 'placement', desc: '浮层相对触发器的位置', type: 'NyPlacement', default: "'bottom-start'" },
  { name: 'disabled', desc: '整组禁用, 触发器不响应点击与键盘', type: 'boolean', default: 'false' },
  { name: 'selectedKeys', desc: '选中项的 key 集合, 命中后加 check 图标', type: '(string | number)[]', default: '[]' },
  { name: 'closeOnSelect', desc: '点击菜单项后是否自动收起', type: 'boolean', default: 'true' },
  { name: 'maxHeight', desc: '菜单区最大高度, 超出后内部滚动', type: 'number', default: '280' },
  { name: 'v-model:open', desc: '浮层展开状态, 双向绑定', type: 'boolean', default: 'false' },
]

const apiEvents = [
  { name: 'select', desc: '点击菜单项触发, 禁用项不触发', type: '{ key: string; item: NyDropdownItem }' },
]

const apiSlots = [
  { name: 'default', desc: '触发器内容, 键盘焦点与展开状态挂在它外层', type: '—' },
  { name: 'panel-bottom', desc: '面板底部区域, 放说明或统计, 不参与选中', type: '—' },
]
</script>

<template>
  <DocPage title="Dropdown 下拉菜单" desc="悬浮或点击展开的操作菜单">

    <DemoBlock
      title="点击展开"
      desc="trigger 设为 click: 点触发器就展开, 再点一次或选中某项后收起; 菜单项支持图标, 快捷键, 禁用与危险色。"
      :code="codeClick"
      :value="`展开状态: ${clickOpen ? '已展开' : '已收起'} · 最近选择: ${clickPick}`"
    >
      <NySpace>
        <NyDropdown v-model:open="clickOpen" trigger="click" :items="basicItems" @select="onClickSelect">
          <NyButton size="sm" variant="primary">
            <template #icon>
              <NyIcon name="more-horizontal" :size="15" />
            </template>
            点我展开
          </NyButton>
        </NyDropdown>

        <NyDropdown trigger="click" :items="iconItems" :max-height="200" @select="onMenuSelect">
          <NyButton size="sm" variant="ghost">
            <template #icon>
              <NyIcon name="sliders" :size="15" />
            </template>
            带图标与快捷键
          </NyButton>
        </NyDropdown>
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="悬浮触发"
      desc="trigger 默认是 hover: 移入触发器展开, 移出 120ms 后收起。注意这种模式下点触发器不会有反应, 需要点击响应就把 trigger 换成 click。"
      :code="codeHover"
      :value="`最近选择: ${hoverPick}`"
    >
      <NyDropdown :items="basicItems" trigger="hover" @select="onHoverSelect">
        <NyButton size="sm" variant="ghost">
          <template #icon>
            <NyIcon name="user" :size="16" />
          </template>
          悬浮我
        </NyButton>
      </NyDropdown>
    </DemoBlock>

    <DemoBlock
      title="选中态"
      desc="selectedKeys 命中当前项后加 check 图标, 选中值由使用方自己维护。"
      :code="codeSelected"
      :value="`当前视图: ${viewLabel}`"
    >
      <NyDropdown :items="viewItems" :selected-keys="[viewKey]" @select="onViewSelect">
        <NyButton size="sm" variant="ghost">
          <template #icon>
            <NyIcon name="eye" :size="16" />
          </template>
          {{ viewLabel }}
        </NyButton>
      </NyDropdown>
    </DemoBlock>

    <DemoBlock
      title="危险项与禁用状态"
      desc="danger 用危险色标记不可逆操作, disabled 可以加在单项上, 也可以禁用整组。"
      :code="codeDanger"
      :value="`最近选择: ${dangerPick}`"
    >
      <NySpace>
        <NyDropdown :items="dangerItems" @select="onDangerSelect">
          <NyButton size="sm" variant="ghost">项目操作</NyButton>
        </NyDropdown>

        <NyDropdown disabled :items="basicItems">
          <NyButton size="sm" disabled>整组禁用</NyButton>
        </NyDropdown>
      </NySpace>
    </DemoBlock>

    <DemoBlock
      title="受控展开与底部插槽"
      desc="placement 换到右下对齐, closeOnSelect 关掉后可以连续点, 底部插槽放补充说明。"
      :code="codeBottom"
      :value="`展开状态: ${bottomOpen ? '已展开' : '已收起'} · 最近选择: ${bottomPick}`"
    >
      <NyDropdown
        v-model:open="bottomOpen"
        trigger="click"
        placement="bottom-end"
        :items="basicItems"
        :close-on-select="false"
        @select="onBottomSelect"
      >
        <NyButton size="sm">连续操作</NyButton>

        <template #panel-bottom>选择后菜单保持展开</template>
      </NyDropdown>
    </DemoBlock>

    <template #api>
      <NySpace direction="vertical" align="start" size="lg" block>
        <ApiTable title="NyDropdown Props" :rows="apiProps" />
        <ApiTable title="NyDropdown 事件" kind="events" :rows="apiEvents" />
        <ApiTable title="NyDropdown 插槽" kind="slots" :rows="apiSlots" />
      </NySpace>
    </template>
  </DocPage>
</template>
