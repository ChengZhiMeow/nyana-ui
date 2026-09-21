import { reactive } from 'vue'

export type NyMessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'

export interface NyMessageItem {
  id: number
  type: NyMessageType
  content: string
  duration: number
  closable: boolean
}

export interface NyMessageConfig {
  top: number
  duration: number
  maxCount: number
}

export const nyMessages = reactive<NyMessageItem[]>([])

export const nyMessageConfig = reactive<NyMessageConfig>({
  top: 24,
  duration: 3,
  maxCount: 6,
})

let seed = 0

export function pushMessage(item: Omit<NyMessageItem, 'id'>) {
  seed += 1
  nyMessages.push({ ...item, id: seed })

  while (nyMessages.length > nyMessageConfig.maxCount) {
    nyMessages.shift()
  }

  return seed
}

export function removeMessage(id: number) {
  const index = nyMessages.findIndex((item) => item.id === id)

  if (index >= 0) {
    nyMessages.splice(index, 1)
  }
}

export function clearMessages() {
  nyMessages.splice(0, nyMessages.length)
}
