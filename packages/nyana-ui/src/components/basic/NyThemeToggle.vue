<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import NyIcon from './NyIcon.vue'

import type { NySize } from '../../types'

const props = withDefaults(
  defineProps<{
    variant?: 'icon' | 'button' | 'switch' | 'segment'
    size?: NySize
    showLabel?: boolean
    labels?: { light: string; dark: string }
    lightIcon?: string
    darkIcon?: string
    disabled?: boolean
    apply?: boolean
    storageKey?: string
  }>(),
  {
    variant: 'icon',
    size: 'md',
    showLabel: true,
    labels: () => ({ light: '浅色', dark: '深色' }),
    lightIcon: 'sun',
    darkIcon: 'moon',
    disabled: false,
    apply: false,
    storageKey: 'nyana-theme',
  },
)

const emit = defineEmits<{
  (event: 'change', mode: 'light' | 'dark'): void
}>()

const mode = defineModel<'light' | 'dark'>('mode', { default: 'light' })

const isDark = computed(() => mode.value === 'dark')

const currentIcon = computed(() => (isDark.value ? props.darkIcon : props.lightIcon))

const currentLabel = computed(() => (isDark.value ? props.labels.dark : props.labels.light))

const nextLabel = computed(() => (isDark.value ? props.labels.light : props.labels.dark))

const title = computed(() => `切换到${nextLabel.value}`)

const options = computed(() => [
  { value: 'light' as const, icon: props.lightIcon, label: props.labels.light },
  { value: 'dark' as const, icon: props.darkIcon, label: props.labels.dark },
])

const classes = computed(() => [
  `ny-theme-toggle--${props.variant}`,
  `ny-theme-toggle--${props.size}`,
  { 'is-dark': isDark.value, 'is-disabled': props.disabled },
])

const iconSize = computed(() => (props.size === 'sm' ? 14 : props.size === 'lg' ? 18 : 16))

function applyTheme(next: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', next)

  if (props.storageKey) {
    localStorage.setItem(props.storageKey, next)
  }
}

function pick(next: 'light' | 'dark') {
  if (props.disabled || next === mode.value) {
    return
  }

  mode.value = next
  emit('change', next)
}

function toggle() {
  pick(isDark.value ? 'light' : 'dark')
}

onMounted(() => {
  if (!props.apply) {
    return
  }

  const saved = props.storageKey ? localStorage.getItem(props.storageKey) : null

  if (saved === 'light' || saved === 'dark') {
    mode.value = saved
  }

  applyTheme(mode.value)
})

watch(mode, (next) => {
  if (props.apply) {
    applyTheme(next)
  }
})
</script>

<template>
  <button
    v-if="variant === 'icon' || variant === 'button'"
    class="ny-theme-toggle"
    :class="classes"
    type="button"
    :disabled="disabled"
    :title="title"
    :aria-label="title"
    @click="toggle"
  >
    <NyIcon :name="currentIcon" :size="iconSize" />

    <span v-if="variant === 'button' && showLabel" class="ny-theme-toggle__label">
      {{ currentLabel }}
    </span>
  </button>

  <button
    v-else-if="variant === 'switch'"
    class="ny-theme-toggle"
    :class="classes"
    type="button"
    role="switch"
    :aria-checked="isDark"
    :disabled="disabled"
    :title="title"
    :aria-label="title"
    @click="toggle"
  >
    <span class="ny-theme-toggle__track">
      <span class="ny-theme-toggle__knob">
        <NyIcon :name="currentIcon" :size="12" />
      </span>
    </span>

    <span v-if="showLabel" class="ny-theme-toggle__label">{{ currentLabel }}</span>
  </button>

  <span v-else class="ny-theme-toggle" :class="classes" role="radiogroup" aria-label="主题">
    <button
      v-for="option in options"
      :key="option.value"
      class="ny-theme-toggle__seg"
      :class="{ 'is-active': mode === option.value }"
      type="button"
      role="radio"
      :aria-checked="mode === option.value"
      :disabled="disabled"
      @click="pick(option.value)"
    >
      <NyIcon :name="option.icon" :size="iconSize - 2" />

      <span v-if="showLabel">{{ option.label }}</span>
    </button>
  </span>
</template>

<style scoped lang="scss">
.ny-theme-toggle {
  --ny-theme-toggle-height: var(--ny-control-height-md);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--ny-theme-toggle-height);
  padding: 0 8px;
  border: 0;
  border-radius: var(--ny-radius-sm);
  background: transparent;
  color: var(--ny-text-sub);
  font-family: inherit;
  font-size: var(--ny-font-size-sm);
  line-height: 1;
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &:hover:not(:disabled) {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &:disabled,
  &.is-disabled {
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}

.ny-theme-toggle--icon {
  width: var(--ny-theme-toggle-height);
  padding: 0;
}

.ny-theme-toggle--button {
  padding: 0 12px;
}

.ny-theme-toggle--sm {
  --ny-theme-toggle-height: var(--ny-control-height-sm);

  font-size: var(--ny-font-size-xs);
}

.ny-theme-toggle--lg {
  --ny-theme-toggle-height: var(--ny-control-height-lg);
}

.ny-theme-toggle__label {
  font-weight: 500;
}

.ny-theme-toggle--switch {
  padding: 0 4px;
}

.ny-theme-toggle__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 42px;
  height: 22px;
  padding: 2px;
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface-3);
  transition: background var(--ny-transition-base);
}

.ny-theme-toggle--sm .ny-theme-toggle__track {
  width: 34px;
  height: 18px;
}

.ny-theme-toggle--lg .ny-theme-toggle__track {
  width: 50px;
  height: 26px;
}

.ny-theme-toggle__knob {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ny-surface);
  color: var(--ny-primary-text);
  box-shadow: var(--ny-shadow-xs);
  transition:
    transform var(--ny-transition-base),
    background var(--ny-transition-fast);
}

.ny-theme-toggle--sm .ny-theme-toggle__knob {
  width: 14px;
  height: 14px;
}

.ny-theme-toggle--lg .ny-theme-toggle__knob {
  width: 22px;
  height: 22px;
}

.ny-theme-toggle--switch.is-dark {
  .ny-theme-toggle__track {
    background: var(--ny-primary-soft);
  }

  .ny-theme-toggle__knob {
    transform: translateX(20px);
  }
}

.ny-theme-toggle--sm.is-dark .ny-theme-toggle__knob {
  transform: translateX(16px);
}

.ny-theme-toggle--lg.is-dark .ny-theme-toggle__knob {
  transform: translateX(24px);
}

.ny-theme-toggle--segment {
  height: auto;
  gap: 2px;
  padding: 2px;
  background: var(--ny-surface-2);
}

.ny-theme-toggle__seg {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: calc(var(--ny-theme-toggle-height) - 4px);
  padding: 0 10px;
  border: 0;
  border-radius: calc(var(--ny-radius-sm) - 1px);
  background: transparent;
  color: var(--ny-text-sub);
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &:hover:not(:disabled):not(.is-active) {
    color: var(--ny-text);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
  }

  &.is-active {
    background: var(--ny-primary-soft);
    color: var(--ny-primary-text);
    font-weight: 600;
  }

  &:disabled {
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}
</style>
