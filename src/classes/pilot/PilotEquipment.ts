import { store } from '@/store'
import { CompendiumItem, Tag } from '@/class'
import { ICompendiumItemData } from '@/interface'

interface IPilotEquipmentData extends ICompendiumItemData {
  type?: string
  tags: ITagData[]
}

abstract class PilotEquipment extends CompendiumItem {
  public readonly CanSetDamage: boolean
  protected current_uses: number
  protected _custom_damage_type?: string

  public constructor(data: IPilotEquipmentData) {
    super(data)
    this.CanSetDamage = data.tags.some(x => x.id === 'tg_set_damage_type')
    this.current_uses = 0
  }

  public static Serialize(item: PilotEquipment | null): IEquipmentData | null {
    if (!item) return null
    return {
      id: item.ID,
      destroyed: false,
      uses: item.current_uses,
      cascading: false,
      note: item.Note,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
      customDamageType: item._custom_damage_type || null,
    }
  }

  public static Deserialize(itemData: IEquipmentData | null): PilotEquipment | null {
    if (!itemData) return null
    const item = store.getters.instantiate('PilotGear', itemData.id)
    item.current_uses = itemData.uses
    item._note = itemData.note
    item._flavor_name = itemData.flavorName
    item._flavor_description = itemData.flavorDescription
    item._custom_damage_type = itemData.customDamageType || null
    return item
  }
}

export { PilotEquipment, IPilotEquipmentData }
