import { nextTick, onMounted } from 'vue'
import { localize } from '@/i18n/localize'

function useSrdView(props: { preScroll?: string }) {
  function srd(item: any, field: string): string {
    if (typeof item === 'string') return item
    return localize(item.id, field, item[field]?.en ?? '')
  }

  function scrollTo(item: any): void {
    const title = typeof item === 'string' ? item : item.title.en
    const el = document.getElementById(`e_${title.replace(/\W/g, '')}`)
    if (el) {
      const yOffset = -60
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  onMounted(() => {
    if (props.preScroll) {
      nextTick(() => scrollTo(props.preScroll))
    } else {
      window.scrollTo({ top: 0 })
    }
  })

  return { srd, scrollTo }
}

export { useSrdView }
