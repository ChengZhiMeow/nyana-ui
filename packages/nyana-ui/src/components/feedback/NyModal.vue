<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import NyButton from '../basic/NyButton.vue'
import NyIcon from '../basic/NyIcon.vue'

import { useFocusTrap } from '../../composables/useFocusTrap'
import { useScrollLock } from '../../composables/useScrollLock'

const props = withDefaults(
  defineProps<{
    title?: string
    width?: number | string
    centered?: boolean
    closable?: boolean
    maskClosable?: boolean
    keyboard?: boolean
    showFooter?: boolean
    showCancel?: boolean
    okText?: string
    cancelText?: string
    okVariant?: 'primary' | 'danger'
    confirmLoading?: boolean
    closeOnOk?: boolean
    maxHeight?: number
    bodyFlush?: boolean
    zIndex?: number
  }>(),
  {
    title: '',
    width: 520,
    centered: false,
    closable: true,
    maskClosable: true,
    keyboard: true,
    showFooter: true,
    showCancel: true,
    okText: '确定',
    cancelText: '取消',
    okVariant: 'primary',
    confirmLoading: false,
    closeOnOk: true,
    maxHeight: undefined,
    bodyFlush: false,
    zIndex: undefined,
  },
)

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  (event: 'ok'): void
  (event: 'cancel'): void
  (event: 'close'): void
}>()

const panelRef = ref<HTMLElement | null>(null)
const titleId = useId()

useScrollLock(open)
useFocusTrap(panelRef, open)

const widthStyle = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

const bodyStyle = computed(() => (props.maxHeight ? { maxHeight: `${props.maxHeight}px` } : {}))

function onOk() {
  emit('ok')

  if (props.closeOnOk) {
    open.value = false
  }
}

function onCancel() {
  emit('cancel')
  open.value = false
}

function onMaskClick() {
  if (props.maskClosable) {
    onCancel()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.keyboard) {
    onCancel()
  }
}
</script>

<template>
  <Teleport to="body">
    <transition name="ny-modal" @after-leave="emit('close')" :duration="250">
      <div
        v-if="open"
        class="ny-modal"
        :class="{ 'ny-modal--centered': centered }"
        :style="{ zIndex }"
        @keydown="onKeydown"
      >
        <div class="ny-modal__mask" @click="onMaskClick" />

        <div
          ref="panelRef"
          class="ny-modal__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-label="title ? undefined : '对话框'"
          :style="{ width: widthStyle }"
          tabindex="-1"
        >
          <header v-if="title || $slots.title || closable" class="ny-modal__head">
            <h3 :id="titleId" class="ny-modal__title">
              <slot name="title">{{ title }}</slot>
            </h3>

            <button
              v-if="closable"
              class="ny-modal__close"
              type="button"
              title="关闭"
              aria-label="关闭"
              @click="onCancel"
            >
              <NyIcon name="close" :size="16" />
            </button>
          </header>

          <div class="ny-modal__body" :class="{ 'ny-modal__body--flush': bodyFlush }" :style="bodyStyle">
            <slot />
          </div>

          <footer v-if="showFooter" class="ny-modal__foot">
            <slot name="footer">
              <NyButton v-if="showCancel" size="md" @click="onCancel">{{ cancelText }}</NyButton>
              <NyButton
                size="md"
                :variant="okVariant"
                :loading="confirmLoading"
                @click="onOk"
              >
                {{ okText }}
              </NyButton>
            </slot>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-modal {
  position: fixed;
  inset: 0;
  z-index: var(--ny-z-modal);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10vh var(--ny-space-4) var(--ny-space-4);
  overflow: auto;
}

.ny-modal--centered {
  align-items: center;
  padding: var(--ny-space-4);
}

.ny-modal__mask {
  position: fixed;
  inset: 0;
  background: var(--ny-mask);
  backdrop-filter: blur(2px);
}

.ny-modal__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 100%;
  border: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-lg);
  background: var(--ny-surface);
  box-shadow: var(--ny-shadow-lg);
  outline: none;
}

.ny-modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ny-space-3);
  padding: var(--ny-space-5) var(--ny-space-5) var(--ny-space-3);
}

.ny-modal__title {
  margin: 0;
  font-size: var(--ny-font-size-lg);
  font-weight: 600;
  color: var(--ny-text-strong);
}

.ny-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex: none;
  margin: -2px -4px 0 0;
  padding: 0;
  border: none;
  border-radius: var(--ny-radius-xs);
  background: transparent;
  color: var(--ny-text-muted);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover {
    background: var(--ny-surface-3);
    color: var(--ny-text);
  }
}

.ny-modal__body {
  flex: 1;
  min-height: 0;
  padding: 0 var(--ny-space-5) var(--ny-space-5);
  overflow: auto;
  font-size: var(--ny-font-size-md);
  color: var(--ny-text);
}

.ny-modal__body--flush {
  padding: 0;
}

.ny-modal__foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ny-space-2);
  padding: var(--ny-space-3) var(--ny-space-5) var(--ny-space-5);
  border-top: 1px solid var(--ny-border-soft);
}

.ny-modal-enter-active,
.ny-modal-leave-active {
  transition: opacity var(--ny-transition-base);
}

.ny-modal-enter-active .ny-modal__panel,
.ny-modal-leave-active .ny-modal__panel {
  transition:
    transform var(--ny-transition-base),
    opacity var(--ny-transition-base);
}

.ny-modal-enter-from,
.ny-modal-leave-to {
  opacity: 0;
}

.ny-modal-enter-from .ny-modal__panel,
.ny-modal-leave-to .ny-modal__panel {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}
</style>
