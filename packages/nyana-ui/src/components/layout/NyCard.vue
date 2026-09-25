<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    desc?: string
    padding?: 'md' | 'sm' | 'none'
    variant?: 'outline' | 'raised' | 'plain'
    hoverable?: boolean
    divided?: boolean
    flush?: boolean
  }>(),
  {
    title: '',
    desc: '',
    padding: 'md',
    variant: 'outline',
    hoverable: false,
    divided: false,
    flush: false,
  },
)
</script>

<template>
  <section
    class="ny-card"
    :class="[
      `ny-card--${variant}`,
      `ny-card--pad-${padding}`,
      { 'ny-card--flush': flush, 'is-hoverable': hoverable, 'is-divided': divided },
    ]"
  >
    <div v-if="$slots.cover" class="ny-card__cover">
      <slot name="cover" />
    </div>

    <header v-if="title || desc || $slots.title || $slots.actions" class="ny-card__head">
      <div class="ny-card__titles">
        <h3 v-if="title || $slots.title" class="ny-card__title">
          <slot name="title">{{ title }}</slot>
        </h3>

        <p v-if="desc || $slots.desc" class="ny-card__desc">
          <slot name="desc">{{ desc }}</slot>
        </p>
      </div>

      <div v-if="$slots.actions" class="ny-card__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="ny-card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="ny-card__foot">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped lang="scss">
.ny-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-md);
  background: var(--ny-surface);
  transition:
    border-color var(--ny-transition-fast),
    box-shadow var(--ny-transition-base),
    transform var(--ny-transition-base);
}

.ny-card--outline {
  box-shadow: var(--ny-shadow-xs);
}

.ny-card--raised {
  box-shadow: var(--ny-shadow-md);
}

.ny-card--plain {
  border-color: transparent;
  background: transparent;
}

.ny-card.is-hoverable:hover {
  border-color: var(--ny-primary);
  box-shadow: var(--ny-shadow-md);
}

.ny-card--pad-md {
  padding: var(--ny-space-5);
}

.ny-card--pad-sm {
  padding: var(--ny-space-4);
}

.ny-card--pad-none {
  padding: 0;
}

.ny-card--flush {
  overflow: hidden;
}

.ny-card__cover {
  overflow: hidden;
  border-bottom: 1px solid var(--ny-border-soft);

  :deep(img) {
    display: block;
    width: 100%;
    object-fit: cover;
  }
}

.ny-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ny-space-3);
  margin-bottom: var(--ny-space-4);
}

.ny-card.is-divided .ny-card__head {
  margin-bottom: 0;
  padding-bottom: var(--ny-space-3);
  border-bottom: 1px solid var(--ny-border-soft);
}

.ny-card--pad-none .ny-card__head,
.ny-card--pad-none .ny-card__foot {
  padding: var(--ny-space-4) var(--ny-space-4) 0;
  margin-bottom: var(--ny-space-3);
}

.ny-card--pad-none .ny-card__foot {
  margin-top: 0;
  padding: var(--ny-space-3) var(--ny-space-4) var(--ny-space-4);
}

.ny-card--pad-none.is-divided .ny-card__head {
  padding-bottom: var(--ny-space-3);
}

.ny-card__titles {
  min-width: 0;
}

.ny-card__title {
  margin: 0;
  font-size: var(--ny-font-size-lg);
  font-weight: 600;
  color: var(--ny-text-strong);
}

.ny-card__desc {
  margin: 4px 0 0;
  font-size: var(--ny-font-size-sm);
  color: var(--ny-text-muted);
}

.ny-card__actions {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  flex-wrap: wrap;
  flex: none;
}

.ny-card__body {
  flex: 1;
  min-width: 0;
}

.ny-card__foot {
  margin-top: var(--ny-space-4);
  padding-top: var(--ny-space-3);
  border-top: 1px solid var(--ny-border-soft);
  font-size: var(--ny-font-size-sm);
  color: var(--ny-text-muted);
}

.ny-card__cover + .ny-card__head {
  margin-top: var(--ny-space-4);
}

.ny-card--pad-none .ny-card__cover + .ny-card__head {
  margin-top: var(--ny-space-4);
}
</style>
