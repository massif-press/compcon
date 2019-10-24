import { store } from '@/store'
import _ from 'lodash'
import { MechEquipment, SystemType, ItemType } from '@/class'

class MechSystem extends MechEquipment {
  private _system_type: SystemType

  public constructor(systemData: any) {
    super(systemData)
    this._system_type = systemData.type
    this._item_type = ItemType.MechSystem
  }

  public get SP(): number {
    return this.sp
  }

  public get Type(): SystemType {
    return this._system_type
  }

  public static Serialize(item: MechSystem): IEquipmentData {
    return {
      id: item.ID,
      uses: item.Uses || 0,
      destroyed: item.IsDestroyed || false,
    }
  }

  public static Deserialize(itemData: IEquipmentData): MechSystem {
    let item = store.getters.instantiate('MechSystems', itemData.id)
    item.Uses = itemData.uses || 0
    item.destroyed = itemData.destroyed || false
    return item
  }
}

export default MechSystem
