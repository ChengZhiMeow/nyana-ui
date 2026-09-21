import type { InjectionKey, Ref } from 'vue'

export interface NyTreeNodeData {
  key: string
  title: string
  icon?: string
  disabled?: boolean
  children?: NyTreeNodeData[]
}

export interface NyTreeContext {
  root: Ref<HTMLElement | null>
  expandedKeys: Ref<string[]>
  checkedKeys: Ref<string[]>
  selectedKeys: Ref<string[]>
  focusKey: Ref<string>
  checkable: () => boolean
  selectable: () => boolean
  multiple: () => boolean
  showIcon: () => boolean
  expandOnClick: () => boolean
  isExpanded: (key: string) => boolean
  isSelected: (key: string) => boolean
  checkedState: (node: NyTreeNodeData) => { checked: boolean; indeterminate: boolean }
  toggleExpand: (node: NyTreeNodeData) => void
  toggleCheck: (node: NyTreeNodeData) => void
  selectNode: (node: NyTreeNodeData) => void
}

export const nyTreeContextKey: InjectionKey<NyTreeContext> = Symbol('ny-tree')
