import { PilotEquipment, ItemType } from '@/class'
import { IPilotEquipmentData, ITagCompendiumData } from '@/interface'

class PilotGear extends PilotEquipment {
  public constructor(
    data: IPilotEquipmentData,
    packTags?: ITagCompendiumData[],
    packName?: string
  ) {
    super(data, packTags, packName)
    this.ItemType = ItemType.PilotGear
  }
}

export { PilotGear }
