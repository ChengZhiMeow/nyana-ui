<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { NyButton, NyEmpty } from '@chengzhimeow/nyana-ui'

import { docEntries, entryPath } from '@/docs/registry'

const first = docEntries[0]!
</script>

<template>
  <div class="not-found">
    <NyEmpty title="页面还没写" desc="这个组件已经登记在 registry.ts, 但对应的文档页文件还不存在">
      <RouterLink :to="entryPath(first)">
        <NyButton variant="primary">去看 {{ first.title }}</NyButton>
      </RouterLink>
    </NyEmpty>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
}
</style>
