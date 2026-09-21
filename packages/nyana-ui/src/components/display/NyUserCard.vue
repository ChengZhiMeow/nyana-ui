<script setup lang="ts">
import { computed } from 'vue'

import NyAvatar from './NyAvatar.vue'
import NyDropdown from '../nav/NyDropdown.vue'

import type { NySize, NyTrigger } from '../../types'

interface NyUserCardItem {
  key?: string
  label: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

const props = withDefaults(
  defineProps<{
    name: string
    avatar?: string
    desc?: string
    items?: NyUserCardItem[]
    trigger?: NyTrigger
    size?: NySize
    nameWidth?: number
  }>(),
  {
    avatar: '',
    desc: '',
    items: () => [],
    trigger: 'hover',
    size: 'md',
    nameWidth: 110,
  },
)

const emit = defineEmits<{
  (event: 'select', payload: { key: string; item: NyUserCardItem }): void
}>()

const avatarSize = computed(() => (props.size === 'sm' ? 'sm' : props.size === 'lg' ? 'lg' : 'md'))

const classes = computed(() => [`ny-user-card--${props.size}`])

const nameStyle = computed(() => ({ maxWidth: `${props.nameWidth}px` }))

function onSelect(payload: { key: string; item: NyUserCardItem }) {
  emit('select', payload)
}
</script>

<template>
  <NyDropdown
    v-if="items.length > 0"
    class="ny-user-card__dropdown"
    :trigger="trigger"
    :items="items"
    placement="bottom-end"
    @select="onSelect"
  >
    <span class="ny-user-card" :class="classes">
      <NyAvatar :src="avatar" :text="avatar ? '' : name" :size="avatarSize" />

      <span v-if="name" class="ny-user-card__name" :style="nameStyle">{{ name }}</span>
    </span>
  </NyDropdown>

  <span v-else class="ny-user-card" :class="classes">
    <NyAvatar :src="avatar" :text="avatar ? '' : name" :size="avatarSize" />

    <span v-if="name || desc" class="ny-user-card__text">
      <span class="ny-user-card__name" :style="nameStyle">{{ name }}</span>
      <span v-if="desc" class="ny-user-card__desc">{{ desc }}</span>
    </span>
  </span>
</template>

<style scoped lang="scss">
.ny-user-card {
  display: inline-flex;
  align-items: center;
  gap: var(--ny-space-2);
  padding: 3px 10px 3px 3px;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface-2);
  color: var(--ny-text);
  cursor: pointer;
  transition:
    border-color var(--ny-transition-fast),
    background var(--ny-transition-fast);

  &:hover {
    border-color: var(--ny-primary);
    background: var(--ny-primary-soft);
  }
}

.ny-user-card--sm {
  padding: 2px 8px 2px 2px;
}

.ny-user-card--lg {
  padding: 4px 14px 4px 4px;
}

.ny-user-card__text {
  display: inline-flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.ny-user-card__name {
  overflow: hidden;
  font-size: var(--ny-font-size-sm);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ny-user-card__desc {
  overflow: hidden;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
