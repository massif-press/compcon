import { computed, nextTick, onMounted } from 'vue'
import { NavStore } from '@/stores'

function useSrdView(props: { preScroll?: string }) {
  const lang = computed(() => NavStore().Language)

  function getLangItem(item: any, type: string) {
    if (typeof item === 'string') return item
    return item[type][lang.value] ? item[type][lang.value] : item[type].en
  }

  function scrollTo(item: any): void {
    const title = getLangItem(item, 'title')
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

  return { lang, getLangItem, scrollTo }
}

export { useSrdView }
