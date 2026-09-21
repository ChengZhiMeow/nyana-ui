<script setup lang="ts">
import { computed, type Component } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import type { NySize } from '../../types'

interface NyBreadcrumbItem {
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

const iconSize = computed(() => (props.size === 'sm' ? 13 : props.size === 'lg' ? 17 : 15))

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

<style scoped lang="scss">
.ny-breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ny-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--ny-font-size-md);
}

.ny-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: var(--ny-space-2);
  min-width: 0;
}

.ny-breadcrumb__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 2px 0;
  border: 0;
  border-radius: var(--ny-radius-xs);
  background: transparent;
  color: var(--ny-text-sub);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--ny-transition-fast);

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &:hover:not(.is-plain) {
    color: var(--ny-primary-text);
  }

  &.is-plain,
  &.is-current {
    cursor: default;
  }

  &.is-current {
    color: var(--ny-text-strong);
    font-weight: 600;
  }
}

.ny-breadcrumb__label {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ny-breadcrumb__sep {
  display: inline-flex;
  align-items: center;
  color: var(--ny-text-muted);
  user-select: none;
}

.ny-breadcrumb--sm .ny-breadcrumb__list {
  font-size: var(--ny-font-size-sm);
}

.ny-breadcrumb--lg .ny-breadcrumb__list {
  font-size: var(--ny-font-size-lg);
}
</style>
