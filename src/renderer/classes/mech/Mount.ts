import _ from 'lodash'
import { store } from '@/store'
import { MechWeapon, WeaponSlot, CoreBonus, MountType, FittingSize, WeaponSize } from '@/class'

abstract class Mount {
  private _mount_type: MountType
  protected lock: boolean
  protected slots: WeaponSlot[]
  protected extra: WeaponSlot[]
  private _name_override: string

  public constructor(mountType: MountType) {
    this._mount_type = mountType
    this.lock = false
    this.extra = []
    this._name_override = ''
    this.slots = []
    this.generateSlots(mountType)
  }

  private generateSlots(mountType: MountType): void {
    if (mountType === MountType.Integrated) {
      this.slots = [new WeaponSlot(FittingSize.Integrated)]
    } else {
      if (mountType === MountType.AuxAux) {
        this.slots = [new WeaponSlot(FittingSize.Auxiliary), new WeaponSlot(FittingSize.Auxiliary)]
      } else if (mountType === MountType.Aux) {
        this.slots = [new WeaponSlot(FittingSize.Auxiliary)]
        this._name_override = 'Integrated Weapon'
      } else if (mountType === MountType.MainAux) {
        this.slots = [new WeaponSlot(FittingSize.Main), new WeaponSlot(FittingSize.Auxiliary)]
      } else if (mountType === MountType.Flex) {
        this.slots = [new WeaponSlot(FittingSize.Flex)]
        this.extra = [new WeaponSlot(FittingSize.Auxiliary)]
      } else if (mountType === MountType.Main) {
        this.slots = [new WeaponSlot(FittingSize.Main)]
      } else {
        this.slots = [new WeaponSlot(FittingSize.Heavy)]
      }
    }
  }

  protected save(): void {
    store.dispatch('saveData')
  }

  public get Type(): MountType {
    return this._mount_type
  }

  public get MountName(): string {
    return this._name_override ? this._name_override : `${this.Type} Mount`
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
    return this.Slots.map(x => x.Weapon).filter(y => y !== null) as MechWeapon[]
  }

  public get IsLocked(): boolean {
    return this.lock
  }
}

class IntegratedMount extends Mount {
  private _item_source: string

  public constructor(intWeapon: MechWeapon, itemSource: string) {
    super(MountType.Integrated)
    this.slots[0].EquipWeapon(intWeapon)
    this._item_source = itemSource
  }

  public get Weapon(): MechWeapon | null {
    return this.slots[0].Weapon
  }

  public get ItemSource(): string {
    return this._item_source
  }

  public static Serialize(m: IntegratedMount): { weapon: IMechWeaponData; source: string } {
    return {
      weapon: MechWeapon.Serialize(m.Weapon),
      source: m.ItemSource,
    }
  }

  public static Deserialize(mountData: any): IntegratedMount {
    return new IntegratedMount(MechWeapon.Deserialize(mountData.weapon), mountData.source)
  }
}

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

export { Mount, IntegratedMount, EquippableMount }
