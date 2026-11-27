<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import NyIcon from '../icon/NyIcon.vue'

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
