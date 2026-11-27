import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { describe, expect, it } from 'vitest'

import NyanaUI, { components } from '../src'

// 渲染每个组件需要的最少 props
const required: Record<string, Record<string, unknown>> = {
  NyIcon: { name: 'check' },
  NySegmented: { options: [{ label: 'A', value: 'a' }] },
  NyTabs: { items: [{ key: 'a', label: 'A' }] },
  NyBreadcrumb: { items: [{ label: '首页' }] },
  NySteps: { items: [{ title: '第一步' }] },
  NyTable: { columns: [{ key: 'name', title: '名称' }], data: [{ id: 1, name: '生存服' }] },
  NyTransfer: { data: [{ key: 'a', label: 'A' }] },
  NyPagination: { total: 100 },
  NyDescriptions: { items: [{ label: '版本', value: '1.21.1' }] },
  NyTimeline: { items: [{ title: '已开启' }] },
  NyTree: { data: [{ key: 'a', title: 'A' }] },
  NyDropdown: { items: [{ key: 'a', label: 'A' }] },
  NySelect: { options: [{ label: 'A', value: 'a' }] },
  NyCascader: { options: [{ label: 'A', value: 'a' }] },
  NyAutoComplete: { options: [{ label: 'A', value: 'a' }] },
  NyMentions: { options: [{ label: 'A', value: 'a' }] },
  NyUserCard: { name: '橙汁喵' },
  NyPageHeader: { title: '我的实例' },
  NyImage: { src: 'data:,' },
  NyStatistic: { value: 1280 },
  NyMeter: { label: '内存', percent: 65 },
  NyMetricCard: { label: '在线玩家', value: 15 },
  NyCopyButton: { text: 'abc' },
  NyCopyField: { value: 'mc.na-mc.cn:25565' },
  NyKeyValue: { items: [{ label: '用户名', value: 'u' }] },
  NyPlayerHead: { name: 'Steve' },
  NyChoiceCard: { value: 'a' },
  NyTaskSteps: { steps: [{ title: '下载', status: 'done' }] },
}

describe('全部组件都能渲染', () => {
  for (const [name, component] of Object.entries(components)) {
    it(name, () => {
      const wrapper = mount(component, { props: required[name] ?? {}, attachTo: document.body })
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  }
})

describe('插件安装', () => {
  it('app.use(NyanaUI) 注册全部组件', () => {
    const app = createApp({})
    app.use(NyanaUI)
    for (const name of Object.keys(components)) expect(app.component(name)).toBeTruthy()
  })

  it('单个组件可以按需 app.use', async () => {
    const { NyButton } = await import('../src/components/button')
    const app = createApp({})
    app.use(NyButton)
    expect(app.component('NyButton')).toBeTruthy()
  })
})
