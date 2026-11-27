import type { InjectionKey } from 'vue'

export interface NyCollapseContext {
  isActive: (key: string | number) => boolean
  toggle: (key: string | number) => void
}

export const nyCollapseKey: InjectionKey<NyCollapseContext> = Symbol('nyCollapse')
