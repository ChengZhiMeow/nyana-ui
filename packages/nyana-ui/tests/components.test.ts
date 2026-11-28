import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import {
  NyButton,
  NyChoiceCard,
  NyChoiceGroup,
  NyCopyButton,
  NyIcon,
  NyKeyValue,
  NyMeter,
  NyMetricCard,
  NyPill,
  NySwitch,
  NyTerminal,
  nyBrandIcons,
  nyIcons,
} from '../src'

describe('NyIcon 品牌图标', () => {
  it('品牌图标都带 brand- 前缀, 渲染时带标记; 通用图标没有', () => {
    const brand = Object.keys(nyBrandIcons)
    expect(brand.length).toBeGreaterThan(0)
    expect(brand.every((name) => name.startsWith('brand-'))).toBe(true)
    expect('x' in nyIcons).toBe(false)
    expect('alipay' in nyIcons).toBe(false)
    const logo = mount(NyIcon, { props: { name: 'brand-x' } })
    expect(logo.classes()).toContain('ny-icon--brand')
    expect(logo.attributes('data-brand')).toBe('')
    expect(logo.attributes('fill')).toBe('currentColor')
    const close = mount(NyIcon, { props: { name: 'close' } })
    expect(close.classes()).not.toContain('ny-icon--brand')
    expect(close.attributes('data-brand')).toBeUndefined()
  })
})

describe('NyButton', () => {
  it('点击触发 click, 禁用时不触发', async () => {
    const wrapper = mount(NyButton, { slots: { default: '保存' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    await wrapper.setProps({ disabled: true })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})

describe('NySwitch', () => {
  it('点击切换 v-model', async () => {
    const wrapper = mount(NySwitch, { props: { checked: false } })
    await wrapper.find('[role="switch"]').trigger('click')
    expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
    expect(wrapper.find('[role="switch"]').attributes('aria-checked')).toBeDefined()
  })
})

describe('NyMetricCard', () => {
  it('没有 percent 时不显示进度条', () => {
    const wrapper = mount(NyMetricCard, { props: { label: '余额', value: '¥86.50' } })
    expect(wrapper.find('.ny-metric__track').exists()).toBe(false)
  })

  it('超过阈值自动变色', () => {
    const warn = mount(NyMetricCard, { props: { label: '内存', value: 7, percent: 85 } })
    expect(warn.find('.ny-metric__bar--warning').exists()).toBe(true)
    const danger = mount(NyMetricCard, { props: { label: '磁盘', value: 39, percent: 97 } })
    expect(danger.find('.ny-metric__bar--danger').exists()).toBe(true)
  })
})

describe('NyMeter', () => {
  it('进度限制在 0–100', () => {
    const wrapper = mount(NyMeter, { props: { label: 'CPU', percent: 140 } })
    expect(wrapper.find('.ny-meter__bar').attributes('style')).toContain('width: 100%')
  })
})

describe('NyPill', () => {
  it('type 决定颜色, dot=false 去掉圆点', () => {
    const wrapper = mount(NyPill, { props: { type: 'success', dot: false }, slots: { default: '运行中' } })
    expect(wrapper.classes()).toContain('ny-pill--success')
    expect(wrapper.classes()).toContain('ny-pill--plain')
  })
})

const card = (value: string) => h(NyChoiceCard, { value, title: value })

describe('NyChoiceGroup', () => {
  it('单选: 点击卡片更新 v-model', async () => {
    const wrapper = mount(NyChoiceGroup, { props: { modelValue: 'a' }, slots: { default: () => [card('a'), card('b')] } })
    await wrapper.findAll('.ny-choice')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('多选: 再点一次取消', async () => {
    const wrapper = mount(NyChoiceGroup, { props: { modelValue: ['a'], multiple: true }, slots: { default: () => [card('a'), card('b')] } })
    await wrapper.findAll('.ny-choice')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })
})

describe('NyKeyValue', () => {
  it('secret 默认打码, 点眼睛显示', async () => {
    const wrapper = mount(NyKeyValue, { props: { items: [{ label: '密码', value: 'Kx7p', secret: true }] } })
    expect(wrapper.text()).not.toContain('Kx7p')
    await wrapper.find('.ny-kv__eye').trigger('click')
    expect(wrapper.text()).toContain('Kx7p')
  })
})

describe('NyCopyButton', () => {
  it('复制文字并触发 copied', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = mount(NyCopyButton, { props: { text: 'mc.na-mc.cn', tip: false } })
    await wrapper.trigger('click')
    await nextTick()
    await nextTick()
    expect(writeText).toHaveBeenCalledWith('mc.na-mc.cn')
    expect(wrapper.emitted('copied')?.[0]).toEqual(['mc.na-mc.cn'])
  })
})

describe('NyTerminal', () => {
  it('伪终端回车发送命令, ↑ 取回上一条', async () => {
    const wrapper = mount(NyTerminal, { props: { mode: 'pseudo' } })
    const input = wrapper.find('input')
    await input.setValue('list')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('command')?.[0]).toEqual(['list'])
    expect((input.element as HTMLInputElement).value).toBe('')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect((input.element as HTMLInputElement).value).toBe('list')
  })

  it('只读时没有输入行', () => {
    const wrapper = mount(NyTerminal, { props: { readonly: true } })
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('切换真终端', async () => {
    const wrapper = mount(NyTerminal, { props: { mode: 'pseudo' } })
    await wrapper.findAll('.ny-term__modes button')[0]!.trigger('click')
    expect(wrapper.emitted('update:mode')?.[0]).toEqual(['real'])
  })
})
