<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    items: {
      title?: string
      desc?: string
      time?: string
      icon?: string
      status?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    }[]
    mode?: 'left' | 'right' | 'alternate'
    reverse?: boolean
    size?: NySize
  }>(),
  {
    mode: 'left',
    reverse: false,
    size: 'md',
  },
)

const classes = computed(() => [`ny-timeline--${props.mode}`, `ny-timeline--${props.size}`])

const list = computed(() => (props.reverse ? [...props.items].reverse() : props.items))
</script>

<template>
  <ol class="ny-timeline" :class="classes">
    <li
      v-for="(item, index) in list"
      :key="`${item.title ?? ''}-${index}`"
      class="ny-timeline__item"
      :class="[`ny-timeline__item--${item.status ?? 'default'}`, { 'is-right': index % 2 === 1 }]"
    >
      <div class="ny-timeline__rail">
        <span class="ny-timeline__dot" :class="{ 'is-icon': item.icon }">
          <NyIcon v-if="item.icon" :name="item.icon" :size="14" />
        </span>
      </div>

      <div class="ny-timeline__body">
        <p v-if="item.time" class="ny-timeline__time">{{ item.time }}</p>
        <p v-if="item.title" class="ny-timeline__title">{{ item.title }}</p>
        <p v-if="item.desc" class="ny-timeline__desc">{{ item.desc }}</p>
      </div>
    </li>
  </ol>
</template>
