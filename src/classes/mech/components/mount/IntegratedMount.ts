import { MountType } from '../../../enums'
import { IMechWeaponSaveData, MechWeapon } from '../equipment/MechWeapon'
import { MechLoadout } from '../loadout/MechLoadout'
import Mount from './Mount'

class IntegratedMount extends Mount {
  public ID: string

  public constructor(intWeapon: MechWeapon, parent: MechLoadout) {
    super(MountType.Integrated, parent)
    this.slots[0].EquipWeapon(intWeapon, false)
    this.ID = intWeapon.ID
  }

  public get Weapon(): MechWeapon | null {
    return this.slots[0].Weapon
  }

  public static Serialize(m: IntegratedMount): { weapon: IMechWeaponSaveData } {
    return {
      weapon: MechWeapon.Serialize(m.Weapon as MechWeapon),
    }
  }

  public static Deserialize(mountData: any, parent: MechLoadout): IntegratedMount {
    const im = new IntegratedMount(MechWeapon.Deserialize(mountData.weapon), parent)
    return im
  }
}

export default IntegratedMount
