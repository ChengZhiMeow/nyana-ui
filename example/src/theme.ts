import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'nyana_ui_example_theme'

export const themeMode = ref<ThemeMode>((localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'auto')

export const themeOptions: { label: string; value: ThemeMode; icon: string }[] = [
  { label: '浅色', value: 'light', icon: 'sun' },
  { label: '深色', value: 'dark', icon: 'moon' },
  { label: '跟随系统', value: 'auto', icon: 'refresh' },
]

function resolveDark(mode: ThemeMode): boolean {
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  return mode === 'dark'
}

export function isDark(): boolean {
  return resolveDark(themeMode.value)
}

export function applyTheme() {
  document.documentElement.setAttribute('data-theme', resolveDark(themeMode.value) ? 'dark' : 'light')
}

export function setTheme(mode: ThemeMode) {
  themeMode.value = mode
  localStorage.setItem(STORAGE_KEY, mode)
  applyTheme()
}

export function initTheme() {
  applyTheme()

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeMode.value === 'auto') {
      applyTheme()
    }
  })
}
