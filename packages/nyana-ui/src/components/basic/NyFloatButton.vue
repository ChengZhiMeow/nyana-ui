<script setup lang="ts">
import { computed } from 'vue'

import NyBadge from '../display/NyBadge.vue'
import NyTooltip from '../display/NyTooltip.vue'
import NyIcon from './NyIcon.vue'

import type { CSSProperties } from 'vue'
import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    shape?: 'circle' | 'square'
    size?: NySize
    variant?: 'default' | 'primary' | 'solid'
    icon?: string
    description?: string
    badge?: string | number
    tooltip?: string
    href?: string
    target?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'
    offset?: [number, number]
    disabled?: boolean
    visible?: boolean
  }>(),
  {
    shape: 'circle',
    size: 'md',
    variant: 'default',
    icon: '',
    description: '',
    badge: undefined,
    tooltip: '',
    href: '',
    target: undefined,
    offset: undefined,
    disabled: false,
    visible: true,
  },
)

const emit = defineEmits<{
  (event: 'click', payload: MouseEvent): void
}>()

const isFixed = computed(() => !!props.target)

const square = computed(() => props.shape === 'square' || !!props.description)
const tag = computed(() => (props.href ? 'a' : 'button'))
const iconSize = computed(() => (props.size === 'lg' ? 20 : props.size === 'sm' ? 16 : 18))

const badgeCount = computed(() => (typeof props.badge === 'number' ? props.badge : undefined))
const badgeText = computed(() => (typeof props.badge === 'string' ? props.badge : ''))

const tagAttrs = computed(() =>
  props.href
    ? { href: props.disabled ? undefined : props.href, 'aria-disabled': props.disabled || undefined }
    : { type: 'button' as const, disabled: props.disabled },
)

const classes = computed(() => [
  `ny-float-button--${props.size}`,
  `ny-float-button--${props.variant}`,
  { 'ny-float-button--square': square.value, 'is-fixed': isFixed.value, 'is-disabled': props.disabled },
])

const hostStyle = computed<CSSProperties | undefined>(() => {
  if (!props.target) {
    return undefined
  }

  const [x, y] = props.offset ?? [24, 24]
  const style: CSSProperties = {}

  if (props.target.startsWith('top')) {
    style.top = `${y}px`
  } else {
    style.bottom = `${y}px`
  }

  if (props.target.endsWith('Right')) {
    style.right = `${x}px`
  } else {
    style.left = `${x}px`
  }

  return style
})

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()

    return
  }

  emit('click', event)
}
</script>

<template>
  <Teleport to="body" :disabled="!isFixed">
    <span v-show="visible" class="ny-float-button" :class="classes" :style="hostStyle">
      <NyTooltip :content="tooltip" :disabled="!tooltip" placement="left" :offset="10">
        <NyBadge :count="badgeCount" :text="badgeText">
          <component :is="tag" class="ny-float-button__btn" v-bind="tagAttrs" @click="onClick">
            <span class="ny-float-button__icon">
              <slot name="icon">
                <slot>
                  <NyIcon v-if="icon" :name="icon" :size="iconSize" />
                </slot>
              </slot>
            </span>

            <span v-if="description" class="ny-float-button__desc">
              <slot name="description">{{ description }}</slot>
            </span>
          </component>
        </NyBadge>
      </NyTooltip>
    </span>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-float-button {
  display: inline-flex;

  &.is-fixed {
    position: fixed;
    z-index: calc(var(--ny-z-popup) - 20);
  }
}

.ny-float-button__btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--ny-border);
  border-radius: 50%;
  background: var(--ny-surface);
  color: var(--ny-text-sub);
  font-family: inherit;
  font-size: var(--ny-font-size-xs);
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
  box-shadow: var(--ny-shadow-md);
  transition:
    background var(--ny-transition-fast),
    border-color var(--ny-transition-fast),
    color var(--ny-transition-fast),
    box-shadow var(--ny-transition-fast),
    transform var(--ny-transition-fast);

  &:hover {
    border-color: var(--ny-primary);
    color: var(--ny-primary-text);
    box-shadow: var(--ny-shadow-lg);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &:active:not(:disabled) {
    transform: translateY(0.5px);
  }
}

.ny-float-button--sm .ny-float-button__btn {
  width: 40px;
  height: 40px;
}

.ny-float-button--lg .ny-float-button__btn {
  width: 56px;
  height: 56px;
}

.ny-float-button--primary .ny-float-button__btn {
  border-color: transparent;
  background: var(--ny-primary-soft);
  color: var(--ny-primary-text);
  font-weight: 600;

  &:hover {
    border-color: transparent;
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
    box-shadow: inset 0 0 0 1px var(--ny-primary-ring);
  }
}

.ny-float-button--solid .ny-float-button__btn {
  border-color: transparent;
  background: var(--ny-primary);
  color: var(--ny-on-primary);
  font-weight: 600;

  &:hover {
    border-color: transparent;
    background: var(--ny-primary-hover);
    color: var(--ny-on-primary);
  }
}

.ny-float-button--square .ny-float-button__btn {
  width: auto;
  height: auto;
  min-width: 48px;
  min-height: 48px;
  padding: 8px 12px;
  border-radius: var(--ny-radius-md);
}

.ny-float-button--square.ny-float-button--sm .ny-float-button__btn {
  min-width: 40px;
  min-height: 40px;
  padding: 6px 10px;
}

.ny-float-button--square.ny-float-button--lg .ny-float-button__btn {
  min-width: 56px;
  min-height: 56px;
  padding: 10px 14px;
}

.ny-float-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ny-float-button__desc {
  font-size: var(--ny-font-size-xs);
  font-weight: 400;
  white-space: nowrap;
}

.ny-float-button.is-disabled .ny-float-button__btn {
  opacity: 0.5;
  box-shadow: none;
  cursor: not-allowed;

  &:hover {
    border-color: var(--ny-border);
    color: var(--ny-text-sub);
    box-shadow: none;
  }
}
</style>
