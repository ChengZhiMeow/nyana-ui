<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

import NyIcon from '../basic/NyIcon.vue'
import { usePopup } from '../../composables/usePopup'

import type { NyPlacement, NyTrigger } from '../../types'

interface NyDropdownItem {
  key?: string
  label: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

const props = withDefaults(
  defineProps<{
    items: NyDropdownItem[]
    trigger?: NyTrigger
    placement?: NyPlacement
    disabled?: boolean
    selectedKeys?: (string | number)[]
    closeOnSelect?: boolean
    maxHeight?: number
  }>(),
  {
    items: () => [],
    trigger: 'hover',
    placement: 'bottom-start',
    disabled: false,
    selectedKeys: () => [],
    closeOnSelect: true,
    maxHeight: 280,
  },
)

const emit = defineEmits<{
  (event: 'select', payload: { key: string; item: NyDropdownItem }): void
}>()

const open = defineModel<boolean>('open', { default: false })

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const CLOSE_DELAY = 120

let closeTimer: ReturnType<typeof setTimeout> | null = null

const { style } = usePopup({
  open,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  offset: () => 8,
  matchWidth: () => true,
  onOutside: () => close(),
  onEscape: () => {
    close()
    focusTrigger()
  },
})

const menuItems = computed(() => props.items.filter((item) => !item.divider))

const classes = computed(() => [`ny-dropdown--${props.placement.split('-')[0]}`])

function itemKey(item: NyDropdownItem): string {
  return item.key ?? item.label
}

function itemSlot(item: NyDropdownItem, index: number): string {
  return item.divider ? `divider-${index}` : `item-${itemKey(item)}-${index}`
}

const selectedSet = computed(() => new Set(props.selectedKeys.map((key) => String(key))))

function isSelected(item: NyDropdownItem): boolean {
  return selectedSet.value.has(itemKey(item))
}

function clearCloseTimer() {
  if (closeTimer === null) {
    return
  }

  clearTimeout(closeTimer)
  closeTimer = null
}

function scheduleClose() {
  clearCloseTimer()
  closeTimer = setTimeout(close, CLOSE_DELAY)
}

function openMenu() {
  clearCloseTimer()
  open.value = true
}

function close() {
  clearCloseTimer()
  open.value = false
}

function toggle() {
  if (props.disabled) {
    return
  }

  if (open.value) {
    close()

    return
  }

  openMenu()
}

function focusTrigger() {
  triggerRef.value?.focus()
}

function onTriggerClick() {
  if (props.disabled) {
    return
  }

  clearCloseTimer()
  open.value = true
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault()
    toggle()

    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openMenu()
    focusItem(event.key === 'ArrowDown' ? 0 : -1)
  }
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null

  if (!next) {
    return
  }

  if (triggerRef.value?.contains(next) || panelRef.value?.contains(next)) {
    return
  }

  close()
}

function focusItem(index: number) {
  const buttons = panelRef.value?.querySelectorAll<HTMLButtonElement>('.ny-dropdown__item:not(:disabled)')

  if (!buttons || buttons.length === 0) {
    return
  }

  const target = index < 0 ? buttons[buttons.length - 1] : buttons[index]

  target?.focus()
}

function currentIndex(): number {
  const buttons = panelRef.value?.querySelectorAll<HTMLButtonElement>('.ny-dropdown__item:not(:disabled)')

  if (!buttons) {
    return -1
  }

  return Array.from(buttons).findIndex((button) => button === document.activeElement)
}

function onPanelKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()

    const buttons = panelRef.value?.querySelectorAll<HTMLButtonElement>('.ny-dropdown__item:not(:disabled)')
    const count = buttons?.length ?? 0

    if (count === 0) {
      return
    }

    const index = currentIndex()
    const step = event.key === 'ArrowDown' ? 1 : -1
    const base = index < 0 ? (step === 1 ? -1 : 0) : index

    focusItem((base + step + count) % count)

    return
  }

  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    focusItem(event.key === 'Home' ? 0 : -1)

    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    focusTrigger()
  }
}

async function onItemSelect(item: NyDropdownItem) {
  if (item.disabled) {
    return
  }

  emit('select', { key: itemKey(item), item })

  if (!props.closeOnSelect) {
    return
  }

  close()
  await nextTick()
  focusTrigger()
}

onBeforeUnmount(clearCloseTimer)
</script>

