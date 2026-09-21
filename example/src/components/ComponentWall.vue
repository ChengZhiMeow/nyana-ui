<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import { RouterLink } from 'vue-router'

import { NyCard, NyGrid, NyIcon, NySpace, NyStack, NyText } from '@chengzhimeow/nyana-ui'

import { componentPreviews } from '@/docs/previews'

export interface WallCard {
  name: string
  title: string
  label?: string
  desc: string
  icon: string
  to?: string
  wide?: boolean
}

export interface WallGroup {
  title: string
  cards: WallCard[]
}

const props = withDefaults(
  defineProps<{
    groups: WallGroup[]
    previewHeight?: number
    minItemWidth?: number
  }>(),
  {
    previewHeight: 72,
    minItemWidth: 240,
  },
)

const active = ref<Set<string>>(new Set())

const stages = new Set<HTMLElement>()

let observer: IntersectionObserver | null = null

function registerStage(element: Element | ComponentPublicInstance | null, name: string) {
  if (!(element instanceof HTMLElement)) {
    return
  }

  element.dataset.preview = name
  stages.add(element)
  observer?.observe(element)
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    active.value = new Set(props.groups.flatMap((group) => group.cards.map((card) => card.name)))

    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const next = new Set(active.value)

      for (const entry of entries) {
        const name = (entry.target as HTMLElement).dataset.preview

        if (!name) {
          continue
        }

        if (entry.isIntersecting) {
          next.add(name)
        } else {
          next.delete(name)
        }
      }

      active.value = next
    },
    { rootMargin: '320px 0px' },
  )

  for (const element of stages) {
    observer.observe(element)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

const previewStyle = computed(() =>
  props.previewHeight > 0
    ? {
        height: `${props.previewHeight}px`,
        padding: '6px',
        overflow: 'hidden',
        flexWrap: 'nowrap' as const,
      }
    : {
        minHeight: '120px',
        padding: '8px',
        overflow: 'hidden',
      },
)
</script>

<template>
  <section v-for="group in groups" :key="group.title">
    <h2 class="ex-h2">
      {{ group.title }}
      <NyText tag="span" type="muted" size="sm" weight="normal">{{ group.cards.length }} 个</NyText>
    </h2>

    <NyGrid :min-item-width="minItemWidth" :gap="16">
      <NyCard
        v-for="card in group.cards"
        :key="card.name"
        class="wall__card"
        :class="{ 'wall__card--wide': card.wide }"
        padding="sm"
        hoverable
      >
        <template #title>
          <span class="wall__title">
            <RouterLink v-if="card.to" class="wall__link" :to="card.to">{{ card.title }}</RouterLink>

            <span v-else>{{ card.title }}</span>

            <NyText v-if="card.label" tag="span" type="muted" size="sm" weight="normal">{{ card.label }}</NyText>
          </span>
        </template>

        <template #actions>
          <NyIcon :name="card.icon" :size="16" />
        </template>

        <NyStack :gap="10">
          <span v-if="card.desc" class="ex-note">{{ card.desc }}</span>

          <div
            :ref="(el) => registerStage(el, card.name)"
            :class="componentPreviews[card.name] ? 'ex-box' : 'ex-tile'"
            :style="previewStyle"
          >
            <component :is="componentPreviews[card.name]" v-if="active.has(card.name) && componentPreviews[card.name]" />

            <NySpace v-else-if="!componentPreviews[card.name]" size="sm">
              <NyIcon :name="card.icon" :size="16" />
              <span>示意</span>
            </NySpace>
          </div>
        </NyStack>
      </NyCard>
    </NyGrid>
  </section>
</template>

<style scoped lang="scss">
.wall__title {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.wall__card--wide {
  grid-column: 1 / -1;
}

.wall__link {
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--ny-primary-text);
  }
}
</style>
