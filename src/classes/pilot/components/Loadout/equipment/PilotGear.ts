import { PilotEquipment, ItemType } from '@/class';
import { IContentPack, IPilotEquipmentData, ITagCompendiumData } from '@/interface';

class PilotGear extends PilotEquipment {
  public constructor(data: IPilotEquipmentData, pack?: ContentPack) {
    super(data, pack);
    this.ItemType = ItemType.PilotGear;
  }

  public get Icon(): string {
    return 'cc:pilot';
  }
}

export { PilotGear };
