import { computed } from 'vue'

function usePrintOptions(props: { options: any }) {
  const blank = computed(() => props.options?.content?.title === 'Blank')
  const landscape = computed(() => props.options?.orientation?.title === 'Landscape')

  function hasPilotOption(title: string): boolean {
    return props.options?.pilotInclude?.some((x: any) => x.title === title) ?? false
  }

  function hasMechOption(title: string): boolean {
    return props.options?.mechInclude?.some((x: any) => x.title === title) ?? false
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
