<script setup lang="ts">
import { computed } from 'vue'

import { components, NyText } from '@chengzhimeow/nyana-ui'

import ComponentWall, { type WallCard, type WallGroup } from '@/components/ComponentWall.vue'
import DocPage from '@/components/DocPage.vue'
import { componentNameOf, docEntries, docGroups, entryByComponent, entryPath, groupByComponent } from '@/docs/registry'

const names = Object.keys(components).sort()

const WIDE_COMPONENTS = new Set(['NyCalendar'])

const extraInfo: Record<string, { icon: string; page?: string }> = {
  NyCollapseItem: { icon: 'chevron-down', page: 'collapse' },
  NyCheckboxGroup: { icon: 'check-circle', page: 'checkbox' },
  NyRadioGroup: { icon: 'check', page: 'radio' },
  NyAvatarGroup: { icon: 'users', page: 'avatar' },
  NyGridItem: { icon: 'grid', page: 'grid' },
  NyFormItem: { icon: 'file-text', page: 'form' },
  NyInputShell: { icon: 'sidebar', page: 'input' },
  NyText: { icon: 'file', page: 'typography' },
  NyTitle: { icon: 'heading', page: 'typography' },
  NyParagraph: { icon: 'align-left', page: 'typography' },
}

const groups = computed<WallGroup[]>(() => {
  const cards = new Map<string, WallCard>()

  for (const name of names) {
    const entry = entryByComponent.get(name)
    const extra = extraInfo[name]

    if (entry) {
      const [en, ...rest] = entry.title.split(' ')

      cards.set(name, {
        name,
        title: en ?? entry.title,
        label: rest.join(' '),
        desc: entry.desc,
        icon: entry.icon,
        to: entryPath(entry),
        wide: WIDE_COMPONENTS.has(name),
      })

      continue
    }

    const page = extra?.page ? docEntries.find((item) => item.key === extra.page) : undefined

    cards.set(name, {
      name,
      title: name,
      desc: '',
      icon: extra?.icon ?? 'layers',
      to: page ? entryPath(page) : undefined,
      wide: WIDE_COMPONENTS.has(name),
    })
  }

  const result: WallGroup[] = docGroups.map((group) => ({
    title: group.title,
    cards: group.items
      .map((item) => cards.get(componentNameOf(item.key)))
      .filter((card): card is WallCard => !!card),
  }))

  const rest = names.filter((name) => !groupByComponent.has(name)).map((name) => cards.get(name))

  result.push({
    title: '子组件与内部件',
    cards: rest.filter((card): card is WallCard => !!card),
  })

  return result.filter((group) => group.cards.length > 0)
})
</script>

<template>
  <DocPage
    title="All 全部组件"
    :desc="`库里 ${names.length} 个组件全部真机渲染出来, 卡片可以直接点进文档页`"
  >
    <ComponentWall :groups="groups" :preview-height="0" :min-item-width="280" />
  </DocPage>
</template>
