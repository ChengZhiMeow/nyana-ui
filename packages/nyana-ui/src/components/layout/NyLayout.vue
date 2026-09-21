<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import type { Component } from 'vue'

import NyContainer from './NyContainer.vue'
import NyIcon from '../basic/NyIcon.vue'

import { useBelow } from '../../composables/useMediaQuery'
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
    sidebarWidth: 248,
    collapsedWidth: 64,
    headerHeight: 62,
    stickyHeader: true,
    fill: true,
    contentMax: 'full',
    contentPadding: true,
    breakpoint: 1024,
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

const hasSidebar = computed(
  () => (props.mode === 'side' || props.mode === 'mix') && hasNav.value,
)

const headerBrand = computed(() => props.mode === 'top' || props.mode === 'mix')

const narrow = useBelow(() => props.breakpoint)

const drawerEnabled = computed(() => hasSidebar.value && narrow.value)

const layoutStyle = computed(() => ({
  '--ny-layout-side-width': `${collapsed.value ? props.collapsedWidth : props.sidebarWidth}px`,
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
  if (collapsed.value) {
    collapsed.value = false
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

  if (drawerEnabled.value) {
    drawer.value = false
  }
}

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

function closeDrawer() {
  drawer.value = false
}

const navRef = ref<HTMLElement | null>(null)

const MOVE_MS = 320

const indicator = ref({ x: 0, y: 0, height: 16, ready: false, moving: false })

let moveTimer: ReturnType<typeof setTimeout> | null = null
let navObserver: ResizeObserver | null = null

function measureIndicator() {
  const navEl = navRef.value
  const activeEl = navEl?.querySelector<HTMLElement>('.ny-layout__link.is-active') ?? null

  if (!navEl || !activeEl) {
    indicator.value = { ...indicator.value, ready: false }

    return
  }

  const navRect = navEl.getBoundingClientRect()
  const activeRect = activeEl.getBoundingClientRect()

  if (!navRect.height || !activeRect.height) {
    indicator.value = { ...indicator.value, ready: false }

    return
  }

  const height = Math.max(14, Math.min(24, activeRect.height - 14))

  indicator.value = {
    x: activeRect.left - navRect.left,
    y: activeRect.top - navRect.top + navEl.scrollTop + (activeRect.height - height) / 2,
    height,
    ready: true,
    moving: indicator.value.moving,
  }
}

function startMove() {
  if (moveTimer !== null) {
    clearTimeout(moveTimer)
  }

  indicator.value = { ...indicator.value, moving: true }
  moveTimer = setTimeout(() => {
    moveTimer = null
    indicator.value = { ...indicator.value, moving: false }
  }, MOVE_MS)
}

const activeNavKey = computed(() => {
  const hits: string[] = []

  for (const group of props.nav) {
    for (const item of group.items) {
      if (isActive(item)) {
        hits.push(itemKey(item))
      }

      for (const child of item.children ?? []) {
        if (isActive(child)) {
          hits.push(`${itemKey(item)}/${itemKey(child)}`)
        }
      }
    }
  }

  return hits.join('|')
})

watch(activeNavKey, async () => {
  startMove()
  await nextTick()
  measureIndicator()
})

watch([collapsed, expandedKeys, drawer, () => props.nav.length], async () => {
  await nextTick()
  measureIndicator()
})

onMounted(() => {
  measureIndicator()

  if (navRef.value && typeof ResizeObserver !== 'undefined') {
    navObserver = new ResizeObserver(() => measureIndicator())
    navObserver.observe(navRef.value)
  }

  window.addEventListener('resize', measureIndicator)
})

onBeforeUnmount(() => {
  if (moveTimer !== null) {
    clearTimeout(moveTimer)
  }

  navObserver?.disconnect()
  navObserver = null
  window.removeEventListener('resize', measureIndicator)
})
</script>

<template>
  <div
    class="ny-layout"
    :class="[
      `ny-layout--${mode}`,
      {
        'ny-layout--fill': fill,
        'is-collapsed': collapsed,
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
        @click="drawer = true"
      >
        <NyIcon name="menu" :size="18" />
      </button>

      <div v-if="headerBrand" class="ny-layout__brand-inline">
        <slot name="brand" />
      </div>

      <nav v-if="mode === 'top' && nav.length" class="ny-layout__topnav">
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
            <span>{{ item.label }}</span>
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

      <nav ref="navRef" class="ny-layout__nav">
        <span
          v-show="indicator.ready"
          class="ny-layout__indicator"
          :class="{ 'is-moving': indicator.moving }"
          :style="{
            '--ny-indicator-x': `${indicator.x}px`,
            '--ny-indicator-y': `${indicator.y}px`,
            height: `${indicator.height}px`,
          }"
          aria-hidden="true"
        />

        <slot name="nav">
          <template v-for="(group, index) in nav" :key="index">
            <p v-if="group.title && !collapsed" class="ny-layout__group">{{ group.title }}</p>

            <template v-for="item in group.items" :key="itemKey(item)">
              <button
                v-if="hasChildren(item)"
                class="ny-layout__link ny-layout__link--parent"
                :class="{ 'is-expanded': isExpanded(item), 'is-disabled': item.disabled }"
                type="button"
                :title="collapsed ? item.label : undefined"
                :aria-expanded="isExpanded(item)"
                :disabled="item.disabled"
                @click="toggleChildren(item)"
              >
                <NyIcon v-if="item.icon" :name="item.icon" :size="17" />
                <span v-if="!collapsed" class="ny-truncate">{{ item.label }}</span>

                <NyIcon
                  v-if="!collapsed"
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
                :title="collapsed ? item.label : undefined"
                v-bind="linkProps(item)"
                @click="onSelect(item, $event)"
              >
                <NyIcon v-if="item.icon" :name="item.icon" :size="17" />
                <span v-if="!collapsed" class="ny-truncate">{{ item.label }}</span>
                <span v-if="item.badge !== undefined && !collapsed" class="ny-layout__badge">
                  {{ item.badge }}
                </span>
              </component>

              <div v-if="hasChildren(item) && isExpanded(item) && !collapsed" class="ny-layout__sub">
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
          </template>
        </slot>
      </nav>

      <div v-if="$slots['side-footer'] || !drawerEnabled" class="ny-layout__side-foot">
        <slot name="side-footer" />

        <button
          v-if="!drawerEnabled"
          class="ny-layout__icon-btn ny-layout__collapse"
          type="button"
          :title="collapsed ? '展开侧栏' : '收起侧栏'"
          @click="toggleCollapse"
        >
          <NyIcon :name="collapsed ? 'chevron-right' : 'chevron-left'" :size="15" />
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

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.ny-layout {
  display: grid;
  grid-template-columns: var(--ny-layout-side-width) minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr);
  grid-template-areas:
    'side header'
    'side main';
  min-width: 0;
  background: var(--ny-bg);
  color: var(--ny-text);
  font-family: var(--ny-font-family);
  font-size: var(--ny-font-size-md);
  line-height: 1.65;
}

.ny-layout--fill {
  height: 100%;
  min-height: 0;
}

.ny-layout--mix {
  grid-template-areas:
    'header header'
    'side main';
}

.ny-layout--top {
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'header'
    'main';
}

.ny-layout--blank {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  grid-template-areas: 'main';
}

.ny-layout.is-drawer.ny-layout--side,
.ny-layout.is-drawer.ny-layout--mix {
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'header'
    'main';
}

.ny-layout__header {
  grid-area: header;
  z-index: $z-header;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  min-height: var(--ny-layout-header-height);
  padding: 6px 22px;
  border-bottom: 1px solid var(--ny-border);
  background: var(--ny-surface);
}

.ny-layout__header.is-sticky {
  position: sticky;
  top: 0;
}

.ny-layout__spacer {
  flex: 1;
  min-width: 0;
}

.ny-layout__header-left,
.ny-layout__header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: none;
}

.ny-layout__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  height: var(--ny-layout-header-height);
  padding: 0 16px;
  flex: none;
  border-bottom: 1px solid var(--ny-border);
  font-size: var(--ny-font-size-sm);
  font-weight: 600;
  color: var(--ny-text-strong);
  overflow: hidden;
}

