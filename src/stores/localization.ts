import { defineStore } from 'pinia'
import { GetAll } from '@/io/Storage'
import type { LanguagePatch } from '@/i18n/validatePatch'

export const LocalizationStore = defineStore('localization', {
  state: () => ({
    catalog: {} as Record<string, string>,
    patches: [] as LanguagePatch[],
    patchesLoaded: false,
  }),
  actions: {
    setCatalog(catalog: Record<string, string>) {
      this.catalog = catalog
    },
    mergeCatalog(partial: Record<string, string>) {
      Object.assign(this.catalog, partial)
    },
    clearCatalog() {
      this.catalog = {}
    },
    async ensurePatchesLoaded() {
      if (this.patchesLoaded) return
      try {
        this.patches = (await GetAll('translations')) as LanguagePatch[]
      } catch {
        this.patches = []
      }
      this.patchesLoaded = true
    },
  },
})
