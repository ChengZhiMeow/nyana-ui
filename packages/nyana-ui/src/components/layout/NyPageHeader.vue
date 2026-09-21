<script setup lang="ts">
import NyButton from '../basic/NyButton.vue'
import NyIcon from '../basic/NyIcon.vue'

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
  <header class="ny-page-header" :class="{ 'ny-page-header--bordered': bordered }">
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

      <div class="ny-min-0">
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

<style scoped lang="scss">
.ny-page-header {
  display: flex;
  flex-direction: column;
  gap: var(--ny-space-3);
  padding: var(--ny-space-4) 0;
}

.ny-page-header--bordered {
  padding: var(--ny-space-5);
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
  box-shadow: var(--ny-shadow-xs);
}

.ny-page-header__crumb {
  font-size: var(--ny-font-size-sm);
}

.ny-page-header__main {
  display: flex;
  align-items: center;
  gap: var(--ny-space-3);
  min-width: 0;
}

.ny-page-header__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: var(--ny-radius-sm);
  background: var(--ny-primary-soft);
  color: var(--ny-primary-text);
}

.ny-page-header__title {
  margin: 0;
  font-size: var(--ny-font-size-xl);
  font-weight: 700;
  color: var(--ny-text-strong);
  letter-spacing: -0.2px;
}

.ny-page-header__desc {
  margin: 2px 0 0;
  font-size: var(--ny-font-size-sm);
  color: var(--ny-text-muted);
}

.ny-page-header__tags {
  display: flex;
  align-items: center;
  gap: var(--ny-space-1);
  flex-wrap: wrap;
}

.ny-page-header__actions {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  flex-wrap: wrap;
  margin-left: auto;
}

.ny-page-header__footer {
  padding-top: var(--ny-space-3);
  border-top: 1px solid var(--ny-border-soft);
}
</style>
