import { store } from '@/store'
import { MechEquipment, SystemType, ItemType } from '@/class'
import { IMechEquipmentData, ITagCompendiumData } from '@/interface'

interface IMechSystemData extends IMechEquipmentData {
  type: SystemType
}

class MechSystem extends MechEquipment {
  private _system_type: SystemType

  public constructor(data: IMechSystemData, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName)
    this._system_type = data.type || SystemType.System
    this.ItemType = ItemType.MechSystem
  }

  public get Type(): SystemType {
    return this._system_type
  }

  public get Color(): string {
    return 'mech-system'
  }

  public static Serialize(item: MechSystem): IEquipmentData {
    return {
      id: item.ID,
      uses: item.Uses || 0,
      destroyed: item.Destroyed || false,
      cascading: item.IsCascading || false,
      note: item.Note,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
    }
  }

  public static Deserialize(data: IEquipmentData): MechSystem {
    const item = store.getters.instantiate('MechSystems', data.id) as MechSystem
    item.Uses = data.uses || 0
    item._destroyed = data.destroyed || false
    item._cascading = data.cascading || false
    item._note = data.note
    item._flavor_name = data.flavorName
    item._flavor_description = data.flavorDescription

    return item
  }
}

export { MechSystem, IMechSystemData }
