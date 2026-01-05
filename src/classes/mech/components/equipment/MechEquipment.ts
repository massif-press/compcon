import { ContentPack, LicensedItem } from '../../../../class';
import { ILicensedItemData, ITagData } from '../../../../interface';

interface IMechEquipmentData extends ILicensedItemData {
  sp: number;
  tags: ITagData[];
  effect: string;
  talent_item?: boolean;
  frame_id?: boolean;
  ammo?: any[];
  no_mods?: boolean;
  no_bonuses?: boolean;
  no_synergies?: boolean;
}

abstract class MechEquipment extends LicensedItem {
  public IsIntegrated: boolean;
  public readonly SP: number;
  public readonly Effect: string;
  public readonly IsUnique: boolean = false;
  public readonly IsLimited: boolean = false;
  public readonly IsLoading: boolean = false;
  public readonly IsAI: boolean = false;
  public readonly NoCascade: boolean = false;
  public readonly IsIndestructible: boolean = false;
  public readonly IsOrdnance: boolean = false;
  public readonly CanSetDamage: boolean = false;
  public readonly CanSetUses: boolean = false;
  public readonly NoMods: boolean;
  public readonly NoBonuses: boolean;
  public readonly NoSynergies: boolean;
  // TODO: expand
  public readonly Ammo: any[];

  public constructor(data: IMechEquipmentData, pack?: ContentPack) {
    super(data, pack);
    this.SP = parseInt(data.sp as any) || 0;
    this.Effect = data?.effect
      ? typeof data.effect === 'string'
        ? data.effect
        : (data.effect as any).description
      : '';
    this.IsIntegrated = data.talent_item || data.frame_id || data.id.includes('_integrated');
    if (data.tags) {
      const ltd = data.tags.find((x) => x.id === 'tg_limited');
      this.IsLimited = !!ltd;
      this.MaxUses = ltd && typeof ltd.val === 'number' ? parseInt(ltd.val as any) : 0;
      this.IsUnique = this.setTagBool(data, 'tg_unique');
      this.IsLoading = this.setTagBool(data, 'tg_loading');
      this.IsAI = this.setTagBool(data, 'tg_ai');
      this.NoCascade = this.setTagBool(data, 'tg_no_cascade');
      this.IsIndestructible = this.setTagBool(data, 'tg_indestructible');
      this.IsOrdnance = this.setTagBool(data, 'tg_ordnance');
      this.CanSetDamage = this.setTagBool(data, 'tg_set_damage_type');
      this.CanSetUses = this.setTagBool(data, 'tg_set_max_uses');
    }
    this.Ammo = data.ammo || [];
    this.NoMods = data.no_mods || false;
    this.NoBonuses = data.no_bonuses || false;
    this.NoSynergies = data.no_synergies || false;
  }

  private setTagBool(data: IMechEquipmentData, id: string): boolean {
    return data.tags.some((x) => x.id === id);
  }

  public getTotalUses(bonus?: number): number {
    const b = bonus ? bonus : 0;
    return this.MaxUses + b;
  }
}

export { MechEquipment };
export type { IMechEquipmentData };
