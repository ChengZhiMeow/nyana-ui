import type { App, Component, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

// 给单个组件加上 install, 支持按需引入时 app.use(NyButton)
export function withInstall<T extends Component>(component: T, name: string): SFCWithInstall<T> {
  const target = component as SFCWithInstall<T>
  target.install = (app: App) => {
    app.component(name, component)
  }
  return target
}
