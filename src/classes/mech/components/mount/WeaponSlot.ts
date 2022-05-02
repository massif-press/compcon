import Vue from 'vue'
import { Mech, MechWeapon, FittingSize } from '@/class'
import _ from 'lodash'
import { store } from '@/store'
import { WeaponMod } from '@/class'

class WeaponSlot {
  private Parent: Mech
  private _size: FittingSize
  private _weapon: MechWeapon | null

  public constructor(parent: Mech, size: FittingSize) {
    this.Parent = parent
    this._size = size
    this._weapon = null
  }

  private save(): void {
    this.Parent.SaveController.save()
  }

  public get Size(): FittingSize {
    return this._size
  }

  public get Weapon(): MechWeapon | null {
    return this._weapon || null
  }

  public get Mod(): WeaponMod | null {
    return this.Weapon && this.Weapon.Mod
  }

  public EquipWeapon(weapon: MechWeapon, save = true): void {
    const w = _.cloneDeep(weapon)
    Vue.set(this, '_weapon', w)
    if (save) this.save()
  }

  public UnequipWeapon(): void {
    Vue.set(this, '_weapon', null)
    this.save()
  }

  public static Serialize(ws: WeaponSlot): IWeaponSlotData {
    return {
      size: ws.Size,
      weapon: ws.Weapon ? MechWeapon.Serialize(ws.Weapon) : null,
    }
  }

  public static Deserialize(parent: Mech, slotData: IWeaponSlotData): WeaponSlot {
    const ws = new WeaponSlot(parent, slotData.size as FittingSize)
    if (slotData.weapon) {
      const w = MechWeapon.Deserialize(slotData.weapon)
      if (w) ws.EquipWeapon(w, false)
    }
    return ws
  }
}

export default WeaponSlot
