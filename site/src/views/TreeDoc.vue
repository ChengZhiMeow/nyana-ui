<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyTree } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

interface TreeNode {
  key: string
  title: string
  icon?: string
  disabled?: boolean
  children?: TreeNode[]
}

const treeData: TreeNode[] = [
  {
    key: 'src',
    title: 'src',
    icon: 'folder',
    children: [
      {
        key: 'components',
        title: 'components',
        icon: 'folder',
        children: [
          { key: 'button', title: 'NyButton.vue', icon: 'file' },
          { key: 'select', title: 'NySelect.vue', icon: 'file' },
        ],
      },
      {
        key: 'styles',
        title: 'styles',
        icon: 'folder',
        children: [{ key: 'variables', title: 'variables.scss', icon: 'file' }],
      },
      { key: 'main', title: 'main.ts', icon: 'file' },
    ],
  },
  {
    key: 'docs',
    title: 'docs',
    icon: 'folder',
    children: [
      { key: 'guide', title: '开发规范.md', icon: 'file' },
      { key: 'contract', title: '组件实现约定.md', icon: 'file' },
    ],
  },
]

const permissionTree: TreeNode[] = [
  {
    key: 'dashboard',
    title: '仪表盘',
    children: [
      { key: 'dashboard-view', title: '查看' },
      { key: 'dashboard-edit', title: '编辑' },
    ],
  },
  {
    key: 'order',
    title: '订单',
    children: [
      { key: 'order-view', title: '查看' },
      { key: 'order-edit', title: '编辑' },
      { key: 'order-delete', title: '删除', disabled: true },
    ],
  },
  {
    key: 'system',
    title: '系统设置',
    disabled: true,
    children: [{ key: 'system-user', title: '用户管理' }],
  },
]

function collectKeys(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) => [
    ...(node.disabled ? [] : [node.key]),
    ...collectKeys(node.children ?? []),
  ])
}

const allPermissionKeys = collectKeys(permissionTree)

function list(keys: string[]) {
  return keys.length ? keys.join(', ') : '无'
}

const expandedKeys = ref<string[]>(['src'])
const selectedKeys = ref<string[]>([])

const basicText = computed(() => `展开: ${list(expandedKeys.value)} | 选中: ${list(selectedKeys.value)}`)

const allExpanded = ref<string[]>([])
const levelExpanded = ref<string[]>([])

const defaultText = computed(
  () => `default-expand-all: 展开 ${allExpanded.value.length} 项 | default-expand-level=1: 展开 ${levelExpanded.value.length} 项`,
)

const lineExpanded = ref<string[]>(['src', 'components'])
const lineText = computed(() => `展开: ${list(lineExpanded.value)}`)

const checkedKeys = ref<string[]>(['dashboard', 'dashboard-view', 'dashboard-edit'])
const checkedText = computed(() => `勾选: ${list(checkedKeys.value)}`)

function checkAll() {
  checkedKeys.value = [...allPermissionKeys]
}

const multiSelected = ref<string[]>(['button'])
const multiText = computed(() => `已选 ${multiSelected.value.length} 项: ${list(multiSelected.value)}`)

const fileData = ref<TreeNode[]>(treeData)

function toggleData() {
  fileData.value = fileData.value.length ? [] : treeData
}

const codeBasic = `<NyTree
  v-model:expandedKeys="expandedKeys"
  v-model:selectedKeys="selectedKeys"
  :data="treeData"
  show-icon
/>`

const codeDefault = `<!-- 全部展开: defaultExpandAll -->
<NyTree v-model:expandedKeys="allExpanded" :data="treeData" default-expand-all show-icon />

<!-- 只展开第一层: defaultExpandLevel -->
<NyTree v-model:expandedKeys="levelExpanded" :data="treeData" :default-expand-level="1" show-icon />`

const codeLine = `<NyTree
  v-model:expandedKeys="lineExpanded"
  :data="treeData"
  show-line
  show-icon
/>`

const codeCheck = `<NyTree
  v-model:checkedKeys="checkedKeys"
  :data="permissionTree"
  checkable
  default-expand-all
/>

<NyButton size="sm" @click="checkAll()">全选</NyButton>
<NyButton size="sm" @click="checkedKeys = []">清空</NyButton>`

const codeSelect = `<NyTree
  v-model:selectedKeys="multiSelected"
  :data="treeData"
  multiple
  expand-on-click
  default-expand-all
  show-icon
/>`

const codeEmpty = `<NyButton size="sm" @click="toggleData">切换有无数据</NyButton>

<NyTree :data="fileData" empty-text="这个项目还没有文件" show-icon :default-expand-all="true" />`

