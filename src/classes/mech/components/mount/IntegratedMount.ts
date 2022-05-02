import { Mech, Mount, MechWeapon, MountType } from '@/class'

class IntegratedMount extends Mount {
  public constructor(parent: Mech, intWeapon: MechWeapon) {
    super(parent, MountType.Integrated)
    this.slots[0].EquipWeapon(intWeapon, false)
  }

  public get Weapon(): MechWeapon | null {
    return this.slots[0].Weapon
  }

  public static Serialize(m: IntegratedMount): { weapon: IMechWeaponSaveData } {
    return {
      weapon: MechWeapon.Serialize(m.Weapon),
    }
  }

  public static Deserialize(parent: Mech, mountData: any): IntegratedMount {
    const im = new IntegratedMount(parent, MechWeapon.Deserialize(mountData.weapon))
    im.getID()
    return im
  }
}

export default IntegratedMount
