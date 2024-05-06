import { CompendiumStore } from '@/stores';
import { MechEquipment, SystemType, ItemType, ContentPack } from '@/class';
import { IContentPack, IEquipmentData, IMechEquipmentData, ITagCompendiumData } from '@/interface';

interface IMechSystemData extends IMechEquipmentData {
  type: SystemType;
}

class MechSystem extends MechEquipment {
  private _system_type: SystemType;

  public constructor(data: IMechSystemData, pack?: ContentPack) {
    super(data, pack);
    this._system_type = data.type || SystemType.System;
    this.ItemType = ItemType.MechSystem;
  }

  public get Type(): SystemType {
    return this._system_type;
  }

  public get Color(): string {
    return 'system';
  }

  public static Serialize(item: MechSystem): IEquipmentData {
    return {
      id: item.ID,
      note: item.Note,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
    };
  }

  public static Deserialize(data: IEquipmentData): MechSystem {
    const item = CompendiumStore().instantiate('MechSystems', data.id) as MechSystem;
    item._note = data.note;
    item._flavor_name = data.flavorName || '';
    item._flavor_description = data.flavorDescription || '';

    return item;
  }
}

export { MechSystem };
export type { IMechSystemData };
