import _ from 'lodash'
import { PilotEquipment, PilotArmor, PilotWeapon, PilotGear, Loadout } from "..";
import { rules } from 'lancer-data'

interface IPilotLoadoutItems {
  armor: (PilotArmor)[]
  weapon: (PilotWeapon)[]
  gear: (PilotGear)[]
}

class PilotLoadout extends Loadout {
  private items: IPilotLoadoutItems

  constructor(count: number) {
    super(count);
    //TODO: downtime bonus: extra gear
    this.items = {
      armor: Array(rules.max_pilot_armor).fill(new PilotArmor()),
      gear: Array(rules.max_pilot_gear).fill(new PilotGear()),
      weapon: Array(rules.max_pilot_weapons).fill(new PilotWeapon())
    }
  }

  public get Items(): IPilotLoadoutItems {
    return this.items
  }

  public get Armor(): PilotArmor[] {
    return this.items.armor
  }

  public get Weapons(): PilotWeapon[] {
    return this.items.weapon
  }

  public get Gear(): PilotGear[] {
    return this.items.gear
  }

  public Add(item: PilotEquipment, slot: number) {
    if (item instanceof PilotArmor) {
      this.items.armor[slot] = item
    } else if (item instanceof PilotWeapon) {
      this.items.weapon[slot] = item
    } else if (item instanceof PilotGear) {
      this.items.gear[slot] = item
    }
  }

  public Remove(itemType: string, slot: number) {
    //TODO: index this correctly
    const key = itemType.toLowerCase()
    if (key === 'armor') {
      if (this.items.armor[slot]) 
        this.items.armor[slot] = new PilotArmor()
    } else if (key === 'weapon') {
      if (this.items.weapon[slot]) 
        this.items.weapon[slot] = new PilotWeapon();
    } else {
      if (this.items.gear[slot]) 
        this.items.gear[slot] = new PilotGear();
    }
  }

}

export default PilotLoadout