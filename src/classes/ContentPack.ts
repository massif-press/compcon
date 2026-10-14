import { Sitrep } from './encounter/Sitrep'
import { ItemType } from './enums'
import { Environment } from './Environment'
import { IManufacturerData, Manufacturer } from './Manufacturer'
import { IMechSystemData, MechSystem } from './mech/components/equipment/MechSystem'
import { IMechWeaponData, MechWeapon } from './mech/components/equipment/MechWeapon'
import { IWeaponModData, WeaponMod } from './mech/components/equipment/WeaponMod'
import { Frame, IFrameData } from './mech/components/frame/Frame'
import { CoreBonus } from './pilot/components/corebonus/CoreBonus'
import { IPilotArmorData, PilotArmor } from './pilot/components/Loadout/equipment/PilotArmor'
import {
  IPilotEquipmentData,
  PilotEquipment,
} from './pilot/components/Loadout/equipment/PilotEquipment'
import { PilotGear } from './pilot/components/Loadout/equipment/PilotGear'
import { IPilotWeaponData, PilotWeapon } from './pilot/components/Loadout/equipment/PilotWeapon'
import { Reserve } from './pilot/components/reserves/Reserve'
import { Talent } from './pilot/components/talent/Talent'
import Tag, { ITagCompendiumData } from './Tag'
import * as PlayerAction from '@/classes/Action'
import { Action } from './Action'
import { Background, IBackgroundData } from './Background'
import { Status, IStatusData } from './Status'
import { Bond, BondPower, IBondData } from './pilot/components/bond/Bond'
import { Skill } from './pilot/components/skill/Skill'
import type { ICoreBonusData, IReserveData, ISkillData, ITalentData } from './pilot/components'
import { IEnvironmentData } from './Environment'
import { ISitrepData } from './encounter/Sitrep'
import { INpcClassData, NpcClass } from './npc/class/NpcClass'
import { INpcFeatureData, NpcFeature } from './npc/feature/NpcFeature'
import { INpcTemplateData, NpcTemplate } from './npc/template/NpcTemplate'
import { NpcFeatureFactory } from './npc/feature/NpcFeatureFactory'
import { EidolonLayer, IEidolonLayerData, CORE_LAYER_ID } from './npc/eidolon/EidolonLayer'
import { DowntimeAction, IDowntimeActionData } from './DowntimeAction'
import type { IndexItem } from '@/stores/nav'
import { stampContentKeys } from '@/i18n/contentKeys'

type ContentPackDependency = {
  name: string
  version: string
  link: string
}

type ContentPackChangelogEntry = {
  version: string
  date: string
  changes: string[]
}

interface IContentPackManifest {
  name: string
  item_prefix: string
  author: string
  version: string
  description?: string
  website?: string
  image_url?: string
  dependencies?: ContentPackDependency[]
  v3?: boolean
  version_history?: ContentPackChangelogEntry[]
}

interface IExtraNpcFeatureEntry {
  class_id?: string
  template_id?: string
  base_features?: string[]
  optional_features?: string[]
}

interface IContentPackData {
  manufacturers: IManufacturerData[]
  backgrounds: IBackgroundData[]
  coreBonuses: ICoreBonusData[]
  frames: IFrameData[]
  weapons: IMechWeaponData[]
  systems: IMechSystemData[]
  mods: IWeaponModData[]
  pilotGear: IPilotEquipmentData[]
  talents: ITalentData[]
  tags: ITagCompendiumData[]
  reserves: IReserveData[]
  skills: ISkillData[]

  npcClasses: INpcClassData[]
  npcFeatures: INpcFeatureData[]
  npcTemplates: INpcTemplateData[]
  extraNpcFeatures?: IExtraNpcFeatureEntry[]

  eidolonLayers: IEidolonLayerData[]

  bonds: IBondData[]
  bondPowers: BondPower[]

  actions: PlayerAction.IActionData[]

  statuses: IStatusData[]
  environments: IEnvironmentData[]
  sitreps: ISitrepData[]

  downtimeActions: IDowntimeActionData[]

