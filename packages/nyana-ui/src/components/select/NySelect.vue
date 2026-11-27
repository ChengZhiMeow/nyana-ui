<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'

import NyIcon from '../icon/NyIcon.vue'
import NyInputShell from '../input/NyInputShell.vue'

import { usePopup } from '../../composables/usePopup'
import type { NyOption, NyPlacement, NySize, NyVariant } from '../../types'

type NySelectValue = string | number
type NySelectModel = NySelectValue | NySelectValue[] | null

const props = withDefaults(
  defineProps<{
    options: NyOption[]
    size?: NySize
    variant?: NyVariant
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    clearable?: boolean
    placeholder?: string
    multiple?: boolean
    filterable?: boolean
    maxTagCount?: number
    emptyText?: string
    placement?: NyPlacement
    maxHeight?: number
    loading?: boolean
    filterPlaceholder?: string
  }>(),
  {
    size: 'md',
    variant: 'outline',
    disabled: false,
    readonly: false,
    invalid: false,
    clearable: true,
    placeholder: '请选择',
    multiple: false,
    filterable: false,
    maxTagCount: 2,
    emptyText: '无匹配选项',
    placement: 'bottom-start',
    maxHeight: 260,
    loading: false,
    filterPlaceholder: '搜索',
  },
)

const emit = defineEmits<{
  (event: 'change', payload: NySelectModel): void
  (event: 'clear'): void
  (event: 'search', payload: string): void
}>()

const model = defineModel<NySelectModel>({ default: null })

const visible = ref(false)
const focused = ref(false)
const keyword = ref('')
const activeIndex = ref(-1)

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)

const panelId = useId()
// placeholder 传空字符串时也给一句兜底文案, 免得选择框里只剩一条竖线。
const displayPlaceholder = computed(() => props.placeholder || '请选择')

function optionId(index: number) {
  return `${panelId}-option-${index}`
}

const { style } = usePopup({
  open: visible,
  trigger: triggerRef,
  panel: panelRef,
  placement: () => props.placement,
  offset: () => 6,
  matchWidth: () => true,
  onOutside: () => close(),
  onEscape: () => close(true),
})

const selectedValues = computed<NySelectValue[]>(() => {
  const value = model.value

  if (props.multiple) {
    return Array.isArray(value) ? value : []
  }

  if (value === null || Array.isArray(value)) {
    return []
  }

  return [value]
})

const ringVisible = computed(() => focused.value || visible.value)

function findOption(value: NySelectValue) {
  return props.options.find((option) => option.value === value)
}

function isSelected(value: NySelectValue) {
  return selectedValues.value.includes(value)
}

function labelOf(value: NySelectValue) {
  return findOption(value)?.label ?? String(value)
}

const selectedLabels = computed(() => selectedValues.value.map(labelOf))

const tagItems = computed(() =>
  selectedValues.value.slice(0, props.maxTagCount).map((value) => ({ value, label: labelOf(value) })),
)

const hiddenTagCount = computed(() => Math.max(0, selectedValues.value.length - props.maxTagCount))

const visibleOptions = computed(() => {
  const text = keyword.value.trim().toLowerCase()

  if (!text) {
    return props.options
  }

  return props.options.filter((option) => option.label.toLowerCase().includes(text))
})

function firstEnabledIndex() {
  return visibleOptions.value.findIndex((option) => !option.disabled)
}

async function scrollActiveIntoView() {
  await nextTick()
  panelRef.value?.querySelector<HTMLElement>('.is-active')?.scrollIntoView({ block: 'nearest' })
}

watch(activeIndex, () => {
  scrollActiveIntoView()
})

watch(visible, async (opened) => {
  if (!opened) {
    keyword.value = ''
    return
  }

  const current = visibleOptions.value.findIndex((option) => isSelected(option.value) && !option.disabled)
  activeIndex.value = current >= 0 ? current : firstEnabledIndex()

  await nextTick()

  if (props.filterable) {
    searchRef.value?.focus()
  }
})

function focus() {
  triggerRef.value?.focus()
}

function open() {
  if (props.disabled || props.readonly) {
    return
  }

  visible.value = true
}

function close(refocus = false) {
  if (!visible.value) {
    return
  }

  visible.value = false

  if (refocus) {
    focus()
  }
}

function clear() {
  model.value = props.multiple ? [] : null
  emit('clear')
}

function selectOption(option: NyOption) {
  if (option.disabled) {
    return
  }

  if (props.multiple) {
    const next = [...selectedValues.value]
    const index = next.indexOf(option.value)

    if (index >= 0) {
      next.splice(index, 1)
    } else {
      next.push(option.value)
    }

    model.value = next
    emit('change', next)
    return
  }

  model.value = option.value
  emit('change', option.value)
  close(true)
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

function removeLast() {
  const values = selectedValues.value

  if (!values.length) {
    return
  }

  const next = values.slice(0, -1)

  model.value = next
  emit('change', next)
}

function onTriggerClick(event: MouseEvent) {
  const target = event.target as Element | null

  if (target?.closest('.ny-shell__clear')) {
    return
  }

  if (visible.value) {
    close(true)
    return
  }

  open()
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) {
    return
  }

  if (event.key === 'Escape') {
    if (visible.value) {
      event.preventDefault()
      close(true)
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

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()

    if (!visible.value) {
      open()
      return
    }

    const option = visibleOptions.value[activeIndex.value]

    if (option) {
      selectOption(option)
    }
    return
  }

  if (event.key === 'Backspace' && props.multiple) {
    removeLast()
  }
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === ' ' || event.key === 'Backspace') {
    return
  }

  onTriggerKeydown(event)
}

