<script setup lang="ts">
import { computed, inject, ref, useId } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

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

      <NyIcon class="ny-collapse-item__chevron" name="chevron-down" :size="16" />
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

<style scoped lang="scss">
.ny-collapse-item {
  background: var(--ny-surface);
}

.ny-collapse-item__head {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  width: 100%;
  padding: var(--ny-space-3) var(--ny-space-4);
  border: 0;
  background: transparent;
  color: var(--ny-text);
  font-family: inherit;
  font-size: var(--ny-font-size-md);
  text-align: left;
  cursor: pointer;
  transition: background var(--ny-transition-fast);

  &:hover:not(:disabled) {
    background: var(--ny-surface-hover);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &:disabled {
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}

.ny-collapse-item__icon {
  color: var(--ny-text-sub);
}

.ny-collapse-item__title {
  flex: 1;
  min-width: 0;
  font-weight: 600;
}

.ny-collapse-item__extra {
  flex: none;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
  font-weight: 400;
}

.ny-collapse-item__chevron {
  flex: none;
  color: var(--ny-text-muted);
  transition: transform var(--ny-transition-base);
}

.ny-collapse-item.is-active .ny-collapse-item__chevron {
  transform: rotate(180deg);
}

.ny-collapse-item__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--ny-transition-base);
}

.ny-collapse-item.is-active .ny-collapse-item__panel {
  grid-template-rows: 1fr;
}

.ny-collapse-item__inner {
  min-height: 0;
  overflow: hidden;
}

.ny-collapse-item__body {
  padding: 0 var(--ny-space-4) var(--ny-space-4);
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
  line-height: 1.7;
}
</style>
