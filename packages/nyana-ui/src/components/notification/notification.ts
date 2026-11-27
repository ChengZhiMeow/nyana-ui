import { createVNode, render } from 'vue'

import NyNotificationHost from './NyNotificationHost.vue'
import {
  clearNotifications,
  nyNotificationConfig,
  pushNotification,
  removeNotification,
  type NyNotificationConfig,
  type NyNotificationItem,
  type NyNotificationPlacement,
  type NyNotificationType,
} from './notificationStore'

export type { NyNotificationItem, NyNotificationPlacement, NyNotificationType } from './notificationStore'

export interface NyNotificationOptions {
  title?: string
  desc?: string
  type?: NyNotificationType
  duration?: number
  closable?: boolean
  placement?: NyNotificationPlacement
}

let container: HTMLElement | null = null

function ensureHost() {
  if (container) {
    return
  }

  container = document.createElement('div')
  container.className = 'ny-notification-root'
  document.body.appendChild(container)
  render(createVNode(NyNotificationHost), container)
}

function open(options: NyNotificationOptions) {
  ensureHost()

  const item: Omit<NyNotificationItem, 'id'> = {
    type: options.type ?? 'info',
    title: options.title ?? '',
    desc: options.desc ?? '',
    duration: options.duration ?? nyNotificationConfig.duration,
    closable: options.closable ?? true,
    placement: options.placement ?? nyNotificationConfig.placement,
  }

  return pushNotification(item)
}

function typed(type: NyNotificationType) {
  return (options: Omit<NyNotificationOptions, 'type'>) => open({ ...options, type })
}

export const nyNotification = {
  open,
  info: typed('info'),
  success: typed('success'),
  warning: typed('warning'),
  error: typed('error'),
  loading: (options: Omit<NyNotificationOptions, 'type'>) =>
    open({ duration: 0, ...options, type: 'info' }),
  close: (id: number) => removeNotification(id),
  config: (options: Partial<NyNotificationConfig>) => {
    Object.assign(nyNotificationConfig, options)
  },
  destroy: () => {
    clearNotifications()

    if (container) {
      render(null, container)
      container.remove()
      container = null
    }
  },
}

export default nyNotification
