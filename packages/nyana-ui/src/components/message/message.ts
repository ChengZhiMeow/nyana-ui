import { createVNode, render } from 'vue'

import NyMessageHost from './NyMessageHost.vue'
import { clearMessages, nyMessageConfig, pushMessage, removeMessage, type NyMessageConfig, type NyMessageType } from './messageStore'

export interface NyMessageOptions {
  type?: NyMessageType
  duration?: number
  closable?: boolean
}

let container: HTMLElement | null = null

function ensureHost() {
  if (container) {
    return
  }

  container = document.createElement('div')
  container.className = 'ny-message-root'
  document.body.appendChild(container)
  render(createVNode(NyMessageHost), container)
}

function open(content: string, options: NyMessageOptions = {}) {
  ensureHost()

  return pushMessage({
    type: options.type ?? 'info',
    content,
    duration: options.duration ?? nyMessageConfig.duration,
    closable: options.closable ?? false,
  })
}

function typed(type: NyMessageType) {
  return (content: string, options: Omit<NyMessageOptions, 'type'> = {}) => open(content, { ...options, type })
}

export const nyMessage = {
  open,
  info: typed('info'),
  success: typed('success'),
  warning: typed('warning'),
  error: typed('error'),
  loading: (content: string, options: Omit<NyMessageOptions, 'type'> = {}) =>
    open(content, { duration: 0, ...options, type: 'loading' }),
  close: (id: number) => removeMessage(id),
  config: (options: Partial<NyMessageConfig>) => {
    Object.assign(nyMessageConfig, options)
  },
  destroy: () => {
    clearMessages()

    if (container) {
      render(null, container)
      container.remove()
      container = null
    }
  },
}

export default nyMessage
