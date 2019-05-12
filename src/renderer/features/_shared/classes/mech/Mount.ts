import _ from 'lodash'
import {MechWeapon, WeaponSlot, CoreBonus} from "..";


class Mount {
  private mount_type: MountType;
  private lock: boolean;
  private slots: WeaponSlot[];
  private bonus_effects: CoreBonus[];

  constructor(
    mtype: MountType,
    intWeapon?: MechWeapon
  ) {
    this.mount_type = mtype;
    this.lock = false;
    this.bonus_effects = [];
    if (intWeapon) {
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

  public get Weapons(): MechWeapon[] {
    return this.slots.map(x => x.Weapon).filter(y => y !== null) as MechWeapon[]
  }

  public get IsLocked(): boolean {
    return this.lock;
  }

  public Lock() {
    this.lock = true;
  }

  public Unlock() {
    this.lock = false;
  }

  public AddCoreBonus(id: string) {
    this.bonus_effects.push(new CoreBonus(id))
  }

  public RemoveCoreBonus(cb: CoreBonus) {
    const index = this.bonus_effects.findIndex(x => _.isEqual(x, cb))
    if (index > -1) this.bonus_effects.splice(index, 1)
  }

  public get BonusEffects() {
    return this.bonus_effects
  }
}

export default Mount;
