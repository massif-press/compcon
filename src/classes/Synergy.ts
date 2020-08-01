import { MechEquipment, Pilot, MechWeapon, ItemType, MechSystem, Frame } from '@/class'

interface ISynergyItem {
  locations: string[]
  types?: string[]
  sizes?: string[]
  detail: string
}

interface ISynergyDecorator {
  title: string
  synergy: ISynergyItem
}

class Synergy {
  public static TalentSynergies(
    item: MechEquipment,
    pilot: Pilot,
    location: string
  ): ISynergyDecorator[] {
    let synergies = []
    const type =
      item.ItemType === ItemType.MechWeapon ? (item as MechWeapon).Type : (item as MechSystem).Type
    const size = item.ItemType === ItemType.MechWeapon ? (item as MechWeapon).Size : 'any'

    pilot.Talents.forEach(pt => {
      for (let i = 1; i <= pt.Rank; i++) {
        if (pt.Talent.Rank(i) && pt.Talent.Rank(i).synergies)
          pt.Talent.Rank(i).synergies.forEach(s => {
            synergies.push({
              title: `${pt.Talent.Name} RANK ${'I'.repeat(i)}//${pt.Talent.Rank(i).name}`,
              synergy: s,
            })
          })
      }
    })

    synergies = synergies.filter(
      x =>
        (!x.synergy.locations ||
          x.synergy.locations.includes(location) ||
          x.synergy.locations.includes('any')) &&
        (!x.synergy.types || x.synergy.types.includes(type) || x.synergy.types.includes('any')) &&
        (!x.synergy.sizes || x.synergy.sizes.includes(size) || x.synergy.sizes.includes('any'))
    )

    return synergies
  }

  public static FrameSynergies(frame: Frame, location: string): ISynergyDecorator[] {
    let synergies = []
    frame.Traits.forEach(t => {
      if (t.synergies)
        t.synergies.forEach(s => {
          synergies.push({
            title: t.name,
            synergy: s,
          })
        })
    })

    synergies = synergies.filter(
      x => !x.locations || x.locations.includes(location) || x.locations.includes('any')
    )

    return synergies
  }
}

export { Synergy, ISynergyItem, ISynergyDecorator }
