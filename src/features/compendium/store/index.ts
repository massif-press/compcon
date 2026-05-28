import { v4 as uuid } from 'uuid'
import { defineStore } from 'pinia'
import * as _ from 'lodash-es'
import License from '@/classes/pilot/components/license/License'
import { CoreBonus } from '@/classes/pilot/components/corebonus/CoreBonus'
import { Skill } from '@/classes/pilot/components/skill/Skill'
import { Frame } from '@/classes/mech/components/frame/Frame'
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import { WeaponMod } from '@/classes/mech/components/equipment/WeaponMod'
import { MechSystem } from '@/classes/mech/components/equipment/MechSystem'
import Tag, { ITagCompendiumData } from '@/classes/Tag'
import { Talent } from '@/classes/pilot/components/talent/Talent'
import { Reserve } from '@/classes/pilot/components/reserves/Reserve'
import { Manufacturer } from '@/classes/Manufacturer'
import { PilotEquipmentFactory } from '@/classes/pilot/components/Loadout/equipment/PilotEquipmentFactory'
import { Background } from '@/classes/Background'
import * as PlayerAction from '@/classes/Action'
import { Bond } from '@/classes/pilot/components/bond/Bond'
import { Environment } from '@/classes/Environment'
import { Sitrep } from '@/classes/encounter/Sitrep'
import { LicensedItem } from '@/classes/pilot/components/license/LicensedItem'
import { DowntimeAction } from '@/classes/DowntimeAction'
import { CompendiumItem } from '@/classes/CompendiumItem'
import { Status } from '@/classes/Status'
import { NpcFeature } from '@/classes/npc/feature/NpcFeature'
import { NpcClass } from '@/classes/npc/class/NpcClass'
import { NpcTemplate } from '@/classes/npc/template/NpcTemplate'
import { EidolonLayer } from '@/classes/npc/eidolon/EidolonLayer'
import { NavStore } from '@/stores/nav'
import type { IndexItem } from '@/stores/nav'
import { BondPower } from '@/classes/pilot/components/bond/Bond'
import logger from '@/user/logger'
import { StatController } from '@/classes/components/combat/stats/StatController'
import {
  registerBonus,
  clearBonusExtensions,
} from '@/classes/components/feature/bonus/bonus_dictionary'
import { RollableTable } from '@/classes/narrative/elements/RollableTable'
import { IPilotEquipmentData } from '@/classes/pilot/components/Loadout/equipment/PilotEquipment'
import { ContentPackStore } from './ContentPackStore'
import { ContentCollectionStore } from './ContentCollectionStore'
import { collect, itemTypeMap, lancerData } from './compendiumUtils'
import type { ContentPack } from '@/classes/ContentPack'
import type { ContentCollection } from '@/classes/components/cloud/ContentCollection'

export { ContentPackStore } from './ContentPackStore'
export { ContentCollectionStore } from './ContentCollectionStore'

