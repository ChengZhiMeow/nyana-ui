<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    title?: string
    desc?: string
    size?: NySize
    image?: 'default' | 'simple'
    icon?: string
  }>(),
  {
    title: '暂无数据',
    desc: '',
    size: 'md',
    image: 'default',
    icon: '',
  },
)

const iconSize = computed(() => (props.size === 'sm' ? 20 : props.size === 'lg' ? 30 : 24))

const fallbackIcon = computed(() => props.icon || (props.image === 'simple' ? 'file' : 'inbox'))
</script>

<template>
  <div class="ny-empty" :class="`ny-empty--${size}`">
    <div class="ny-empty__image">
      <slot name="image">
        <span class="ny-empty__icon">
          <NyIcon :name="fallbackIcon" :size="iconSize" />
        </span>
      </slot>
    </div>

    <p v-if="title" class="ny-empty__title">{{ title }}</p>
    <p v-if="desc" class="ny-empty__desc">{{ desc }}</p>

    <div v-if="$slots.default" class="ny-empty__actions">
      <slot />
    </div>
  </div>
</template>