const apiProps = [
  { name: 'data', desc: '树形数据, 节点的字段见下一张表, children 递归同构', type: 'TreeNode[]', default: '—' },
  { name: 'checkable', desc: '每个节点前面加复选框, 父子联动', type: 'boolean', default: 'false' },
  { name: 'selectable', desc: '节点可选中', type: 'boolean', default: 'true' },
  { name: 'multiple', desc: '选中多选, 关闭时选中项始终只有一个', type: 'boolean', default: 'false' },
  { name: 'showLine', desc: '层级之间画连接线', type: 'boolean', default: 'false' },
  { name: 'showIcon', desc: '显示节点自带的 icon', type: 'boolean', default: 'false' },
  { name: 'defaultExpandAll', desc: '初始展开全部有子节点的节点', type: 'boolean', default: 'false' },
  { name: 'defaultExpandLevel', desc: '初始展开前 N 层, 层级从 1 开始数, 与 defaultExpandAll 同时给出时以后者为准', type: 'number', default: '—' },
  { name: 'emptyText', desc: 'data 为空时的文案', type: 'string', default: "'暂无数据'" },
  { name: 'expandOnClick', desc: '点击节点标题时展开 / 收起, 同时照旧选中', type: 'boolean', default: 'false' },
  { name: 'v-model:expandedKeys', desc: '展开的节点 key 列表', type: 'string[]', default: '[]' },
  { name: 'v-model:checkedKeys', desc: '勾选的节点 key 列表, 只包含参与联动的节点', type: 'string[]', default: '[]' },
  { name: 'v-model:selectedKeys', desc: '选中的节点 key 列表', type: 'string[]', default: '[]' },
]

const apiEvents = [
  { name: 'expand', desc: '展开或收起某个节点后触发', type: "{ keys: string[]; node: unknown; expanded: boolean }" },
  { name: 'check', desc: '勾选或取消勾选后触发, keys 是联动之后的完整列表', type: "{ keys: string[]; node: unknown; checked: boolean }" },
  { name: 'select', desc: '选中或取消选中节点后触发', type: "{ keys: string[]; node: unknown }" },
]

const apiNode = [
  { name: 'key', desc: '唯一标识, 展开 / 勾选 / 选中的模型里存的就是它', type: 'string' },
  { name: 'title', desc: '节点文字', type: 'string' },
  { name: 'icon', desc: '节点左侧的 NyIcon 图标名, 需要开 showIcon', type: 'string' },
  { name: 'disabled', desc: '禁用节点不可选也不可勾, 不参与父子联动', type: 'boolean' },
  { name: 'children', desc: '子节点数组, 结构与父节点相同, 递归下去', type: 'TreeNode[]' },
]
</script>

<template>
  <DocPage title="Tree 树形控件" desc="层级数据的展开, 勾选与选中">

    <DemoBlock
      title="基础用法"
      desc="data 是层级数据, 展开与选中都通过 v-model 回传; 点箭头只展开, 点标题只选中, 两者互不干扰。"
      :code="codeBasic"
      :value="basicText"
    >
      <div class="ex-panel">
        <NyTree
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          :data="treeData"
          show-icon
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="默认展开"
      desc="defaultExpandAll 铺开整棵树, defaultExpandLevel 按层数展开, 示例里的 1 表示只展开根层; 数据换成新数组时规则重新生效。"
      :code="codeDefault"
      :value="defaultText"
    >
      <div class="ex-grid ex-grid--2">
        <div class="ex-panel">
          <p class="ex-note">default-expand-all</p>
          <NyTree v-model:expandedKeys="allExpanded" :data="treeData" default-expand-all show-icon />
        </div>

        <div class="ex-panel">
          <p class="ex-note">:default-expand-level="1"</p>
          <NyTree v-model:expandedKeys="levelExpanded" :data="treeData" :default-expand-level="1" show-icon />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="连接线与图标"
      desc="showLine 给层级之间补上连接线, showIcon 显示节点自带的 icon, 目录与文件一眼分得清。"
      :code="codeLine"
      :value="lineText"
    >
      <div class="ex-panel">
        <NyTree
          v-model:expandedKeys="lineExpanded"
          :data="treeData"
          show-line
          show-icon
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="可勾选"
      desc="checkable 打开父子联动: 勾父带子, 子全选父选中, 部分选中父级半选; 禁用节点自己不参与联动, 但它的子节点仍可单独勾选。"
      :code="codeCheck"
      :value="checkedText"
    >
      <div class="ex-group">
        <NyButton size="sm" @click="checkAll">全选</NyButton>
        <NyButton size="sm" @click="checkedKeys = []">清空</NyButton>
      </div>

      <div class="ex-panel">
        <NyTree
          v-model:checkedKeys="checkedKeys"
          :data="permissionTree"
          checkable
          default-expand-all
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="多选与点击展开"
      desc="multiple 允许选中多个节点; expandOnClick 让点击标题顺带展开 / 收起, 选中行为保持不变。"
      :code="codeSelect"
      :value="multiText"
    >
      <div class="ex-panel">
        <NyTree
          v-model:selectedKeys="multiSelected"
          :data="treeData"
          multiple
          expand-on-click
          default-expand-all
          show-icon
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="数据变化与空数据"
      desc="data 换成空数组时展示 emptyText, 换回有数据的数组时默认展开规则重新生效。"
      :code="codeEmpty"
      :value="`数据条数: ${fileData.length}`"
    >
      <div class="ex-group">
        <NyButton size="sm" @click="toggleData">切换有无数据</NyButton>
      </div>

      <div class="ex-panel">
        <NyTree :data="fileData" empty-text="这个项目还没有文件" show-icon :default-expand-all="true" />
      </div>

      <p class="ex-note">节点可以键盘操作: 上下移动, 右键展开, 左键收起, 回车选中, 空格勾选。</p>
    </DemoBlock>

    <template #api>
      <ApiTable title="NyTree Props" :rows="apiProps" />
      <ApiTable title="NyTree 事件" kind="events" :rows="apiEvents" />
      <ApiTable title="TreeNode 节点字段" :rows="apiNode" />
    </template>
  </DocPage>
</template>