  tables: any
  lists: any
  customStats?: any[]
  bonusDictionary?: any[]
}

type PackIssue = {
  severity: 'error' | 'warning'
  code: 'loadError' | 'invalidField' | 'unknownValue' | 'notArray'
  collection: string
  item: string
  field?: string
  detail?: string
}

function invalidField(collection: string, x: any): string | undefined {
  if (typeof x?.name !== 'string' || !x.name.trim()) return 'name'
  if (x.license && typeof x.license !== 'string') return 'license'
  if (collection === 'frames') {
    if (x.mechtype !== undefined && !Array.isArray(x.mechtype)) return 'mechtype'
    if (!x.stats || typeof x.stats !== 'object') return 'stats'
  }
  if (collection === 'weapons') {
    const valid = (d: any) => ['string', 'number'].includes(typeof d?.val) || Array.isArray(d?.val)
    for (const p of [x, ...(Array.isArray(x.profiles) ? x.profiles : [])])
      if (Array.isArray(p?.damage) && !p.damage.every(valid)) return 'damage'
  }
  return undefined
}

interface IContentPack {
  id: string
  active: boolean
  manifest: IContentPackManifest
  data: IContentPackData
  missing_content?: boolean
}

class ContentPack {
  public readonly ItemType: ItemType = ItemType.ContentPack
  public readonly CCVersion: number = 2
  private _manifest!: IContentPackManifest
  private _id!: string
  private _active!: boolean
  private _missing!: boolean
  private _data!: IContentPackData

  private _dependencies!: ContentPackDependency[]

  public Key: string
  public readonly Issues: PackIssue[] = []

  constructor(pack: IContentPack) {
    this.Key = crypto.randomUUID()

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    const { id, manifest, data, active } = pack

    self._missing = pack.missing_content || false
    self._active = self._missing ? false : active
    self._manifest = manifest

    this.CCVersion = manifest.v3 ? 3 : 2

    if (manifest.dependencies) self._dependencies = manifest.dependencies
    else self._dependencies = []

    self._data = data
    stampContentKeys(data) // tag nested (id-less) objects with their localization key prefix

    self._id = id

    const build = <D, T>(collection: string, items: D[] | undefined, make: (x: D) => T): T[] => {
      if (items === undefined || items === null) return []
      if (!Array.isArray(items)) {
        self.Issues.push({ severity: 'error', code: 'notArray', collection, item: '' })
        return []
      }
      return items.flatMap((x: any, i) => {
        const item = [x?.name, x?.id].find(v => typeof v === 'string' && v) ?? `#${i}`
        const field = invalidField(collection, x)
        if (field) {
          self.Issues.push({ severity: 'error', code: 'invalidField', collection, item, field })
          return []
        }
        try {
          return [make(x)]
        } catch (err) {
          self.Issues.push({
            severity: 'error',
            code: 'loadError',
            collection,
            item,
            detail: String(err),
          })
          return []
        }
      })
    }

    self._Tags = build('tags', self._data.tags, x => new Tag(x, self))

    self._Skills = build('skills', self._data.skills, x => new Skill(x, self))

    self._Manufacturers = build(
      'manufacturers',
      self._data.manufacturers,
      x => new Manufacturer(x, self)
    )
    self._Backgrounds = build('backgrounds', self._data.backgrounds, x => new Background(x, self))
    self._Statuses = build('statuses', self._data.statuses, x => new Status(x, self))
    self._CoreBonuses = build('coreBonuses', self._data.coreBonuses, x => new CoreBonus(x, self))
    self._Frames = build('frames', self._data.frames, x => new Frame(x, self))
    self._MechWeapons = build('weapons', self._data.weapons, x => new MechWeapon(x, self))
    self._MechSystems = build('systems', self._data.systems, x => new MechSystem(x, self))
    self._WeaponMods = build('mods', self._data.mods, x => new WeaponMod(x, self))
    self._PilotGear = build('pilotGear', self._data.pilotGear, x => {
      if (x.type?.toLowerCase() === 'weapon') return new PilotWeapon(x as IPilotWeaponData, self)
      else if (x.type?.toLowerCase() === 'armor') return new PilotArmor(x as IPilotArmorData, self)
      return new PilotGear(x as IPilotEquipmentData, self)
    })
    self._Talents = build('talents', self._data.talents, x => new Talent(x, self))

    self._NpcClasses = build('npcClasses', self._data.npcClasses, x => new NpcClass(x, self))

    self._NpcTemplates = build(
      'npcTemplates',
      self._data.npcTemplates,
      x => new NpcTemplate(x, self)
    )

    self._NpcFeatures = build('npcFeatures', self._data.npcFeatures, x =>
      NpcFeatureFactory.Build(x, self)
    )

    self._PlayerActions = build(
      'actions',
      self._data.actions,
      (x: PlayerAction.IActionData) => new PlayerAction.Action(x)
    )

    const layers = self._data.eidolonLayers
    self._EidolonLayers = build(
      'eidolonLayers',
      Array.isArray(layers) ? layers.filter(x => x?.id !== CORE_LAYER_ID) : layers,
      x => new EidolonLayer(x, self)
    )

    self._Environments = build(
      'environments',
      self._data.environments,
      x => new Environment(x, self)
    )

    self._Sitreps = build('sitreps', self._data.sitreps, x => new Sitrep(x, self))

    self._Tables = self._data.tables || []

    self._Lists = self._data.lists || {}

    self._Bonds = build('bonds', self._data.bonds, x => new Bond(x, self))

    self._BondPowers = self._data.bondPowers || []

    self._Reserves = build('reserves', self._data.reserves, x => new Reserve(x, self))

    self._DowntimeActions = build(
      'downtimeActions',
      self._data.downtimeActions,
      x => new DowntimeAction(x, self)
    )

    this._syncVisibility()
  }

