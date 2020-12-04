import { PilotEquipment, ItemType } from '@/class'
import { IPilotEquipmentData, ITagCompendiumData } from '@/interface'

class PilotGear extends PilotEquipment {
  public constructor(gearData: IPilotEquipmentData, packTags?: ITagCompendiumData[]) {
    super(gearData, packTags)
    this.ItemType = ItemType.PilotGear
  }
}

export { PilotGear }
