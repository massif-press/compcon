import type { InjectionKey, Ref } from 'vue'
import type { CompendiumItem } from '@/classes/CompendiumItem'
import type License from '@/classes/pilot/components/license/License'
import type { useCompendiumFacets } from './useCompendiumFacets'

export type BrowserOptions = {
  views: string[]
  initialView: string
  groups: string[]
  initialGroup: string
  noSource?: boolean
  hideTitle?: boolean
  showExotics?: boolean
}

export type CompendiumFacets = ReturnType<typeof useCompendiumFacets>

export interface CompendiumBrowserContext {
  props: any
  facets: CompendiumFacets
  selectedItem: Ref<any>
  comparisons: Ref<any[]>
  view: Ref<string>
  group: Ref<string>
  open: Ref<string[]>
  lcpFilter: Ref<string[]>
  isEquippable: (item: CompendiumItem) => boolean
  toggleItem: (item: CompendiumItem | License) => void
  handleEquip: (item: CompendiumItem) => void
  emitEquip: (item: CompendiumItem) => void
  mf: (id: string) => any
}

export const CompendiumBrowserKey: InjectionKey<CompendiumBrowserContext> = Symbol('compendiumBrowser')
