import _ from 'lodash'
import {MechWeapon, WeaponSlot, CoreBonus, MountType, FittingSize} from "@/class";

abstract class Mount {
  private mount_type: MountType;
  protected lock: boolean;
  protected slots: WeaponSlot[];

  constructor(mtype: MountType) {
    this.mount_type = mtype;
    this.lock = false;
    if (mtype === MountType.Integrated) {
      this.lock = true;
      this.slots = [new WeaponSlot(FittingSize.Integrated, true)];
    } else {
      if (mtype === MountType.AuxAux) {
        this.slots = [
          new WeaponSlot(FittingSize.Auxiliary),
          new WeaponSlot(FittingSize.Auxiliary)
        ];
      } else if (mtype === MountType.MainAux) {
        this.slots = [
          new WeaponSlot(FittingSize.Main),
          new WeaponSlot(FittingSize.Auxiliary)
        ];
      } else if (mtype === MountType.Flex) {
        this.slots = [new WeaponSlot(FittingSize.Flex)];
      } else if (mtype === MountType.Main) {
        this.slots = [new WeaponSlot(FittingSize.Main)];
      } else {
        this.slots = [new WeaponSlot(FittingSize.Heavy)];
      }
    }
  }

  public get Type(): MountType {
    return this.mount_type;
  }

  public get Slots(): WeaponSlot[] {
    return this.slots;
  }

  public set Slots(slots: WeaponSlot[]) {
    this.slots = slots;
  }

  public get Weapons(): MechWeapon[] {
    return this.slots
      .map(x => x.Weapon)
      .filter(y => y !== null) as MechWeapon[];
  }

  public get IsLocked(): boolean {
    return this.lock;
  }
}

class IntegratedMount extends Mount {
  constructor(intWeapon: MechWeapon) {
    super(MountType.Integrated)
    this.slots[0].EquipWeapon(intWeapon)
  }
}

class EquippableMount extends Mount {
  private bonus_effects: CoreBonus[];

  constructor(mtype: MountType) {
    super(mtype);
    this.bonus_effects = [];
  }

  public Lock() {
    this.lock = true;
  }

  public Unlock() {
    this.lock = false;
  }

  public AddCoreBonus(id: string) {
    this.bonus_effects.push(new CoreBonus(id));
  }

  public RemoveCoreBonus(cb: CoreBonus) {
    const index = this.bonus_effects.findIndex(x => _.isEqual(x, cb));
    if (index > -1) this.bonus_effects.splice(index, 1);
  }

  public get BonusEffects() {
    return this.bonus_effects;
  }

  public static Serialize(m: EquippableMount): IMountData {
    return {
      mount_type: m.Type,
      lock: m.IsLocked,
      slots: m.Slots.map(x => WeaponSlot.Serialize(x)),
      bonus_effects: m.BonusEffects.map(x => x.ID)
    };
  }

  public static Deserialize(mountData: IMountData): EquippableMount {
    let m = new EquippableMount(mountData.mount_type as MountType);
    m.slots = mountData.slots.map(x => WeaponSlot.Deserialize(x))
    return m;
  }
}

export {
  Mount,
  IntegratedMount,
  EquippableMount,
};
