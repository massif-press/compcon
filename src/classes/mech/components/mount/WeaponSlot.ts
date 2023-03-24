import { MechWeapon, FittingSize, Mount } from '@/class';
import _ from 'lodash';
import { store } from '@/store';
import { WeaponMod } from '@/class';

class WeaponSlot {
  private _size: FittingSize;
  private _weapon: MechWeapon | null;
  private _parent: Mount;

  public constructor(size: FittingSize, parent: Mount) {
    this._size = size;
    this._weapon = null;
    this._parent = parent;
  }

  private save(): void {
    this._parent.save();
  }

  public get Size(): FittingSize {
    return this._size;
  }

  public get Weapon(): MechWeapon | null {
    return this._weapon || null;
  }

  public get Mod(): WeaponMod | null {
    return this.Weapon && this.Weapon.Mod;
  }

  public EquipWeapon(weapon: MechWeapon, save = true): void {
    const w = { ...weapon };
    Vue.set(this, '_weapon', w);
    if (save) this.save();
  }

  public UnequipWeapon(): void {
    Vue.set(this, '_weapon', null);
    this.save();
  }

  public static Serialize(ws: WeaponSlot): IWeaponSlotData {
    return {
      size: ws.Size,
      weapon: ws.Weapon ? MechWeapon.Serialize(ws.Weapon) : null,
    };
  }

  public static Deserialize(
    slotData: IWeaponSlotData,
    parent: Mount
  ): WeaponSlot {
    const ws = new WeaponSlot(slotData.size as FittingSize, parent);
    if (slotData.weapon) {
      const w = MechWeapon.Deserialize(slotData.weapon);
      if (w) ws.EquipWeapon(w, false);
    }
    return ws;
  }
}

export default WeaponSlot;
