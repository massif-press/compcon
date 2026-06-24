import { defineStore } from 'pinia'

export const LocalizationStore = defineStore('localization', {
  state: () => ({
    catalog: {} as Record<string, string>,
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
  },
})
