import _ from 'lodash'
import { Mount, WeaponSlot, CoreBonus, MountType, FittingSize, MechLoadout } from '@/class'

class EquippableMount extends Mount {
  private _bonuses: CoreBonus[]
  private _lock_target?: Mount

  public constructor(mtype: MountType, parent: MechLoadout) {
    super(mtype, parent)
    this._bonuses = []
  }

  public Lock(target?: Mount): void {
    this.lock = true
    this._lock_target = target
    this.Clear()
  }

  public Unlock(): void {
    this.lock = false
    this._lock_target = null
    this.save()
  }

  public LockModification(): void {
    this.modifiable = false
    this._bonuses = []
    this.save()
  }

  public unlockModification(): void {
    this.modifiable = true
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
    if (cb.ID === 'cb_mount_retrofitting') {
      this._name_override = 'Retrofitted Mount'
      this.slots = [
        new WeaponSlot(FittingSize.Main, this),
        new WeaponSlot(FittingSize.Auxiliary, this),
      ]
    }
    this.save()
  }

  public RemoveCoreBonus(cb: CoreBonus): void {
    const index = this._bonuses.findIndex(x => _.isEqual(x, cb))
    if (index > -1) {
      this._bonuses.splice(index, 1)
      if (cb.ID === 'cb_mount_retrofitting') {
        this._name_override = ''
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
      modifiable: m.IsModifiable,
    }
  }

  public static Deserialize(mountData: IMountData, parent: MechLoadout): EquippableMount {
    const m = new EquippableMount(mountData.mount_type as MountType, parent)
    m.slots = mountData.slots.map(x => WeaponSlot.Deserialize(x, m))
    m.extra = mountData.extra.map(x => WeaponSlot.Deserialize(x, m))
    m._bonuses = mountData.bonus_effects.map(x => CoreBonus.Deserialize(x))
    m.lock = mountData.lock
    m.modifiable = mountData.modifiable === undefined ? true : mountData.modifiable
    m.getID()
    return m
  }
}

export default EquippableMount
