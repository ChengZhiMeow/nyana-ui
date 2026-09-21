import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/nyana-ui/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@chengzhimeow/nyana-ui': fileURLToPath(new URL('../packages/nyana-ui/src/index.ts', import.meta.url)),
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 5273,
    watch: {
      usePolling: true,
      interval: 300,
      ignored: ['**/*.tmp', '**/*.tmpdir/**', '**/.*.tmpdir/**'],
    },
  },
})
