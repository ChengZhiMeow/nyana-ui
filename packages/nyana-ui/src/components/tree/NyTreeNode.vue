<script setup lang="ts">
import { computed, inject, ref } from 'vue'

import NyCheckbox from '../checkbox/NyCheckbox.vue'
import NyIcon from '../icon/NyIcon.vue'

import { nyTreeContextKey, type NyTreeContext, type NyTreeNodeData } from './treeContext'

const props = defineProps<{
  node: NyTreeNodeData
  level: number
  isLast: boolean
}>()

const injected = inject(nyTreeContextKey, null)

if (!injected) {
  throw new Error('[nyana-ui] NyTreeNode 需要放在 NyTree 内部使用')
}

const ctx: NyTreeContext = injected

const rowRef = ref<HTMLElement | null>(null)

const hasChildren = computed(() => Boolean(props.node.children?.length))
const isExpanded = computed(() => ctx.isExpanded(props.node.key))
const isSelected = computed(() => ctx.isSelected(props.node.key))
const checkState = computed(() => ctx.checkedState(props.node))
const children = computed(() => (isExpanded.value ? (props.node.children ?? []) : []))
const tabindex = computed(() => (ctx.focusKey.value === props.node.key ? 0 : -1))

function rows() {
  const root = ctx.root.value

  return root ? Array.from(root.querySelectorAll<HTMLElement>('.ny-tree__row')) : []
}

function focusWithKey(element: HTMLElement | null | undefined, key: string) {
  if (!element) {
    return
  }

  ctx.focusKey.value = key
  element.focus()
}

function moveRow(step: 1 | -1) {
  const list = rows()
  const index = rowRef.value ? list.indexOf(rowRef.value) : -1
  const target = index < 0 ? undefined : list[index + step]

  focusWithKey(target, target?.dataset.key ?? '')
}

function focusChild() {
  const child = rowRef.value?.parentElement?.querySelector<HTMLElement>('.ny-tree__children .ny-tree__row')

  focusWithKey(child, child?.dataset.key ?? '')
}

function focusParent() {
  const parentNode = rowRef.value?.closest('.ny-tree__node')?.parentElement?.closest('.ny-tree__node')
  const row = parentNode?.querySelector<HTMLElement>('.ny-tree__row')

  focusWithKey(row, row?.dataset.key ?? '')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    moveRow(event.key === 'ArrowDown' ? 1 : -1)
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()

    if (hasChildren.value && !isExpanded.value) {
      ctx.toggleExpand(props.node)
      return
    }

    focusChild()
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()

    if (hasChildren.value && isExpanded.value) {
      ctx.toggleExpand(props.node)
      return
    }

    focusParent()
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    ctx.selectNode(props.node)
    return
  }

  if (event.key === ' ') {
    event.preventDefault()

    if (ctx.checkable()) {
      ctx.toggleCheck(props.node)
      return
    }

    ctx.selectNode(props.node)
  }
}

function onRowClick() {
  if (props.node.disabled) {
    return
  }

  if (ctx.expandOnClick() && hasChildren.value) {
    ctx.toggleExpand(props.node)
  }

  ctx.selectNode(props.node)
}
</script>

<template>
  <li
    class="ny-tree__node"
    :class="{
      'ny-tree__node--root': level === 0,
      'is-last': isLast,
      'is-expanded': isExpanded,
      'is-selected': isSelected,
      'is-disabled': node.disabled,
    }"
    role="none"
  >
    <div
      ref="rowRef"
      class="ny-tree__row"
      :class="{ 'is-selected': isSelected, 'is-disabled': node.disabled }"
      :data-key="node.key"
      role="treeitem"
      :tabindex="tabindex"
      :aria-level="level + 1"
      :aria-expanded="hasChildren ? isExpanded : undefined"
      :aria-selected="ctx.selectable() ? isSelected : undefined"
      :aria-checked="ctx.checkable() ? checkState.checked : undefined"
      :aria-disabled="node.disabled || undefined"
      @click="onRowClick"
      @keydown="onKeydown"
      @focus="ctx.focusKey.value = node.key"
    >
      <button
        v-if="hasChildren"
        class="ny-tree__switcher"
        type="button"
        :aria-label="isExpanded ? '收起' : '展开'"
        @click.stop="ctx.toggleExpand(node)"
      >
        <NyIcon class="ny-tree__arrow" name="chevron-right" :size="16" />
      </button>

      <span v-else class="ny-tree__switcher ny-tree__switcher--empty" aria-hidden="true" />

      <NyCheckbox
        v-if="ctx.checkable()"
        class="ny-tree__check"
        size="sm"
        :checked="checkState.checked"
        :indeterminate="checkState.indeterminate"
        :disabled="node.disabled"
        @click.stop
        @change="ctx.toggleCheck(node)"
      />

      <NyIcon v-if="ctx.showIcon() && node.icon" class="ny-tree__icon" :name="node.icon" :size="16" />

      <span class="ny-tree__title">{{ node.title }}</span>
    </div>

    <ul v-if="children.length" class="ny-tree__children" role="group">
      <NyTreeNode
        v-for="(child, index) in children"
        :key="child.key"
        :node="child"
        :level="level + 1"
        :is-last="index === children.length - 1"
      />
    </ul>
  </li>
</template>
