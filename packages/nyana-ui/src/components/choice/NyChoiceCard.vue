<script setup lang="ts">
import { computed, inject } from 'vue'

import NyIcon from '../icon/NyIcon.vue'
import { nyChoiceKey } from './choiceContext'

const props = withDefaults(
  defineProps<{
    value: string | number
    title?: string
    description?: string
    icon?: string
    // 右上角的角标, 例如 "推荐"
    tag?: string
    disabled?: boolean
  }>(),
  {
    title: undefined,
    description: undefined,
    icon: undefined,
    tag: undefined,
    disabled: false,
  },
)

const ctx = inject(nyChoiceKey, null)
const selected = computed(() => ctx?.isSelected(props.value) ?? false)
const off = computed(() => props.disabled || ctx?.disabled.value)

function pick() {
  if (!off.value) ctx?.toggle(props.value)
}
</script>

<template>
  <div
    class="ny-choice"
    :class="{ 'is-active': selected, 'is-disabled': off }"
    :role="ctx?.multiple.value ? 'checkbox' : 'radio'"
    :aria-checked="selected"
    :aria-disabled="off || undefined"
    :tabindex="off ? -1 : 0"
    @click="pick"
    @keydown.enter.prevent="pick"
    @keydown.space.prevent="pick"
  >
    <span v-if="tag" class="ny-choice__corner">{{ tag }}</span>
    <span v-if="ctx?.indicator.value" class="ny-choice__mark" :class="{ 'is-check': ctx?.multiple.value }" aria-hidden="true" />
    <span v-if="icon || $slots.icon" class="ny-choice__icon"><slot name="icon"><NyIcon :name="icon!" /></slot></span>
    <span class="ny-choice__main">
      <slot>
        <b v-if="title" class="ny-choice__title">{{ title }}</b>
        <span v-if="description" class="ny-choice__desc">{{ description }}</span>
      </slot>
    </span>
    <span v-if="$slots.extra" class="ny-choice__extra"><slot name="extra" /></span>
  </div>
</template>
