import { nextTick, onBeforeUnmount, ref, watch, type CSSProperties, type Ref } from 'vue'

import type { NyPlacement } from '../types'

const VIEWPORT_GAP = 8

export interface NyPopupOptions {
  open: Ref<boolean>
  trigger: Ref<HTMLElement | null | undefined>
  panel: Ref<HTMLElement | null | undefined>
  placement?: () => NyPlacement
  offset?: () => number
  matchWidth?: () => boolean
  autoFlip?: () => boolean
  onOutside?: () => void
  onEscape?: () => void
}

export interface NyPopupInstance {
  style: Ref<CSSProperties>
  update: () => void
}

export function usePopup(options: NyPopupOptions): NyPopupInstance {
  const style = ref<CSSProperties>({})

  function resolveAxis(placement: NyPlacement, triggerRect: DOMRect, panelRect: DOMRect) {
    const [rawSide, align = 'center'] = placement.split('-')
    let side = rawSide
    const offset = options.offset?.() ?? 8
    const flip = options.autoFlip?.() ?? true

    if (flip) {
      if (side === 'bottom' && triggerRect.bottom + offset + panelRect.height > window.innerHeight - VIEWPORT_GAP) {
        side = 'top'
      } else if (side === 'top' && triggerRect.top - offset - panelRect.height < VIEWPORT_GAP) {
        side = 'bottom'
      } else if (side === 'right' && triggerRect.right + offset + panelRect.width > window.innerWidth - VIEWPORT_GAP) {
        side = 'left'
      } else if (side === 'left' && triggerRect.left - offset - panelRect.width < VIEWPORT_GAP) {
        side = 'right'
      }
    }

    return { side, align, offset }
  }

  function resolvePosition() {
    const triggerEl = options.trigger.value
    const panelEl = options.panel.value

    if (!triggerEl || !panelEl) {
      return
    }

    const triggerRect = triggerEl.getBoundingClientRect()
    const panelRect = panelEl.getBoundingClientRect()
    const { side, align, offset } = resolveAxis(options.placement?.() ?? 'bottom-start', triggerRect, panelRect)

    let top: number
    let left: number

    if (side === 'top' || side === 'bottom') {
      top = side === 'bottom' ? triggerRect.bottom + offset : triggerRect.top - panelRect.height - offset
      left =
        align === 'start'
          ? triggerRect.left
          : align === 'end'
            ? triggerRect.right - panelRect.width
            : triggerRect.left + (triggerRect.width - panelRect.width) / 2
    } else {
      left = side === 'right' ? triggerRect.right + offset : triggerRect.left - panelRect.width - offset
      top =
        align === 'start'
          ? triggerRect.top
          : align === 'end'
            ? triggerRect.bottom - panelRect.height
            : triggerRect.top + (triggerRect.height - panelRect.height) / 2
    }

    left = Math.min(Math.max(left, VIEWPORT_GAP), Math.max(VIEWPORT_GAP, window.innerWidth - panelRect.width - VIEWPORT_GAP))
    top = Math.min(Math.max(top, VIEWPORT_GAP), Math.max(VIEWPORT_GAP, window.innerHeight - panelRect.height - VIEWPORT_GAP))

    const next: CSSProperties = { top: `${Math.round(top)}px`, left: `${Math.round(left)}px` }

    if (options.matchWidth?.()) {
      next.minWidth = `${Math.round(triggerRect.width)}px`
    }

    style.value = next
  }

  function update() {
    resolvePosition()
  }

  function onScroll() {
    resolvePosition()
  }

  function onDocumentPointerDown(event: Event) {
    const target = event.target as Node | null

    if (!target) {
      return
    }

    if (options.trigger.value?.contains(target) || options.panel.value?.contains(target)) {
      return
    }

    options.onOutside?.()
  }

  function onDocumentKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
      return
    }

    options.onEscape?.()
  }

  function bind() {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    document.addEventListener('keydown', onDocumentKeydown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
  }

  function unbind() {
    document.removeEventListener('pointerdown', onDocumentPointerDown, true)
    document.removeEventListener('keydown', onDocumentKeydown)
    window.removeEventListener('scroll', onScroll, true)
    window.removeEventListener('resize', onScroll)
  }

  watch(
    options.open,
    async (open) => {
      if (!open) {
        unbind()
        return
      }

      await nextTick()
      resolvePosition()
      bind()
    },
    { immediate: true },
  )

  onBeforeUnmount(unbind)

  return { style, update }
}
