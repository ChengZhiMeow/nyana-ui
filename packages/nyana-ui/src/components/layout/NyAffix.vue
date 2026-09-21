<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    offsetTop?: number
    offsetBottom?: number
    target?: string | HTMLElement
    zIndex?: number
  }>(),
  {
    offsetTop: 0,
    offsetBottom: undefined,
    target: undefined,
    zIndex: undefined,
  },
)

const placeholderRef = ref<HTMLElement | null>(null)
const affixRef = ref<HTMLElement | null>(null)
const fixed = ref(false)

let naturalTop = 0
let naturalBottom = 0
let naturalWidth = 0
let naturalHeight = 0
let offsetLeft = 0

const fixedStyle = ref<CSSProperties>({})
const placeholderStyle = ref<CSSProperties>({})

function getTarget(): HTMLElement | null {
  if (!props.target) {
    return null
  }

  if (typeof props.target === 'string') {
    return document.querySelector<HTMLElement>(props.target)
  }

  return props.target
}

function measure() {
  const el = affixRef.value

  if (!el || fixed.value) {
    return
  }

  const rect = el.getBoundingClientRect()
  const container = getTarget()
  const baseTop = container ? rect.top - container.getBoundingClientRect().top + container.scrollTop : rect.top + window.scrollY
  const baseBottom = container ? baseTop + rect.height : rect.bottom + window.scrollY

  naturalTop = baseTop
  naturalBottom = baseBottom
  naturalWidth = rect.width
  naturalHeight = rect.height
  offsetLeft = rect.left
}

function update() {
  const container = getTarget()
  const scrollTop = container ? container.scrollTop : window.scrollY
  const viewportHeight = container ? container.clientHeight : window.innerHeight

  if (!fixed.value) {
    measure()

    if (props.offsetBottom !== undefined) {
      if (naturalBottom - scrollTop + props.offsetBottom > viewportHeight) {
        fixedStyle.value = {
          position: 'fixed',
          bottom: `${props.offsetBottom}px`,
          left: `${offsetLeft}px`,
          width: `${naturalWidth}px`,
          zIndex: props.zIndex,
        }
        placeholderStyle.value = { height: `${naturalHeight}px` }
        fixed.value = true
      }

      return
    }

    if (naturalTop - scrollTop <= props.offsetTop) {
      fixedStyle.value = {
        position: 'fixed',
        top: `${props.offsetTop}px`,
        left: `${offsetLeft}px`,
        width: `${naturalWidth}px`,
        zIndex: props.zIndex,
      }
      placeholderStyle.value = { height: `${naturalHeight}px` }
      fixed.value = true
    }

    return
  }

  const shouldRelease =
    props.offsetBottom !== undefined
      ? naturalBottom - scrollTop + props.offsetBottom <= viewportHeight
      : naturalTop - props.offsetTop > scrollTop

  if (shouldRelease) {
    fixed.value = false
    fixedStyle.value = {}
    placeholderStyle.value = {}
  }
}

function onScroll() {
  update()
}

function bind() {
  const container = getTarget()

  if (container) {
    container.addEventListener('scroll', onScroll, { passive: true })
  } else {
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  window.addEventListener('resize', onScroll)
}

function unbind() {
  const container = getTarget()

  if (container) {
    container.removeEventListener('scroll', onScroll)
  } else {
    window.removeEventListener('scroll', onScroll)
  }

  window.removeEventListener('resize', onScroll)
}

onMounted(() => {
  bind()
  update()
})

onBeforeUnmount(unbind)

watch(() => [props.offsetTop, props.offsetBottom, props.target], () => {
  unbind()
  bind()
  update()
})
</script>

<template>
  <div ref="placeholderRef" class="ny-affix" :style="placeholderStyle">
    <div
      ref="affixRef"
      class="ny-affix__body"
      :class="{ 'is-fixed': fixed }"
      :style="fixed ? fixedStyle : undefined"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-affix {
  min-width: 0;
}

.ny-affix__body.is-fixed {
  margin: 0;
}
</style>
