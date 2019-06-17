import store from '@/store'
import _ from 'lodash'
import {
  Damage,
  Range,
  WeaponMod,
  Tag,
  WeaponSize,
  WeaponType,
  ItemType,
  MechEquipment,
} from '@/class'

// TODO:
// class WeaponAmmo {}

class MechWeapon extends MechEquipment {
  private size: WeaponSize
  private weapon_type: WeaponType
  private damage?: Damage[]
  private range?: Range[]

  private mod: WeaponMod | null
  // private ammo?: WeaponAmmo | null;

  constructor(weaponData: any) {
    super(weaponData)
    this.size = weaponData.mount
    this.weapon_type = weaponData.type
    if (weaponData.damage)
      this.damage = weaponData.damage.map((x: any) => new Damage(x))
    if (weaponData.range)
      this.range = weaponData.range.map((x: any) => new Range(x))
    this.mod = null
    this.item_type = ItemType.MechWeapon
  }

  public get Size(): WeaponSize {
    return this.size
  }

  public get Type(): WeaponType {
    return this.weapon_type
  }

  public get SP(): number {
    if (!this.Mod) return this.sp
    return this.Mod.SP + this.sp
  }

  public get IsUnique(): boolean {
    return this.Tags.some(x => x.IsUnique)
  }

  public get Damage(): Damage[] {
    return this.damage || []
  }

  public get Range(): Range[] {
    return this.range || []
  }

  public set Mod(mod: WeaponMod | null) {
    this.mod = _.clone(mod)
  }

  public get Mod(): WeaponMod | null {
    return this.mod || null
  }

  // public set Ammo(ammo: WeaponAmmo | null) {
  //   this.ammo = ammo;
  // }

  // public get Ammo(): WeaponAmmo | null {
  //   return this.ammo || null;
  // }

  public static Serialize(item: MechWeapon): IMechWeaponData {
    return {
      id: item.ID,
      notes: item.Notes,
      mod: item.Mod ? item.Mod.ID : null,
    }
  }

  public static Deserialize(itemData: IMechWeaponData): MechWeapon {
    let item = store.getters.getItemById('MechWeapons', itemData.id)
    item.Notes = itemData.notes
    item.Mod = itemData.mod
      ? store.getters.getItemById('WeaponMods', itemData.mod)
      : null
    return item
  }
}

export default MechWeapon
