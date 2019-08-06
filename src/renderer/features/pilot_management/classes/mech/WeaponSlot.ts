import { MechWeapon, FittingSize, Pilot } from '@/class'
import _ from 'lodash'
import store from '@/store'
import WeaponMod from '@/features/_shared/classes/WeaponMod'

class WeaponSlot {
  private size: FittingSize
  private weapon: MechWeapon | null

  constructor(size: FittingSize) {
    this.size = size
    this.weapon = null
  }

  private save() {
    store.dispatch('saveData')
  }

  public get Size(): FittingSize {
    return this.size
  }

  public get Weapon(): MechWeapon | null {
    return this.weapon || null
  }

  public get Mod(): WeaponMod | null {
    return this.Weapon && this.Weapon.Mod
  }

  public EquipWeapon(weapon: MechWeapon, pilot?: Pilot) {
    const w = _.clone(weapon)
    if (w.IsLimited && pilot) w.Uses = w.MaxUses + pilot.LimitedBonus
    this.weapon = w
    this.save()
  }

  public UnequipWeapon() {
    this.weapon = null
    this.save()
  }

  public static Serialize(ws: WeaponSlot): IWeaponSlotData {
    return {
      size: ws.size,
      weapon: ws.Weapon ? MechWeapon.Serialize(ws.Weapon) : null,
    }
  }

  public static Deserialize(slotData: IWeaponSlotData): WeaponSlot {
    let ws = new WeaponSlot(slotData.size as FittingSize)
    if (slotData.weapon) {
      const ew = MechWeapon.Deserialize(slotData.weapon)
      if (ew) ws.EquipWeapon(ew)
    }
    return ws
  }
}

export default WeaponSlot
