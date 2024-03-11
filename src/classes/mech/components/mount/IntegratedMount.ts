import { Mount, MechWeapon, MountType, MechLoadout } from '@/class';
import { IMechWeaponSaveData } from '@/interface';

class IntegratedMount extends Mount {
  public constructor(intWeapon: MechWeapon, parent: MechLoadout) {
    super(MountType.Integrated, parent);
    this.slots[0].EquipWeapon(intWeapon, false);
  }

  public get Weapon(): MechWeapon | null {
    return this.slots[0].Weapon;
  }

  public static Serialize(m: IntegratedMount): { weapon: IMechWeaponSaveData } {
    return {
      weapon: MechWeapon.Serialize(m.Weapon as MechWeapon),
    };
  }

  public static Deserialize(mountData: any, parent: MechLoadout): IntegratedMount {
    const im = new IntegratedMount(MechWeapon.Deserialize(mountData.weapon), parent);
    im.getID();
    return im;
  }
}

export default IntegratedMount;
