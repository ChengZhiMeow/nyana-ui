import { onBeforeUnmount, watch, type Ref } from 'vue'

let lockCount = 0
let originalOverflow = ''

export function lockScroll() {
  lockCount += 1

  if (lockCount === 1) {
    originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
}

export function unlockScroll() {
  if (lockCount === 0) {
    return
  }

  lockCount -= 1

  if (lockCount === 0) {
    document.body.style.overflow = originalOverflow
  }
}

export function useScrollLock(open: Ref<boolean>) {
  let locked = false

  function lock() {
    if (!locked) {
      lockScroll()
      locked = true
    }
  }

  function unlock() {
    if (locked) {
      unlockScroll()
      locked = false
    }
  }

  watch(open, (value) => (value ? lock() : unlock()), { immediate: true })

  onBeforeUnmount(unlock)

  return { lock, unlock }
}
