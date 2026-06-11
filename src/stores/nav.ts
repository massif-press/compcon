import { defineStore } from 'pinia'
import { CompendiumStore } from '@/features/compendium/store'
import { PilotStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { EncounterStore } from '@/features/gm/store/encounter_store'
import { NarrativeStore } from '@/features/gm/store/narrative_store'
import { CampaignStore } from '@/features/gm/store/campaign_store'
import * as CompendiumRoutes from '@/features/compendium/routes'
import * as GmRoutes from '@/features/gm/routes'
import { UserStore } from '@/user/store'
import { setUiLocale } from '@/i18n/loadLocale'
import logger from '@/user/logger'

export type IndexItem = {
  id: string
  title: string
  type: string
  pack: string
  path: string
  icon: string
}

export const NavStore = defineStore('nav', {
  state: () => ({
    _srdTab: 0,
    _language: 'en',
    _searchHistory: [] as IndexItem[],
    _staticIndex: [] as IndexItem[],
    _compendiumIndex: [] as IndexItem[],
    _pilotIndex: [] as IndexItem[],
    _mechIndex: [] as IndexItem[],
    _npcIndex: [] as IndexItem[],
    _narrativeIndex: [] as IndexItem[],
    _encounterIndex: [] as IndexItem[],
    _campaignIndex: [] as IndexItem[],
  }),
  getters: {
    SrdTab: state => state._srdTab,
    Language: state => state._language,
    SearchHistory: state => state._searchHistory,
    Index: state => [
      ...state._staticIndex,
      ...state._compendiumIndex,
      ...state._pilotIndex,
      ...state._mechIndex,
      ...state._npcIndex,
      ...state._narrativeIndex,
      ...state._encounterIndex,
      ...state._campaignIndex,
    ],
  },
  actions: {
    loadSearchHistory() {
      const history = localStorage.getItem('cc_searchdata')
      if (history) this._searchHistory = JSON.parse(history)
    },
    setSearchHistory(payload: IndexItem) {
      this._searchHistory.push(payload)
      if (this._searchHistory.length > 5) this._searchHistory.shift()
      localStorage.setItem('cc_searchdata', JSON.stringify(this._searchHistory))
    },
    setSrdTab(tab: number) {
      this._srdTab = tab
    },
    setLanguage(lang: string, persist = true) {
      this._language = lang
      setUiLocale(lang).catch(err => logger.warn(`Failed to load locale ${lang}: ${err}`))
      if (persist) {
        const user = UserStore().User
        if (user) user.Language = lang
      }
    },
    addToIndex(items: IndexItem | IndexItem[]) {
      const arr = Array.isArray(items) ? items : [items]
      this._compendiumIndex.push(...arr)
    },
    async CreateIndex(): Promise<void> {
      const staticIndex: IndexItem[] = []

      staticIndex.push(
        ...CompendiumRoutes.default
          .filter(x => !!x.searchData)
          .map(route => ({
            id: route.path,
            title: route.searchData.title,
            type: 'Compendium Page',
            pack: '',
            path: route.path,
            icon: route.searchData.icon,
          }))
      )

      staticIndex.push(
        ...GmRoutes.default[0].children
          .filter((x: any) => !!x.searchData)
          .map((route: any) => ({
            id: route.path,
            title: route.searchData.title,
            type: 'GM Tool',
            pack: '',
            path: '/gm/' + route.path,
            icon: route.searchData.icon,
          }))
      )

      staticIndex.push({
        id: '/pilot-roster',
        title: 'Pilot Roster',
        type: 'Roster View',
        pack: '',
        path: '/pilot-roster',
        icon: 'mdi-account-group',
      })

      this._staticIndex = staticIndex
      this._compendiumIndex = CompendiumStore().itemIndexes
      this._pilotIndex = PilotStore().pilotIndexes
      this._mechIndex = PilotStore().mechIndexes
      this._npcIndex = [
        ...NpcStore().unitIndexes,
        ...NpcStore().doodadIndexes,
        ...NpcStore().eidolonIndexes,
      ]
      this._narrativeIndex = NarrativeStore().narrativeIndexes
      this._encounterIndex = EncounterStore().encounterIndexes
      this._campaignIndex = [
        ...CampaignStore().editableCampaignIndexes,
        ...CampaignStore().publishedCampaignIndexes,
      ]

      this.loadSearchHistory()
    },

    rebuildCompendiumIndex(): void {
      this._compendiumIndex = CompendiumStore().itemIndexes
    },

    updatePilotEntry(pilot: any): void {
      this._pilotIndex = this._pilotIndex.filter(x => x.id !== pilot.ID)
      this._mechIndex = this._mechIndex.filter(x => !x.path.startsWith(`/pilot/${pilot.ID}/`))
      if (!pilot.SaveController?.IsDeleted) {
        this._pilotIndex.push({
          id: pilot.ID,
          title: `${pilot.Callsign} (${pilot.Name})`,
          type: 'Pilot',
          pack: '',
          path: `/pilot/${pilot.ID}`,
          icon: 'cc:pilot',
        })
        pilot.Mechs?.forEach((m: any) => {
          this._mechIndex.push({
            id: m.ID,
            title: m.Name,
            type: `Mech (${pilot.Callsign} // ${pilot.Name})`,
            pack: '',
            path: `/pilot/${pilot.ID}/mech/${m.ID}`,
            icon: 'cc:mech',
          })
        })
      }
    },

    removePilotEntry(pilotId: string): void {
      this._pilotIndex = this._pilotIndex.filter(x => x.id !== pilotId)
      this._mechIndex = this._mechIndex.filter(x => !x.path.startsWith(`/pilot/${pilotId}/`))
    },

    updateNpcEntry(npc: any): void {
      this._npcIndex = this._npcIndex.filter(x => x.id !== npc.ID)
      if (npc.SaveController?.IsDeleted) return
      const brews = npc.BrewController?.Brews?.map((x: any) => x.LcpName).join(', ') ?? ''
      const icon = npc.Icon || 'cc:encounter'
      if (npc.npcType === 'unit' || npc.DataType === 'unit') {
        this._npcIndex.push({
          id: npc.ID,
          title: `${npc.Name}${npc.NpcClassController?.HasClass
            ? ` (T${npc.NpcClassController.Tier} ${npc.NpcClassController.Class?.Name || ''})`
            : ''}`,
          type: 'Unit',
          pack: brews,
          path: `/gm/npcs/unit/${npc.ID}`,
          icon,
        })
      } else if (npc.npcType === 'doodad' || npc.DataType === 'doodad') {
        this._npcIndex.push({
          id: npc.ID,
          title: npc.Name,
          type: 'Doodad',
          pack: '',
          path: `/gm/npcs/doodad/${npc.ID}`,
          icon: npc.Icon || 'cc:generic_item',
        })
      } else if (npc.npcType === 'eidolon' || npc.DataType === 'eidolon') {
        this._npcIndex.push({
          id: npc.ID,
          title: npc.Name,
          type: 'Eidolon',
          pack: brews,
          path: `/gm/npcs/eidolon/${npc.ID}`,
          icon: npc.Icon || 'cc:monist',
        })
      }
    },

    removeNpcEntry(npcId: string): void {
      this._npcIndex = this._npcIndex.filter(x => x.id !== npcId)
    },

    updateEncounterEntry(encounter: any): void {
      this._encounterIndex = this._encounterIndex.filter(x => x.id !== encounter.ID)
      if (!encounter.SaveController?.IsDeleted) {
        this._encounterIndex.push({
          id: encounter.ID,
          title: encounter.Name,
          type: 'Encounter',
          pack: '',
          path: `/gm/encounters/${encounter.ID}`,
          icon: encounter.Icon || 'cc:encounter',
        })
      }
    },

    removeEncounterEntry(encounterId: string): void {
      this._encounterIndex = this._encounterIndex.filter(x => x.id !== encounterId)
    },

    updateNarrativeEntry(item: any): void {
      this._narrativeIndex = this._narrativeIndex.filter(x => x.id !== item.ID)
      if (!item.SaveController?.IsDeleted) {
        this._narrativeIndex.push({
          id: item.ID,
          title: item.Name,
          type: item.ItemType,
          pack: '',
          path: `/gm/narrative/${item.ItemType?.toLowerCase()}/${item.ID}`,
          icon: item.Icon || 'cc:generic_item',
        })
      }
    },

    removeNarrativeEntry(itemId: string): void {
      this._narrativeIndex = this._narrativeIndex.filter(x => x.id !== itemId)
    },

    updateCampaignEntry(campaign: any): void {
      this._campaignIndex = this._campaignIndex.filter(x => x.id !== campaign.ID)
      this._campaignIndex.push({
        id: campaign.ID,
        title: campaign.Title,
        type: 'Campaign (Unpublished)',
        pack: '',
        path: `/gm/campaigns/edit/${campaign.ID}`,
        icon: 'mdi-pencil-circle-outline',
      })
    },

    removeCampaignEntry(campaignId: string): void {
      this._campaignIndex = this._campaignIndex.filter(x => x.id !== campaignId)
    },
  },
})
