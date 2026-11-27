<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { ComponentPublicInstance } from 'vue'
import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    items?: { key: string; title: string; href?: string; children?: { key: string; title: string }[] }[]
    target?: string | HTMLElement
    offset?: number
    affix?: boolean
    direction?: 'vertical' | 'horizontal'
    ink?: boolean
    size?: NySize
  }>(),
  {
    items: () => [],
    target: '',
    offset: 0,
    affix: true,
    direction: 'vertical',
    ink: true,
    size: 'md',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string): void
  (event: 'click', payload: { key: string; event: MouseEvent }): void
}>()

const model = defineModel<string>('activeKey', { default: '' })

const rootRef = ref<HTMLElement | null>(null)
const linkRefs = ref<Record<string, HTMLElement | null>>({})
const missing = ref<string[]>([])

const inkMain = ref(0)
const inkSize = ref(0)

let scroller: HTMLElement | Window | null = null
let frame = 0
let observer: ResizeObserver | null = null

const rows = computed<{ key: string; title: string; href?: string; level: number }[]>(() =>
  props.items.flatMap((item) => [
    { key: item.key, title: item.title, href: item.href, level: 0 },
    ...(item.children ?? []).map((child) => ({ key: child.key, title: child.title, level: 1 })),
  ]),
)

const classes = computed(() => [
  `ny-anchor--${props.direction}`,
  `ny-anchor--${props.size}`,
  { 'is-affix': props.affix },
])

const inkStyle = computed(() =>
  props.direction === 'vertical'
    ? { transform: `translateY(${inkMain.value}px)`, height: `${inkSize.value}px` }
    : { transform: `translateX(${inkMain.value}px)`, width: `${inkSize.value}px` },
)

function containerElement(): HTMLElement | null {
  if (typeof props.target === 'string') {
    return props.target ? document.querySelector<HTMLElement>(props.target) : null
  }

  return props.target
}

function distanceTo(el: HTMLElement): number {
  const box = containerElement()

  return el.getBoundingClientRect().top - (box ? box.getBoundingClientRect().top : 0)
}

function atBottom(box: HTMLElement | null): boolean {
  if (box) {
    return box.scrollTop + box.clientHeight >= box.scrollHeight - 1
  }

  const doc = document.scrollingElement

  return doc ? doc.scrollTop + window.innerHeight >= doc.scrollHeight - 1 : false
}

function isActive(key: string): boolean {
  return model.value === key
}

function isMissing(key: string): boolean {
  return missing.value.includes(key)
}

function setActive(key: string) {
  if (!key || key === model.value) {
    return
  }

  model.value = key
  emit('change', key)
}

function syncActive() {
  const missingKeys: string[] = []
  let current = ''

  rows.value.forEach((row) => {
    const el = document.getElementById(row.key)

    if (!el) {
      missingKeys.push(row.key)

      return
    }

    if (distanceTo(el) <= props.offset) {
      current = row.key
    }
  })

  missing.value = missingKeys

  const reachable = rows.value.filter((row) => !missingKeys.includes(row.key))

  if (reachable.length && atBottom(containerElement())) {
    current = reachable[reachable.length - 1].key
  } else if (!current && reachable.length) {
    current = reachable[0].key
  }

  if (current) {
    setActive(current)
  }
}

function measureInk() {
  const el = linkRefs.value[model.value]

  if (!el) {
    inkSize.value = 0

    return
  }

  if (props.direction === 'vertical') {
    inkMain.value = el.offsetTop
    inkSize.value = el.offsetHeight

    return
  }

  inkMain.value = el.offsetLeft
  inkSize.value = el.offsetWidth
}

function onScroll() {
  if (frame) {
    return
  }

  frame = requestAnimationFrame(() => {
    frame = 0
    syncActive()
  })
}

function bind() {
  unbind()

  scroller = containerElement() ?? window
  scroller.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
}

function unbind() {
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }

  scroller?.removeEventListener('scroll', onScroll)
  scroller = null
  window.removeEventListener('resize', onScroll)
}

function setLinkRef(el: Element | ComponentPublicInstance | null, key: string) {
  linkRefs.value[key] = el as HTMLElement | null
}

function onClick(row: { key: string; href?: string }, event: MouseEvent) {
  const el = document.getElementById(row.key)

  if (!el) {
    if (!row.href) {
      event.preventDefault()
    }

    emit('click', { key: row.key, event })

    return
  }

  event.preventDefault()

  const box = containerElement()
  const delta = distanceTo(el) - props.offset

  if (box) {
    box.scrollTo({ top: box.scrollTop + delta, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: (window.scrollY || 0) + delta, behavior: 'smooth' })
  }

  setActive(row.key)
  emit('click', { key: row.key, event })
}

onMounted(() => {
  bind()
  syncActive()
  measureInk()

  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    observer = new ResizeObserver(measureInk)
    observer.observe(rootRef.value)
  }
})

onBeforeUnmount(() => {
  unbind()
  observer?.disconnect()
  observer = null
})

watch(
  () => props.target,
  () => {
    bind()
    syncActive()
  },
)

watch(
  () => props.items,
  () => {
    nextTick(() => {
      syncActive()
      measureInk()
    })
  },
  { deep: true },
)

watch(model, () => nextTick(measureInk), { flush: 'post' })
</script>

<template>
  <nav ref="rootRef" class="ny-anchor" :class="classes">
    <span v-show="inkSize > 0" class="ny-anchor__ink" :style="inkStyle" aria-hidden="true" />

    <ul class="ny-anchor__list">
      <li v-for="row in rows" :key="row.key">
        <a
          :ref="(el) => setLinkRef(el, row.key)"
          class="ny-anchor__link"
          :class="{
            'ny-anchor__link--child': row.level > 0,
            'is-active': isActive(row.key),
            'is-disabled': isMissing(row.key),
          }"
          :href="row.href || `#${row.key}`"
          :aria-current="isActive(row.key) ? 'true' : undefined"
          :aria-disabled="isMissing(row.key) || undefined"
          @click="onClick(row, $event)"
        >
          <span class="ny-anchor__title">{{ row.title }}</span>

          <span v-if="isMissing(row.key)" class="ny-anchor__note">未找到元素</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
