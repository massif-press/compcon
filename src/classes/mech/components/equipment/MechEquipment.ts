import { LicensedItem } from '../../../../class';
import { ILicensedItemData, ITagCompendiumData, ITagData } from '../../../../interface';

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
  protected _missing_uses: number;
  protected _used: boolean;
  protected _destroyed: boolean;
  protected _cascading: boolean;
  protected _loaded: boolean;
  protected max_use_override: number = 0;
  private _max_uses: number;
  public readonly SP: number;
  public readonly Effect: string;
  public readonly IsIntegrated: boolean;
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

  public constructor(data: IMechEquipmentData, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName);
    this.SP = parseInt(data.sp as any) || 0;
    this.Effect = data.effect;
    this.IsIntegrated = data.talent_item || data.frame_id || data.id.includes('_integrated');
    this._destroyed = false;
    this._cascading = false;
    this._loaded = true;
    this._used = false;
    if (data.tags) {
      const ltd = data.tags.find((x) => x.id === 'tg_limited');
      this.IsLimited = !!ltd;
      this._max_uses = ltd && typeof ltd.val === 'number' ? parseInt(ltd.val as any) : 0;
      this.IsUnique = this.setTagBool(data, 'tg_unique');
      this.IsLoading = this.setTagBool(data, 'tg_loading');
      this.IsAI = this.setTagBool(data, 'tg_ai');
      this.NoCascade = this.setTagBool(data, 'tg_no_cascade');
      this.IsIndestructible = this.setTagBool(data, 'tg_indestructible');
      this.IsOrdnance = this.setTagBool(data, 'tg_ordnance');
      this.CanSetDamage = this.setTagBool(data, 'tg_set_damage_type');
      this.CanSetUses = this.setTagBool(data, 'tg_set_max_uses');
    } else {
      this._max_uses = 0;
    }
    this._missing_uses = 0;
    this.Ammo = data.ammo || [];
    this.NoMods = data.no_mods || false;
    this.NoBonuses = data.no_bonuses || false;
    this.NoSynergies = data.no_synergies || false;
  }

  private setTagBool(data: IMechEquipmentData, id: string): boolean {
    return data.tags.some((x) => x.id === id);
  }

  public Use(cost?: number, free?: boolean): void {
    if (!free) {
      if (!this.CheckUsable(cost)) return;
      this._used = true;
    }
    if (this.IsLoading) this._loaded = false;
    if (this.IsLimited && cost) this.Uses -= cost;
  }

  public Undo(cost?: number): void {
    if (cost) this.Uses += cost;
    if (this.IsLoading) this._loaded = true;
    this._used = false;
  }

  public Reset(): void {
    this._used = false;
  }

  public CheckUsable(cost?: number): boolean {
    if (this.IsLoading && !this._loaded) return false;
    if (this.IsCascading) return false;
    if (this.IsLimited && this.Uses === 0) return false;
    if (this.IsLimited && cost && this.Uses < cost) return false;
    return true;
  }

  public get Used(): boolean {
    return this._used;
  }

  public set Used(b: boolean) {
    this._used = b;
  }

  public get IsCascading(): boolean {
    return this._cascading;
  }

  public set IsCascading(b: boolean) {
    this._cascading = b;
  }

  public Unshackle(): void {
    if (!this.IsAI) return;
    this._cascading = true;
    this.save();
  }

  public Shackle(): void {
    this._cascading = false;
    this.save();
  }

  public get Destroyed(): boolean {
    return this._destroyed;
  }

  public set Destroyed(b: boolean) {
    this._destroyed = b;
  }

  public Destroy(): void {
    if (this.IsIndestructible) return;
    this._destroyed = true;
    this.save();
  }

  public Repair(): void {
    this._destroyed = false;
    this.save();
  }

  public get Loaded(): boolean {
    return this._loaded;
  }

  public set Loaded(_loaded: boolean) {
    this._loaded = _loaded;
    this.save();
  }

  public get Uses(): number {
    return this.MaxUses - this._missing_uses;
  }

  public set Uses(val: number) {
    this._missing_uses = this.MaxUses - val;
    this.save();
  }

  public get MissingUses(): number {
    return this._missing_uses;
  }

  public get MaxUses(): number {
    return this.max_use_override ? this.max_use_override : this._max_uses;
  }

  public getTotalUses(bonus?: number): number {
    const b = bonus ? bonus : 0;
    return this.MaxUses + b;
  }
}

export { MechEquipment };
export type { IMechEquipmentData };