.ny-layout__brand-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font-weight: 600;
  color: var(--ny-text-strong);
}

.ny-layout__side {
  grid-area: side;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--ny-border);
  background: var(--ny-surface);
  transition: width var(--ny-transition-base);
}

.ny-layout__nav {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 12px;

  margin-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: var(--ny-radius-pill);
    background: var(--ny-border-strong);
  }
}

.ny-layout__indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-primary);
  pointer-events: none;
  transform: translate(var(--ny-indicator-x, 0), var(--ny-indicator-y, 0));
  transition:
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    height 320ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity var(--ny-transition-fast);
}

.ny-layout__indicator.is-moving {
  transform: translate(var(--ny-indicator-x, 0), var(--ny-indicator-y, 0)) scaleY(1.4);
}

.ny-layout__group {
  margin: 0;
  padding: 14px 10px 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--ny-text-muted);
  text-transform: uppercase;
}

.ny-layout__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  border-radius: var(--ny-radius-sm);
  background: transparent;
  color: var(--ny-text-sub);
  font-family: inherit;
  font-size: var(--ny-font-size-md);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover {
    background: var(--ny-surface-2);
    color: var(--ny-text);
  }

  &.is-active {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
    font-weight: 600;
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ny-layout__link--parent .ny-layout__caret {
  margin-left: auto;
  transition: transform var(--ny-transition-fast);
}

.ny-layout__link--parent.is-expanded .ny-layout__caret {
  transform: rotate(180deg);
}

.ny-layout__sub {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 2px 0 4px;
}

.ny-layout__link--child {
  padding: 7px 12px 7px 30px;
  font-size: var(--ny-font-size-sm);
}

.ny-layout__dot {
  position: absolute;
  left: 18px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.45;
}

.is-collapsed .ny-layout__link {
  justify-content: center;
  gap: 0;
  padding: 9px 0;
}

.ny-layout__topnav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 0 1 auto;
  min-width: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex: none;
  }
}

