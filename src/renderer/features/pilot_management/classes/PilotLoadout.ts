import _ from 'lodash'
import { store } from '@/store'
import { PilotEquipment, PilotArmor, PilotWeapon, PilotGear, Loadout, ItemType } from '@/class'
import { rules } from 'lancer-data'

class PilotLoadout extends Loadout {
  private armor: (PilotArmor | null)[]
  private gear: (PilotGear | null)[]
  private weapons: (PilotWeapon | null)[]
  private extendedWeapons: (PilotWeapon | null)[]
  private extendedGear: (PilotGear | null)[]

  constructor(count: number, id?: string) {
    super(count, id)
    ;(this.armor = Array(rules.max_pilot_armor).fill(null)),
    (this.gear = Array(rules.max_pilot_gear).fill(null)),
    (this.weapons = Array(rules.max_pilot_weapons).fill(null))
    this.extendedWeapons = Array(1).fill(null)
    this.extendedGear = Array(2).fill(null)
  }

  private save() {
    store.dispatch('saveData')
  }

  public get Armor(): (PilotArmor | null)[] {
    return this.armor
  }

  public set Armor(items: (PilotArmor | null)[]) {
    this.armor = items
  }

  public get Weapons(): (PilotWeapon | null)[] {
    return this.weapons
  }

  public set Weapons(items: (PilotWeapon | null)[]) {
    this.weapons = items
  }

  public get ExtendedWeapons(): (PilotWeapon | null)[] {
    return this.extendedWeapons
  }

  public set ExtendedWeapons(items: (PilotWeapon | null)[]) {
    this.extendedWeapons = items
  }

  public get Gear(): (PilotGear | null)[] {
    return this.gear
  }

  public set Gear(items: (PilotGear | null)[]) {
    this.gear = items
  }

  public get ExtendedGear(): (PilotGear | null)[] {
    return this.extendedGear
  }

  public set ExtendedGear(items: (PilotGear | null)[]) {
    this.extendedGear = items
  }

  public get Items(): PilotEquipment[] {
    return (this.armor as PilotEquipment[])
      .concat(this.weapons as PilotEquipment[])
      .concat(this.gear as PilotEquipment[])
  }

  public Add(item: PilotEquipment, slot: number, extended?: boolean) {
    switch (item.ItemType) {
      case ItemType.PilotArmor:
        this.armor[slot] = item as PilotArmor
        break
      case ItemType.PilotWeapon:
        if (extended) this.extendedWeapons[slot] = item as PilotWeapon
        else this.weapons[slot] = item as PilotWeapon
        break
      case ItemType.PilotGear:
        if (extended) this.extendedGear[slot] = item as PilotGear
        else this.gear[slot] = item as PilotGear
        break
      default:
        break
    }
    this.save()
  }

  public Remove(item: PilotEquipment, slot: number, extended?: boolean) {
    switch (item.ItemType) {
      case ItemType.PilotArmor:
        if (this.armor[slot]) this.armor[slot] = null
        break
      case ItemType.PilotWeapon:
        if (extended) this.extendedWeapons[slot] = null
        if (this.weapons[slot]) this.weapons[slot] = null
        break
      case ItemType.PilotGear:
        if (extended) this.extendedGear[slot] = null
        if (this.gear[slot]) this.gear[slot] = null
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
