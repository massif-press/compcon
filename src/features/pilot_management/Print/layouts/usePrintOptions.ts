import { computed } from 'vue'
import { CONTENT, ORIENTATION, has } from '@/ui/print/options'

function usePrintOptions(props: { options: any }) {
  const blank = computed(() => props.options?.content?.key === CONTENT.blank.key)
  const landscape = computed(() => props.options?.orientation?.key === ORIENTATION.landscape.key)

  function hasPilotOption(key: string): boolean {
    return has(props.options?.pilotInclude, key)
  }

  function hasMechOption(key: string): boolean {
    return has(props.options?.mechInclude, key)
  }

  function signed(val: number): string {
    return val > -1 ? `+${val}` : `${val}`
  }

  function showTag(id: string): boolean {
    const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type']
    return !hiddenTags.includes(id)
  }

  function showCollectedEffect(w: any): boolean {
    if (!w.Profiles[0].Effect) return false
    return w.Profiles.every((x: any) => x.Effect === w.Profiles[0].Effect)
  }

  return { blank, landscape, hasPilotOption, hasMechOption, signed, showTag, showCollectedEffect }
}

export { usePrintOptions }
