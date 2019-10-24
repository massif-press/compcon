import { PilotEquipment, PilotArmor, PilotWeapon, PilotGear, Loadout, ItemType } from '@/class'
import { rules } from 'lancer-data'

class PilotLoadout extends Loadout {
  private _armor: (PilotArmor | null)[]
  private _gear: (PilotGear | null)[]
  private _weapons: (PilotWeapon | null)[]
  private _extendedWeapons: (PilotWeapon | null)[]
  private _extendedGear: (PilotGear | null)[]

  public constructor(count: number, id?: string) {
    super(count, id)
    this._armor = Array(rules.max_pilot_armor).fill(null)
    this._gear = Array(rules.max_pilot_gear).fill(null)
    this._weapons = Array(rules.max_pilot_weapons).fill(null)
    this._extendedWeapons = Array(1).fill(null)
    this._extendedGear = Array(2).fill(null)
  }

  public get Armor(): (PilotArmor | null)[] {
    return this._armor
  }

  public set Armor(items: (PilotArmor | null)[]) {
    this._armor = items
  }

  public get Weapons(): (PilotWeapon | null)[] {
    return this._weapons
  }

  public set Weapons(items: (PilotWeapon | null)[]) {
    this._weapons = items
  }

  public get ExtendedWeapons(): (PilotWeapon | null)[] {
    return this._extendedWeapons
  }

  public set ExtendedWeapons(items: (PilotWeapon | null)[]) {
    this._extendedWeapons = items
  }

  public get Gear(): (PilotGear | null)[] {
    return this._gear
  }

  public set Gear(items: (PilotGear | null)[]) {
    this._gear = items
  }

  public get ExtendedGear(): (PilotGear | null)[] {
    return this._extendedGear
  }

  public set ExtendedGear(items: (PilotGear | null)[]) {
    this._extendedGear = items
  }

  public get Items(): PilotEquipment[] {
    return (this._armor as PilotEquipment[])
      .concat(this._weapons as PilotEquipment[])
      .concat(this._gear as PilotEquipment[])
  }

  public Add(item: PilotEquipment, slot: number, extended?: boolean): void {
    switch (item.ItemType) {
      case ItemType.PilotArmor:
        this._armor[slot] = item as PilotArmor
        break
      case ItemType.PilotWeapon:
        if (extended) this._extendedWeapons[slot] = item as PilotWeapon
        else this._weapons[slot] = item as PilotWeapon
        break
      case ItemType.PilotGear:
        if (extended) this._extendedGear[slot] = item as PilotGear
        else this._gear[slot] = item as PilotGear
        break
      default:
        break
    }
    this.save()
  }

  public Remove(item: PilotEquipment, slot: number, extended?: boolean): void {
    switch (item.ItemType) {
      case ItemType.PilotArmor:
        if (this._armor[slot]) this._armor[slot] = null
        break
      case ItemType.PilotWeapon:
        if (extended) this._extendedWeapons[slot] = null
        if (this._weapons[slot]) this._weapons[slot] = null
        break
      case ItemType.PilotGear:
        if (extended) this._extendedGear[slot] = null
        if (this._gear[slot]) this._gear[slot] = null
        break
      default:
        break
    }
    this.save()
  }

  public static Serialize(pl: PilotLoadout): IPilotLoadoutData {
    return {
      id: pl.ID,
      name: pl.Name,
      armor: pl.Armor.map(x => PilotEquipment.Serialize(x)),
      weapons: pl.Weapons.map(x => PilotEquipment.Serialize(x)),
      gear: pl.Gear.map(x => PilotEquipment.Serialize(x)),
      extendedWeapons: pl.ExtendedWeapons.map(x => PilotEquipment.Serialize(x)),
      extendedGear: pl.ExtendedGear.map(x => PilotEquipment.Serialize(x)),
    }
  }

  public static Deserialize(loadoutData: IPilotLoadoutData): PilotLoadout {
    let loadout = new PilotLoadout(0, loadoutData.id)
    loadout.ID = loadoutData.id
    loadout.Name = loadoutData.name
    loadout.Armor = loadoutData.armor.map(x => PilotEquipment.Deserialize(x) as PilotArmor)
    loadout.Weapons = loadoutData.weapons.map(x => PilotEquipment.Deserialize(x) as PilotWeapon)
    loadout.Gear = loadoutData.gear.map(x => PilotEquipment.Deserialize(x) as PilotGear)
    loadout.ExtendedWeapons = loadoutData.extendedWeapons
      ? loadoutData.extendedWeapons.map(x => PilotEquipment.Deserialize(x) as PilotWeapon)
      : Array(1).fill(null)
    loadout.ExtendedGear = loadoutData.extendedGear
      ? loadoutData.extendedGear.map(x => PilotEquipment.Deserialize(x) as PilotGear)
      : Array(2).fill(null)
    return loadout
  }
}

export default PilotLoadout
