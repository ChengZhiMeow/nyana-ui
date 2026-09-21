<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import NyIcon from '../basic/NyIcon.vue'

import { useFocusTrap } from '../../composables/useFocusTrap'
import { useScrollLock } from '../../composables/useScrollLock'

const props = withDefaults(
  defineProps<{
    title?: string
    placement?: 'left' | 'right' | 'top' | 'bottom'
    width?: number | string
    height?: number | string
    closable?: boolean
    maskClosable?: boolean
    keyboard?: boolean
    showFooter?: boolean
    okText?: string
    cancelText?: string
    okVariant?: 'primary' | 'danger'
    confirmLoading?: boolean
    closeOnOk?: boolean
    bodyFlush?: boolean
    zIndex?: number
  }>(),
  {
    title: '',
    placement: 'right',
    width: 380,
    height: 320,
    closable: true,
    maskClosable: true,
    keyboard: true,
    showFooter: false,
    okText: '确定',
    cancelText: '取消',
    okVariant: 'primary',
    confirmLoading: false,
    closeOnOk: true,
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

const panelClass = computed(() => `ny-drawer__panel--${props.placement}`)

const panelStyle = computed(() => {
  const horizontal = props.placement === 'left' || props.placement === 'right'
  const size = horizontal ? props.width : props.height

  return {
    [horizontal ? 'width' : 'height']: typeof size === 'number' ? `${size}px` : size,
  }
})

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
    <transition :name="`ny-drawer-${placement}`" @after-leave="emit('close')" :duration="250">
      <div v-if="open" class="ny-drawer" :style="{ zIndex }" @keydown="onKeydown">
        <div class="ny-drawer__mask" @click="onMaskClick" />

        <div
          ref="panelRef"
          class="ny-drawer__panel"
          :class="panelClass"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-label="title ? undefined : '抽屉'"
          :style="panelStyle"
          tabindex="-1"
        >
          <header v-if="title || $slots.title || closable" class="ny-drawer__head">
            <h3 :id="titleId" class="ny-drawer__title">
              <slot name="title">{{ title }}</slot>
            </h3>

            <button
              v-if="closable"
              class="ny-drawer__close"
              type="button"
              title="关闭"
              aria-label="关闭"
              @click="onCancel"
            >
              <NyIcon name="close" :size="16" />
            </button>
          </header>

          <div class="ny-drawer__body" :class="{ 'ny-drawer__body--flush': bodyFlush }">
            <slot />
          </div>

          <footer v-if="showFooter || $slots.footer" class="ny-drawer__foot">
            <slot name="footer">
              <button class="ny-drawer__btn" type="button" @click="onCancel">{{ cancelText }}</button>
              <button
                class="ny-drawer__btn ny-drawer__btn--primary"
                :class="{ 'is-danger': okVariant === 'danger' }"
                type="button"
                :disabled="confirmLoading"
                @click="onOk"
              >
                <NyIcon v-if="confirmLoading" name="refresh" :size="14" spin />
                {{ okText }}
              </button>
            </slot>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-drawer {
  position: fixed;
  inset: 0;
  z-index: var(--ny-z-drawer);
}

.ny-drawer__mask {
  position: absolute;
  inset: 0;
  background: var(--ny-mask);
  backdrop-filter: blur(2px);
}

.ny-drawer__panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 100%;
  background: var(--ny-surface);
  box-shadow: var(--ny-shadow-lg);
  outline: none;
}

.ny-drawer__panel--right {
  top: 0;
  right: 0;
  height: 100%;
  border-left: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-lg) 0 0 var(--ny-radius-lg);
}

.ny-drawer__panel--left {
  top: 0;
  left: 0;
  height: 100%;
  border-right: 1px solid var(--ny-border);
  border-radius: 0 var(--ny-radius-lg) var(--ny-radius-lg) 0;
}

