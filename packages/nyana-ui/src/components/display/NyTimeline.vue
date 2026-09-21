<script setup lang="ts">
import { computed } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    items: {
      title?: string
      desc?: string
      time?: string
      icon?: string
      status?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    }[]
    mode?: 'left' | 'right' | 'alternate'
    reverse?: boolean
    size?: NySize
  }>(),
  {
    mode: 'left',
    reverse: false,
    size: 'md',
  },
)

const classes = computed(() => [`ny-timeline--${props.mode}`, `ny-timeline--${props.size}`])

const list = computed(() => (props.reverse ? [...props.items].reverse() : props.items))
</script>

<template>
  <ol class="ny-timeline" :class="classes">
    <li
      v-for="(item, index) in list"
      :key="`${item.title ?? ''}-${index}`"
      class="ny-timeline__item"
      :class="[`ny-timeline__item--${item.status ?? 'default'}`, { 'is-right': index % 2 === 1 }]"
    >
      <div class="ny-timeline__rail">
        <span class="ny-timeline__dot">
          <NyIcon v-if="item.icon" :name="item.icon" :size="12" />
          <span v-else class="ny-timeline__dot-inner" />
        </span>
      </div>

      <div class="ny-timeline__body">
        <p v-if="item.title" class="ny-timeline__title">{{ item.title }}</p>
        <p v-if="item.time" class="ny-timeline__time">{{ item.time }}</p>
        <p v-if="item.desc" class="ny-timeline__desc">{{ item.desc }}</p>
      </div>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.ny-timeline {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--ny-font-size-md);
}

.ny-timeline__item {
  position: relative;
  display: flex;
  gap: var(--ny-space-3);
  padding-bottom: var(--ny-space-5);
}

.ny-timeline__item::before {
  content: '';
  position: absolute;
  top: 26px;
  bottom: 0;
  left: 10px;
  width: 2px;
  background: var(--ny-border);
}

.ny-timeline__item:last-child::before {
  display: none;
}

.ny-timeline__rail {
  flex: none;
  width: 22px;
}

.ny-timeline__dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--ny-border-strong);
  color: var(--ny-text-invert);
}

.ny-timeline__dot-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ny-surface);
}

.ny-timeline__body {
  flex: 1;
  min-width: 0;
  padding-top: 1px;
}

.ny-timeline__title {
  margin: 0;
  color: var(--ny-text);
  font-weight: 600;
}

.ny-timeline__time {
  margin: var(--ny-space-1) 0 0;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
}

.ny-timeline__desc {
  margin: var(--ny-space-1) 0 0;
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
  line-height: 1.7;
}

.ny-timeline__item--primary .ny-timeline__dot {
  background: var(--ny-primary);
  color: var(--ny-on-primary);
}

.ny-timeline__item--success .ny-timeline__dot {
  background: var(--ny-success);
  color: var(--ny-on-success);
}

.ny-timeline__item--warning .ny-timeline__dot {
  background: var(--ny-warning);
  color: var(--ny-on-warning);
}

.ny-timeline__item--danger .ny-timeline__dot {
  background: var(--ny-danger);
  color: var(--ny-on-danger);
}

.ny-timeline--right {
  .ny-timeline__item {
    flex-direction: row-reverse;
  }

  .ny-timeline__item::before {
    left: auto;
    right: 10px;
  }

  .ny-timeline__body {
    text-align: right;
  }
}

.ny-timeline--sm {
  font-size: var(--ny-font-size-sm);
}

.ny-timeline--lg {
  .ny-timeline__title {
    font-size: var(--ny-font-size-lg);
  }
}

@media (min-width: 768px) {
  .ny-timeline--alternate {
    .ny-timeline__item {
      display: block;
    }

    .ny-timeline__rail {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    .ny-timeline__item::before {
      left: 50%;
      transform: translateX(-50%);
    }

    .ny-timeline__body {
      width: calc(50% - var(--ny-space-7));
      text-align: right;
    }

    .ny-timeline__item.is-right .ny-timeline__body {
      margin-left: auto;
      text-align: left;
    }
  }
}
</style>