  private _syncVisibility(): void {
    const hidden = !this.Active
    const collections: { IsHidden: boolean }[][] = [
      this._Manufacturers,
      this._CoreBonuses,
      this._Frames,
      this._MechWeapons,
      this._MechSystems,
      this._WeaponMods,
      this._PilotGear,
      this._Talents,
    ]
    for (const collection of collections) {
      for (const item of collection) item.IsHidden = hidden
    }
  }

  public get ID(): string {
    return this._id
  }
  public get Manifest(): IContentPackManifest {
    return this._manifest
  }
  public get IsV3(): boolean {
    return this.CCVersion >= 3
  }

  public get Name(): string {
    return this._manifest.name
  }
  public get Author(): string {
    return this._manifest.author
  }
  public get Version(): string {
    return this._manifest.version
  }
  public get LastUpdated(): number {
    if (this._manifest.version_history) {
      const latestEntry = this._manifest.version_history.reduce((latest, entry) => {
        const entryDate = new Date(entry.date).getTime()
        return entryDate > latest ? entryDate : latest
      }, 0)
      return latestEntry
    }
    return 0
  }
  public get Description(): string | undefined {
    return this._manifest.description
  }
  public get Website(): string | undefined {
    return this._manifest.website
  }
  public get ImageURL(): string | undefined {
    return this._manifest.image_url
  }
  public get Data(): IContentPackData {
    return this._data
  }

  private _Manufacturers: Manufacturer[] = []
  public get Manufacturers(): Manufacturer[] {
    return this._Manufacturers
  }

  private _Backgrounds: Background[] = []
  public get Backgrounds(): Background[] {
    return this._Backgrounds
  }

  private _Skills: Skill[] = []
  public get Skills(): Skill[] {
    return this._Skills
  }

  private _CoreBonuses: CoreBonus[] = []
  public get CoreBonuses(): CoreBonus[] {
    return this._CoreBonuses
  }

  private _Frames: Frame[] = []
  public get Frames(): Frame[] {
    return this._Frames
  }

  private _MechWeapons: MechWeapon[] = []
  public get MechWeapons(): MechWeapon[] {
    return this._MechWeapons
  }

  private _MechSystems: MechSystem[] = []
  public get MechSystems(): MechSystem[] {
    return this._MechSystems
  }