.ny-drawer__panel--top {
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid var(--ny-border);
  border-radius: 0 0 var(--ny-radius-lg) var(--ny-radius-lg);
}

.ny-drawer__panel--bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid var(--ny-border);
  border-radius: var(--ny-radius-lg) var(--ny-radius-lg) 0 0;
}

.ny-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ny-space-3);
  padding: var(--ny-space-4) var(--ny-space-5);
  border-bottom: 1px solid var(--ny-border-soft);
}

.ny-drawer__title {
  margin: 0;
  font-size: var(--ny-font-size-lg);
  font-weight: 600;
  color: var(--ny-text-strong);
}

.ny-drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex: none;
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

.ny-drawer__body {
  flex: 1;
  min-height: 0;
  padding: var(--ny-space-5);
  overflow: auto;
}

.ny-drawer__body--flush {
  padding: 0;
}

.ny-drawer__foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ny-space-2);
  padding: var(--ny-space-3) var(--ny-space-5);
  border-top: 1px solid var(--ny-border-soft);
}

.ny-drawer__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: var(--ny-control-height-md);
  padding: 0 18px;
  border: 1px solid var(--ny-border-strong);
  border-radius: var(--ny-radius-sm);
  background: var(--ny-surface);
  color: var(--ny-text);
  font-size: var(--ny-font-size-md);
  cursor: pointer;
  transition: all var(--ny-transition-fast);

  &:hover:not(:disabled) {
    border-color: var(--ny-primary);
    color: var(--ny-primary-text);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.ny-drawer__btn--primary {
  border-color: transparent;
  background: var(--ny-primary-soft);
  color: var(--ny-primary-text);
  font-weight: 600;

  &:hover:not(:disabled) {
    color: var(--ny-primary-text);
    box-shadow: inset 0 0 0 1px var(--ny-primary-ring);
  }

  &.is-danger {
    background: var(--ny-danger-soft);
    color: var(--ny-danger-text);
  }
}

.ny-drawer-right-enter-active,
.ny-drawer-right-leave-active,
.ny-drawer-left-enter-active,
.ny-drawer-left-leave-active,
.ny-drawer-top-enter-active,
.ny-drawer-top-leave-active,
.ny-drawer-bottom-enter-active,
.ny-drawer-bottom-leave-active {
  transition: opacity var(--ny-transition-base);
}

.ny-drawer-right-enter-active .ny-drawer__panel,
.ny-drawer-right-leave-active .ny-drawer__panel,
.ny-drawer-left-enter-active .ny-drawer__panel,
.ny-drawer-left-leave-active .ny-drawer__panel,
.ny-drawer-top-enter-active .ny-drawer__panel,
.ny-drawer-top-leave-active .ny-drawer__panel,
.ny-drawer-bottom-enter-active .ny-drawer__panel,
.ny-drawer-bottom-leave-active .ny-drawer__panel {
  transition: transform var(--ny-transition-base);
}

.ny-drawer-right-enter-from,
.ny-drawer-right-leave-to,
.ny-drawer-left-enter-from,
.ny-drawer-left-leave-to,
.ny-drawer-top-enter-from,
.ny-drawer-top-leave-to,
.ny-drawer-bottom-enter-from,
.ny-drawer-bottom-leave-to {
  opacity: 0;
}

.ny-drawer-right-enter-from .ny-drawer__panel,
.ny-drawer-right-leave-to .ny-drawer__panel {
  transform: translateX(100%);
}

.ny-drawer-left-enter-from .ny-drawer__panel,
.ny-drawer-left-leave-to .ny-drawer__panel {
  transform: translateX(-100%);
}

.ny-drawer-top-enter-from .ny-drawer__panel,
.ny-drawer-top-leave-to .ny-drawer__panel {
  transform: translateY(-100%);
}

.ny-drawer-bottom-enter-from .ny-drawer__panel,
.ny-drawer-bottom-leave-to .ny-drawer__panel {
  transform: translateY(100%);
}
</style>
