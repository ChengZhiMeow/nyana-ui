<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'

import NyIcon from '../basic/NyIcon.vue'
import NyInputShell from './NyInputShell.vue'

import { usePopup } from '../../composables/usePopup'
import type { NyOption, NyPlacement, NySize, NyVariant } from '../../types'

const props = withDefaults(
  defineProps<{
    options: NyOption<string>[]
    size?: NySize
    variant?: NyVariant
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    clearable?: boolean
    placeholder?: string
    filterable?: boolean
    placement?: NyPlacement
    maxHeight?: number
    maxLength?: number
    emptyText?: string
    freeInput?: boolean
  }>(),
  {
    size: 'md',
    variant: 'outline',
    disabled: false,
    readonly: false,
    invalid: false,
    clearable: true,
    placeholder: '',
    filterable: true,
    placement: 'bottom-start',
    maxHeight: 240,
    maxLength: undefined,
    emptyText: '无匹配选项',
    freeInput: true,
  },
)

const emit = defineEmits<{
  (event: 'change', payload: string): void
  (event: 'select', payload: { value: string; option: NyOption<string> }): void
  (event: 'search', payload: string): void
}>()

const model = defineModel<string>({ default: '' })

const visible = ref(false)
const focused = ref(false)
const activeIndex = ref(-1)
const confirmed = ref('')

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const panelId = useId()

const ringVisible = computed(() => focused.value || visible.value)

const visibleOptions = computed(() => {
  const text = model.value.trim().toLowerCase()

  if (!props.filterable || !text) {
    return props.options
  }

  return props.options.filter((option) => option.label.toLowerCase().includes(text))
})

const { style } = usePopup({
  open: visible,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  offset: () => 6,
  matchWidth: () => true,
  onOutside: () => close(),
  onEscape: () => close(true, true),
})

function optionId(index: number) {
  return `${panelId}-option-${index}`
}

function firstEnabledIndex() {
  return visibleOptions.value.findIndex((option) => !option.disabled)
}

function applyValue(next: string) {
  if (next === model.value) {
    return
  }

  model.value = next
  emit('change', next)
}

function focus() {
  inputRef.value?.focus()
}

function open() {
  if (props.disabled || props.readonly || visible.value) {
    return
  }

  confirmed.value = model.value
  visible.value = true
  activeIndex.value = firstEnabledIndex()
}

function close(restore = false, refocus = false) {
  if (!visible.value) {
    return
  }

  visible.value = false
  activeIndex.value = -1

  if (restore) {
    applyValue(confirmed.value)
  }

  if (refocus) {
    focus()
  }
}

function clear() {
  applyValue('')
}

function selectOption(option: NyOption<string>) {
  if (option.disabled) {
    return
  }

  applyValue(option.label)
  emit('select', { value: option.value, option })
  close(false, true)
}

function move(step: 1 | -1) {
  const total = visibleOptions.value.length

  if (!total) {
    return
  }

  let index = activeIndex.value < 0 ? (step === 1 ? -1 : 0) : activeIndex.value

  for (let count = 0; count < total; count++) {
    index = (index + step + total) % total

    if (!visibleOptions.value[index].disabled) {
      activeIndex.value = index
      return
    }
  }
}

async function scrollActiveIntoView() {
  await nextTick()
  panelRef.value?.querySelector<HTMLElement>('.is-active')?.scrollIntoView({ block: 'nearest' })
}

watch(activeIndex, () => {
  scrollActiveIntoView()
})

watch(visibleOptions, () => {
  if (visible.value) {
    activeIndex.value = firstEnabledIndex()
  }
})

function highlightParts(label: string) {
  const text = model.value.trim().toLowerCase()
  const index = text ? label.toLowerCase().indexOf(text) : -1

  if (index < 0) {
    return [{ text: label, hit: false }]
  }

  return [
    { text: label.slice(0, index), hit: false },
    { text: label.slice(index, index + text.length), hit: true },
    { text: label.slice(index + text.length), hit: false },
  ].filter((part) => part.text.length > 0)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const previous = model.value
  const next = props.maxLength === undefined ? target.value : target.value.slice(0, props.maxLength)

  if (next !== target.value) {
    target.value = next
  }

  if (!visible.value && !props.disabled && !props.readonly) {
    confirmed.value = previous
    visible.value = true
  }

  applyValue(next)
  emit('search', next)
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  if (event.key === 'Escape') {
    if (visible.value) {
      event.preventDefault()
      close(true, true)
    }
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()

    if (!visible.value) {
      open()
      return
    }

    move(event.key === 'ArrowDown' ? 1 : -1)
    return
  }

  if (event.key === 'Enter' && visible.value) {
    const option = visibleOptions.value[activeIndex.value]

    event.preventDefault()

    if (!option || option.disabled) {
      if (!props.freeInput) {
        close(true, true)
      }

      return
    }

    selectOption(option)
    return
  }

  if (event.key === 'Tab') {
    close()
  }
}

