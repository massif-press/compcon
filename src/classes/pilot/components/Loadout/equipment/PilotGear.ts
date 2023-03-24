import { PilotEquipment, ItemType } from '@/class';
import { IPilotEquipmentData, ITagCompendiumData } from '@/interface';

class PilotGear extends PilotEquipment {
  public constructor(
    data: IPilotEquipmentData,
    packTags?: ITagCompendiumData[],
    packName?: string
  ) {
    super(data, packTags, packName);
    this.ItemType = ItemType.PilotGear;
  }

  public get Icon(): string {
    return 'cc:pilot';
  }
}

export { PilotGear };
