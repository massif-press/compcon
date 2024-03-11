import { CompendiumStore } from '@/stores';
import { CompendiumItem, PilotArmor, PilotGear, PilotWeapon } from '@/class';
import {
  ICompendiumItemData,
  IEquipmentData,
  IPilotWeaponData,
  ITagCompendiumData,
  ITagData,
} from '@/interface';

interface IPilotEquipmentData extends ICompendiumItemData {
  type?: string;
  tags: ITagData[];
}

abstract class PilotEquipment extends CompendiumItem {
  protected _custom_damage_type?: string | null;
  protected _missing_uses: number;
  protected _destroyed: boolean;
  protected _cascading: boolean;
  protected _loaded: boolean;
  protected _used: boolean;
  protected max_use_override: number | null;
  private _max_uses: number;
  public readonly SP: number = 0;
  public readonly Effect: string = '';
  public readonly IsIntegrated: boolean = false;
  public readonly IsUnique: boolean = false;
  public readonly IsLimited: boolean = false;
  public readonly IsLoading: boolean = false;
  public readonly IsAI: boolean = false;
  public readonly IsIndestructible: boolean = false;
  public readonly IsOrdnance: boolean = false;
  public readonly CanSetDamage: boolean = false;
  public readonly CanSetUses: boolean = false;
  public readonly NoCascade: boolean = false;

  public constructor(
    data: IPilotEquipmentData,
    packTags?: ITagCompendiumData[],
    packName?: string
  ) {
    super(data, packTags, packName);

    this._used = false;
    this._destroyed = false;
    this._cascading = false;
    this._loaded = true;
    this._custom_damage_type = null;
    if (data.tags) {
      const ltd = data.tags.find((x) => x.id === 'tg_limited');
      this.IsLimited = !!ltd;
      this._max_uses = ltd && typeof ltd.val === 'number' ? ltd.val : 0;
      this.IsUnique = data.tags.some((x) => x.id === 'tg_unique');
      this.IsLoading = data.tags.some((x) => x.id === 'tg_loading');
      this.IsAI = data.tags.some((x) => x.id === 'tg_ai');
      this.NoCascade = data.tags.some((x) => x.id === 'tg_no_cascade');
      this.IsIndestructible = data.tags.some((x) => x.id === 'tg_indestructible');
      this.IsOrdnance = data.tags.some((x) => x.id === 'tg_ordnance');
      this.CanSetDamage = data.tags.some((x) => x.id === 'tg_set_damage_type');
      this.CanSetUses = data.tags.some((x) => x.id === 'tg_set_max_uses');
      this.max_use_override = this.CanSetUses ? 0 : null;
    } else {
      this._max_uses = 0;
      this.max_use_override = null;
    }
    this._missing_uses = 0;
  }

  public static Factory<T>(data: IPilotEquipmentData): T {
    if ((data as any).InstanceID) return data as T;
    if (data.type?.toLowerCase() === 'armor') return new PilotArmor(data) as T;
    if (data.type?.toLowerCase() === 'weapon')
      return new PilotWeapon(data as IPilotWeaponData) as T;
    return new PilotGear(data) as T;
  }

  public get Uses(): number {
    return this.MaxUses;
  }

  public get MaxUses(): number {
    return this.max_use_override !== null ? this.max_use_override : this._max_uses;
  }

  public getTotalUses(bonus?: number): number {
    const b = bonus ? bonus : 0;
    return this.max_use_override !== null ? this.max_use_override : this._max_uses + b;
  }

  public get Type(): string {
    return this.ItemType.replace(/([A-Z])/g, ' $1');
  }

  public static Serialize(item: PilotEquipment): IEquipmentData | null {
    if (!item) return null;
    return {
      id: item.ID,
      note: item.Note,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
      customDamageType: item._custom_damage_type || undefined,
    };
  }

  public static Deserialize(itemData: IEquipmentData): PilotEquipment | null {
    if (!itemData) return null;
    const item = CompendiumStore().instantiate('PilotGear', itemData.id);
    item._note = itemData.note;
    item._flavor_name = itemData.flavorName;
    item._flavor_description = itemData.flavorDescription;
    item._custom_damage_type = itemData.customDamageType || null;

    return item;
  }
}

export { PilotEquipment };
export type { IPilotEquipmentData };
