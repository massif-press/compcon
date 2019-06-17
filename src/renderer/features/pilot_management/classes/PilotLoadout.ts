import _ from 'lodash'
import store from '@/store'
import {
  PilotEquipment,
  PilotArmor,
  PilotWeapon,
  PilotGear,
  Loadout,
  ItemType,
} from '@/class'
import { rules } from 'lancer-data'

class PilotLoadout extends Loadout {
  private armor: (PilotArmor | null)[]
  private gear: (PilotGear | null)[]
  private weapons: (PilotWeapon | null)[]

  constructor(count: number, id?: string) {
    super(count, id)
    ;(this.armor = Array(rules.max_pilot_armor).fill(null)),
      (this.gear = Array(rules.max_pilot_gear).fill(null)),
      (this.weapons = Array(rules.max_pilot_weapons).fill(null))
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

  public get Gear(): (PilotGear | null)[] {
    return this.gear
  }

  public set Gear(items: (PilotGear | null)[]) {
    this.gear = items
  }

  public get Items(): PilotEquipment[] {
    return (this.armor as PilotEquipment[])
      .concat(this.weapons as PilotEquipment[])
      .concat(this.gear as PilotEquipment[])
  }

  public Add(item: PilotEquipment, slot: number) {
    switch (item.ItemType) {
      case ItemType.PilotArmor:
        this.armor[slot] = item as PilotArmor
        break
      case ItemType.PilotWeapon:
        this.weapons[slot] = item as PilotWeapon
        break
      case ItemType.PilotGear:
        this.gear[slot] = item as PilotGear
        break
      default:
        break
    }
    this.save()
  }

  public Remove(item: PilotEquipment, slot: number) {
    switch (item.ItemType) {
      case ItemType.PilotArmor:
        if (this.armor[slot]) this.armor[slot] = null
        break
      case ItemType.PilotWeapon:
        if (this.weapons[slot]) this.weapons[slot] = null
        break
      case ItemType.PilotGear:
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
    }
  }

  public static Deserialize(loadoutData: IPilotLoadoutData): PilotLoadout {
    let loadout = new PilotLoadout(0, loadoutData.id)
    loadout.ID = loadoutData.id
    loadout.Name = loadoutData.name
    loadout.Armor = loadoutData.armor.map(
      x => PilotEquipment.Deserialize(x) as PilotArmor
    )
    loadout.Weapons = loadoutData.weapons.map(
      x => PilotEquipment.Deserialize(x) as PilotWeapon
    )
    loadout.Gear = loadoutData.gear.map(
      x => PilotEquipment.Deserialize(x) as PilotGear
    )
    return loadout
  }
}

export default PilotLoadout
