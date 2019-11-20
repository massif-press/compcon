import { store } from '@/store'
import { MechEquipment, SystemType, ItemType } from '@/class'
import { IMechEquipmentData } from '@/interface'

interface IMechSystemData extends IMechEquipmentData {
  type: SystemType
}

class MechSystem extends MechEquipment {
  private _system_type: SystemType

  public constructor(systemData: IMechSystemData) {
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
      unshackled: item.IsUnshackled || false,
    }
  }

  public static Deserialize(itemData: IEquipmentData): MechSystem {
    let item = store.getters.instantiate('MechSystems', itemData.id)
    item.Uses = itemData.uses || 0
    item.destroyed = itemData.destroyed || false
    item.unshackled = itemData.unshackled || false
    return item
  }
}

export { MechSystem, IMechSystemData }
