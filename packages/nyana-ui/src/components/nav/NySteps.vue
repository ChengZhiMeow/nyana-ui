<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import type { NyDirection, NySize } from '../../types'

interface NyStepItem {
  title: string
  desc?: string
  icon?: string
  status?: 'wait' | 'process' | 'finish' | 'error'
}

type NyStepStatus = 'wait' | 'process' | 'finish' | 'error'

const props = withDefaults(
  defineProps<{
    items: NyStepItem[]
    current?: number
    direction?: NyDirection
    size?: NySize
    clickable?: boolean
    progressDot?: boolean
  }>(),
  {
    items: () => [],
    current: 0,
    direction: 'horizontal',
    size: 'md',
    clickable: false,
    progressDot: false,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: number): void
}>()

const nodeSize = computed(() => (props.size === 'sm' ? 24 : props.size === 'lg' ? 36 : 30))

const classes = computed(() => [
  `ny-steps--${props.direction}`,
  `ny-steps--${props.size}`,
  { 'is-dot': props.progressDot, 'is-clickable': props.clickable },
])

function statusOf(item: NyStepItem, index: number): NyStepStatus {
  if (item.status) {
    return item.status
  }

  if (index < props.current) {
    return 'finish'
  }

  return index === props.current ? 'process' : 'wait'
}

function isLineFinish(index: number): boolean {
  if (index === 0) {
    return false
  }

  return statusOf(props.items[index - 1], index - 1) === 'finish'
}

function onSelect(index: number) {
  if (!props.clickable || index === props.current) {
    return
  }

  emit('change', index)
}
</script>

<template>
  <ol class="ny-steps" :class="classes">
    <li v-for="(item, index) in items" :key="index" class="ny-steps__item" :class="[`is-${statusOf(item, index)}`]">
      <div class="ny-steps__head" :class="{ 'is-done': isLineFinish(index) }">
        <button
          class="ny-steps__node"
          type="button"
          :aria-current="index === current ? 'step' : undefined"
          :aria-disabled="clickable ? undefined : true"
          :tabindex="clickable ? 0 : -1"
          @click="onSelect(index)"
        >
          <NyIcon v-if="statusOf(item, index) === 'error'" name="close" :size="progressDot ? 9 : 15" />
          <NyIcon v-else-if="statusOf(item, index) === 'finish'" name="check" :size="progressDot ? 9 : 15" />
          <NyIcon
            v-else-if="statusOf(item, index) === 'process' && item.icon"
            :name="item.icon"
            :size="progressDot ? 9 : 15"
          />
          <template v-else-if="!progressDot">{{ index + 1 }}</template>
        </button>
      </div>

      <div class="ny-steps__body">
        <button class="ny-steps__title" type="button" :tabindex="clickable ? 0 : -1" @click="onSelect(index)">
          {{ item.title }}
        </button>

        <p v-if="item.desc" class="ny-steps__desc">{{ item.desc }}</p>
      </div>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.ny-steps {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ny-steps__item {
  display: flex;
  min-width: 0;

  &.is-process .ny-steps__node {
    border-color: var(--ny-primary);
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
  }

  &.is-finish .ny-steps__node {
    border-color: var(--ny-primary);
    background: var(--ny-primary);
    color: var(--ny-on-primary);
  }

  &.is-error .ny-steps__node {
    border-color: var(--ny-danger);
    background: var(--ny-danger);
    color: var(--ny-on-danger);
  }
}

.ny-steps__head {
  position: relative;
  flex: none;
}

.ny-steps__node {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: v-bind('`${nodeSize}px`');
  height: v-bind('`${nodeSize}px`');
  padding: 0;
  border: 1px solid var(--ny-border-strong);
  border-radius: 50%;
  background: var(--ny-surface);
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
  font-weight: 600;
  line-height: 1;
  cursor: default;
  transition:
    background var(--ny-transition-fast),
    border-color var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }
}

.ny-steps.is-clickable .ny-steps__node,
.ny-steps.is-clickable .ny-steps__title {
  cursor: pointer;
}

.ny-steps__title {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ny-text);
  font-family: inherit;
  font-size: var(--ny-font-size-md);
  font-weight: 600;
  text-align: left;
  cursor: default;

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
    border-radius: var(--ny-radius-xs);
  }
}

.ny-steps__desc {
  margin: 4px 0 0;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
}

.ny-steps__item.is-wait {
  .ny-steps__title {
    color: var(--ny-text-sub);
    font-weight: 500;
  }
}

.ny-steps--horizontal .ny-steps__item {
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding-right: var(--ny-space-3);
}

.ny-steps--horizontal .ny-steps__head {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: var(--ny-space-2);

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    margin-left: var(--ny-space-2);
    background: var(--ny-border);
  }

  &.is-done::after {
    background: var(--ny-primary);
  }
}

.ny-steps--horizontal .ny-steps__item:last-child .ny-steps__head::after {
  display: none;
}

.ny-steps--vertical {
  flex-direction: column;

  .ny-steps__item {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--ny-space-3);

    &:not(:last-child) {
      padding-bottom: var(--ny-space-5);
    }
  }

  .ny-steps__head::after {
    content: '';
    position: absolute;
    top: calc(v-bind('`${nodeSize}px`') + 4px);
    left: calc(50% - 0.5px);
    bottom: calc(-1 * var(--ny-space-5) - 4px);
    width: 1px;
    background: var(--ny-border);
  }

  .ny-steps__head.is-done::after {
    background: var(--ny-primary);
  }

  .ny-steps__body {
    padding-top: 3px;
  }
}

.ny-steps.is-dot .ny-steps__node {
  width: v-bind('`${nodeSize / 3}px`');
  height: v-bind('`${nodeSize / 3}px`');
  border-width: 0;
  background: var(--ny-border-strong);
  color: var(--ny-text-invert);
}

.ny-steps.is-dot .ny-steps__item.is-process .ny-steps__node {
  background: var(--ny-primary);
}

.ny-steps.is-dot .ny-steps__item.is-finish .ny-steps__node {
  background: var(--ny-primary);
}

.ny-steps.is-dot .ny-steps__item.is-error .ny-steps__node {
  background: var(--ny-danger);
}

.ny-steps--sm .ny-steps__title {
  font-size: var(--ny-font-size-sm);
}

.ny-steps--lg .ny-steps__title {
  font-size: var(--ny-font-size-lg);
}
</style>
