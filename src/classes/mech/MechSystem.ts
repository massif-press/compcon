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
      destroyed: item.Destroyed || false,
      unshackled: item.IsUnshackled || false,
      note: item.Note,
    }
  }

  public static Deserialize(data: IEquipmentData): MechSystem {
    let item = store.getters.instantiate('MechSystems', data.id) as MechSystem
    item.Uses = data.uses || 0
    item.Destroyed = data.destroyed || false
    item.IsUnshackled = data.unshackled || false
    item.Note = data.note
    return item
  }
}

export { MechSystem, IMechSystemData }
