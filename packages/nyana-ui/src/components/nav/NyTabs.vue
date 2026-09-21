<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import type { NySize } from '../../types'

interface NyTabItem {
  key: string
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    items: NyTabItem[]
    type?: 'line' | 'plain' | 'soft' | 'card' | 'segment' | 'pill'
    size?: NySize
    align?: 'start' | 'center' | 'end'
    closable?: boolean
  }>(),
  {
    items: () => [],
    type: 'line',
    size: 'md',
    align: 'start',
    closable: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string): void
  (event: 'close', payload: string): void
}>()

const activeKey = defineModel<string>('activeKey', { default: '' })

const listRef = ref<HTMLElement | null>(null)
const tabRefs = ref<HTMLElement[]>([])

const inkLeft = ref(0)
const inkWidth = ref(0)

let observer: ResizeObserver | null = null

const firstEnabledKey = computed(() => props.items.find((item) => !item.disabled)?.key ?? '')

const resolvedKey = computed(() => activeKey.value || firstEnabledKey.value)

const classes = computed(() => [
  `ny-tabs--${props.type}`,
  `ny-tabs--${props.size}`,
  `ny-tabs--align-${props.align}`,
])

const iconSize = computed(() => (props.size === 'sm' ? 15 : props.size === 'lg' ? 18 : 16))

function isActive(item: NyTabItem): boolean {
  return item.key === resolvedKey.value
}

function setTabRef(el: Element | ComponentPublicInstance | null, index: number) {
  const node = el as HTMLElement | null

  if (node) {
    tabRefs.value[index] = node
  }
}

function panelId(key: string): string {
  return `ny-tabs-panel-${key}`
}

function tabId(key: string): string {
  return `ny-tabs-tab-${key}`
}

function neighborIndex(step: 1 | -1): number {
  const count = props.items.length
  let index = props.items.findIndex((item) => item.key === resolvedKey.value)

  if (index < 0) {
    index = 0
  }

  for (let offset = 0; offset < count; offset += 1) {
    const next = (index + step * (offset + 1) + count * count) % count

    if (!props.items[next].disabled) {
      return next
    }
  }

  return index
}

function focusTab(index: number) {
  const target = props.items[index]

  if (!target || target.disabled) {
    return
  }

  activeKey.value = target.key
  emit('change', target.key)

  nextTick(() => tabRefs.value[index]?.focus())
}

function onKeydown(event: KeyboardEvent) {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']

  if (!keys.includes(event.key)) {
    return
  }

  event.preventDefault()

  if (event.key === 'Home' || event.key === 'End') {
    const step = event.key === 'Home' ? 1 : -1
    const start = event.key === 'Home' ? -1 : props.items.length

    for (let offset = 0; offset < props.items.length; offset += 1) {
      const index = start + step * (offset + 1)

      if (props.items[index] && !props.items[index].disabled) {
        focusTab(index)

        return
      }
    }

    return
  }

  focusTab(neighborIndex(event.key === 'ArrowRight' ? 1 : -1))
}

function select(item: NyTabItem) {
  if (item.disabled || item.key === resolvedKey.value) {
    return
  }

  activeKey.value = item.key
  emit('change', item.key)
}

function onClose(item: NyTabItem, event: MouseEvent) {
  event.stopPropagation()
  emit('close', item.key)
}

function measure() {
  const index = props.items.findIndex((item) => item.key === resolvedKey.value)
  const node = index < 0 ? null : tabRefs.value[index]

  if (!node) {
    inkWidth.value = 0

    return
  }

  inkLeft.value = node.offsetLeft
  inkWidth.value = node.offsetWidth
}

onMounted(() => {
  measure()

  if (typeof ResizeObserver !== 'undefined' && listRef.value) {
    observer = new ResizeObserver(measure)
    observer.observe(listRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

watch(() => [resolvedKey.value, props.items], () => nextTick(measure), { deep: true, flush: 'post' })
</script>

<template>
  <div class="ny-tabs" :class="classes">
    <div class="ny-tabs__head">
      <div ref="listRef" class="ny-tabs__list" role="tablist" @keydown="onKeydown">
        <button
          v-for="(item, index) in items"
          :key="item.key"
          :ref="(el) => setTabRef(el, index)"
          class="ny-tabs__tab"
          :class="{ 'is-active': isActive(item) }"
          type="button"
          role="tab"
          :id="tabId(item.key)"
          :aria-selected="isActive(item)"
          :aria-controls="panelId(item.key)"
          :tabindex="isActive(item) ? 0 : -1"
          :disabled="item.disabled"
          @click="select(item)"
        >
          <NyIcon v-if="item.icon" :name="item.icon" :size="iconSize" />

          <span class="ny-tabs__label">{{ item.label }}</span>

          <span v-if="item.badge !== undefined" class="ny-tabs__badge">{{ item.badge }}</span>

          <span
            v-if="closable"
            class="ny-tabs__close"
            role="button"
            :aria-label="`关闭 ${item.label}`"
            @click="onClose(item, $event)"
          >
            <NyIcon name="close" :size="13" />
          </span>
        </button>

        <span
          v-if="type === 'line'"
          class="ny-tabs__ink"
          aria-hidden="true"
          :style="{ width: `${inkWidth}px`, transform: `translateX(${inkLeft}px)` }"
        />
      </div>

      <div v-if="$slots.extra" class="ny-tabs__extra">
        <slot name="extra" />
      </div>
    </div>

    <div
      class="ny-tabs__panel"
      role="tabpanel"
      :id="panelId(resolvedKey)"
      :aria-labelledby="tabId(resolvedKey)"
      tabindex="0"
    >
      <slot :active-key="resolvedKey" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-tabs {
  min-width: 0;
}

.ny-tabs__head {
  display: flex;
  align-items: center;
  gap: var(--ny-space-4);
  border-bottom: 1px solid var(--ny-border);
}

.ny-tabs__list {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--ny-space-1);
  min-width: 0;
  flex: 1;
}

.ny-tabs--align-center .ny-tabs__list {
  justify-content: center;
}

.ny-tabs--align-end .ny-tabs__list {
  justify-content: flex-end;
}

.ny-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: var(--ny-control-height-md);
  padding: 0 14px;
  border: 0;
  border-radius: var(--ny-radius-sm);
  background: transparent;
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-md);
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &:hover:not(:disabled, .is-active) {
    color: var(--ny-text-strong);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &:disabled {
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }

  &.is-active {
    color: var(--ny-primary-text);
    font-weight: 600;
  }
}

.ny-tabs__label {
  min-width: 0;
}

.ny-tabs__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface-3);
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-xs);
  font-weight: 500;
}

