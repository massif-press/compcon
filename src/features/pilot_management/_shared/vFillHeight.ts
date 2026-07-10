import type { Directive } from 'vue'

const RESERVE = 54
const MOBILE_MAX = 960

function fit(el: HTMLElement) {
  if (window.innerWidth < MOBILE_MAX) {
    el.style.height = ''
    return
  }
  const top = el.getBoundingClientRect().top
  el.style.height = `${Math.max(0, window.innerHeight - top - RESERVE)}px`
}

const handlers = new WeakMap<HTMLElement, () => void>()

const vFillHeight: Directive<HTMLElement> = {
  mounted(el) {
    const run = () => requestAnimationFrame(() => fit(el))
    run()
    window.addEventListener('resize', run)
    handlers.set(el, run)
  },
  updated(el) {
    requestAnimationFrame(() => fit(el))
  },
  unmounted(el) {
    const run = handlers.get(el)
    if (run) window.removeEventListener('resize', run)
    handlers.delete(el)
  },
}

export default vFillHeight
