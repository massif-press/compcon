import {
  MechWeapon,
  SystemType,
  WeaponType,
  WeaponSize,
  RangeType,
  DamageType,
  MechEquipment,
  MechSystem,
  ItemType,
} from '@/class'

declare interface IEquipmentFilter {
  license: string[]
  include: string[]
  exclude: string[]
  source: string[]
}

declare interface IWeaponFilter extends IEquipmentFilter {
  weaponType: WeaponType[]
  weaponSize: WeaponSize[]
  attackType: RangeType[]
  damageType: DamageType[]
}

declare interface ISystemFilter extends IEquipmentFilter {
  systemType: (SystemType | string)[]
}

class ItemFilter {
  public static FilterEquipment(
    items: MechEquipment[],
    filter: IEquipmentFilter
  ): MechEquipment[] {
    if (filter.license && filter.license.length) {
      items = items.filter(x =>
        filter.license.includes(x.License.toLowerCase())
      )
    }
    if (filter.include && filter.include.length) {
      items = items.filter(x => x.Tags.some(t => filter.include.includes(t.ID)))
    }
    if (filter.exclude && filter.exclude.length) {
      items = items.filter(
        x => !x.Tags.some(t => filter.include.includes(t.ID))
      )
    }
    if (filter.source && filter.source.length) {
      items = items.filter(x => filter.source.includes(x.Source))
    }
    return items
  }

  public static FilterWeapons(
    items: MechWeapon[],
    filter: IWeaponFilter
  ): MechWeapon[] {
    items = this.FilterEquipment(items, filter) as MechWeapon[]
    if (filter.weaponType && filter.weaponType.length) {
      items = items.filter(x => filter.weaponType.includes(x.Type))
    }
    if (filter.weaponSize && filter.weaponSize.length) {
      items = items.filter(x => filter.weaponSize.includes(x.Size))
    }
    if (filter.attackType && filter.attackType.length) {
      items = items.filter(x =>
        x.Range.some(r => filter.attackType.includes(r.Type))
      )
    }
    if (filter.damageType && filter.damageType.length) {
      items = items.filter(x =>
        x.Damage.some(d => filter.damageType.includes(d.Type))
      )
    }

    return items
  }

  public static FilterSystems(
    items: MechSystem[],
    filter: ISystemFilter
  ): MechSystem[] {
    items = this.FilterEquipment(items, filter) as MechSystem[]
    if (filter.systemType && filter.systemType.length) {
      items = items.filter(x => filter.systemType.includes(x.Type))
    }
    return items
  }

  //includes weapon mods
  public static FilterSystemsCompendium(
    items: MechEquipment[],
    filter: ISystemFilter
  ): MechEquipment[] {
    items = this.FilterEquipment(items, filter)
    if (filter.systemType && filter.systemType.length) {
      console.log(filter.systemType)
      items = items.filter(function(item) {
        if (item.ItemType === ItemType.MechSystem)
          return filter.systemType.includes((item as MechSystem).Type)
        else if (item.ItemType === ItemType.WeaponMod) {
          return filter.systemType.includes(SystemType.Mod)
        }
        return false
      })
    }
    return items
  }
}

export default ItemFilter
