<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4 | 5
    align?: 'start' | 'center' | 'end'
    mark?: boolean
    ellipsis?: boolean
  }>(),
  {
    level: 1,
    align: 'start',
    mark: false,
    ellipsis: false,
  },
)

const classes = computed(() => [
  `ny-title--h${props.level}`,
  `ny-title--align-${props.align}`,
  { 'ny-title--mark': props.mark, 'ny-title--ellipsis': props.ellipsis },
])

const tag = computed(() => `h${Math.min(props.level + 1, 6)}`)
</script>

<template>
  <component :is="tag" class="ny-title" :class="classes">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.ny-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: var(--ny-text-strong);
  font-weight: 600;
  line-height: 1.4;
}

.ny-title--h1 {
  font-size: var(--ny-font-size-2xl);
  letter-spacing: -0.2px;
}

.ny-title--h2 {
  font-size: var(--ny-font-size-xl);
}

.ny-title--h3 {
  font-size: var(--ny-font-size-lg);
}

.ny-title--h4 {
  font-size: var(--ny-font-size-md);
}

.ny-title--h5 {
  font-size: var(--ny-font-size-sm);
  color: var(--ny-text-sub);
}

.ny-title--align-center {
  justify-content: center;
  text-align: center;
}

.ny-title--align-end {
  justify-content: flex-end;
  text-align: right;
}

.ny-title--mark::before {
  content: '';
  width: 3px;
  height: 0.9em;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-primary);
}

.ny-title--ellipsis {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
