import { MechEquipment, CompendiumItem, MechWeapon } from '@/class'

class ItemFilter {
  public static Filter(items: CompendiumItem[], filter: any): CompendiumItem[] {
    Object.keys(filter).forEach(p => {
      if (p === 'LcpName') {
        items = items.filter(i => filter[p][0].includes(i.LcpName))
      } else if (p === 'Tags') {
        items = items.filter((e: MechEquipment) => {
          if (e instanceof MechWeapon && e.ProfileTags?.map(t => t.ID).some(x => filter.Tags.includes(x))) return true
          return e.Tags.map(t => t.ID).some(x => filter.Tags.includes(x))
        }
        )
      } else if (p === 'SP_greater') {
        items = items.filter((x: MechEquipment) => x.SP > filter[p])
      } else if (p === 'SP_less') {
        items = items.filter((x: MechEquipment) => x.SP < filter[p])
      } else if (p === 'SP_eq') {
        items = items.filter((x: MechEquipment) => x.SP === filter[p])
      } else if (filter[p].length) items = items.filter(x => filter[p].some(e => x[p].includes(e)))
    })
    return items
  }
}

export default ItemFilter
