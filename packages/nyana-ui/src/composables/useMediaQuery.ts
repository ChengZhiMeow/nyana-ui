import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export function useMediaQuery(query: () => string) {
  const matches = ref(false)

  let media: MediaQueryList | null = null

  function update(event: MediaQueryList | MediaQueryListEvent) {
    matches.value = event.matches
  }

  function subscribe(value: string) {
    media?.removeEventListener('change', update)

    media = window.matchMedia(value)
    update(media)
    media.addEventListener('change', update)
  }

  onMounted(() => {
    subscribe(query())
    watch(query, (value) => subscribe(value))
  })

  onBeforeUnmount(() => {
    media?.removeEventListener('change', update)
  })

  return matches
}

export function useBelow(breakpoint: () => number) {
  return useMediaQuery(() => `(max-width: ${breakpoint() - 0.02}px)`)
}