.ny-tabs__tab.is-active .ny-tabs__badge {
  background: var(--ny-primary-soft);
  color: var(--ny-primary-text);
}

.ny-tabs__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 2px;
  border-radius: var(--ny-radius-xs);
  color: inherit;
  opacity: 0.6;
  transition:
    opacity var(--ny-transition-fast),
    background var(--ny-transition-fast);

  &:hover {
    background: var(--ny-surface-hover);
    opacity: 1;
  }
}

.ny-tabs__ink {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-primary);
  transition:
    transform var(--ny-transition-base),
    width var(--ny-transition-base);
}

.ny-tabs__extra {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  flex: none;
}

.ny-tabs__panel {
  padding-top: var(--ny-space-4);

  &:focus-visible {
    outline: none;
  }
}

.ny-tabs--plain .ny-tabs__head,
.ny-tabs--soft .ny-tabs__head,
.ny-tabs--segment .ny-tabs__head,
.ny-tabs--pill .ny-tabs__head {
  border-bottom: 0;
}

.ny-tabs--plain .ny-tabs__list {
  gap: var(--ny-space-4);
}

.ny-tabs--soft .ny-tabs__list {
  gap: 6px;
}

.ny-tabs--soft .ny-tabs__tab {
  background: var(--ny-surface-2);

  &:hover:not(:disabled, .is-active) {
    background: var(--ny-surface-3);
  }

  &.is-active {
    background: var(--ny-primary-bg);
  }
}

.ny-tabs--card .ny-tabs__head {
  align-items: flex-end;
  gap: var(--ny-space-3);
  padding-left: var(--ny-space-3);
}

.ny-tabs--card .ny-tabs__list {
  gap: 0;
}

.ny-tabs--card .ny-tabs__tab {
  height: calc(var(--ny-control-height-md) - 4px);
  margin-bottom: -1px;
  border: 1px solid transparent;
  border-bottom: 0;
  border-radius: var(--ny-radius-sm) var(--ny-radius-sm) 0 0;

  &:hover:not(:disabled, .is-active) {
    background: var(--ny-surface-2);
  }

  &.is-active {
    border-color: var(--ny-border);
    background: var(--ny-surface);
  }
}

.ny-tabs--segment .ny-tabs__list {
  flex: none;
  gap: 2px;
  padding: 3px;
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface-3);
}

.ny-tabs--segment .ny-tabs__tab {
  height: calc(var(--ny-control-height-md) - 6px);
  border-radius: calc(var(--ny-radius-sm) - 1px);

  &.is-active {
    background: var(--ny-primary);
    color: var(--ny-on-primary);
    box-shadow: var(--ny-shadow-xs);
  }
}

.ny-tabs--segment .ny-tabs__tab.is-active .ny-tabs__badge {
  background: rgb(255 255 255 / 24%);
  color: var(--ny-on-primary);
}

.ny-tabs--pill .ny-tabs__head {
  justify-content: space-between;
}

.ny-tabs--pill .ny-tabs__list {
  flex: none;
  padding: 3px;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface-3);
}

.ny-tabs--pill .ny-tabs__tab {
  height: calc(var(--ny-control-height-md) - 8px);
  border-radius: var(--ny-radius-pill);

  &.is-active {
    background: var(--ny-surface);
    box-shadow: var(--ny-shadow-xs);
  }
}

.ny-tabs--sm .ny-tabs__tab {
  height: var(--ny-control-height-sm);
  padding: 0 10px;
  font-size: var(--ny-font-size-sm);
}

.ny-tabs--lg .ny-tabs__tab {
  height: var(--ny-control-height-lg);
  padding: 0 18px;
  font-size: var(--ny-font-size-lg);
}
</style>
