import { store } from '@/store'
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
import { IMechEquipmentData, IDamageData, IRangeData } from '@/interface'

// TODO:
// class WeaponAmmo {}

interface IMechWeaponData extends IMechEquipmentData {
  mount: WeaponSize
  type: WeaponType
  damage: IDamageData[]
  range: IRangeData[]
}

class MechWeapon extends MechEquipment {
  private _size: WeaponSize
  private _weapon_type: WeaponType
  private _damage?: Damage[]
  private _range?: Range[]
  private _loaded: boolean
  private _mod: WeaponMod | null
  // private ammo?: WeaponAmmo | null;

  public constructor(weaponData: IMechWeaponData) {
    super(weaponData)
    this._size = weaponData.mount
    this._weapon_type = weaponData.type
    if (weaponData.damage) this._damage = weaponData.damage.map(x => new Damage(x))
    if (weaponData.range) this._range = weaponData.range.map(x => new Range(x))
    this._loaded = true
    this._mod = null
    this._item_type = ItemType.MechWeapon
  }

  public get Size(): WeaponSize {
    return this._size
  }

  public get Type(): WeaponType {
    return this._weapon_type
  }

  public get SP(): number {
    if (!this.Mod) return this.sp
    return this.Mod.SP + this.sp
  }

  public get Damage(): Damage[] {
    return this._damage || []
  }

  public get DamageType(): DamageType[] {
    return this._damage.map(x => x.Type)
  }

  public get Range(): Range[] {
    return this._range || []
  }

  public get RangeType(): RangeType[] {
    return this._range.map(x => x.Type)
  }

  public set Mod(_mod: WeaponMod | null) {
    this._mod = _.clone(_mod)
  }

  public get Mod(): WeaponMod | null {
    return this._mod || null
  }

  public get IsLoading(): boolean {
    return this.Tags.some(x => x.IsLoading)
  }

  public get Loaded(): boolean {
    return this._loaded
  }

  public set Loaded(_loaded: boolean) {
    this._loaded = _loaded
  }

  // public set Ammo(ammo: WeaponAmmo | null) {
  //   this.ammo = ammo;
  // }

  // public get Ammo(): WeaponAmmo | null {
  //   return this.ammo || null;
  // }

  public static Serialize(item: MechWeapon): IMechWeaponSaveData {
    return {
      id: item.ID,
      uses: item.Uses || 0,
      destroyed: item.IsDestroyed || false,
      loaded: item.Loaded || true,
      mod: item.Mod ? item.Mod.ID : null,
    }
  }

  public static Deserialize(itemData: IMechWeaponSaveData): MechWeapon {
    let item = store.getters.instantiate('MechWeapons', itemData.id)
    item.uses = itemData.uses || 0
    item.destroyed = itemData.destroyed || false
    item._loaded = itemData.loaded || true
    item.Mod = itemData.mod ? WeaponMod.Deserialize(itemData.mod) : null
    return item
  }
}

export { MechWeapon, IMechWeaponData }
