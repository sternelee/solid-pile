import { makeEventListener } from "@solid-primitives/event-listener"
import { type Accessor, onCleanup, onMount } from "solid-js"
import { copyToClipboard } from "~/utils"

export function useCopyCode() {
  const timeoutIdMap: Map<HTMLElement, NodeJS.Timeout> = new Map()
  onMount(() => {
    makeEventListener(window, "click", e => {
      const el = e.target as HTMLElement
      if (el.matches(".copy")) {
        const parent = el.parentElement
        const sibling = el.nextElementSibling as HTMLPreElement | null
        if (!parent || !sibling) {
          return
        }

        const text = sibling.innerText

        copyToClipboard(text.trim()).then(() => {
          el.classList.add("copied")
          clearTimeout(timeoutIdMap.get(el))
          const timeoutId = setTimeout(() => {
            el.classList.remove("copied")
            el.blur()
            timeoutIdMap.delete(el)
          }, 2000)
          timeoutIdMap.set(el, timeoutId)
        })
      }
    })
  })
}

export function clickOutside(el: Element, accessor: Accessor<any>) {
  const onClick = (e: any) => !el.contains(e.target) && accessor()?.()
  document.body.addEventListener("click", onClick)

  onCleanup(() => document.body.removeEventListener("click", onClick))
}

export function observerEl(options: {
  target: HTMLElement
  root?: HTMLElement | null
  threshold?: number
  show: () => any
}) {
  const { target, root = null, threshold = 0.01, show = () => null } = options
  const io = new window.IntersectionObserver(
    entries => {
      if (entries[0].intersectionRatio >= threshold) {
        show()
      }
    },
    { threshold: [threshold], root }
  )
  io.observe(target)
  onCleanup(() => io.disconnect())
}