  private _WeaponMods: WeaponMod[] = []
  public get WeaponMods(): WeaponMod[] {
    return this._WeaponMods
  }

  private _PilotGear: PilotEquipment[] = []
  public get PilotGear(): PilotEquipment[] {
    return this._PilotGear
  }

  private _Talents: Talent[] = []
  public get Talents(): Talent[] {
    return this._Talents
  }

  private _Tags: Tag[] = []
  public get Tags(): Tag[] {
    return this._Tags
  }

  private _NpcClasses: NpcClass[] = []
  public get NpcClasses(): NpcClass[] {
    return this._NpcClasses
  }

  private _NpcTemplates: NpcTemplate[] = []
  public get NpcTemplates(): NpcTemplate[] {
    return this._NpcTemplates
  }

  private _NpcFeatures: NpcFeature[] = []
  public get NpcFeatures(): NpcFeature[] {
    return this._NpcFeatures
  }

  private _EidolonLayers: EidolonLayer[] = []
  public get EidolonLayers(): EidolonLayer[] {
    return this._EidolonLayers
  }

  private _Statuses: Status[] = []
  public get Statuses(): Status[] {
    return this._Statuses
  }

  private _Environments: Environment[] = []
  public get Environments(): Environment[] {
    return this._Environments
  }

  private _PlayerActions: Action[] = []
  public get Actions(): Action[] {
    return this._PlayerActions
  }

  private _Sitreps: Sitrep[] = []
  public get Sitreps(): Sitrep[] {
    return this._Sitreps
  }

  private _Tables: any = []
  public get Tables(): any {
    return this._Tables
  }

  private _Lists: any = {}
  public get Lists(): any {
    return this._Lists
  }

  private _Bonds: any = []
  public get Bonds(): any {
    return this._Bonds
  }

  private _BondPowers: BondPower[] = []
  public get BondPowers(): BondPower[] {
    return this._BondPowers
  }

  private _DowntimeActions: DowntimeAction[] = []
  public get DowntimeActions(): DowntimeAction[] {
    return this._DowntimeActions
  }

  private _Reserves: any = []
  public get Reserves(): any {
    return this._Reserves
  }

  public get CustomStats(): any[] {
    return this._data.customStats || []
  }

  public get BonusDictionary(): any[] {
    return this._data.bonusDictionary || []
  }

  public get ExtraNpcFeatures(): IExtraNpcFeatureEntry[] {
    return this._data.extraNpcFeatures || []
  }

  public get Missing(): boolean {
    return this._missing
  }

  public get Active(): boolean {
    if (this._missing) return false
    return this._active
  }

  public SetActive(active: boolean): void {
    if (this._missing) return
    this._active = active
    this._syncVisibility()
  }

  public get Dependencies(): ContentPackDependency[] {
    return this._dependencies
  }

  public get v3(): boolean {
    return this.CCVersion >= 3
  }

  public GetIndexItems(): IndexItem[] {
    return [
      ...this._Manufacturers,
      ...this._Frames,
      ...this._CoreBonuses,
      ...this._MechWeapons,
      ...this._MechSystems,
      ...this._WeaponMods,
      ...this._PilotGear,
      ...this._Talents,
      ...this._NpcClasses,
      ...this._NpcTemplates,
      ...this._NpcFeatures,
      ...this._EidolonLayers,
      ...this._Statuses,
      ...this._Environments,
      ...this._PlayerActions,
      ...this._Sitreps,
      ...this._Bonds,
      ...this._Reserves,
      ...this._DowntimeActions,
      ...this._Skills,
      ...this._Backgrounds,
      ...this._Tags,
      ...this._Tables,
      ...this._Lists,
      ...this._BondPowers,
    ]
  }

  public Serialize(): IContentPack {
    return {
      id: this._id,
      active: this._active,
      manifest: this._manifest,
      data: this._data,
    }
  }
}

export { ContentPack }
export type {
  PackIssue,
  IContentPack,
  IContentPackManifest,
  IContentPackData,
  IExtraNpcFeatureEntry,
  ContentPackDependency,
}
