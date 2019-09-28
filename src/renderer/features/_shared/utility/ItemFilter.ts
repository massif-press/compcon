import { MechEquipment, CompendiumItem } from '@/class'

class ItemFilter {
  public static Filter(items: CompendiumItem[], filter: any): CompendiumItem[] {
    Object.keys(filter).forEach(p => {
      if (p === 'Tags') {
        items = items.filter((x: MechEquipment) =>
          filter.Tags.every(e => x.Tags.map(t => t.ID).includes(e))
        )
      } else if (filter[p].length) items = items.filter(x => filter[p].every(e => x[p].includes(e)))
    })
    return items
  }
}

export default ItemFilter
