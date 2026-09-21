<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import NyButton from '../basic/NyButton.vue'
import NyIcon from '../basic/NyIcon.vue'
import { usePopup } from '../../composables/usePopup'

import type { NyPlacement } from '../../types'

const props = withDefaults(
  defineProps<{
    title?: string
    desc?: string
    placement?: NyPlacement
    trigger?: 'click' | 'hover'
    okText?: string
    cancelText?: string
    okVariant?: 'primary' | 'danger'
    icon?: string
    width?: number
    disabled?: boolean
  }>(),
  {
    title: '确认执行该操作？',
    desc: '',
    placement: 'top',
    trigger: 'click',
    okText: '确定',
    cancelText: '取消',
    okVariant: 'primary',
    icon: 'question-circle',
    width: 240,
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()

const open = defineModel<boolean>('open', { default: false })

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

function close(restoreFocus: boolean) {
  open.value = false

  if (restoreFocus) {
    triggerRef.value?.focus()
  }
}

const { style } = usePopup({
  open,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  offset: () => 8,
  onOutside: () => close(false),
  onEscape: () => close(true),
})

watch(open, async (value) => {
  if (!value || props.trigger !== 'click') {
    return
  }

  await nextTick()
  panelRef.value?.focus()
})

function onTriggerClick() {
  if (props.disabled || props.trigger !== 'click') {
    return
  }

  if (open.value) {
    close(false)
    return
  }

  open.value = true
}

function onTriggerEnter() {
  if (props.disabled || props.trigger !== 'hover') {
    return
  }

  open.value = true
}

function onTriggerLeave(event: MouseEvent) {
  if (props.disabled || props.trigger !== 'hover') {
    return
  }

  const next = event.relatedTarget as Node | null

  if (next && panelRef.value?.contains(next)) {
    return
  }

  close(false)
}

function onPanelLeave() {
  if (props.disabled || props.trigger !== 'hover') {
    return
  }

  close(false)
}

function onConfirm() {
  emit('confirm')
  close(true)
}

function onCancel() {
  emit('cancel')
  close(true)
}
</script>

<template>
  <span
    ref="triggerRef"
    class="ny-popconfirm__trigger"
    aria-haspopup="dialog"
    :aria-expanded="open"
    @click="onTriggerClick"
    @mouseenter="onTriggerEnter"
    @mouseleave="onTriggerLeave"
  >
    <slot />
  </span>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="open"
        ref="panelRef"
        class="ny-pop ny-popconfirm ny-scroll"
        :style="[{ width: `${width}px` }, style]"
        role="dialog"
        :aria-label="title || undefined"
        tabindex="-1"
        @mouseleave="onPanelLeave"
      >
        <div class="ny-popconfirm__head">
          <NyIcon class="ny-popconfirm__icon" :name="icon" :size="16" />

          <div class="ny-popconfirm__titles">
            <p v-if="title || $slots.title" class="ny-popconfirm__title">
              <slot name="title">{{ title }}</slot>
            </p>

            <p v-if="desc || $slots.desc" class="ny-popconfirm__desc">
              <slot name="desc">{{ desc }}</slot>
            </p>
          </div>
        </div>

        <div class="ny-popconfirm__actions">
          <NyButton size="sm" @click="onCancel">{{ cancelText }}</NyButton>
          <NyButton size="sm" :variant="okVariant" @click="onConfirm">{{ okText }}</NyButton>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-popconfirm__trigger {
  display: inline-flex;
  align-items: center;
}

.ny-popconfirm {
  position: fixed;
  z-index: var(--ny-z-popup);
  max-height: 70vh;
  padding: var(--ny-space-3);
  font-size: var(--ny-font-size-md);
  line-height: 1.6;
}

.ny-popconfirm__head {
  display: flex;
  align-items: flex-start;
  gap: var(--ny-space-2);
}

.ny-popconfirm__icon {
  flex: none;
  margin-top: 2px;
  color: var(--ny-warning);
}

.ny-popconfirm__titles {
  min-width: 0;
}

.ny-popconfirm__title {
  margin: 0;
  color: var(--ny-text-strong);
  font-weight: 600;
}

.ny-popconfirm__desc {
  margin: var(--ny-space-1) 0 0;
  color: var(--ny-text-sub);
  font-size: var(--ny-font-size-sm);
  word-break: break-word;
}

.ny-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--ny-space-2);
  margin-top: var(--ny-space-3);
}

.ny-popconfirm:focus {
  outline: none;
}
</style>
