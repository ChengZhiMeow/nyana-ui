import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export interface NyFocusTrapOptions {
  restore?: boolean
}

export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  options: NyFocusTrapOptions = {},
) {
  let lastActive: HTMLElement | null = null

  function focusables(): HTMLElement[] {
    const root = container.value

    if (!root) {
      return []
    }

    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
    )
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') {
      return
    }

    const list = focusables()
    const root = container.value

    if (!list.length) {
      event.preventDefault()
      root?.focus()

      return
    }

    const first = list[0]!
    const last = list[list.length - 1]!
    const current = document.activeElement

    if (event.shiftKey) {
      if (current === first || !root?.contains(current)) {
        event.preventDefault()
        last.focus()
      }

      return
    }

    if (current === last || !root?.contains(current)) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(
    active,
    async (value) => {
      if (value) {
        lastActive = document.activeElement instanceof HTMLElement ? document.activeElement : null

        await nextTick()

        const list = focusables()
        ;(list[0] ?? container.value)?.focus()
        document.addEventListener('keydown', onKeydown, true)

        return
      }

      document.removeEventListener('keydown', onKeydown, true)

      if (options.restore !== false) {
        lastActive?.focus()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown, true)
  })
}
