<script setup lang="ts">
withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    dashed?: boolean
    align?: 'start' | 'center' | 'end'
    spacing?: number
  }>(),
  {
    direction: 'horizontal',
    dashed: false,
    align: 'center',
    spacing: 16,
  },
)
</script>

<template>
  <div
    class="ny-divider"
    :class="[
      `ny-divider--${direction}`,
      `ny-divider--align-${align}`,
      { 'ny-divider--dashed': dashed },
    ]"
    :style="direction === 'horizontal' ? { margin: `${spacing}px 0` } : undefined"
    role="separator"
  >
    <span v-if="$slots.default" class="ny-divider__text"><slot /></span>
  </div>
</template>

<style scoped lang="scss">
.ny-divider {
  display: flex;
  align-items: center;
  gap: var(--ny-space-3);
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-xs);
}

.ny-divider--horizontal {
  width: 100%;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 0;
    border-top: 1px solid var(--ny-border);
  }

  &.ny-divider--dashed::before,
  &.ny-divider--dashed::after {
    border-top-style: dashed;
  }
}

.ny-divider--align-start::before {
  flex: none;
  width: 0;
}

.ny-divider--align-end::after {
  flex: none;
  width: 0;
}

.ny-divider--horizontal:not(:has(.ny-divider__text))::after {
  display: none;
}

.ny-divider--vertical {
  flex-direction: column;
  align-self: stretch;
  width: 1px;
  margin: 0 var(--ny-space-1);
  border-left: 1px solid var(--ny-border);

  &.ny-divider--dashed {
    border-left-style: dashed;
  }
}

.ny-divider__text {
  white-space: nowrap;
  color: var(--ny-text-sub);
}
</style>
