import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// ES 模块按源码目录输出 (preserveModules), 使用方的打包工具可以按需摇树;
// 全部样式合成一个 dist/style.css, 按需样式由 scripts/build-styles.mjs 单独编译
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
    },
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      external: ['vue'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: 'style.css',
      },
    },
  },
})
