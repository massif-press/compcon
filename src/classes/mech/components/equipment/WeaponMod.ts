import { CompendiumStore } from '@/features/compendium/store'
import { ContentPack } from '../../../ContentPack'
import { Damage, IDamageData } from '../../../Damage'
import { WeaponType, WeaponSize, ItemType, SystemType } from '../../../enums'
import { IEquipmentData, IMechEquipmentData, MechEquipment } from './MechEquipment'
import { IRangeData, Range } from '../../../Range'
import Tag, { ITagData } from '../../../Tag'
import {
  ActiveEffect,
  IActiveEffectData,
} from '@/classes/components/feature/active_effects/ActiveEffect'
import { initActiveEffectCallbacks } from '@/classes/components/feature/active_effects/_activeEffectUtils'

interface IWeaponModData extends IMechEquipmentData {
  allowed_types?: WeaponType[]
  allowed_sizes?: WeaponSize[]
  restricted_types?: WeaponType[] // deprecated: transformed to allowed_* on load
  restricted_sizes?: WeaponSize[] // deprecated: transformed to allowed_* on load
  added_tags?: ITagData[]
  added_damage?: IDamageData[]
  added_range?: IRangeData[]
  on_miss?: string | IActiveEffectData
  on_attack?: string | IActiveEffectData
  on_hit?: string | IActiveEffectData
  on_crit?: string | IActiveEffectData
}

class WeaponMod extends MechEquipment {
  public readonly SystemType = SystemType.Mod
  public readonly AllowedTypes: WeaponType[]
  public readonly AllowedSizes: WeaponSize[]
  public readonly AddedTags: Tag[]
  public readonly AddedDamage: Damage[]
  public readonly AddedRange: Range[]

  public OnMiss?: ActiveEffect
  public OnAttack?: ActiveEffect
  public OnHit?: ActiveEffect
  public OnCrit?: ActiveEffect

  public constructor(data: IWeaponModData, pack?: ContentPack) {
    super(data as IMechEquipmentData, pack)
    const allTypes = Object.keys(WeaponType).map(k => WeaponType[k as string])
    const allSizes = Object.keys(WeaponSize).map(k => WeaponSize[k as string])
    const baseTypes = data.allowed_types || allTypes
    const baseSizes = data.allowed_sizes || allSizes
    this.AllowedTypes = data.restricted_types?.length
      ? baseTypes.filter(
          t => !data.restricted_types!.some(r => r.toLowerCase() === t.toLowerCase())
        )
      : baseTypes
    this.AllowedSizes = data.restricted_sizes?.length
      ? baseSizes.filter(
          s => !data.restricted_sizes!.some(r => r.toLowerCase() === s.toLowerCase())
        )
      : baseSizes
    this.AddedTags = data.added_tags
      ? Tag.Deserialize(data.added_tags, pack?.Data.tags, pack?.Name || '')
      : []
    this.AddedDamage = data.added_damage ? data.added_damage.map(x => new Damage(x)) : []
    if (this.AddedDamage && this.AddedDamage.length)
      this.AddedDamage.forEach(d => d.setDamageAttributes(this))

    this.AddedRange = data.added_range ? data.added_range.map(x => new Range(x)) : []

    initActiveEffectCallbacks(data, this, this)

    this.ItemType = ItemType.WeaponMod
  }

  public get Color(): string {
    return 'mod'
  }

  public get Type(): SystemType {
    return SystemType.Mod
  }

  public static Serialize(item: WeaponMod): IEquipmentData {
    return {
      id: item.ID,
      data: item.ItemData,
      note: item.Note,
    }
  }

  public static Deserialize(data: IEquipmentData): WeaponMod {
    let item
    if (CompendiumStore().has('WeaponMods', data.id))
      item = CompendiumStore().instantiate('WeaponMods', data.id) as WeaponMod
    else {
      if (!data.data)
        throw new Error(`LCP item "${data.id}" is not installed and no instance data was saved`)
      item = new WeaponMod(data.data, data.data.pack)
      item.FromInstance = true
    }

    item._note = data.note
    return item
  }
}

export { WeaponMod }
export type { IWeaponModData }
