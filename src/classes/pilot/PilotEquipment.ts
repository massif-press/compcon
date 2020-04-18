import { store } from '@/store'
import { CompendiumItem, Tag } from '@/class'
import { ICompendiumItemData } from '@/interface'

interface IPilotEquipmentData extends ICompendiumItemData {
  type?: string
  tags: ITagData[]
}

abstract class PilotEquipment extends CompendiumItem {
  private _tags: ITagData[]
  protected current_uses: number
  protected _custom_damage_type?: string

  public constructor(equipmentData: IPilotEquipmentData) {
    super(equipmentData)
    this._tags = equipmentData.tags || []
    this.current_uses = 0
  }

  protected save(): void {
    store.dispatch('saveData')
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }

  public get CanSetDamage(): boolean {
    return this._tags.some(x => x.id === 'tg_set_damage_type')
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
    item.note = itemData.note
    item._flavor_name = itemData.flavorName
    item._flavor_description = itemData.flavorDescription
    item._custom_damage_type = itemData.customDamageType || null
    return item
  }
}

export { PilotEquipment, IPilotEquipmentData }
