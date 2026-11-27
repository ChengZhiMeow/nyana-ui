<script setup lang="ts">
import { computed, ref } from 'vue'

import { NyButton, NyIcon } from '@chengzhimeow/nyana-ui'

const props = withDefaults(
  defineProps<{
    title: string
    desc?: string
    code?: string
    value?: string
    backdrop?: 'plain' | 'muted'
  }>(),
  {
    desc: '',
    code: '',
    value: undefined,
    backdrop: 'plain',
  },
)

const open = ref(false)
const copied = ref(false)

const hasCode = computed(() => props.code.trim().length > 0)

async function copy() {
  if (!hasCode.value || !navigator.clipboard) {
    return
  }

  await navigator.clipboard.writeText(props.code)
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <section class="demo">
    <header class="demo__head">
      <h3 class="demo__title">{{ title }}</h3>
      <p v-if="desc" class="demo__desc">{{ desc }}</p>
    </header>

    <div class="demo__body" :class="`demo__body--${backdrop}`">
      <slot />
    </div>

    <p v-if="value !== undefined" class="demo__value">{{ value }}</p>

    <footer v-if="hasCode" class="demo__foot">
      <div class="demo__actions">
        <NyButton size="sm" variant="text" @click="copy">
          <template #icon>
            <NyIcon :name="copied ? 'check' : 'copy'" :size="14" />
          </template>
          {{ copied ? '已复制' : '复制代码' }}
        </NyButton>

        <NyButton size="sm" variant="text" @click="open = !open">
          <template #icon>
            <NyIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="14" />
          </template>
          {{ open ? '收起代码' : '查看代码' }}
        </NyButton>
      </div>

      <pre v-if="open" class="demo__code"><code>{{ code }}</code></pre>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.demo {
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
  box-shadow: var(--ny-shadow-xs);
  overflow: hidden;
  transition: box-shadow var(--ny-transition-base);
}

.demo:hover {
  box-shadow: var(--ny-shadow-sm);
}

.demo__head {
  padding: 16px 18px 0;
}

.demo__title {
  margin: 0;
  font-size: var(--ny-font-size-md);
  font-weight: 600;
  color: var(--ny-text-strong);
}

.demo__desc {
  margin-top: 4px;
  font-size: var(--ny-font-size-sm);
  color: var(--ny-text-muted);
}

.demo__body {
  padding: 20px 18px;
}

.demo__body > * + * {
  margin-top: 14px;
}

.demo__body--muted {
  background: var(--ny-surface-2);
}

.demo__value {
  margin: 0 18px 14px;
  padding: 7px 12px;
  border-radius: var(--ny-radius-xs);
  background: var(--ny-surface-3);
  color: var(--ny-text-sub);
  font-family: var(--ny-font-family-mono);
  font-size: var(--ny-font-size-xs);
  word-break: break-all;
}

.demo__foot {
  border-top: 1px dashed var(--ny-border);
  padding: 10px 12px;
}

.demo__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.demo__code {
  margin: 10px 0 0;
  padding: 14px;
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface-3);
  color: var(--ny-text);
  font-family: var(--ny-font-family-mono);
  font-size: var(--ny-font-size-xs);
  line-height: 1.75;
  overflow-x: auto;
  white-space: pre;
}
</style>
