export interface PrintOptions {
  mech_id: string
  loadout_index: number
  combo: boolean
}

export const usePrintOptions = {
  computed: {
    blank(this: any): boolean {
      return this.options.content.title === 'Blank'
    },
    landscape(this: any): boolean {
      return this.options.orientation.title === 'Landscape'
    },
  },
  methods: {
    hasPilotOption(this: any, title: string): boolean {
      return this.options.pilotInclude.some((x: any) => x.title === title)
    },
    hasMechOption(this: any, title: string): boolean {
      return this.options.mechInclude.some((x: any) => x.title === title)
    },
    signed(val: number): string {
      return val > -1 ? `+${val}` : `${val}`
    },
    showTag(id: string): boolean {
      const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type']
      return !hiddenTags.includes(id)
    },
    showCollectedEffect(w: any): boolean {
      if (!w.Profiles[0].Effect) return false
      return w.Profiles.every((x: any) => x.Effect === w.Profiles[0].Effect)
    },
  },
}
