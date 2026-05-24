import { ContentPack } from '../../../../ContentPack'
import { ItemType } from '../../../../enums'
import { IPilotEquipmentData, PilotEquipment } from './PilotEquipment'

class PilotGear extends PilotEquipment {
  public constructor(data: IPilotEquipmentData, pack?: ContentPack) {
    super(data, pack)
    this.ItemType = ItemType.PilotGear
  }

  public get Icon(): string {
    return 'cc:pilot'
  }

  public get Color(): string {
    return this.IsExotic ? 'exotic' : 'pilot'
  }
}

export { PilotGear }
