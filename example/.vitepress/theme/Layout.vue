<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Content, useData, useRoute } from 'vitepress'

import { NyBackTop, NyButton, NyIcon, NyLayout, NyThemeToggle, type NyLayoutMode, type NyNavGroup } from '@chengzhimeow/nyana-ui'

import { docEntries, docGroups, entryPath } from '@/docs/registry'
import { layoutModes, shell } from '@/state'
import { initTheme, setTheme, themeMode } from '@/theme'

const route = useRoute()
const { frontmatter } = useData()

const year = new Date().getFullYear()

const nav: NyNavGroup[] = docGroups.map((group) => ({
  title: group.title,
  items: group.items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    href: entryPath(item),
  })),
}))

const current = computed(() => docEntries.find((item) => entryPath(item) === route.path.replace(/\.html$/, '')))
const activeKey = computed(() => current.value?.key ?? 'all')
// 场景演示整页渲染, 不套文档外壳
const isScene = computed(() => !!frontmatter.value.scene)
const sceneEntries = docEntries.filter((item) => item.scene)

const themeValue = computed<'light' | 'dark'>(() => (themeMode.value === 'dark' ? 'dark' : 'light'))

function pickMode(mode: NyLayoutMode) {
  shell.mode = mode
}

onMounted(initTheme)
</script>

<template>
  <ClientOnly>
    <template v-if="isScene">
      <Content />
      <div class="app-scene-bar">
        <a class="app-scene-bar__back" href="/components/all"><NyIcon name="arrow-left" :size="16" />组件库</a>
        <span class="app-scene-bar__sep" />
        <a
          v-for="item in sceneEntries"
          :key="item.key"
          :href="entryPath(item)"
          class="app-scene-bar__link"
          :class="{ 'is-active': item.key === activeKey }"
          >{{ item.label }}</a
        >
        <NyThemeToggle variant="button" size="sm" :mode="themeValue" @update:mode="setTheme" />
      </div>
    </template>

    <NyLayout
      v-else
      v-model:collapsed="shell.collapsed"
      :mode="shell.mode"
      :nav="nav"
      :active-key="activeKey"
      :breakpoint="shell.breakpoint"
      content-max="xl"
    >
      <template #brand>
        <span class="app-logo" />
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
        <NyThemeToggle variant="button" size="sm" :mode="themeValue" :labels="{ light: '浅色', dark: '深色' }" @update:mode="setTheme" />
      </template>

      <Content />

      <template #footer> © {{ year }} ChengZhiMeow · 保留所有权利 </template>
    </NyLayout>

    <div v-if="!isScene && shell.mode === 'blank'" class="app-dock">
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
      <NyThemeToggle variant="button" size="sm" :mode="themeValue" @update:mode="setTheme" />
    </div>

    <NyBackTop v-if="!isScene" target=".ny-layout__main" :visibility-height="320" />
  </ClientOnly>
</template>

<style scoped lang="scss">
.app-logo {
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 8px;
  background: conic-gradient(from 180deg, var(--ny-sky) 0 50%, var(--ny-pink) 50% 100%);
}

.app-modes {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
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
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface);
}

.app-scene-bar {
  position: fixed;
  left: 50%;
  bottom: max(16px, env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  z-index: 80;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: calc(100vw - 24px);
  padding: 4px;
  overflow-x: auto;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-pill);
  background: var(--ny-surface);
  white-space: nowrap;
}

.app-scene-bar__back,
.app-scene-bar__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0 12px;
  border-radius: var(--ny-radius-pill);
  color: var(--ny-text-sub);
  font-size: 13px;
  text-decoration: none;

  &:hover {
    background: var(--ny-fill);
    color: var(--ny-text);
  }
}

.app-scene-bar__link.is-active {
  background: var(--ny-text);
  color: var(--ny-bg);
}

.app-scene-bar__sep {
  width: 1px;
  height: 16px;
  background: var(--ny-line);
}
</style>
