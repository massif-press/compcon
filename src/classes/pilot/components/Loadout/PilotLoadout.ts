import { Rules, PilotEquipment, PilotArmor, PilotWeapon, PilotGear, ItemType } from '@/class';
import { PilotLoadoutController } from './PilotLoadoutController';

declare interface IPilotLoadoutData {
  armor: IEquipmentData[];
  weapons: IEquipmentData[];
  gear: IEquipmentData[];
}

class PilotLoadout {
  public readonly Parent: PilotLoadoutController;

  private _armor: PilotArmor[];
  private _gear: PilotGear[];
  private _weapons: PilotWeapon[];

  public constructor(parent: PilotLoadoutController) {
    this._armor = [];
    this._gear = [];
    this._weapons = [];
    this.Parent = parent;
  }

  public get Armor(): PilotArmor[] {
    return this._armor;
  }

  public set Armor(items: PilotArmor[]) {
    this._armor = items;
    // this.save();
  }

  public get Weapons(): PilotWeapon[] {
    return this._weapons;
  }

  public set Weapons(items: PilotWeapon[]) {
    this._weapons = items;
    // this.save();
  }

  public get Gear(): PilotGear[] {
    return this._gear;
  }

  public set Gear(items: PilotGear[]) {
    this._gear = items;
    // this.save();
  }

  public get Items(): PilotEquipment[] {
    return [
      ...(this._armor as PilotEquipment[]),
      ...(this._weapons as PilotEquipment[]),
      ...(this._gear as PilotEquipment[]),
    ];
  }

  public Add(item: PilotEquipment, index: number): void {
    switch (item.ItemType) {
      case ItemType.PilotArmor:
        if (index + 1 > this.Parent.MaxArmorSlots) return;
        if (this._armor[index]) this._armor[index] = item as PilotArmor;
        else this._armor.push(item as PilotArmor);
        break;
      case ItemType.PilotWeapon:
        if (index + 1 > this.Parent.MaxWeaponSlots) return;
        if (this._weapons[index]) this._weapons[index] = item as PilotWeapon;
        else this._weapons.push(item as PilotWeapon);
        break;
      case ItemType.PilotGear:
        if (index + 1 > this.Parent.MaxGearSlots) return;
        if (this._gear[index]) this._gear[index] = item as PilotGear;
        else this._gear.push(item as PilotGear);
        break;
      default:
        break;
    }
    // this.save();
  }

  public Remove(item: PilotEquipment): void {
    let idx = -1;
    switch (item.ItemType) {
      case ItemType.PilotArmor:
        idx = this._armor.findIndex((x) => x.InstanceID === item.InstanceID);
        if (idx > -1) this._armor.splice(idx, 1);
        break;
      case ItemType.PilotWeapon:
        idx = this._weapons.findIndex((x) => x.InstanceID === item.InstanceID);
        if (idx > -1) this._weapons.splice(idx, 1);
        break;
      case ItemType.PilotGear:
        idx = this._gear.findIndex((x) => x.InstanceID === item.InstanceID);
        if (idx > -1) this._gear.splice(idx, 1);
        break;
      default:
        break;
    }
    // this.save();
  }

  public static Serialize(pl: PilotLoadout): IPilotLoadoutData {
    return {
      armor: pl.Armor.map((x) => PilotEquipment.Serialize(x)),
      weapons: pl.Weapons.map((x) => PilotEquipment.Serialize(x)),
      gear: pl.Gear.map((x) => PilotEquipment.Serialize(x)),
    };
  }

  public static Deserialize(
    loadoutData: IPilotLoadoutData,
    parent: PilotLoadoutController
  ): PilotLoadout {
    const loadout = new PilotLoadout(parent);
    loadout._armor = loadoutData.armor.map((x) => PilotEquipment.Deserialize(x) as PilotArmor);
    loadout._weapons = loadoutData.weapons.map((x) => PilotEquipment.Deserialize(x) as PilotWeapon);
    loadout._gear = loadoutData.gear.map((x) => PilotEquipment.Deserialize(x) as PilotGear);
    return loadout;
  }
}

export { PilotLoadout };
export type { IPilotLoadoutData };