function onBlur() {
  focused.value = false
  close()
}

function hoverOption(index: number, option: NyOption<string>) {
  if (option.disabled) {
    return
  }

  activeIndex.value = index
}

function onTriggerMousedown(event: MouseEvent) {
  const target = event.target as Element | null

  if (target?.closest('.ny-shell__clear')) {
    event.preventDefault()
  }
}

function onTriggerClick(event: MouseEvent) {
  const target = event.target as Element | null

  if (target?.closest('.ny-shell__clear')) {
    return
  }

  if (target === inputRef.value) {
    open()
    return
  }

  if (visible.value) {
    close()
    return
  }

  open()
  focus()
}

defineExpose({ focus, open, close, clear })
</script>

<template>
  <div
    ref="triggerRef"
    class="ny-autocomplete"
    :class="[`ny-autocomplete--${size}`, { 'is-open': visible, 'is-disabled': disabled }]"
    @mousedown="onTriggerMousedown"
    @click="onTriggerClick"
  >
    <NyInputShell
      :size="size"
      :variant="variant"
      :disabled="disabled"
      :readonly="readonly"
      :invalid="invalid"
      :focused="ringVisible"
      :clearable="clearable"
      :has-value="!!model"
      @clear="clear"
    >
      <input
        ref="inputRef"
        class="ny-shell__control"
        type="text"
        role="combobox"
        autocomplete="off"
        :value="model"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :aria-expanded="visible"
        :aria-controls="visible ? panelId : undefined"
        aria-autocomplete="list"
        :aria-activedescendant="visible && activeIndex >= 0 ? optionId(activeIndex) : undefined"
        :aria-invalid="invalid || undefined"
        @input="onInput"
        @keydown="onKeydown"
        @focus="focused = true"
        @blur="onBlur"
      />

      <template #suffix>
        <NyIcon class="ny-autocomplete__arrow" :class="{ 'is-open': visible }" name="chevron-down" :size="14" />
      </template>
    </NyInputShell>
  </div>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="visible"
        :id="panelId"
        ref="panelRef"
        class="ny-pop ny-autocomplete__panel"
        :style="style"
        role="listbox"
        @mousedown.prevent
      >
        <ul
          v-if="visibleOptions.length"
          class="ny-autocomplete__list ny-scroll"
          :style="{ maxHeight: `${maxHeight}px` }"
        >
          <li
            v-for="(option, index) in visibleOptions"
            :id="optionId(index)"
            :key="option.value"
            class="ny-autocomplete__option"
            :class="{
              'is-active': index === activeIndex,
              'is-disabled': !!option.disabled,
            }"
            role="option"
            :aria-selected="index === activeIndex"
            :aria-disabled="option.disabled || undefined"
            @click="selectOption(option)"
            @mouseenter="hoverOption(index, option)"
          >
            <NyIcon v-if="option.icon" class="ny-autocomplete__option-icon" :name="option.icon" :size="15" />

            <span class="ny-autocomplete__option-label">
              <template v-for="(part, partIndex) in highlightParts(option.label)" :key="partIndex">
                <strong v-if="part.hit" class="ny-autocomplete__mark">{{ part.text }}</strong>
                <template v-else>{{ part.text }}</template>
              </template>
            </span>
          </li>
        </ul>

        <div v-else class="ny-autocomplete__empty">{{ emptyText }}</div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ny-autocomplete {
  display: block;
  width: 100%;
}

.ny-autocomplete.is-disabled {
  cursor: not-allowed;
}

.ny-autocomplete__arrow {
  color: var(--ny-text-muted);
  transition: transform var(--ny-transition-fast);
}

.ny-autocomplete__arrow.is-open {
  transform: rotate(180deg);
}

.ny-autocomplete__panel {
  position: fixed;
  z-index: var(--ny-z-popup);
  min-width: 120px;
  padding: 4px;
  overflow: hidden;
}

.ny-autocomplete__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ny-autocomplete__option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: var(--ny-radius-xs);
  color: var(--ny-text);
  font-size: var(--ny-font-size-md);
  cursor: pointer;
  transition:
    background var(--ny-transition-fast),
    color var(--ny-transition-fast);

  &.is-active {
    background: var(--ny-surface-3);
  }

  &.is-disabled {
    background: transparent;
    color: var(--ny-text-muted);
    cursor: not-allowed;
  }
}

.ny-autocomplete__option-icon {
  flex: none;
  color: var(--ny-text-muted);
}

.ny-autocomplete__option-label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ny-autocomplete__mark {
  color: var(--ny-primary-text);
  font-weight: 600;
}

.ny-autocomplete__empty {
  padding: 18px 12px;
  color: var(--ny-text-muted);
  font-size: var(--ny-font-size-sm);
  text-align: center;
}
</style>
