<script setup lang="ts">
import { computed } from 'vue'

import { components, NyText } from '@chengzhimeow/nyana-ui'

import ComponentWall, { type WallCard, type WallGroup } from '@/components/ComponentWall.vue'
import DocPage from '@/components/DocPage.vue'
import {
  componentNameOf,
  docEntries,
  docGroups,
  entryByComponent,
  entryPath,
  groupByComponent,
  subComponents,
} from '@/docs/registry'

const names = Object.keys(components).sort()

const WIDE_COMPONENTS = new Set(['NyCalendar'])

function splitTitle(title: string) {
  const [en, ...rest] = title.split(' ')

  return { title: en ?? title, label: rest.join(' ') }
}

const groups = computed<WallGroup[]>(() => {
  const cards = new Map<string, WallCard>()

  for (const name of names) {
    const entry = entryByComponent.get(name)
    const sub = subComponents[name]

    if (entry) {
      cards.set(name, {
        name,
        ...splitTitle(entry.title),
        desc: entry.desc,
        icon: entry.icon,
        to: entryPath(entry),
        wide: WIDE_COMPONENTS.has(name),
      })

      continue
    }

    const named = splitTitle(sub?.title ?? name)
    const page = sub ? docEntries.find((item) => item.key === sub.page) : undefined

    cards.set(name, {
      name,
      title: named.title,
      label: named.label,
      desc: sub?.desc ?? '',
      icon: sub?.icon ?? 'layers',
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

  for (const name of names.filter((item) => !groupByComponent.has(item))) {
    const card = cards.get(name)
    const target =
      result.find((group) => group.title === subComponents[name]?.group) ??
      result.find((group) => group.title === '其他')

    if (card && target) {
      target.cards.push(card)
    }
  }

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
