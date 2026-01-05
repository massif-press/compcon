import { CompendiumStore } from '@/stores';
import { CompendiumItem, ContentPack, PilotArmor, PilotGear, PilotWeapon } from '@/class';
import { ICompendiumItemData, IEquipmentData, IPilotWeaponData, ITagData } from '@/interface';

interface IPilotEquipmentData extends ICompendiumItemData {
  type?: string;
  tags: ITagData[];
  effect?: string;
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

  public constructor(data: IPilotEquipmentData, pack?: ContentPack) {
    super(data, pack);
    this._used = false;
    this._destroyed = false;
    this._cascading = false;
    this._loaded = true;
    this._custom_damage_type = null;
    // todo: effectobject constructor
    this.Effect = data?.effect
      ? typeof data.effect === 'string'
        ? data.effect
        : (data.effect as any).description
      : '';
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

  public static Factory<T>(data: IPilotEquipmentData, pack?: ContentPack): T {
    if ((data as any).InstanceID) return data as T;
    if (data.type?.toLowerCase() === 'armor') return new PilotArmor(data, pack) as T;
    if (data.type?.toLowerCase() === 'weapon')
      return new PilotWeapon(data as IPilotWeaponData, pack) as T;
    return new PilotGear(data) as T;
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
      type: item.ItemType,
      note: item.Note,
      data: item.ItemData,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
      customDamageType: item._custom_damage_type || undefined,

      // combat props
      maxUses: item.getTotalUses(),
      currentUses: item.Uses,
      destroyed: item.Destroyed,
      isUsed: item.Used,
    } as IEquipmentData;
  }

  public static Deserialize(itemData: IEquipmentData): PilotEquipment | null {
    if (!itemData) return null;
    let item;
    if (CompendiumStore().has('PilotGear', itemData.id))
      item = CompendiumStore().instantiate('PilotGear', itemData.id);
    else {
      item = PilotEquipment.Factory(itemData.data) as PilotEquipment;
      item.FromInstance = true;
    }
    item._note = itemData.note;
    item._flavor_name = itemData.flavorName;
    item._flavor_description = itemData.flavorDescription;
    item._custom_damage_type = itemData.customDamageType || null;

    // combat props
    if (itemData.maxUses) item.max_use_override = itemData.maxUses;
    if (itemData.currentUses) item.Uses = itemData.currentUses;
    if (itemData.destroyed) item.Destroyed = itemData.destroyed;
    if (itemData.isUsed) item.Used = itemData.isUsed;

    return item;
  }
}

export { PilotEquipment };
export type { IPilotEquipmentData };
