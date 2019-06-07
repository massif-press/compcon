import _ from 'lodash'
import store from '@/store'
import {
  MechWeapon,
  WeaponSlot,
  CoreBonus,
  MountType,
  FittingSize,
} from '@/class'
import { WeaponSize } from '@/features/_shared/classes/enums'

abstract class Mount {
  private mount_type: MountType
  protected lock: boolean
  protected slots: WeaponSlot[]
  protected extra: WeaponSlot[]
  private name_override: string

  constructor(mtype: MountType) {
    this.mount_type = mtype
    this.lock = false
    this.extra = []
    this.name_override = ''
    this.slots = []
    this.generateSlots(mtype)
  }

  private generateSlots(mtype: MountType) {
    if (mtype === MountType.Integrated) {
      this.slots = [new WeaponSlot(FittingSize.Integrated)]
    } else {
      if (mtype === MountType.AuxAux) {
        this.slots = [
          new WeaponSlot(FittingSize.Auxiliary),
          new WeaponSlot(FittingSize.Auxiliary),
        ]
      } else if (mtype === MountType.Aux) {
        this.slots = [new WeaponSlot(FittingSize.Auxiliary)]
        this.name_override = 'Integrated Weapon'
      } else if (mtype === MountType.MainAux) {
        this.slots = [
          new WeaponSlot(FittingSize.Main),
          new WeaponSlot(FittingSize.Auxiliary),
        ]
      } else if (mtype === MountType.Flex) {
        this.slots = [new WeaponSlot(FittingSize.Flex)]
        this.extra = [new WeaponSlot(FittingSize.Auxiliary)]
      } else if (mtype === MountType.Main) {
        this.slots = [new WeaponSlot(FittingSize.Main)]
      } else {
        this.slots = [new WeaponSlot(FittingSize.Heavy)]
      }
    }
  }

  public get Type(): MountType {
    return this.mount_type
  }

  public get MountName() {
    return this.name_override ? this.name_override : `${this.Type} Mount`
  }

  public get Slots(): WeaponSlot[] {
    if (!this.slots[0]) this.generateSlots(this.Type)
    if (
      this.Type == MountType.Flex &&
      this.slots[0].Weapon &&
      this.slots[0].Weapon.Size === WeaponSize.Aux
    )
      return this.slots.concat(this.extra)
    return this.slots
  }

  public set Slots(slots: WeaponSlot[]) {
    this.slots = slots
  }

  public get Weapons(): MechWeapon[] {
    return this.slots.concat(this.extra).map(x => x.Weapon).filter(y => y !== null) as MechWeapon[]
  }

  public get IsLocked(): boolean {
    return this.lock
  }
}

class IntegratedMount extends Mount {
  private item_source: string

  constructor(intWeapon: MechWeapon, itemSource: string) {
    super(MountType.Integrated)
    this.slots[0].EquipWeapon(intWeapon)
    this.item_source = itemSource
  }

  public get Weapon(): MechWeapon | null {
    return this.slots[0].Weapon
  }

  public get ItemSource(): string {
    return this.item_source
  }
}

class EquippableMount extends Mount {
  private bonus_effects: CoreBonus[]

  constructor(mtype: MountType) {
    super(mtype)
    this.bonus_effects = []
  }

  private save() {
    store.dispatch('saveData')
  }

  public Lock() {
    this.lock = true
    this.save()
  }

  public Unlock() {
    this.lock = false
  }

  public AddCoreBonus(cb: CoreBonus) {
    this.bonus_effects.push(cb)
    this.save()
  }

  public RemoveCoreBonus(cb: CoreBonus) {
    const index = this.bonus_effects.findIndex(x => _.isEqual(x, cb))
    if (index > -1) this.bonus_effects.splice(index, 1)
    this.save()
  }

  public get BonusEffects() {
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
    return m
  }
}

export { Mount, IntegratedMount, EquippableMount }
