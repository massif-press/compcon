import { rules } from "lancer-data";
import {MechWeapon} from '..'

class WeaponSlot {
  private size: FittingSize;
  private locked: boolean;
  private weapon: MechWeapon | null;

  constructor(size: FittingSize, locked?: boolean) {
    this.size = size;
    this.locked = locked || false;
    this.weapon = null;
  }

  public get Size(): FittingSize {
    return this.size;
  }

  public get Weapon(): MechWeapon | null {
    return this.weapon || null;
  }

  public EquipWeapon(id: string, freeSP: number) {
    if (this.locked) return;
    const w = new MechWeapon(id);
    if (rules.mount_fittings[this.size].includes(w.Size) && w.SP <= freeSP)
      this.weapon = w;
  }

  public UnequipWeapon() {
    if (this.locked) return;
    this.weapon = null;
  }
}

export default WeaponSlot;