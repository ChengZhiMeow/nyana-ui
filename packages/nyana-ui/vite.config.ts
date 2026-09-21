import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'NyanaUI',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: 'style.css',
      },
    },
  },
})
