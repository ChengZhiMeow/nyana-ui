<script setup lang="ts">
import {
  Comment,
  Fragment,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useSlots,
  type ComponentPublicInstance,
  type VNode,
} from 'vue'

const props = withDefaults(
  defineProps<{
    columns?: number
    minColumnWidth?: number
    gap?: number
    rowUnit?: number
  }>(),
  {
    columns: 0,
    minColumnWidth: 240,
    gap: 16,
    rowUnit: 8,
  },
)

const slots = useSlots()

const rootRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLElement[]>([])
const spans = ref<number[]>([])
const width = ref(0)

let observer: ResizeObserver | null = null

function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Fragment && Array.isArray(node.children)) {
      return flatten(node.children as VNode[])
    }

    if (node.type === Comment || typeof node.type === 'symbol') {
      return []
    }

    return typeof node.type === 'string' || typeof node.type === 'object' || typeof node.type === 'function'
      ? [node]
      : []
  })
}

const items = computed(() => flatten(slots.default?.() ?? []))

const columnCount = computed(() => {
  if (props.columns > 0) {
    return props.columns
  }

  if (!width.value) {
    return 1
  }

  return Math.max(1, Math.floor((width.value + props.gap) / (props.minColumnWidth + props.gap)))
})

const style = computed(() => ({
  gridTemplateColumns: `repeat(${columnCount.value}, minmax(0, 1fr))`,
  gridAutoRows: `${props.rowUnit}px`,
  rowGap: `${props.gap}px`,
  columnGap: `${props.gap}px`,
}))

function itemStyle(index: number) {
  return { gridRowEnd: `span ${spans.value[index] ?? 1}` }
}

function setItem(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLElement) {
    itemRefs.value[index] = el
  }
}

function measure() {
  const next = itemRefs.value.map((el) => {
    if (!el) {
      return 1
    }

    return Math.max(1, Math.ceil((el.getBoundingClientRect().height + props.gap) / (props.rowUnit + props.gap)))
  })

  const changed = next.length !== spans.value.length || next.some((span, index) => span !== spans.value[index])

  if (changed) {
    spans.value = next
  }
}

onMounted(() => {
  width.value = rootRef.value?.clientWidth ?? 0
  measure()

  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    observer = new ResizeObserver((entries) => {
      width.value = entries[0]?.contentRect.width ?? width.value
      nextTick(measure)
    })
    observer.observe(rootRef.value)
  }
})

onUpdated(() => {
  measure()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div ref="rootRef" class="ny-masonry" :style="style">
    <div
      v-for="(node, index) in items"
      :key="index"
      :ref="(el) => setItem(el, index)"
      class="ny-masonry__item"
      :style="itemStyle(index)"
    >
      <component :is="() => node" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ny-masonry {
  display: grid;
  min-width: 0;
  align-items: start;
}

.ny-masonry__item {
  min-width: 0;
}
</style>
