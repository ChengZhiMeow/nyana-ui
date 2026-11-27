<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import NyButton from '../button/NyButton.vue'
import NyIcon from '../icon/NyIcon.vue'

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
                class="ny-modal__ok"
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
