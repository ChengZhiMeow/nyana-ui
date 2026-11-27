<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import type { Component } from 'vue'

import NyContainer from '../container/NyContainer.vue'
import NyIcon from '../icon/NyIcon.vue'

import { useBelow, useMediaQuery } from '../../composables/useMediaQuery'
import type { NyLayoutMode, NyNavGroup, NyNavItem } from '../../types'

const collapsed = defineModel<boolean>('collapsed', { default: false })
const drawer = defineModel<boolean>('drawer', { default: false })

const props = withDefaults(
  defineProps<{
    mode?: NyLayoutMode
    nav?: NyNavGroup[]
    linkComponent?: string | Component
    activeKey?: string
    sidebarWidth?: number
    collapsedWidth?: number
    headerHeight?: number
    stickyHeader?: boolean
    fill?: boolean
    contentMax?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    contentPadding?: boolean
    breakpoint?: number
    showMenuButton?: boolean
  }>(),
  {
    mode: 'side',
    nav: () => [],
    linkComponent: 'a',
    activeKey: '',
    sidebarWidth: 240,
    collapsedWidth: 64,
    headerHeight: 56,
    stickyHeader: true,
    fill: true,
    contentMax: 'full',
    contentPadding: true,
    breakpoint: 641,
    showMenuButton: true,
  },
)

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
  (event: 'update:drawer', value: boolean): void
  (event: 'select', item: NyNavItem): void
}>()

const slots = useSlots()

const isPlainLink = computed(() => props.linkComponent === 'a')

const hasNav = computed(() => props.nav.length > 0 || !!slots.nav)

const narrow = useBelow(() => props.breakpoint)

// 顶部导航在窄屏上放不下, 和侧栏布局一样收进抽屉
const hasSidebar = computed(
  () => (props.mode === 'side' || props.mode === 'mix' || (props.mode === 'top' && narrow.value)) && hasNav.value,
)

const headerBrand = computed(() => props.mode === 'top' || props.mode === 'mix')

const drawerEnabled = computed(() => hasSidebar.value && narrow.value)

const tablet = useMediaQuery(() => '(min-width: 641px) and (max-width: 900px)')

// 平板宽度 (641–900px) 自动收成图标栏, 不改写 collapsed; 点开父级菜单时临时展开
const autoRail = computed(() => tablet.value && !drawerEnabled.value)

const railPeek = ref(false)

const railed = computed(() => !drawerEnabled.value && (collapsed.value || (autoRail.value && !railPeek.value)))

watch(autoRail, () => {
  railPeek.value = false
})

const layoutStyle = computed(() => ({
  '--ny-layout-side-width': `${railed.value ? props.collapsedWidth : props.sidebarWidth}px`,
  '--ny-layout-header-height': `${props.headerHeight}px`,
}))

const expandedKeys = ref<string[]>([])

function itemKey(item: NyNavItem): string {
  return String(item.key ?? item.href ?? item.to ?? item.label)
}

function isActive(item: NyNavItem): boolean {
  if (typeof item.active === 'boolean') {
    return item.active
  }

  return !!props.activeKey && itemKey(item) === props.activeKey
}

function hasChildren(item: NyNavItem): boolean {
  return !!item.children?.length
}

function isExpanded(item: NyNavItem): boolean {
  return expandedKeys.value.includes(itemKey(item))
}

function toggleChildren(item: NyNavItem) {
  if (railed.value) {
    collapsed.value = false
    railPeek.value = autoRail.value
    expandedKeys.value = [...expandedKeys.value, itemKey(item)]

    return
  }

  const key = itemKey(item)
  const next = expandedKeys.value.filter((item_) => item_ !== key)

  if (!isExpanded(item)) {
    next.push(key)
  }

  expandedKeys.value = next
}

function linkProps(item: NyNavItem): Record<string, unknown> {
  return isPlainLink.value ? { href: item.href } : { to: item.to }
}

function onSelect(item: NyNavItem, event: MouseEvent) {
  if (item.disabled) {
    event.preventDefault()

    return
  }

  emit('select', item)

  railPeek.value = false

  if (drawerEnabled.value) {
    drawer.value = false
  }
}

function toggleCollapse() {
  if (autoRail.value) {
    railPeek.value = !railPeek.value

    return
  }

  collapsed.value = !collapsed.value
}

function closeDrawer() {
  drawer.value = false
}

</script>