function onSearch(event: Event) {
  const target = event.target as HTMLInputElement

  keyword.value = target.value
  activeIndex.value = firstEnabledIndex()
  emit('search', target.value)
}

function onPanelPointerDown(event: PointerEvent) {
  if (props.filterable) {
    if (searchRef.value && event.target !== searchRef.value) {
      searchRef.value.focus()
    }
    return
  }

  focus()
}

function hoverOption(index: number, option: NyOption) {
  if (option.disabled) {
    return
  }

  activeIndex.value = index
}

function optionClasses(option: NyOption, index: number) {
  return {
    'is-active': index === activeIndex.value,
    'is-selected': isSelected(option.value),
    'is-disabled': !!option.disabled,
  }
}

defineExpose({ focus, open, close, clear })
</script>

<template>
  <div
    ref="triggerRef"
    class="ny-select"
    :class="[`ny-select--${size}`, { 'is-open': visible, 'is-disabled': disabled, 'is-invalid': invalid }]"
    role="combobox"
    aria-haspopup="listbox"
    :tabindex="disabled ? -1 : 0"
    :aria-expanded="visible"
    :aria-controls="visible ? panelId : undefined"
    :aria-activedescendant="visible && activeIndex >= 0 ? optionId(activeIndex) : undefined"
    :aria-disabled="disabled || undefined"
    :aria-invalid="invalid || undefined"
    @click="onTriggerClick"
    @keydown="onTriggerKeydown"
    @focus="focused = true"
    @blur="focused = false"
  >
    <NyInputShell
      :size="size"
      :variant="variant"
      :disabled="disabled"
      :readonly="readonly"
      :invalid="invalid"
      :focused="ringVisible"
      :clearable="clearable"
      :has-value="selectedValues.length > 0"
      @clear="clear"
    >
      <template v-if="loading" #prefix>
        <NyIcon name="refresh" :size="14" spin />
      </template>

      <span v-if="multiple" class="ny-select__values">
        <template v-if="tagItems.length">
          <span v-for="tag in tagItems" :key="tag.value" class="ny-select__tag">{{ tag.label }}</span>
          <span v-if="hiddenTagCount" class="ny-select__tag ny-select__tag--more">+{{ hiddenTagCount }}</span>
        </template>

        <span v-else class="ny-select__placeholder">{{ displayPlaceholder }}</span>
      </span>

      <span v-else class="ny-select__value" :class="{ 'is-placeholder': !selectedLabels.length }">
        {{ selectedLabels.length ? selectedLabels[0] : displayPlaceholder }}
      </span>

      <template #suffix>
        <NyIcon class="ny-select__arrow" :class="{ 'is-open': visible }" name="chevron-down" :size="14" />
      </template>
    </NyInputShell>
  </div>

  <Teleport to="body">
    <transition name="ny-zoom" :duration="160">
      <div
        v-if="visible"
        :id="panelId"
        ref="panelRef"
        class="ny-pop ny-select__panel"
        :style="style"
        role="listbox"
        :aria-multiselectable="multiple || undefined"
        @pointerdown="onPanelPointerDown"
      >
        <div v-if="filterable" class="ny-select__search">
          <NyIcon name="search" :size="14" />

          <input
            ref="searchRef"
            class="ny-select__search-input"
            type="text"
            autocomplete="off"
            :placeholder="filterPlaceholder"
            :value="keyword"
            :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
            @input="onSearch"
            @keydown="onSearchKeydown"
          />
        </div>

        <ul v-if="visibleOptions.length" class="ny-select__list ny-scroll" :style="{ maxHeight: `${maxHeight}px` }">
          <li
            v-for="(option, index) in visibleOptions"
            :id="optionId(index)"
            :key="option.value"
            class="ny-select__option"
            :class="optionClasses(option, index)"
            role="option"
            :aria-selected="isSelected(option.value)"
            :aria-disabled="option.disabled || undefined"
            @click="selectOption(option)"
            @mouseenter="hoverOption(index, option)"
          >
            <NyIcon v-if="option.icon" class="ny-select__option-icon" :name="option.icon" :size="15" />

            <span class="ny-select__option-body">
              <span class="ny-select__option-label">{{ option.label }}</span>
              <span v-if="option.desc" class="ny-select__option-desc">{{ option.desc }}</span>
            </span>

            <NyIcon v-if="isSelected(option.value)" class="ny-select__check" name="check" :size="14" />
          </li>
        </ul>

        <div v-else class="ny-select__empty">{{ emptyText }}</div>
      </div>
    </transition>
  </Teleport>
</template>
