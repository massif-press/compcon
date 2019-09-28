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

class WeaponMod extends MechEquipment {
  private applied_to: WeaponType[]
  private applied_string: string
  private restricted_mounts: WeaponSize[]
  private added_tags: ITagData[]
  private added_damage?: Damage
  private added_range?: Range

  constructor(weaponModData: any) {
    super(weaponModData)
    this.sp = weaponModData.sp
    this.applied_to = weaponModData.applied_to
    this.applied_string = weaponModData.applied_string
    this.description = weaponModData.description
    this.restricted_mounts = weaponModData.restricted_mounts
    this.tags = weaponModData.tags
    this.added_tags = weaponModData.added_tags || []
    if (weaponModData.added_damage) this.added_damage = new Damage(weaponModData.added_damage)
    if (weaponModData.added_range) this.added_range = new Range(weaponModData.added_range)
    this.item_type = ItemType.WeaponMod
  }

  public get Type(): SystemType {
    return SystemType.Mod
  }

  public get SP(): number {
    return this.sp
  }

  public get AppliedTo(): WeaponType[] {
    return this.applied_to
  }

  public get AppliedString(): string {
    return this.applied_string
  }

  public get Restricted(): WeaponSize[] {
    return this.restricted_mounts
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this.tags)
  }

  public get AddedTags(): Tag[] {
    return Tag.Deserialize(this.added_tags)
  }

  public get AddedDamage(): Damage | null {
    return this.added_damage || null
  }

  public get AddedRange(): Range | null {
    return this.added_range || null
  }

  public static Deserialize(id: string): WeaponMod {
    return store.getters.getItemById('WeaponMods', id)
  }
}

export default WeaponMod
