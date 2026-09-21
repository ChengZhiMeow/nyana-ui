import { reactive } from 'vue'

import type { NyLayoutMode } from '@chengzhimeow/nyana-ui'

export const shell = reactive({
  mode: 'side' as NyLayoutMode,
  collapsed: false,
  breakpoint: 1024,
})

export function setShellMode(mode: NyLayoutMode) {
  shell.mode = mode
}

export const layoutModes: { label: string; value: NyLayoutMode; desc: string; icon: string }[] = [
  { label: '侧栏', value: 'side', desc: '顶栏在内容区上方, 导航常驻左侧', icon: 'sidebar' },
  { label: '顶栏', value: 'top', desc: '导航横向排在顶栏, 不占内容宽度', icon: 'panel-top' },
  { label: '混合', value: 'mix', desc: '顶栏通栏, 导航放在顶栏下方的侧栏', icon: 'columns' },
  { label: '纯净', value: 'blank', desc: '没有顶栏与侧栏, 由页面自己排版', icon: 'grid' },
]
