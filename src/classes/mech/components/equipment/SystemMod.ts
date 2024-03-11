import { CompendiumStore } from '@/stores';
import { ItemType, MechEquipment, SystemType } from '@/class';
import { IEquipmentData, IMechEquipmentData, ITagData } from '@/interface';

interface ISystemModData extends IMechEquipmentData {
  allowed_types?: SystemType[];
  restricted_types?: SystemType[];
  added_tags?: ITagData[];
}

class SystemMod extends MechEquipment {
  public readonly AllowedTypes: SystemType[];
  public readonly RestrictedTypes: SystemType[];

  public constructor(data: ISystemModData) {
    super(data);
    this.AllowedTypes =
      data.allowed_types || Object.keys(SystemType).map((k) => SystemType[k as string]);
    this.RestrictedTypes = data.restricted_types || [];
    this.ItemType = ItemType.SystemMod;
  }

  public get Type(): SystemType {
    return SystemType.Mod;
  }

  public get AppliedString(): string {
    return 'todo';
  }

  public static Serialize(item: SystemMod): IEquipmentData {
    return {
      id: item.ID,
      note: item.Note,
    };
  }

  public static Deserialize(data: IEquipmentData): SystemMod {
    const item = CompendiumStore().instantiate('SystemMods', data.id) as SystemMod;
    item._note = data.note;
    return item;
  }
}

export { SystemMod };
export type { ISystemModData };
