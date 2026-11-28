<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NySize } from '../../types'

export interface NyTabItem {
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
    /** 页签放不下时在两侧显示翻页按钮 */
    arrows?: boolean
  }>(),
  {
    items: () => [],
    type: 'line',
    size: 'md',
    align: 'start',
    closable: false,
    arrows: true,
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

const canLeft = ref(false)
const canRight = ref(false)
const overflow = computed(() => props.arrows && (canLeft.value || canRight.value))

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

function updateScroll() {
  const list = listRef.value

  if (!list) {
    return
  }

  canLeft.value = list.scrollLeft > 1
  canRight.value = list.scrollLeft + list.clientWidth < list.scrollWidth - 1
}

function scrollPage(step: 1 | -1) {
  const list = listRef.value

  list?.scrollBy({ left: step * list.clientWidth * 0.7, behavior: 'smooth' })
}

// 选中项不在可见区域时滚过去, 两边各留一点余量
function revealActive() {
  const list = listRef.value
  const index = props.items.findIndex((item) => item.key === resolvedKey.value)
  const node = index < 0 ? null : tabRefs.value[index]

  if (!list || !node || list.scrollWidth <= list.clientWidth) {
    return
  }

  const left = node.offsetLeft - 24
  const right = node.offsetLeft + node.offsetWidth + 24 - list.clientWidth

  if (left < list.scrollLeft) {
    list.scrollTo({ left, behavior: 'smooth' })
  } else if (right > list.scrollLeft) {
    list.scrollTo({ left: right, behavior: 'smooth' })
  }
}

function measure() {
  updateScroll()

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
  revealActive()

  if (typeof ResizeObserver !== 'undefined' && listRef.value) {
    observer = new ResizeObserver(measure)
    observer.observe(listRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

watch(
  () => [resolvedKey.value, props.items],
  () =>
    nextTick(() => {
      measure()
      revealActive()
    }),
  { deep: true, flush: 'post' },
)
</script>

<template>
  <div class="ny-tabs" :class="classes">
    <div class="ny-tabs__head" :class="{ 'is-scroll-left': canLeft, 'is-scroll-right': canRight }">
      <button
        v-if="overflow"
        class="ny-tabs__arrow"
        type="button"
        aria-label="向左翻页"
        tabindex="-1"
        :disabled="!canLeft"
        @click="scrollPage(-1)"
      >
        <NyIcon name="chevron-left" :size="iconSize" />
      </button>

      <div ref="listRef" class="ny-tabs__list" role="tablist" @keydown="onKeydown" @scroll.passive="updateScroll">
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

      <button
        v-if="overflow"
        class="ny-tabs__arrow"
        type="button"
        aria-label="向右翻页"
        tabindex="-1"
        :disabled="!canRight"
        @click="scrollPage(1)"
      >
        <NyIcon name="chevron-right" :size="iconSize" />
      </button>

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
