<script setup lang="ts">
import { computed } from 'vue'

export interface ApiRow {
  name: string
  desc: string
  type?: string
  default?: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    rows: ApiRow[]
    kind?: 'props' | 'events' | 'slots' | 'methods'
    compact?: boolean
  }>(),
  {
    title: '',
    kind: 'props',
    compact: false,
  },
)

const typeLabel = computed(() => {
  if (props.kind === 'events') {
    return '参数'
  }

  if (props.kind === 'methods') {
    return '返回值'
  }

  return '类型'
})

const hasDefault = computed(() => props.kind === 'props' && !props.compact)
</script>

<template>
  <div class="api">
    <h3 v-if="title" class="api__title">{{ title }}</h3>

    <div class="api__wrap">
      <table class="api__table">
        <thead>
          <tr>
            <th class="api__col-name">名称</th>
            <th>说明</th>
            <th v-if="!compact" class="api__col-type">{{ typeLabel }}</th>
            <th v-if="hasDefault" class="api__col-default">默认值</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in rows" :key="row.name">
            <td class="api__name">{{ row.name }}</td>
            <td>{{ row.desc }}</td>
            <td v-if="!compact" class="api__type">{{ row.type ?? '—' }}</td>
            <td v-if="hasDefault" class="api__type">{{ row.default ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.api {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.api__title {
  margin: 0;
  font-size: var(--ny-font-size-md);
  font-weight: 600;
  color: var(--ny-text-strong);
}

.api__wrap {
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
  overflow-x: auto;
}

.api__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ny-font-size-sm);

  th,
  td {
    padding: 11px 14px;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid var(--ny-border-soft);
  }

  th {
    background: var(--ny-surface-2);
    color: var(--ny-text-sub);
    font-weight: 600;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background: var(--ny-surface-2);
  }
}

.api__col-name {
  width: 20%;
}

.api__col-type {
  width: 26%;
}

.api__col-default {
  width: 12%;
}

.api__name {
  color: var(--ny-text-strong);
  font-weight: 600;
  font-family: var(--ny-font-family-mono);
  font-size: var(--ny-font-size-xs);
}

.api__type {
  color: var(--ny-primary-text);
  font-family: var(--ny-font-family-mono);
  font-size: var(--ny-font-size-xs);
  word-break: break-word;
}
</style>