.ny-layout__toplink {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--ny-radius-pill);
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-md);
  text-decoration: none;
  transition: all var(--ny-transition-fast);

  &:hover {
    background: var(--ny-surface-3);
    color: var(--ny-text);
  }

  &.is-active {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
    font-weight: 600;
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ny-layout__badge {
  margin-left: auto;
  padding: 0 6px;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-primary-soft);
  color: var(--ny-primary-text);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.7;
}

.ny-layout__toplink .ny-layout__badge {
  margin-left: 0;
}

.ny-layout__side-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  padding: 10px 12px;
  border-top: 1px solid var(--ny-border);
}

.ny-layout__collapse {
  margin-left: auto;
}

.ny-layout__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: none;
  padding: 0;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-sm);
  background: transparent;
  color: var(--ny-text-muted);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover {
    border-color: var(--ny-primary);
    color: var(--ny-primary-text);
    background: var(--ny-primary-soft);
  }
}

.ny-layout__main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.ny-layout--fill .ny-layout__main {
  overflow: auto;
}

.ny-layout__content {
  flex: 1;
  min-width: 0;
}

.ny-layout__content.is-padded {
  padding: 22px 0;
}

.ny-layout__footer {
  flex: none;
  padding: 18px 0;
  border-top: 1px solid var(--ny-border);
  background: var(--ny-surface);
  font-size: var(--ny-font-size-sm);
  color: var(--ny-text-muted);
}

.ny-layout.is-drawer .ny-layout__side {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $z-sidebar;
  width: var(--ny-layout-side-width);
  transform: translateX(-100%);
  transition: transform var(--ny-transition-base);
  box-shadow: var(--ny-shadow-lg);
}

.ny-layout.is-drawer.is-open .ny-layout__side {
  transform: translateX(0);
}

.ny-layout__overlay {
  position: fixed;
  inset: 0;
  z-index: $z-header;
  display: none;
  background: var(--ny-mask);
}

.ny-layout__overlay.is-open {
  display: block;
}

@media (max-width: $breakpoint-md) {
  .ny-layout__header {
    gap: 10px;
    padding: 0 14px;
  }

  .ny-layout__content.is-padded {
    padding: 16px 0;
  }
}
</style>
