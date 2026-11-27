<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import NyButton from '../button/NyButton.vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    type?: 'default' | 'secondary' | 'muted'
    lines?: number
    expandable?: boolean
    align?: 'start' | 'center' | 'end'
  }>(),
  {
    size: 'md',
    type: 'default',
    lines: 2,
    expandable: true,
    align: 'start',
  },
)

const expanded = ref(false)
const overflow = ref(false)
const bodyRef = ref<HTMLElement | null>(null)

let observer: ResizeObserver | null = null

const clamped = computed(() => props.expandable && props.lines > 0 && !expanded.value)
const showToggle = computed(() => props.expandable && props.lines > 0 && (overflow.value || expanded.value))

const style = computed(() => (clamped.value ? { '-webkit-line-clamp': String(props.lines) } : {}))

function measure() {
  const el = bodyRef.value

  if (!el || !props.expandable || props.lines <= 0) {
    overflow.value = false

    return
  }

  const wasClamped = clamped.value

  if (!wasClamped) {
    expanded.value = false
    nextTick(() => measure())

    return
  }

  overflow.value = el.scrollHeight > el.clientHeight + 1
}

onMounted(() => {
  measure()

  if (typeof ResizeObserver !== 'undefined' && bodyRef.value) {
    observer = new ResizeObserver(measure)
    observer.observe(bodyRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

watch(() => [props.lines, props.expandable], () => nextTick(measure))
</script>

<template>
  <div class="ny-paragraph" :class="[`ny-paragraph--${size}`, `ny-paragraph--${type}`, `ny-paragraph--align-${align}`]">
    <p ref="bodyRef" class="ny-paragraph__body" :class="{ 'is-clamped': clamped }" :style="style">
      <slot />
    </p>

    <NyButton
      v-if="showToggle"
      class="ny-paragraph__toggle"
      variant="text"
      size="sm"
      @click="expanded = !expanded"
    >
      {{ expanded ? '收起' : '展开' }}
    </NyButton>
  </div>
</template>
