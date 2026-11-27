<script setup lang="ts">
import { computed, inject, ref, useId } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

import { nyCollapseKey } from './collapseContext'
import type { NyCollapseContext } from './collapseContext'

const props = withDefaults(
  defineProps<{
    itemKey?: string | number
    title?: string
    icon?: string
    disabled?: boolean
    extra?: string
  }>(),
  {
    title: '',
    icon: '',
    disabled: false,
    extra: '',
  },
)

const autoId = useId()
const localActive = ref(false)

const resolvedKey = computed(() => props.itemKey ?? autoId)
const injected = inject(nyCollapseKey, null)
const context: NyCollapseContext = injected ?? {
  isActive: () => localActive.value,
  toggle: () => {
    localActive.value = !localActive.value
  },
}

const active = computed(() => context.isActive(resolvedKey.value))
const panelId = computed(() => `${autoId}-panel`)

function toggle() {
  if (props.disabled) {
    return
  }

  context.toggle(resolvedKey.value)
}
</script>

<template>
  <div class="ny-collapse-item" :class="{ 'is-active': active, 'is-disabled': disabled }">
    <button
      type="button"
      class="ny-collapse-item__head"
      :disabled="disabled"
      :aria-expanded="active"
      :aria-controls="panelId"
      @click="toggle"
      @keydown.space.prevent
    >
      <NyIcon v-if="icon" class="ny-collapse-item__icon" :name="icon" :size="16" />

      <span class="ny-collapse-item__title">
        <slot name="title">{{ title }}</slot>
      </span>

      <span v-if="extra || $slots.extra" class="ny-collapse-item__extra">
        <slot name="extra">{{ extra }}</slot>
      </span>

      <NyIcon class="ny-collapse-item__chevron" name="plus" :size="14" />
    </button>

    <div :id="panelId" class="ny-collapse-item__panel" :aria-hidden="!active">
      <div class="ny-collapse-item__inner">
        <div class="ny-collapse-item__body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