<template>
  <span
    ref="triggerRef"
    class="ny-dropdown"
    :class="[classes, { 'is-open': open, 'is-disabled': disabled }]"
    data-ny-dropdown-trigger
    :tabindex="disabled ? -1 : 0"
    :aria-expanded="open"
    aria-haspopup="menu"
    :aria-disabled="disabled || undefined"
    @click="onTriggerClick"
    @keydown="onTriggerKeydown"
    @focus="onTriggerClick"
    @focusout="onFocusOut"
    @mouseenter="trigger === 'hover' && !disabled && openMenu()"
    @mouseleave="trigger === 'hover' && scheduleClose()"
  >
    <slot />
  </span>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="open"
        ref="panelRef"
        class="ny-pop ny-dropdown__panel"
        :class="classes"
        :style="style"
        @keydown="onPanelKeydown"
        @focusout="onFocusOut"
        @mouseenter="trigger === 'hover' && clearCloseTimer()"
        @mouseleave="trigger === 'hover' && scheduleClose()"
      >
        <div class="ny-dropdown__menu ny-scroll" role="menu" :style="{ maxHeight: `${maxHeight}px` }">
          <template v-for="(item, index) in items" :key="itemSlot(item, index)">
            <div v-if="item.divider" class="ny-dropdown__divider" role="separator" />

            <button
              v-else
              class="ny-dropdown__item"
              :class="{ 'is-selected': isSelected(item), 'is-danger': item.danger }"
              type="button"
              role="menuitem"
              tabindex="-1"
              :disabled="item.disabled"
              @click="onItemSelect(item)"
            >
              <NyIcon v-if="item.icon" class="ny-dropdown__icon" :name="item.icon" :size="16" />

              <span class="ny-dropdown__label">{{ item.label }}</span>

              <span v-if="item.shortcut" class="ny-dropdown__shortcut">{{ item.shortcut }}</span>

              <NyIcon v-if="isSelected(item)" class="ny-dropdown__check" name="check" :size="15" />
            </button>
          </template>
        </div>

        <div v-if="$slots['panel-bottom']" class="ny-dropdown__bottom">
          <slot name="panel-bottom" />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-dropdown {
  display: inline-flex;
  align-items: center;

  &:focus-visible {
    outline: none;
    box-shadow: var(--ny-shadow-focus);
    border-radius: var(--ny-radius-sm);
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.ny-dropdown__panel {
  position: fixed;
  z-index: var(--ny-z-popup);
  padding: var(--ny-space-1);
  min-width: 160px;
}

.ny-dropdown__menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ny-dropdown__item {
  display: flex;
  align-items: center;
  gap: var(--ny-space-2);
  width: 100%;
  padding: 7px 10px;
  border: 0;
  border-radius: var(--ny-radius-xs);
  background: transparent;
  color: var(--ny-text);
  font-size: var(--ny-font-size-sm);
  text-align: left;
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &:hover:not(:disabled),
  &:focus-visible {
    outline: none;
    background: var(--ny-surface-hover);
  }

  &:focus-visible {
    box-shadow: var(--ny-shadow-focus);
  }

  &:disabled {
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }

  &.is-selected {
    color: var(--ny-primary-text);
    font-weight: 600;
  }

  &.is-danger:not(:disabled) {
    color: var(--ny-danger-text);

    &:hover,
    &:focus-visible {
      background: var(--ny-danger-soft);
      color: var(--ny-danger-text);
    }
  }
}

.ny-dropdown__icon {
  color: var(--ny-text-muted);
}

.ny-dropdown__item.is-danger .ny-dropdown__icon {
  color: inherit;
}

.ny-dropdown__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ny-dropdown__shortcut {
  color: var(--ny-text-muted);
  font-family: var(--ny-font-family-mono);
  font-size: var(--ny-font-size-xs);
}

.ny-dropdown__check {
  color: var(--ny-primary-text);
}

.ny-dropdown__divider {
  height: 1px;
  margin: var(--ny-space-1) 0;
  background: var(--ny-border-soft);
}

.ny-dropdown__bottom {
  padding: var(--ny-space-2) 10px var(--ny-space-1);
  margin-top: var(--ny-space-1);
  border-top: 1px solid var(--ny-border-soft);
  font-size: var(--ny-font-size-xs);
  color: var(--ny-text-muted);
}
</style>
