<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'

import NyTreeNode from './NyTreeNode.vue'
import { nyTreeContextKey, type NyTreeNodeData } from './treeContext'

const props = withDefaults(
  defineProps<{
    data: NyTreeNodeData[]
    checkable?: boolean
    selectable?: boolean
    multiple?: boolean
    showLine?: boolean
    showIcon?: boolean
    defaultExpandAll?: boolean
    defaultExpandLevel?: number
    emptyText?: string
    expandOnClick?: boolean
  }>(),
  {
    checkable: false,
    selectable: true,
    multiple: false,
    showLine: false,
    showIcon: false,
    defaultExpandAll: false,
    emptyText: '暂无数据',
    expandOnClick: false,
  },
)

const emit = defineEmits<{
  (event: 'expand', payload: { keys: string[]; node: unknown; expanded: boolean }): void
  (event: 'check', payload: { keys: string[]; node: unknown; checked: boolean }): void
  (event: 'select', payload: { keys: string[]; node: unknown }): void
}>()

const expandedKeys = defineModel<string[]>('expandedKeys', { default: () => [] })
const checkedKeys = defineModel<string[]>('checkedKeys', { default: () => [] })
const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] })

const rootRef = ref<HTMLElement | null>(null)
const focusKey = ref('')

const expandedSet = computed(() => new Set(expandedKeys.value))
const checkedSet = computed(() => new Set(checkedKeys.value))
const selectedSet = computed(() => new Set(selectedKeys.value))

function walkNodes(
  nodes: NyTreeNodeData[],
  visit: (node: NyTreeNodeData, parent: NyTreeNodeData | null, level: number) => void,
  parent: NyTreeNodeData | null = null,
  level = 0,
) {
  nodes.forEach((node) => {
    visit(node, parent, level)

    if (node.children?.length) {
      walkNodes(node.children, visit, node, level + 1)
    }
  })
}

const parentMap = computed(() => {
  const map = new Map<string, NyTreeNodeData>()

  walkNodes(props.data, (node, parent) => {
    if (parent) {
      map.set(node.key, parent)
    }
  })

  return map
})

function checkableKeysOf(node: NyTreeNodeData) {
  const keys: string[] = []

  if (!node.disabled) {
    keys.push(node.key)
  }

  node.children?.forEach((child) => keys.push(...checkableKeysOf(child)))

  return keys
}

function defaultExpandedKeys() {
  const keys: string[] = []

  if (!props.defaultExpandAll && props.defaultExpandLevel === undefined) {
    return keys
  }

  walkNodes(props.data, (node, parent, level) => {
    if (!node.children?.length) {
      return
    }

    if (props.defaultExpandAll || level < (props.defaultExpandLevel ?? 0)) {
      keys.push(node.key)
    }
  })

  return keys
}

function firstEnabledKey() {
  let key = ''

  walkNodes(props.data, (node) => {
    if (!key && !node.disabled) {
      key = node.key
    }
  })

  return key
}

watch(
  () => props.data,
  () => {
    const defaults = defaultExpandedKeys()

    if (defaults.length) {
      expandedKeys.value = Array.from(new Set([...expandedKeys.value, ...defaults]))
    }

    if (!focusKey.value) {
      focusKey.value = firstEnabledKey()
    }
  },
  { immediate: true },
)

function isExpanded(key: string) {
  return expandedSet.value.has(key)
}

function isSelected(key: string) {
  return selectedSet.value.has(key)
}

function toggleExpand(node: NyTreeNodeData) {
  if (!node.children?.length) {
    return
  }

  const next = [...expandedKeys.value]
  const index = next.indexOf(node.key)
  const expanded = index < 0

  if (expanded) {
    next.push(node.key)
  } else {
    next.splice(index, 1)
  }

  expandedKeys.value = next
  emit('expand', { keys: next, node, expanded })
}

function toggleCheck(node: NyTreeNodeData) {
  if (!props.checkable || node.disabled) {
    return
  }

  const next = new Set(checkedKeys.value)
  const checked = !next.has(node.key)

  checkableKeysOf(node).forEach((key) => (checked ? next.add(key) : next.delete(key)))

  let parent = parentMap.value.get(node.key)

  while (parent) {
    const siblings = checkableKeysOf(parent)

    if (checked && siblings.every((key) => next.has(key))) {
      next.add(parent.key)
    } else {
      next.delete(parent.key)
    }

    parent = parentMap.value.get(parent.key)
  }

  const keys = Array.from(next)

  checkedKeys.value = keys
  emit('check', { keys, node, checked })
}

function selectNode(node: NyTreeNodeData) {
  if (!props.selectable || node.disabled) {
    return
  }

  const current = selectedKeys.value
  const next = props.multiple
    ? current.includes(node.key)
      ? current.filter((key) => key !== node.key)
      : [...current, node.key]
    : [node.key]

  selectedKeys.value = next
  emit('select', { keys: next, node })
}

function checkedState(node: NyTreeNodeData) {
  const keys = checkableKeysOf(node)
  const hit = keys.filter((key) => checkedSet.value.has(key)).length

  return {
    checked: keys.length > 0 && hit === keys.length,
    indeterminate: hit > 0 && hit < keys.length,
  }
}

provide(nyTreeContextKey, {
  root: rootRef,
  expandedKeys,
  checkedKeys,
  selectedKeys,
  focusKey,
  checkable: () => props.checkable,
  selectable: () => props.selectable,
  multiple: () => props.multiple,
  showIcon: () => props.showIcon,
  expandOnClick: () => props.expandOnClick,
  isExpanded,
  isSelected,
  checkedState,
  toggleExpand,
  toggleCheck,
  selectNode,
})
</script>

<template>
  <ul
    ref="rootRef"
    class="ny-tree"
    :class="{ 'ny-tree--line': showLine }"
    role="tree"
    :aria-multiselectable="multiple || undefined"
  >
    <NyTreeNode
      v-for="(node, index) in data"
      :key="node.key"
      :node="node"
      :level="0"
      :is-last="index === data.length - 1"
    />

    <li v-if="data.length === 0" class="ny-tree__empty">{{ emptyText }}</li>
  </ul>
</template>

<style scoped lang="scss">
.ny-tree {
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--ny-text);
  font-size: var(--ny-font-size-md);
}

.ny-tree__empty {
  padding: var(--ny-space-4) var(--ny-space-3);
  list-style: none;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
  text-align: center;
}
</style>
