<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

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

const iconSize = computed(() => (props.size === 'sm' ? 16 : props.size === 'lg' ? 20 : 18))

const THEME_SWITCH_CLASS = 'ny-theme-switching'

function applyTheme(next: 'light' | 'dark') {
  const root = document.documentElement

  // 切换的一瞬间挂上过渡类, 让整页元素一起做颜色过渡而不是瞬间反色
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add(THEME_SWITCH_CLASS)
    window.setTimeout(() => root.classList.remove(THEME_SWITCH_CLASS), 260)
  }

  root.setAttribute('data-theme', next)

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
