import {MechWeapon, FittingSize} from '@/class'
import store from '@/store';

class WeaponSlot {
  private size: FittingSize;
  private weapon: MechWeapon | null;

  constructor(size: FittingSize) {
    this.size = size;
    this.weapon = null;
  }

  public get Size(): FittingSize {
    return this.size;
  }

  public get Weapon(): MechWeapon | null {
    return this.weapon || null;
  }

  public EquipWeapon(weapon: MechWeapon) {
    this.weapon = weapon;
  }

  public UnequipWeapon() {
    this.weapon = null;
  }

  public static Serialize(ws: WeaponSlot): IWeaponSlotData {
    return {
      size: ws.size,
      weapon_id: ws.Weapon ? ws.Weapon.ID : null
    };
  }

  public static Deserialize(slotData: IWeaponSlotData): WeaponSlot {
    let ws = new WeaponSlot(slotData.size as FittingSize);
    if (slotData.weapon_id)
      ws.EquipWeapon(
        store.getters.getItemById("MechWeapons", slotData.weapon_id)
      );
    return ws;
  }
}

export default WeaponSlot;