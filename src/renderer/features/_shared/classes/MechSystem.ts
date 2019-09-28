import { store } from '@/store'
import { MechEquipment, SystemType, ItemType } from '@/class'

class MechSystem extends MechEquipment {
  private system_type: SystemType

  constructor(systemData: any) {
    super(systemData)
    this.system_type = systemData.type
    this.item_type = ItemType.MechSystem
  }

  public get SP(): number {
    return this.sp
  }

  public get Type(): SystemType {
    return this.system_type
  }

  public static Serialize(item: MechSystem): IEquipmentData {
    return {
      id: item.ID,
      notes: item.Notes,
      uses: item.Uses || 0,
      destroyed: item.IsDestroyed || false,
    }
  }

  public static Deserialize(itemData: IEquipmentData): MechSystem {
    let item = store.getters.getItemById('MechSystems', itemData.id)
    item.Notes = itemData.notes
    item.Uses = itemData.uses || 0
    item.destroyed = itemData.destroyed || false
    return item
  }
}

export default MechSystem
