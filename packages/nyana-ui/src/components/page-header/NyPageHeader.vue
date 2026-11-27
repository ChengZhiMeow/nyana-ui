<script setup lang="ts">
import NyButton from '../button/NyButton.vue'
import NyIcon from '../icon/NyIcon.vue'

withDefaults(
  defineProps<{
    title: string
    desc?: string
    icon?: string
    bordered?: boolean
    back?: boolean
  }>(),
  {
    desc: '',
    icon: '',
    bordered: false,
    back: false,
  },
)

const emit = defineEmits<{
  (event: 'back'): void
}>()
</script>

<template>
  <header class="ny-page-header" :class="{ 'ny-page-header--bordered': bordered, 'is-detail': back }">
    <nav v-if="$slots.breadcrumb" class="ny-page-header__crumb" aria-label="面包屑">
      <slot name="breadcrumb" />
    </nav>

    <div class="ny-page-header__main">
      <NyButton v-if="back" variant="ghost" size="sm" icon-only title="返回" @click="emit('back')">
        <template #icon>
          <NyIcon name="arrow-left" :size="16" />
        </template>
      </NyButton>

      <span v-if="icon" class="ny-page-header__icon">
        <NyIcon :name="icon" :size="20" />
      </span>

      <div class="ny-page-header__titles">
        <h2 class="ny-page-header__title">{{ title }}</h2>
        <p v-if="desc || $slots.desc" class="ny-page-header__desc">
          <slot name="desc">{{ desc }}</slot>
        </p>
      </div>

      <div v-if="$slots.tags" class="ny-page-header__tags">
        <slot name="tags" />
      </div>

      <div v-if="$slots.actions" class="ny-page-header__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.footer" class="ny-page-header__footer">
      <slot name="footer" />
    </div>
  </header>
</template>
