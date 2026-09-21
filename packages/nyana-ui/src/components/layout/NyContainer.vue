<script setup lang="ts">
withDefaults(
  defineProps<{
    max?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    padding?: boolean
  }>(),
  {
    max: 'xl',
    padding: true,
  },
)
</script>

<template>
  <div class="ny-container" :class="[`ny-container--${max}`, { 'ny-container--pad': padding }]">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.ny-container {
  width: 100%;
  margin: 0 auto;
  min-width: 0;
}

.ny-container--pad {
  padding: 0 20px;
}

.ny-container--sm {
  max-width: 640px;
}

.ny-container--md {
  max-width: 768px;
}

.ny-container--lg {
  max-width: 1024px;
}

.ny-container--xl {
  max-width: 1280px;
}

.ny-container--2xl {
  max-width: 1536px;
}

.ny-container--full {
  max-width: none;
}

@media (max-width: 768px) {
  .ny-container--pad {
    padding: 0 14px;
  }
}
</style>
