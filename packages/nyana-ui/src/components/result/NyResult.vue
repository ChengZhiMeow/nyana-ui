<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    status?: 'success' | 'error' | 'warning' | 'info' | '404' | '403'
    title?: string
    desc?: string
    size?: NySize
  }>(),
  {
    status: 'info',
    title: '',
    desc: '',
    size: 'md',
  },
)

const ART_SIZES: Record<NySize, number> = { sm: 52, md: 64, lg: 72 }

const STATUS_ICONS: Record<string, string> = {
  success: 'check',
  error: 'close',
  warning: 'alert',
  info: 'info',
  '403': 'lock',
}

const classes = computed(() => [`ny-result--${props.status}`, `ny-result--${props.size}`])

const artSize = computed(() => ART_SIZES[props.size])

const artStyle = computed(() => ({ width: `${artSize.value}px`, height: `${artSize.value}px` }))

const iconName = computed(() => STATUS_ICONS[props.status] || '')

const iconSize = computed(() => Math.round(artSize.value * 0.47))

const role = computed(() => (props.status === 'error' ? 'alert' : 'status'))
</script>

<template>
  <div class="ny-result" :class="classes" :role="role">
    <div class="ny-result__art-wrap">
      <slot name="icon">
        <span class="ny-result__icon" :style="artStyle" aria-hidden="true">
          <NyIcon v-if="iconName" :name="iconName" :size="iconSize" />
          <span v-else class="ny-result__code">{{ status }}</span>
        </span>
      </slot>
    </div>

    <h3 v-if="title || $slots.title" class="ny-result__title">
      <slot name="title">{{ title }}</slot>
    </h3>

    <p v-if="desc || $slots.desc" class="ny-result__desc">
      <slot name="desc">{{ desc }}</slot>
    </p>

    <div v-if="$slots.default" class="ny-result__actions">
      <slot />
    </div>
  </div>
</template>
