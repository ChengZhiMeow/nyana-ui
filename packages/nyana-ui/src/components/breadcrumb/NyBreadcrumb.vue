<script setup lang="ts">
import { computed, type Component } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NySize } from '../../types'

export interface NyBreadcrumbItem {
  label: string
  to?: unknown
  href?: string
  icon?: string
  clickable?: boolean
}

const props = withDefaults(
  defineProps<{
    items: NyBreadcrumbItem[]
    separator?: string
    separatorIcon?: string
    linkComponent?: string | Component
    size?: NySize
  }>(),
  {
    items: () => [],
    separator: '/',
    separatorIcon: '',
    linkComponent: 'a',
    size: 'md',
  },
)

const emit = defineEmits<{
  (event: 'select', payload: { item: NyBreadcrumbItem; index: number }): void
}>()

const isPlainLink = computed(() => props.linkComponent === 'a')

const iconSize = computed(() => (props.size === 'sm' ? 13 : props.size === 'lg' ? 16 : 14))

const classes = computed(() => [`ny-breadcrumb--${props.size}`, `ny-breadcrumb--sep-${props.separatorIcon ? 'icon' : 'text'}`])

function isCurrent(index: number): boolean {
  return index === props.items.length - 1
}

function hasLink(item: NyBreadcrumbItem): boolean {
  return isPlainLink.value ? !!item.href : !!item.to
}

function isInteractive(item: NyBreadcrumbItem, index: number): boolean {
  return !isCurrent(index) && (hasLink(item) || !!item.clickable)
}

function tagOf(item: NyBreadcrumbItem, index: number): string {
  if (!isInteractive(item, index)) {
    return 'span'
  }

  return hasLink(item) ? 'component' : 'button'
}

function linkProps(item: NyBreadcrumbItem): Record<string, unknown> {
  if (isPlainLink.value) {
    return { href: item.href ?? undefined }
  }

  return { to: item.to }
}

function onSelect(item: NyBreadcrumbItem, index: number, event: MouseEvent) {
  if (!isInteractive(item, index)) {
    return
  }

  if (!hasLink(item)) {
    event.preventDefault()
  }

  emit('select', { item, index })
}
</script>

<template>
  <nav class="ny-breadcrumb" :class="classes" aria-label="面包屑">
    <ol class="ny-breadcrumb__list">
      <li v-for="(item, index) in items" :key="index" class="ny-breadcrumb__item">
        <component
          :is="tagOf(item, index)"
          class="ny-breadcrumb__link"
          :class="{ 'is-current': isCurrent(index), 'is-plain': !isInteractive(item, index) }"
          :type="tagOf(item, index) === 'button' ? 'button' : undefined"
          :aria-current="isCurrent(index) ? 'page' : undefined"
          v-bind="hasLink(item) ? linkProps(item) : {}"
          @click="onSelect(item, index, $event)"
        >
          <NyIcon v-if="item.icon" :name="item.icon" :size="iconSize" />
          <span class="ny-breadcrumb__label">{{ item.label }}</span>
        </component>

        <span v-if="!isCurrent(index)" class="ny-breadcrumb__sep" aria-hidden="true">
          <NyIcon v-if="separatorIcon" :name="separatorIcon" :size="iconSize - 2" />
          <template v-else>{{ separator }}</template>
        </span>
      </li>
    </ol>
  </nav>
</template>
