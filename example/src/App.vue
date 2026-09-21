<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { NyBackTop, NyButton, NyIcon, NyLayout, NyThemeToggle, type NyLayoutMode, type NyNavGroup } from '@chengzhimeow/nyana-ui'

import { docEntries, docGroups, entryPath } from '@/docs/registry'
import { layoutModes, shell } from '@/state'
import { setTheme, themeMode } from '@/theme'

const route = useRoute()

const year = new Date().getFullYear()

const nav: NyNavGroup[] = docGroups.map((group) => ({
  title: group.title,
  items: group.items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    to: entryPath(item),
  })),
}))

const activeKey = computed(() => String(route.name ?? docEntries[0]!.key))

const themeValue = computed<'light' | 'dark'>(() => (themeMode.value === 'dark' ? 'dark' : 'light'))

function pickMode(mode: NyLayoutMode) {
  shell.mode = mode
}
</script>

<template>
  <NyLayout
    v-model:collapsed="shell.collapsed"
    :mode="shell.mode"
    :nav="nav"
    :link-component="RouterLink"
    :active-key="activeKey"
    :breakpoint="shell.breakpoint"
    content-max="xl"
  >
    <template #brand>
      <span class="app-logo"><NyIcon name="layers" :size="20" /></span>
      <span class="ny-truncate">Nyana UI</span>
    </template>

    <template #header-left>
      <div class="app-modes">
        <NyButton
          v-for="item in layoutModes"
          :key="item.value"
          :variant="shell.mode === item.value ? 'primary' : 'default'"
          size="sm"
          :title="item.desc"
          @click="pickMode(item.value)"
        >
          {{ item.label }}
        </NyButton>
      </div>
    </template>

    <template #header-right>
      <NyThemeToggle
        variant="button"
        size="sm"
        :mode="themeValue"
        :labels="{ light: '浅色', dark: '深色' }"
        @update:mode="setTheme"
      />
    </template>

    <template #side-footer>
      <span class="app-count">{{ docEntries.length }} 个组件</span>
    </template>

    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>

    <template #footer>
      © {{ year }} ChengZhiMeow · 保留所有权利
    </template>
  </NyLayout>

  <div v-if="shell.mode === 'blank'" class="app-dock">
    <NyButton
      v-for="item in layoutModes"
      :key="item.value"
      :variant="shell.mode === item.value ? 'primary' : 'default'"
      size="sm"
      :title="item.desc"
      @click="shell.mode = item.value"
    >
      {{ item.label }}
    </NyButton>

    <NyThemeToggle
      variant="button"
      size="sm"
      :mode="themeValue"
      @update:mode="setTheme"
    />
  </div>

  <NyBackTop target=".ny-layout__main" :visibility-height="320" />
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: var(--ny-radius-sm);
  background: var(--ny-primary-bg);
  color: var(--ny-primary-text);
}

.app-modes {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.app-count {
  font-size: var(--ny-font-size-xs);
  color: var(--ny-text-muted);
}

.app-dock {
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 6px;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface);
  box-shadow: var(--ny-shadow-md);
}
</style>
