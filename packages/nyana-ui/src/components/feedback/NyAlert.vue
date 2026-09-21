<script setup lang="ts">
import { computed, ref } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import type { NyStatus } from '../../types'

const props = withDefaults(
  defineProps<{
    type?: NyStatus
    title?: string
    desc?: string
    variant?: 'soft' | 'outline'
    showIcon?: boolean
    closable?: boolean
    banner?: boolean
    action?: string
  }>(),
  {
    type: 'info',
    title: '',
    desc: '',
    variant: 'soft',
    showIcon: true,
    closable: false,
    banner: false,
    action: '',
  },
)

const emit = defineEmits<{
  (event: 'close', payload: MouseEvent): void
  (event: 'action'): void
}>()

const ALERT_TYPES: NyStatus[] = ['info', 'success', 'warning', 'danger']

const ALERT_ICONS: Record<string, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert',
  danger: 'close-circle',
}

const visible = ref(true)

const resolvedType = computed(() => (ALERT_TYPES.includes(props.type) ? props.type : 'info'))

const iconName = computed(() => ALERT_ICONS[resolvedType.value] || 'info')

const classes = computed(() => [
  `ny-alert--${resolvedType.value}`,
  `ny-alert--${props.variant}`,
  { 'ny-alert--banner': props.banner },
])

const role = computed(() =>
  resolvedType.value === 'danger' || resolvedType.value === 'warning' ? 'alert' : 'status',
)

function onAction() {
  emit('action')
}

function onClose(event: MouseEvent) {
  visible.value = false
  emit('close', event)
}
</script>

<template>
  <transition name="ny-fade" :duration="160">
    <div v-if="visible" class="ny-alert" :class="classes" :role="role">
      <span v-if="showIcon" class="ny-alert__icon">
        <slot name="icon">
          <NyIcon :name="iconName" :size="18" />
        </slot>
      </span>

      <div class="ny-alert__main">
        <p v-if="title || $slots.title" class="ny-alert__title">
          <slot name="title">{{ title }}</slot>
        </p>

        <div v-if="desc || $slots.default" class="ny-alert__desc">
          <slot>{{ desc }}</slot>
        </div>

        <div v-if="action || $slots.action" class="ny-alert__foot">
          <button type="button" class="ny-alert__action" @click="onAction">
            <slot name="action">{{ action }}</slot>
          </button>
        </div>
      </div>

      <button v-if="closable" type="button" class="ny-alert__close" aria-label="关闭" @click="onClose">
        <NyIcon name="close" :size="14" />
      </button>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.ny-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--ny-space-2);
  padding: 10px var(--ny-space-4);
  border: 1px solid transparent;
  border-radius: var(--ny-radius-sm);
  font-size: var(--ny-font-size-md);
  line-height: 1.6;
}

.ny-alert__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  flex: none;
  color: inherit;
}

.ny-alert__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.ny-alert__title {
  color: inherit;
  margin: 0;
  font-weight: 600;
}

.ny-alert__desc {
  margin: var(--ny-space-1) 0 0;
  color: inherit;
  opacity: 0.88;
  word-break: break-word;
}

.ny-alert__main > .ny-alert__desc:first-child {
  margin-top: 0;
}

.ny-alert__foot {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--ny-space-2);
}

.ny-alert__action {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: var(--ny-font-size-sm);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
}

.ny-alert__close {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: -2px -4px 0 0;
  padding: 0;
  border: 0;
  border-radius: var(--ny-radius-xs);
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.72;

  &:hover {
    background: var(--ny-surface-hover);
    opacity: 1;
  }
}

.ny-alert--info {
  &.ny-alert--soft {
    background: var(--ny-info-soft);
    color: var(--ny-info-text);
  }

  &.ny-alert--outline {
    border-color: var(--ny-border-strong);
    color: var(--ny-text);

    .ny-alert__icon {
      color: var(--ny-info);
    }
  }

  &.ny-alert--banner {
    border-top-color: var(--ny-info);
  }
}

.ny-alert--success {
  &.ny-alert--soft {
    background: var(--ny-success-soft);
    color: var(--ny-success-text);
  }

  &.ny-alert--outline {
    border-color: var(--ny-border-strong);
    color: var(--ny-text);

    .ny-alert__icon {
      color: var(--ny-success);
    }
  }

  &.ny-alert--banner {
    border-top-color: var(--ny-success);
  }
}

.ny-alert--warning {
  &.ny-alert--soft {
    background: var(--ny-warning-soft);
    color: var(--ny-warning-text);
  }

  &.ny-alert--outline {
    border-color: var(--ny-border-strong);
    color: var(--ny-text);

    .ny-alert__icon {
      color: var(--ny-warning);
    }
  }

  &.ny-alert--banner {
    border-top-color: var(--ny-warning);
  }
}

.ny-alert--danger {
  &.ny-alert--soft {
    background: var(--ny-danger-soft);
    color: var(--ny-danger-text);
  }

  &.ny-alert--outline {
    border-color: var(--ny-border-strong);
    color: var(--ny-text);

    .ny-alert__icon {
      color: var(--ny-danger);
    }
  }

  &.ny-alert--banner {
    border-top-color: var(--ny-danger);
  }
}

.ny-alert--banner {
  border-radius: 0;
  border-top-width: 2px;
}
</style>
