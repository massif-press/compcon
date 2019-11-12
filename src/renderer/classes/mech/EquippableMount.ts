import _ from 'lodash'
import { Mount, WeaponSlot, CoreBonus, MountType } from '@/class'

class EquippableMount extends Mount {
  private bonus_effects: CoreBonus[]

  public constructor(mtype: MountType) {
    super(mtype)
    this.bonus_effects = []
  }

  public Lock(): void {
    this.lock = true
    this.save()
  }

  public Unlock(): void {
    this.lock = false
    this.save()
  }

  public Clear(): void {
    this.Slots.forEach(s => {
      s.UnequipWeapon()
    })
    this.save()
  }

  public AddCoreBonus(cb: CoreBonus): void {
    this.bonus_effects.push(cb)
    this.save()
  }

  public RemoveCoreBonus(cb: CoreBonus): void {
    const index = this.bonus_effects.findIndex(x => _.isEqual(x, cb))
    if (index > -1) this.bonus_effects.splice(index, 1)
    this.save()
  }

  public get BonusEffects(): CoreBonus[] {
    return this.bonus_effects
  }

  public static Serialize(m: EquippableMount): IMountData {
    return {
      mount_type: m.Type,
      lock: m.IsLocked,
      slots: m.slots.map(x => WeaponSlot.Serialize(x)),
      extra: m.extra.map(x => WeaponSlot.Serialize(x)),
      bonus_effects: m.BonusEffects.map(x => x.ID),
    }
  }

  public static Deserialize(mountData: IMountData): EquippableMount {
    let m = new EquippableMount(mountData.mount_type as MountType)
    m.slots = mountData.slots.map(x => WeaponSlot.Deserialize(x))
    m.extra = mountData.extra.map(x => WeaponSlot.Deserialize(x))
    m.bonus_effects = mountData.bonus_effects.map(x => CoreBonus.Deserialize(x))
    m.lock = mountData.lock
    return m
  }
}

export default EquippableMount
