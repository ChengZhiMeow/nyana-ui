import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitepress'

// 文档站: 组件文档与场景演示都是 Vue 组件 (example/src/views), Markdown 页面只负责挂载它们
export default defineConfig({
  lang: 'zh-CN',
  title: 'Nyana UI',
  description: '喵の服务器的 Vue 3 组件库',
  // GitHub Pages 部署在 /nyana-ui/ 下, 产物输出到 example/dist
  base: process.env.GITHUB_ACTIONS ? '/nyana-ui/' : '/',
  outDir: 'dist',
  cleanUrls: true,
  srcExclude: ['src/**', 'README.md'],
  head: [['meta', { name: 'theme-color', content: '#0894d8' }]],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../src', import.meta.url)),
        '@chengzhimeow/nyana-ui': fileURLToPath(new URL('../../packages/nyana-ui/src/index.ts', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
    },
  },
})
