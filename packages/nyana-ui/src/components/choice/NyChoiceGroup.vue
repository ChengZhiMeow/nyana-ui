<script setup lang="ts">
import { computed, provide, toRef } from 'vue'

import { nyChoiceKey } from './choiceContext'

type Value = string | number

const model = defineModel<Value | Value[] | null>({ default: null })

const props = withDefaults(
  defineProps<{
    multiple?: boolean
    disabled?: boolean
    // 每行几列; 平板最多 colsMd 列, 手机 colsSm 列
    cols?: number
    colsMd?: number
    colsSm?: number
    // 是否在卡片左侧显示单选圈 / 勾选框 (支付方式这类列表用)
    indicator?: boolean
  }>(),
  {
    multiple: false,
    disabled: false,
    cols: 3,
    colsMd: undefined,
    colsSm: 1,
    indicator: false,
  },
)

const emit = defineEmits<{ change: [value: Value | Value[] | null] }>()

function isSelected(value: Value) {
  return Array.isArray(model.value) ? model.value.includes(value) : model.value === value
}

function toggle(value: Value) {
  if (props.disabled) return
  if (props.multiple) {
    const list = Array.isArray(model.value) ? [...model.value] : []
    const at = list.indexOf(value)
    if (at >= 0) list.splice(at, 1)
    else list.push(value)
    model.value = list
  } else {
    model.value = value
  }
  emit('change', model.value)
}

provide(nyChoiceKey, {
  isSelected,
  toggle,
  multiple: toRef(props, 'multiple'),
  disabled: toRef(props, 'disabled'),
  indicator: toRef(props, 'indicator'),
})

const style = computed(() => ({
  '--cols': props.cols,
  '--cols-md': props.colsMd ?? Math.min(props.cols, 2),
  '--cols-sm': props.colsSm,
}))
</script>

<template>
  <div class="ny-choice-group" :style="style" :role="multiple ? 'group' : 'radiogroup'">
    <slot />
  </div>
</template>
