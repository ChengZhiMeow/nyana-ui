import { reactive } from 'vue'

export type NyNotificationType = 'info' | 'success' | 'warning' | 'error'

export type NyNotificationPlacement = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'

export interface NyNotificationItem {
  id: number
  type: NyNotificationType
  title: string
  desc: string
  duration: number
  closable: boolean
  placement: NyNotificationPlacement
}

export interface NyNotificationConfig {
  placement: NyNotificationPlacement
  offset: number
  duration: number
  maxCount: number
  width: number
}

export const nyNotifications = reactive<NyNotificationItem[]>([])

export const nyNotificationConfig = reactive<NyNotificationConfig>({
  placement: 'topRight',
  offset: 24,
  duration: 4.5,
  maxCount: 5,
  width: 340,
})

let seed = 0

export function pushNotification(item: Omit<NyNotificationItem, 'id'>) {
  seed += 1
  nyNotifications.unshift({ ...item, id: seed })

  while (nyNotifications.length > nyNotificationConfig.maxCount) {
    nyNotifications.pop()
  }

  return seed
}

export function removeNotification(id: number) {
  const index = nyNotifications.findIndex((item) => item.id === id)

  if (index >= 0) {
    nyNotifications.splice(index, 1)
  }
}

export function clearNotifications() {
  nyNotifications.splice(0, nyNotifications.length)
}
