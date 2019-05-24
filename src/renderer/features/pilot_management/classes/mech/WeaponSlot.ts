import { rules } from "lancer-data";
import {MechWeapon, FittingSize} from '@/class'
import store from '@/store';

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

  public EquipWeapon(weapon: MechWeapon) {
    if (this.locked) return;
    if (rules.mount_fittings[this.size].includes(weapon.Size))
      this.weapon = weapon;
  }

  public UnequipWeapon() {
    if (this.locked) return;
    this.weapon = null;
  }

  public static Serialize(ws: WeaponSlot): IWeaponSlotData {
    return {
      size: ws.size,
      locked: ws.locked,
      weapon_id: ws.Weapon ? ws.Weapon.ID : null
    };
  }

  public static Deserialize(slotData: IWeaponSlotData): WeaponSlot {
    let ws = new WeaponSlot(slotData.size as FittingSize, slotData.locked);
    if (slotData.weapon_id)
      ws.EquipWeapon(
        store.getters.getItemById("MechWeapons", slotData.weapon_id)
      );
    return ws;
  }
}

export default WeaponSlot;