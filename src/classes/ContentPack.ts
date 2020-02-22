import { mapValues } from 'lodash'

import {
  Manufacturer,
  CoreBonus,
  Frame,
  MechWeapon,
  MechSystem,
  WeaponMod,
  PilotEquipment,
  PilotWeapon,
  PilotArmor,
  PilotGear,
  Talent,
  Tag,
  NpcClass,
  NpcTemplate,
  NpcFeature,
  NpcWeapon,
  NpcReaction,
  NpcTrait,
  NpcSystem,
  NpcTech,
} from '@/class'
import {
  IManufacturerData,
  ICoreBonusData,
  IFrameData,
  IMechWeaponData,
  IMechSystemData,
  IWeaponModData,
  IPilotEquipmentData,
  IPilotWeaponData,
  IPilotArmorData,
  IPilotGearData,
  ITalentData,
  INpcClassData,
  INpcFeatureData,
  INpcTemplateData,
  INpcWeaponData,
  INpcReactionData,
  INpcSystemData,
  INpcTechData,
  ITagCompendiumData,
} from '@/interface'

export interface IContentPackManifest {
  name: string
  item_prefix: string
  author: string
  version: string
  description?: string
  website?: string
  image_url?: string
}
interface IContentPackData {
  manufacturers: IManufacturerData[]
  coreBonuses: ICoreBonusData[]
  frames: IFrameData[]
  weapons: IMechWeaponData[]
  systems: IMechSystemData[]
  mods: IWeaponModData[]
  pilotGear: IPilotEquipmentData[]
  talents: ITalentData[]
  tags: ITagCompendiumData[]

  npcClasses: INpcClassData[]
  npcFeatures: INpcFeatureData[]
  npcTemplates: INpcTemplateData[]
}

export interface IContentPack {
  id: string
  active: boolean
  manifest: IContentPackManifest
  data: IContentPackData
}

export class ContentPack {
  private _manifest: IContentPackManifest
  private _id: string
  public get ID(): string {
    return this._id
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
  public get Description(): string | undefined {
    return this._manifest.description
  }
  public get Website(): string | undefined {
    return this._manifest.website
  }
  public get ImageURL(): string | undefined {
    return this._manifest.image_url
  }

  private _data: IContentPackData

  private _Manufacturers: Manufacturer[] = []
  public get Manufacturers(): Manufacturer[] {
    return this._Manufacturers
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

  private _active: boolean
  public get Active(): boolean {
    return this._active
  }
  public SetActive(active: boolean): void {
    this._active = active
  }

  constructor(pack: IContentPack) {
    const { id, active, manifest, data } = pack

    this._active = active
    this._manifest = manifest
    this._data = mapValues(data, (items: any) => items.map(item => ({ ...item, brew: id })))
    this._id = id

    this._Manufacturers = this._data.manufacturers?.map(x => new Manufacturer(x)) || []
    this._CoreBonuses = this._data.coreBonuses?.map(x => new CoreBonus(x)) || []
    this._Frames = this._data.frames?.map(x => new Frame(x)) || []
    this._MechWeapons = this._data.weapons?.map(x => new MechWeapon(x)) || []
    this._MechSystems = this._data.systems?.map(x => new MechSystem(x)) || []
    this._WeaponMods = this._data.mods?.map(x => new WeaponMod(x)) || []
    this._PilotGear =
      this._data.pilotGear?.map(function(x) {
        if (x.type === 'weapon') return new PilotWeapon(x as IPilotWeaponData)
        else if (x.type === 'armor') return new PilotArmor(x as IPilotArmorData)
        return new PilotGear(x as IPilotGearData)
      }) || []
    this._Talents = this._data.talents?.map(x => new Talent(x)) || []
    this._Tags = this._data.tags?.map(x => new Tag(x)) || []

    this._NpcFeatures =
      this._data.npcFeatures?.map(function(x) {
        if (x.type.toLowerCase() === 'weapon') return new NpcWeapon(x as INpcWeaponData)
        else if (x.type.toLowerCase() === 'reaction') return new NpcReaction(x as INpcReactionData)
        else if (x.type.toLowerCase() === 'trait') return new NpcTrait(x)
        else if (x.type.toLowerCase() === 'system') return new NpcSystem(x as INpcSystemData)
        return new NpcTech(x as INpcTechData)
      }) || []
    this._NpcClasses = this._data.npcClasses?.map(x => new NpcClass(x)) || []
    this._NpcTemplates = this._data.npcTemplates?.map(x => new NpcTemplate(x)) || []
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
