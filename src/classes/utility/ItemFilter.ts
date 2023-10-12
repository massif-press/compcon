import { MechEquipment, CompendiumItem, MechWeapon, Frame } from '@/class'

class ItemFilter {
  public static Filter(items: CompendiumItem[], filter: any): CompendiumItem[] {
    Object.keys(filter).forEach(p => {
      if (p === 'LcpName') {
        items = items.filter(i => filter[p][0].includes(i.LcpName))
      } else if (p === 'Tags') {
        items = items.filter((e: MechEquipment) => {
          const item_tags = e instanceof MechWeapon ? e.AllTags : e.Tags
          return filter.Tags.every(x => item_tags.map(t => t.ID).includes(x))
        })
      } else if (p === 'SP_greater') {
        items = items.filter((x: MechEquipment) => x.SP > filter[p])
      } else if (p === 'SP_less') {
        items = items.filter((x: MechEquipment) => x.SP < filter[p])
      } else if (p === 'SP_eq') {
        items = items.filter((x: MechEquipment) => x.SP === filter[p])
      } else if (p === 'LL_greater') {
        items = items.filter((x: MechEquipment) => x.LicenseLevel > filter[p])
      } else if (p === 'LL_less') {
        items = items.filter((x: MechEquipment) => x.LicenseLevel < filter[p])
      } else if (p === 'LL_eq') {
        items = items.filter((x: MechEquipment) => x.LicenseLevel === filter[p])
      } else if (p === 'License') {
        items = items.filter((x: MechEquipment) =>
          filter[p][0].map(x => x.toLowerCase()).includes(x.License.toLowerCase())
        )
      } else if (p === 'MechType') {
        items = items.filter((f: Frame) => filter[p].every(t => f.MechType.includes(t)))
      } else if (p === 'MechSize') {
        items = items.filter((f: Frame) => filter[p].every(t => f.Size === t))
      } else if (p === 'Mounts') {
        items = items.filter((f: Frame) => filter[p].every(m => f.Mounts.includes(m)))
      } else if (filter[p].length) items = items.filter(x => filter[p].some(e => x[p].includes(e)))
    })
    return items
  }
}

export default ItemFilter
