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
    if (this.Tags.length) {
      let mType = '';
      if (this.Tags.some((x) => x.ID === 'tg_mine')) mType = SystemType.Mine;
      if (this.Tags.some((x) => x.ID === 'tg_grenade'))
        mType = mType.length ? SystemType.Charge : SystemType.Grenade;
      if (mType) return mType as SystemType;
    }
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
