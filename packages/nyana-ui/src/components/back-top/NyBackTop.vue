<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import type { NySize } from '../../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    target?: string | HTMLElement
    visibilityHeight?: number
    right?: number
    bottom?: number
    size?: NySize
  }>(),
  {
    target: '',
    visibilityHeight: 240,
    right: 24,
    bottom: 32,
    size: 'md',
  },
)

const attrs = useAttrs()

const visible = ref(false)

let scroller: HTMLElement | Window | null = null

function resolveScroller(): HTMLElement | null {
  if (typeof props.target === 'string') {
    return props.target ? document.querySelector<HTMLElement>(props.target) : document.scrollingElement as HTMLElement | null
  }

  return props.target
}

function scrollTopOf(el: HTMLElement | null): number {
  if (!el) {
    return window.scrollY || 0
  }

  return el.scrollTop || 0
}

function onScroll() {
  visible.value = scrollTopOf(resolveScroller()) > props.visibilityHeight
}

function onClick(event: MouseEvent) {
  const scroller = resolveScroller()

  if (scroller && scroller !== document.scrollingElement) {
    scroller.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  emit('click', event)
}

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void
}>()

const classes = computed(() => [`ny-back-top--${props.size}`, { 'is-visible': visible.value }])

const style = computed(() => ({
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
  zIndex: 'var(--ny-z-affix)',
}))

onMounted(() => {
  scroller = resolveScroller() ?? window

  scroller.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  scroller?.removeEventListener('scroll', onScroll)
  scroller = null
})
</script>

<template>
  <Teleport to="body">
    <transition name="ny-fade" :duration="160">
      <button
        v-show="visible"
        class="ny-back-top"
        :class="classes"
        :style="style"
        type="button"
        aria-label="回到顶部"
        v-bind="attrs"
        @click="onClick"
      >
        <slot>
          <NyIcon name="chevron-up" :size="size === 'sm' ? 16 : 18" />
        </slot>
      </button>
    </transition>
  </Teleport>
</template>
