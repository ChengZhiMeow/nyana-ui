import type { Theme } from 'vitepress'

import NyanaUI from '@chengzhimeow/nyana-ui'

import Layout from './Layout.vue'

import '@/styles/example.scss'

// 自定义主题: 不用 VitePress 默认主题的样式, 外壳完全由 Nyana UI 自己的组件搭
const theme: Theme = {
  Layout,
  enhanceApp({ app }) {
    app.use(NyanaUI)
  },
}

export default theme
