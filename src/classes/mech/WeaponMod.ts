import { store } from '@/store'
import {
  Tag,
  WeaponType,
  WeaponSize,
  ItemType,
  Damage,
  Range,
  MechEquipment,
  SystemType,
} from '@/class'
import { IDamageData, IRangeData, IMechEquipmentData, ITagCompendiumData } from '@/interface'

interface IWeaponModData extends IMechEquipmentData {
  allowed_types?: WeaponType[]
  allowed_sizes?: WeaponSize[]
  restricted_types?: WeaponType[]
  restricted_sizes?: WeaponSize[]
  added_tags?: ITagData[]
  added_damage?: IDamageData[]
  added_range?: IRangeData[]
}

class WeaponMod extends MechEquipment {
  public readonly AllowedTypes: WeaponType[]
  public readonly AllowedSizes: WeaponSize[]
  public readonly RestrictedTypes: WeaponType[]
  public readonly RestrictedSizes: WeaponSize[]
  public readonly AddedTags: Tag[]
  public readonly AddedDamage: Damage[]
  public readonly AddedRange: Range[]

  public constructor(data: IWeaponModData, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName)
    this.AllowedTypes =
      data.allowed_types || Object.keys(WeaponType).map(k => WeaponType[k as string])
    this.AllowedSizes =
      data.allowed_sizes || Object.keys(WeaponSize).map(k => WeaponSize[k as string])
    this.RestrictedTypes = data.restricted_types || []
    this.RestrictedSizes = data.restricted_sizes || []
    this.AddedTags = data.added_tags ? Tag.Deserialize(data.added_tags) : []
    this.AddedDamage = data.added_damage ? data.added_damage.map(x => new Damage(x)) : []
    this.AddedRange = data.added_range ? data.added_range.map(x => new Range(x)) : []
    this.ItemType = ItemType.WeaponMod
  }

  public get Type(): SystemType {
    return SystemType.Mod
  }

  public get PossibleTypes(): WeaponType[] {
    return this.AllowedTypes.filter(
      x => !this.RestrictedTypes.some(y => y.toLowerCase() === x.toLowerCase())
    )
  }

  public get PossibleSizes(): WeaponSize[] {
    return this.AllowedSizes.filter(
      x => !this.RestrictedSizes.some(y => y.toLowerCase() === x.toLowerCase())
    )
  }

  public static Serialize(item: WeaponMod): IEquipmentData {
    return {
      id: item.ID,
      uses: item.Uses || 0,
      destroyed: item.Destroyed || false,
      cascading: item.IsCascading || false,
      note: item.Note,
    }
  }

  public static Deserialize(data: IEquipmentData): WeaponMod {
    const item = store.getters.instantiate('WeaponMods', data.id) as WeaponMod
    item.Uses = data.uses || 0
    item._destroyed = data.destroyed || false
    item._cascading = data.cascading || false
    item._note = data.note
    return item
  }
}

export { WeaponMod, IWeaponModData }
