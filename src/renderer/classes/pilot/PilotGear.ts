import { PilotEquipment, ItemType } from '@/class'
import { IPilotEquipmentData } from '@/interface'

interface IPilotGearData extends IPilotEquipmentData {
  uses?: number
}

class PilotGear extends PilotEquipment {
  private uses?: number

  public constructor(gearData: IPilotGearData) {
    super(gearData)
    this.uses = gearData.uses || null
    this._item_type = ItemType.PilotGear
  }

  public get Uses(): number | null {
    return this.current_uses || null
  }

  public set Uses(val: number) {
    val = val < 0 ? 0 : val
    val = val > this.uses ? this.uses : val
    this.current_uses = val
    this.save()
  }

  public get MaxUses(): number | null {
    return this.uses || null
  }
}

export { PilotGear, IPilotGearData }