export const CompendiumStore = defineStore('compendium', {
  state: () => ({
    LancerVersion: '',
    CCVersion: '',
    nfErr: { err: 'ID not found' },
    loaded: false,
  }),
  getters: {
    _packs(): ContentPack[] {
      return ContentPackStore().ContentPacks as unknown as ContentPack[]
    },
    ContentPacks(): ContentPack[] {
      return this._packs
    },
    ContentCollections(): ContentCollection[] {
      return ContentCollectionStore().ContentCollections as unknown as ContentCollection[]
    },
    hasNpcAccess(): boolean {
      if (!this.loaded) return false
      return this.NpcClasses.length > 0
    },
    hasBondsAccess(): boolean {
      if (!this.loaded) return false
      return this.Bonds.length > 0
    },
    hasEidolonAccess(): boolean {
      if (!this.loaded) return false
      return this.EidolonLayers.length > 0
    },
    NpcClasses(): NpcClass[] {
      return collect<NpcClass>(this._packs, 'npc_classes', NpcClass)
    },
    NpcTemplates(): NpcTemplate[] {
      return collect<NpcTemplate>(this._packs, 'npc_templates', NpcTemplate)
    },
    NpcFeatures(): NpcFeature[] {
      return collect<NpcFeature>(this._packs, 'npc_features')
    },
    EidolonLayers(): EidolonLayer[] {
      return collect<EidolonLayer>(this._packs, 'eidolon_layers')
    },
    Bonds(): Bond[] {
      return collect<Bond>(this._packs, 'bonds', Bond)
    },
    Backgrounds(): Background[] {
      return collect<Background>(this._packs, 'backgrounds', Background)
    },
    Talents(): Talent[] {
      return collect<Talent>(this._packs, 'talents', Talent)
    },
    CoreBonuses(): CoreBonus[] {
      return collect<CoreBonus>(this._packs, 'core_bonuses', CoreBonus)
    },
    Frames(): Frame[] {
      return collect<Frame>(this._packs, 'frames', Frame)
    },
    Manufacturers(): Manufacturer[] {
      return collect<Manufacturer>(this._packs, 'manufacturers', Manufacturer)
    },
    MechWeapons(): MechWeapon[] {
      return collect<MechWeapon>(this._packs, 'weapons', MechWeapon)
    },
    WeaponMods(): WeaponMod[] {
      return collect<WeaponMod>(this._packs, 'mods', WeaponMod)
    },
    MechSystems(): MechSystem[] {
      return collect<MechSystem>(this._packs, 'systems', MechSystem)
    },
    Skills(): Skill[] {
      return collect<Skill>(this._packs, 'skills', Skill)
    },
    Actions(): PlayerAction.Action[] {
      return collect<PlayerAction.Action>(this._packs, 'actions', PlayerAction.Action)
    },
    Tags(): Tag[] {
      return collect<Tag>(this._packs, 'tags', Tag)
    },
    TagData(): ITagCompendiumData[] {
      return collect<ITagCompendiumData>(this._packs, 'tags')
    },
    Reserves(): Reserve[] {
      return collect<Reserve>(this._packs, 'reserves', Reserve)
    },
    Statuses(): Status[] {
      return collect<Status>(this._packs, 'statuses', Status)
    },
    Environments(): Environment[] {
      return collect<Environment>(this._packs, 'environments', Environment)
    },
    Sitreps(): Sitrep[] {
      return collect<Sitrep>(this._packs, 'sitreps', Sitrep)
    },
    PilotGear(): any[] {
      return collect<IPilotEquipmentData>(this._packs, 'pilot_gear').map(x =>
        PilotEquipmentFactory(x)
      )
    },
    DowntimeActions(): DowntimeAction[] {
      return collect<DowntimeAction>(this._packs, 'downtime_actions', DowntimeAction)
    },
    Tables(): RollableTable[] {
      return collect<RollableTable>(this._packs, 'tables', RollableTable)
    },

    Lists(): Record<string, any[]> {
      const lists = { ...lancerData.lists }
      this._packs
        .filter(pack => pack.Active)
        .forEach(pack => {
          for (const t in (pack as any).Lists) {
            if (lists[t] !== undefined) lists[t] = [...lists[t], ...(pack as any).Lists[t]]
            else lists[t] = (pack as any).Lists[t]
          }
        })
      return lists
    },

    ExtraBondPowers(): BondPower[] {
      const powers = [] as BondPower[]
      this._packs
        .filter(pack => pack.Active)
        .forEach(pack => {
          powers.push(...(pack as any).BondPowers)
        })
      return powers
    },

    ExtraNpcFeatureMap(): Record<string, { base: string[]; optional: string[] }> {
      const map: Record<string, { base: string[]; optional: string[] }> = {}
      this._packs
        .filter(pack => pack.Active)
        .forEach(pack => {
          ;(pack as any).ExtraNpcFeatures.forEach((entry: any) => {
            const key = entry.class_id ?? entry.template_id
            if (!key) return
            if (!map[key]) map[key] = { base: [], optional: [] }
            if (entry.base_features) map[key].base.push(...entry.base_features)
            if (entry.optional_features) map[key].optional.push(...entry.optional_features)
          })
        })
      return map
    },

    Licenses(): License[] {
      return (this.Frames as any)
        .filter((x: any) => x.LicenseLevel !== 0 && !x.IsHidden)
        .map((frame: Frame) => new License(frame))
    },

    instantiate(): (itemType: string, id: string) => CompendiumItem | null {
      return (itemType: string, id: string) => {
        const col = (this as any)[itemType]
        if (col && col instanceof Array) {
          const i = col.find((x: any) => x.ID === id || x.id === id)
          if (i) {
            const cl = _.cloneDeep(i) as any
            cl.InstanceID = uuid()
            return cl as CompendiumItem
          }
          return null
        }
        logger.error(`Invalid item type: ${itemType}`)
        return null
      }
    },

    referenceByID(): (itemType: string, id: string) => CompendiumItem {
      return (itemType: string, id: string) => {
        const col = (this as any)[itemType]
        if (col && col instanceof Array) {
          const i = col.find((x: any) => x.ID === id || x.id === id)
          if (i) return i as CompendiumItem
          throw new Error(`ID not found: ${id}`)
        }
        throw new Error(`Invalid item type: ${itemType}`)
      }
    },

    has(): (itemType: string, id: string) => boolean {
      return (itemType: string, id: string): boolean => {
        if ((this as any)[itemType] && (this as any)[itemType] instanceof Array) {
          return (this as any)[itemType].some((x: any) => x.ID === id || x.id === id)
        }
        logger.error(`Invalid item type: ${itemType}`)
        return false
      }
    },

    referenceFromID(): (itemType: string, id: string) => CompendiumItem {
      return (itemType: string, id: string) => {
        const mappedType = itemTypeMap[itemType]
        const col = (this as any)[mappedType]
        if (col && col instanceof Array) {
          const i = col.find((x: any) => x.ID === id || x.id === id)
          if (i) return i as CompendiumItem
          throw new Error(`ID not found: ${id}`)
        }
        throw new Error(`Invalid item type: ${mappedType}`)
      }
    },

    getItemCollection(): (itemType: string) => CompendiumItem[] {
      return (itemType: string) => {
        return ((this as any)[itemType] as CompendiumItem[]).filter(
          x => x && !x.IsHidden && !(x as any).Specialty
        )
      }
    },

    lcpNames(): string[] {
      const frame_packs = this.Frames.map(x => x.LcpName)
      const lcp_packs = this._packs.map(x => x.Name)
      return _.unionWith(frame_packs, lcp_packs, _.isEqual)
    },

    itemsByLcp(): (key: string) => Record<string, CompendiumItem[]> {
      return (key: string) => {
        const col = (this as any)[key] as CompendiumItem[] | undefined
        if (!col) throw new Error(`Invalid LCP key: ${key}`)
        return _.groupBy(col, 'LcpName') as Record<string, CompendiumItem[]>
      }
    },

    allEquipment(): LicensedItem[] {
      return (this.MechWeapons as LicensedItem[])
        .concat(this.WeaponMods as LicensedItem[])
        .concat(this.MechSystems as LicensedItem[])
        .concat(this.Frames as LicensedItem[])
        .filter(x => !x.IsHidden)
    },

    referenceLink(): (item: CompendiumItem, internal?: boolean) => string {
      return (item: CompendiumItem, internal: boolean = false): string => {
        const prepend = internal
          ? ''
          : import.meta.env.DEV
            ? 'localhost:5173'
            : 'https://compcon.app'
        return `${prepend}/link/${item.Brew?.LcpName || 'core'}/${item.ItemType.toLowerCase()}/${
          item.ID
        }`
      }
    },

    itemIndexes(): IndexItem[] {
      const index: IndexItem[] = []
      const keys = [...new Set(Object.values(itemTypeMap))]

      keys.forEach(key => {
        index.push(
          ...(this as any)[key]
            .filter((x: any) => x.ItemType)
            .map((item: any) => ({
              id: item.ID,
              title: item.Name,
              type: item.ItemType,
              pack: item.Brew?.LcpName || 'Lancer Core Book',
              path: this.referenceLink(item, true),
              icon: item.Icon,
            }))
        )
      })

      return index
    },
  },
  actions: {
    async refreshExtraContent(): Promise<void> {
      const packStore = ContentPackStore()
      const collStore = ContentCollectionStore()
      this.loaded = false
      packStore.ContentPacks = []
      await packStore.loadExtraContent()
      await collStore.loadContentCollections()

      StatController.ClearCustomStats()
      clearBonusExtensions()
      for (const pack of packStore.ContentPacks.filter(p => p.Active)) {
        for (const stat of (pack as any).CustomStats)
          StatController.RegisterCustomStat(stat)
        for (const entry of (pack as any).BonusDictionary) registerBonus(entry)
      }

      this.loaded = true
      NavStore().rebuildCompendiumIndex()
    },
    find(itemType: string, id: string): any {
      if ((this as any)[itemType] && (this as any)[itemType] instanceof Array) {
        const i = (this as any)[itemType].find((x: any) => x.ID === id || x.id === id)
        if (i) return i
        return this.nfErr
      }
      logger.error(`Invalid item type: ${itemType}`)
      return this.nfErr
    },
  },
})
