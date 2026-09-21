<script setup lang="ts">
import { computed, provide } from 'vue'

import { nyCollapseKey } from './collapseContext'
import type { NyCollapseContext } from './collapseContext'

const props = withDefaults(
  defineProps<{
    accordion?: boolean
    bordered?: boolean
    ghost?: boolean
  }>(),
  {
    accordion: false,
    bordered: true,
    ghost: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: (string | number)[]): void
}>()

const activeKeys = defineModel<(string | number)[]>('activeKeys', { default: () => [] })

const classes = computed(() => ({
  'ny-collapse--accordion': props.accordion,
  'ny-collapse--ghost': props.ghost,
  'ny-collapse--plain': !props.bordered && !props.ghost,
}))

function resolveKeys(key: string | number): (string | number)[] {
  if (activeKeys.value.includes(key)) {
    return activeKeys.value.filter((item) => item !== key)
  }

  return props.accordion ? [key] : [...activeKeys.value, key]
}

function toggle(key: string | number) {
  const next = resolveKeys(key)

  activeKeys.value = next
  emit('change', next)
}

const context: NyCollapseContext = {
  isActive: (key) => activeKeys.value.includes(key),
  toggle,
}

provide(nyCollapseKey, context)
</script>

<template>
  <div class="ny-collapse" :class="classes">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.ny-collapse {
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
  overflow: hidden;

  :deep(.ny-collapse-item + .ny-collapse-item) {
    border-top: 1px solid var(--ny-border-soft);
  }
}

.ny-collapse--plain,
.ny-collapse--ghost {
  border-color: transparent;
  background: transparent;
}

.ny-collapse--ghost {
  :deep(.ny-collapse-item) {
    background: transparent;
  }
}
</style>
