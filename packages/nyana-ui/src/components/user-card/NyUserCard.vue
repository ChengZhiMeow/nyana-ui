<script setup lang="ts">
import { computed } from 'vue'

import NyAvatar from '../avatar/NyAvatar.vue'
import NyDropdown from '../dropdown/NyDropdown.vue'

import type { NySize, NyTrigger } from '../../types'

export interface NyUserCardItem {
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
