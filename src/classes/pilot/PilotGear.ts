import { PilotEquipment, ItemType } from '@/class'
import { IPilotEquipmentData } from '@/interface'

class PilotGear extends PilotEquipment {
  public constructor(gearData: IPilotEquipmentData) {
    super(gearData)
    this.ItemType = ItemType.PilotGear
  }
}

export { PilotGear }
