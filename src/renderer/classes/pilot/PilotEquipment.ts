import { store } from '@/store'
import { CompendiumItem, Tag } from '@/class'
import { ICompendiumItemData } from '@/interface'

interface IPilotEquipmentData extends ICompendiumItemData {
  tags: ITagData[]
}

abstract class PilotEquipment extends CompendiumItem {
  private _tags: ITagData[]
  protected current_uses: number

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

  public static Serialize(item: PilotEquipment | null): IEquipmentData | null {
    if (!item) return null
    return {
      id: item.ID,
      destroyed: false,
      uses: item.current_uses,
      unshackled: false,
      note: item.Note,
    }
  }

  public static Deserialize(itemData: IEquipmentData | null): PilotEquipment | null {
    if (!itemData) return null
    const item = store.getters.referenceByID('PilotGear', itemData.id)
    item.current_uses = itemData.uses
    return item
  }
}

export { PilotEquipment, IPilotEquipmentData }
