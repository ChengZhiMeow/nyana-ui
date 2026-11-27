<script setup lang="ts">
import { NyPlayerHead } from '@chengzhimeow/nyana-ui'

import ApiTable from '@/components/ApiTable.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import DocPage from '@/components/DocPage.vue'

const players = [
  ['Steve', 32],
  ['Alex', 41],
  ['橙汁喵', 18],
  ['小鱼干', 26],
  ['Notch', 88],
] as const

const code = `<NyPlayerHead name="Steve" :src="headUrl(uuid)" />
<!-- 没有 src 或加载失败时, 按名字画一张 8×8 像素脸 -->
<NyPlayerHead name="橙汁喵" :size="32" />`
</script>

<template>
  <DocPage title="PlayerHead 玩家头像" desc="玩家名字前的皮肤头像。头像地址由使用方提供 (例如后端按 UUID 从正版皮肤裁出脸 + 帽子层并缓存); 离线玩家或加载失败时按名字生成像素占位。">
    <DemoBlock title="尺寸" desc="像素放大不模糊, 圆角随尺寸变化。" :code="code">
      <div class="ex-group">
        <NyPlayerHead name="Steve" :size="16" />
        <NyPlayerHead name="Steve" />
        <NyPlayerHead name="Steve" :size="32" />
        <NyPlayerHead name="Steve" :size="48" />
      </div>
    </DemoBlock>

    <DemoBlock title="在线名单" desc="头像 + 名字 + 延迟, 行之间细线分隔。">
      <div class="ex-players">
        <div v-for="[name, ping] in players" :key="name" class="ex-players__row">
          <NyPlayerHead :name="name" />
          <span>{{ name }}</span>
          <span class="ex-players__ping">{{ ping }} ms</span>
        </div>
      </div>
    </DemoBlock>

    <template #api>
      <ApiTable
        :rows="[
          { name: 'name', type: 'string', desc: '玩家名, 也用来生成占位头像' },
          { name: 'src', type: 'string', desc: '头像地址; 没有或加载失败时用像素占位' },
          { name: 'size', type: 'number', default: '20', desc: '边长 (px)' },
        ]"
      />
    </template>
  </DocPage>
</template>

<style scoped lang="scss">
.ex-players {
  max-width: 320px;
}

.ex-players__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-top: 1px solid var(--ny-line);
  font-size: 13px;

  &:first-child {
    border-top: 0;
  }
}

.ex-players__ping {
  margin-left: auto;
  color: var(--ny-text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
