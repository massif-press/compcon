import store from '@/store'
import _ from 'lodash'
import {
  Damage,
  Range,
  WeaponMod,
  WeaponSize,
  WeaponType,
  ItemType,
  MechEquipment,
  DamageType,
  RangeType,
} from '@/class'

// TODO:
// class WeaponAmmo {}

class MechWeapon extends MechEquipment {
  private size: WeaponSize
  private weapon_type: WeaponType
  private damage?: Damage[]
  private range?: Range[]
  private loaded: boolean
  private mod: WeaponMod | null
  // private ammo?: WeaponAmmo | null;

  constructor(weaponData: any) {
    super(weaponData)
    this.size = weaponData.mount
    this.weapon_type = weaponData.type
    if (weaponData.damage) this.damage = weaponData.damage.map((x: any) => new Damage(x))
    if (weaponData.range) this.range = weaponData.range.map((x: any) => new Range(x))
    this.loaded = true
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

  public get Damage(): Damage[] {
    return this.damage || []
  }

  public get DamageType(): DamageType[] {
    return this.damage.map(x => x.Type)
  }

  public get Range(): Range[] {
    return this.range || []
  }

  public get RangeType(): RangeType[] {
    return this.range.map(x => x.Type)
  }

  public set Mod(mod: WeaponMod | null) {
    this.mod = _.clone(mod)
  }

  public get Mod(): WeaponMod | null {
    return this.mod || null
  }

  public get IsLoading(): boolean {
    return this.Tags.some(x => x.IsLoading)
  }

  public get Loaded(): boolean {
    return this.loaded
  }

  public set Loaded(loaded: boolean) {
    this.loaded = loaded
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
      uses: item.Uses || 0,
      destroyed: item.IsDestroyed || false,
      loaded: item.Loaded || true,
      mod: item.Mod ? item.Mod.ID : null,
    }
  }

  public static Deserialize(itemData: IMechWeaponData): MechWeapon {
    let item = store.getters.getItemById('MechWeapons', itemData.id)
    item.Notes = itemData.notes
    item.uses = itemData.uses || 0
    item.destroyed = itemData.destroyed || false
    item.loaded = itemData.loaded || true
    item.Mod = itemData.mod ? store.getters.getItemById('WeaponMods', itemData.mod) : null
    return item
  }
}

export default MechWeapon
