<script setup lang="ts">
import { computed } from 'vue'

import NyBadge from '../badge/NyBadge.vue'
import NyTooltip from '../tooltip/NyTooltip.vue'
import NyIcon from '../icon/NyIcon.vue'

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
const iconSize = computed(() => (props.size === 'lg' ? 22 : props.size === 'sm' ? 18 : 20))

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