<template>
  <div
    class="ny-layout"
    :class="[
      `ny-layout--${mode}`,
      {
        'ny-layout--fill': fill,
        'is-collapsed': railed,
        'is-drawer': drawerEnabled,
        'is-open': drawer,
      },
    ]"
    :style="layoutStyle"
  >
    <header
      v-if="mode !== 'blank'"
      class="ny-layout__header"
      :class="{ 'is-sticky': stickyHeader }"
    >
      <button
        v-if="showMenuButton && drawerEnabled"
        class="ny-layout__icon-btn"
        type="button"
        title="打开菜单"
        aria-label="打开菜单"
        @click="drawer = true"
      >
        <NyIcon name="menu" :size="18" />
      </button>

      <div v-if="headerBrand" class="ny-layout__brand-inline">
        <slot name="brand" />
      </div>

      <nav v-if="mode === 'top' && nav.length && !drawerEnabled" class="ny-layout__topnav">
        <template v-for="(group, index) in nav" :key="index">
          <component
            :is="linkComponent"
            v-for="item in group.items"
            :key="itemKey(item)"
            class="ny-layout__toplink"
            :class="{ 'is-active': isActive(item), 'is-disabled': item.disabled }"
            v-bind="linkProps(item)"
            @click="onSelect(item, $event)"
          >
            <NyIcon v-if="item.icon" :name="item.icon" :size="16" />
            <span class="ny-truncate">{{ item.label }}</span>
            <span v-if="item.badge !== undefined" class="ny-layout__badge">{{ item.badge }}</span>
          </component>
        </template>
      </nav>

      <div v-if="$slots['header-left']" class="ny-layout__header-left">
        <slot name="header-left" />
      </div>

      <span class="ny-layout__spacer" />

      <div v-if="$slots['header-right']" class="ny-layout__header-right">
        <slot name="header-right" />
      </div>
    </header>

    <aside v-if="hasSidebar" class="ny-layout__side">
      <div v-if="mode === 'side'" class="ny-layout__brand">
        <slot name="brand" />
      </div>

      <nav class="ny-layout__nav">
        <slot name="nav">
          <div v-for="(group, index) in nav" :key="index" class="ny-layout__nav-group">
            <p v-if="group.title && !railed" class="ny-layout__group">{{ group.title }}</p>

            <template v-for="item in group.items" :key="itemKey(item)">
              <button
                v-if="hasChildren(item)"
                class="ny-layout__link ny-layout__link--parent"
                :class="{ 'is-expanded': isExpanded(item), 'is-disabled': item.disabled }"
                type="button"
                :title="railed ? item.label : undefined"
                :aria-label="railed ? item.label : undefined"
                :aria-expanded="isExpanded(item)"
                :disabled="item.disabled"
                @click="toggleChildren(item)"
              >
                <NyIcon v-if="item.icon" :name="item.icon" :size="18" />
                <span v-if="!railed" class="ny-truncate">{{ item.label }}</span>

                <NyIcon
                  v-if="!railed"
                  class="ny-layout__caret"
                  name="chevron-down"
                  :size="14"
                />
              </button>

              <component
                :is="linkComponent"
                v-else
                class="ny-layout__link"
                :class="{ 'is-active': isActive(item), 'is-disabled': item.disabled }"
                :title="railed ? item.label : undefined"
                :aria-label="railed ? item.label : undefined"
                v-bind="linkProps(item)"
                @click="onSelect(item, $event)"
              >
                <NyIcon v-if="item.icon" :name="item.icon" :size="18" />
                <span v-if="!railed" class="ny-truncate">{{ item.label }}</span>
                <span v-if="item.badge !== undefined && !railed" class="ny-layout__badge">
                  {{ item.badge }}
                </span>
              </component>

              <div v-if="hasChildren(item) && isExpanded(item) && !railed" class="ny-layout__sub">
                <component
                  :is="linkComponent"
                  v-for="child in item.children"
                  :key="itemKey(child)"
                  class="ny-layout__link ny-layout__link--child"
                  :class="{ 'is-active': isActive(child), 'is-disabled': child.disabled }"
                  v-bind="linkProps(child)"
                  @click="onSelect(child, $event)"
                >
                  <span class="ny-layout__dot" />
                  <span class="ny-truncate">{{ child.label }}</span>
                </component>
              </div>
            </template>
          </div>
        </slot>
      </nav>

      <div v-if="$slots['side-footer'] || !drawerEnabled" class="ny-layout__side-foot">
        <slot name="side-footer" />

        <button
          v-if="!drawerEnabled"
          class="ny-layout__icon-btn ny-layout__collapse"
          type="button"
          :title="railed ? '展开侧栏' : '收起侧栏'"
          :aria-label="railed ? '展开侧栏' : '收起侧栏'"
          @click="toggleCollapse"
        >
          <NyIcon :name="railed ? 'chevron-right' : 'chevron-left'" :size="16" />
        </button>
      </div>
    </aside>

    <div
      v-if="drawerEnabled"
      class="ny-layout__overlay"
      :class="{ 'is-open': drawer }"
      @click="closeDrawer"
    />

    <main class="ny-layout__main">
      <div class="ny-layout__content" :class="{ 'is-padded': contentPadding }">
        <NyContainer :max="contentMax">
          <slot />
        </NyContainer>
      </div>

      <footer v-if="$slots.footer" class="ny-layout__footer">
        <NyContainer :max="contentMax">
          <slot name="footer" />
        </NyContainer>
      </footer>
    </main>
  </div>
</template>
