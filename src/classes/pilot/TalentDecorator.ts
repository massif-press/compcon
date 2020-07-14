import { MechEquipment, Pilot, MechWeapon, ItemType, MechSystem } from '@/class'

interface Synergy {
  title: string
  synergy: object
}

class TalentDecorator {
  public static Collect(item: MechEquipment, pilot: Pilot, location: string): Synergy[] {
    let synergies = []
    const type =
      item.ItemType === ItemType.MechWeapon ? (item as MechWeapon).Type : (item as MechSystem).Type
    const size = item.ItemType === ItemType.MechWeapon ? (item as MechWeapon).Size : 'any'

    pilot.Talents.forEach(pt => {
      for (let i = 1; i <= pt.Rank; i++) {
        if (pt.Talent.Rank(i) && pt.Talent.Rank(i).synergy)
          synergies.push({
            title: `${pt.Talent.Name} RANK ${'I'.repeat(i)}//${pt.Talent.Rank(i).name}`,
            synergy: pt.Talent.Rank(i).synergy,
          })
      }
    })

    synergies = synergies.filter(
      x =>
        (x.synergy.locations.includes(location) || x.synergy.locations.includes('any')) &&
        (x.synergy.types.includes(type) || x.synergy.types.includes('any')) &&
        (x.synergy.sizes.includes(size) || x.synergy.sizes.includes('any'))
    )

    return synergies
  }
}

export default TalentDecorator
