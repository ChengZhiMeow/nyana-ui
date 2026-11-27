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
