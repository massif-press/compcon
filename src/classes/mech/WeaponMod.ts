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
import { IDamageData, IRangeData, IMechEquipmentData } from '@/interface'

interface IWeaponModData extends IMechEquipmentData {
  sp: number
  applied_to: WeaponType[]
  applied_string: string
  description: string
  restricted_mounts: WeaponSize[]
  tags: ITagData[]
  added_tags?: ITagData[]
  added_damage?: IDamageData
  added_range?: IRangeData
}

class WeaponMod extends MechEquipment {
  private _applied_to: WeaponType[]
  private _applied_string: string
  private _restricted_mounts: WeaponSize[]
  private _added_tags: ITagData[]
  private _added_damage?: Damage
  private _added_range?: Range

  public constructor(weaponModData: IWeaponModData) {
    super(weaponModData)
    this.sp = weaponModData.sp
    this._applied_to = weaponModData.applied_to
    this._applied_string = weaponModData.applied_string
    this._description = weaponModData.description
    this._restricted_mounts = weaponModData.restricted_mounts
    this._tags = weaponModData.tags
    this._added_tags = weaponModData.added_tags || []
    if (weaponModData.added_damage) this._added_damage = new Damage(weaponModData.added_damage)
    if (weaponModData.added_range) this._added_range = new Range(weaponModData.added_range)
    this._item_type = ItemType.WeaponMod
  }

  public get Type(): SystemType {
    return SystemType.Mod
  }

  public get SP(): number {
    return this.sp
  }

  public get AppliedTo(): WeaponType[] {
    return this._applied_to
  }

  public get AppliedString(): string {
    return this._applied_string
  }

  public get Restricted(): WeaponSize[] {
    return this._restricted_mounts
  }

  public get AddedTags(): Tag[] {
    return Tag.Deserialize(this._added_tags)
  }

  public get AddedDamage(): Damage | null {
    return this._added_damage || null
  }

  public get AddedRange(): Range | null {
    return this._added_range || null
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
    item._uses = data.uses || 0
    item._destroyed = data.destroyed || false
    item._cascading = data.cascading || false
    item._note = data.note
    return item
  }
}

export { WeaponMod, IWeaponModData }
