import _ from 'lodash'
import { Mount, WeaponSlot, CoreBonus, MountType, FittingSize } from '@/class'

class EquippableMount extends Mount {
  private _bonuses: CoreBonus[]
  private _lock_target?: Mount

  public constructor(mtype: MountType) {
    super(mtype)
    this._bonuses = []
  }

  public Lock(target?: Mount): void {
    this.lock = true
    this._lock_target = target
    this.save()
  }

  public Unlock(): void {
    this.lock = false
    this._lock_target = null
    this.save()
  }

  public get LockTarget(): Mount | null {
    return this._lock_target
  }

  public Clear(): void {
    this.Slots.forEach(s => {
      s.UnequipWeapon()
    })
    this.save()
  }

  public AddCoreBonus(cb: CoreBonus): void {
    this._bonuses.push(cb)
    if (cb.ID === 'retrofit') {
      this.slots = [new WeaponSlot(FittingSize.Main), new WeaponSlot(FittingSize.Auxiliary)]
    }
    this.save()
  }

  public RemoveCoreBonus(cb: CoreBonus): void {
    const index = this._bonuses.findIndex(x => _.isEqual(x, cb))
    if (index > -1) {
      this._bonuses.splice(index, 1)
      if (cb.ID === 'retrofit') {
        this.generateSlots(this.Type)
      }
    }
    this.save()
  }

  public ClearBonuses(): void {
    this._bonuses = []
    this.generateSlots(this.Type)
    this.save()
  }

  public get Bonuses(): CoreBonus[] {
    return this._bonuses
  }

  public static Serialize(m: EquippableMount): IMountData {
    return {
      mount_type: m.Type,
      lock: m.IsLocked,
      slots: m.slots.map(x => WeaponSlot.Serialize(x)),
      extra: m.extra.map(x => WeaponSlot.Serialize(x)),
      bonus_effects: m.Bonuses.map(x => x.ID),
    }
  }

  public static Deserialize(mountData: IMountData): EquippableMount {
    let m = new EquippableMount(mountData.mount_type as MountType)
    m.slots = mountData.slots.map(x => WeaponSlot.Deserialize(x))
    m.extra = mountData.extra.map(x => WeaponSlot.Deserialize(x))
    m._bonuses = mountData.bonus_effects.map(x => CoreBonus.Deserialize(x))
    m.lock = mountData.lock
    m.getID()
    return m
  }
}

export default EquippableMount
