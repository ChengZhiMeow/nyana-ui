<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    desc?: string
  }>(),
  {
    desc: '',
  },
)
</script>

<template>
  <article class="doc">
    <header class="doc__head">
      <h1 class="doc__title">{{ title }}</h1>
      <p v-if="desc" class="doc__desc">{{ desc }}</p>
      <slot name="meta" />
    </header>

    <section class="doc__section">
      <h2 class="doc__h2">演示</h2>
      <div class="doc__demos">
        <slot />
      </div>
    </section>

    <section v-if="$slots.api" class="doc__section">
      <h2 class="doc__h2">API</h2>
      <slot name="api" />
    </section>

    <section v-if="$slots.faq" class="doc__section">
      <h2 class="doc__h2">常见问题</h2>
      <slot name="faq" />
    </section>
  </article>
</template>

<style scoped lang="scss">
.doc {
  display: flex;
  flex-direction: column;
  gap: 34px;
  padding-bottom: 40px;
}

.doc__head {
  padding-top: 6px;
  border-bottom: 1px solid var(--ny-border-soft);
  padding-bottom: 18px;
}

.doc__title {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: var(--ny-text-strong);
}

.doc__desc {
  margin-top: 8px;
  max-width: 68ch;
  font-size: var(--ny-font-size-md);
  color: var(--ny-text-sub);
}

.doc__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.doc__h2 {
  margin: 0;
  padding-left: 10px;
  border-left: 3px solid transparent;
  border-image: var(--ny-primary) 1;
  border-image-slice: 0 0 0 1;
  font-size: var(--ny-font-size-xl);
  font-weight: 600;
  color: var(--ny-text-strong);
}

.doc__demos {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>
