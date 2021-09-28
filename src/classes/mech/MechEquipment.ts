import { LicensedItem } from '@/class'
import { ILicensedItemData, ITagCompendiumData } from '@/interface'

interface IMechEquipmentData extends ILicensedItemData {
  sp: number
  tags: ITagData[]
  effect: string
  talent_item?: boolean
  frame_id?: boolean
  // TODO: expand
  ammo?: any[]
  no_mods?: boolean
  no_bonuses?: boolean
  no_synergies?: boolean
}

abstract class MechEquipment extends LicensedItem {
  protected _missing_uses: number
  protected _used: boolean
  protected _destroyed: boolean
  protected _cascading: boolean
  protected _loaded: boolean
  protected max_use_override: number
  private _max_uses: number
  public readonly SP: number
  public readonly Effect: string
  public readonly IsIntegrated: boolean
  public readonly IsUnique: boolean
  public readonly IsLimited: boolean
  public readonly IsLoading: boolean
  public readonly IsAI: boolean
  public readonly NoCascade: boolean
  public readonly IsIndestructible: boolean
  public readonly IsOrdnance: boolean
  public readonly CanSetDamage: boolean
  public readonly CanSetUses: boolean
  public readonly NoMods: boolean
  public readonly NoBonuses: boolean
  public readonly NoSynergies: boolean
  // TODO: expand
  public readonly Ammo: any[]

  public constructor(data: IMechEquipmentData, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName)
    this.SP = data.sp || 0
    this.Effect = data.effect
    this.IsIntegrated = data.talent_item || data.frame_id || data.id.includes('_integrated')
    this._destroyed = false
    this._cascading = false
    this._loaded = true
    this._used = false
    if (data.tags) {
      const ltd = data.tags.find(x => x.id === 'tg_limited')
      this.IsLimited = !!ltd
      this._max_uses = ltd && typeof ltd.val === 'number' ? ltd.val : 0
      this.IsUnique = data.tags.some(x => x.id === 'tg_unique')
      this.IsLoading = data.tags.some(x => x.id === 'tg_loading')
      this.IsAI = data.tags.some(x => x.id === 'tg_ai')
      this.NoCascade = data.tags.some(x => x.id === 'tg_no_cascade')
      this.IsIndestructible = data.tags.some(x => x.id === 'tg_indestructable')
      this.IsOrdnance = data.tags.some(x => x.id === 'tg_ordnance')
      this.CanSetDamage = data.tags.some(x => x.id === 'tg_set_damage_type')
      this.CanSetUses = data.tags.some(x => x.id === 'tg_set_max_uses')
    } else {
      this._max_uses = 0
    }
    this._missing_uses = 0
    this.Ammo = data.ammo || []
    this.NoMods = data.no_mods
    this.NoBonuses = data.no_bonuses
    this.NoSynergies = data.no_synergies
  }

  public Use(cost?: number, free?: boolean): void {
    if (!free) {
      if (!this.CheckUsable(cost)) return
      this._used = true
    }
    if (this.IsLoading) this._loaded = false
    if (this.IsLimited && cost) this.Uses -= cost
  }

  public Undo(cost?: number): void {
    if (cost) this.Uses += cost
    if (this.IsLoading) this._loaded = true
    this._used = false
  }

  public Reset(): void {
    this._used = false
  }

  public CheckUsable(cost?: number): boolean {
    if (this.IsLoading && !this._loaded) return false
    if (this.IsCascading) return false
    if (this.IsLimited && this.Uses === 0) return false
    if (this.IsLimited && cost && this.Uses < cost) return false
    return true
  }

  public get Used(): boolean {
    return this._used
  }

  public set Used(b: boolean) {
    this._used = b
  }

  public get IsCascading(): boolean {
    return this._cascading
  }

  public set IsCascading(b: boolean) {
    this._cascading = b
  }

  public Unshackle(): void {
    if (!this.IsAI) return
    this._cascading = true
    this.save()
  }

  public Shackle(): void {
    this._cascading = false
    this.save()
  }

  public get Destroyed(): boolean {
    return this._destroyed
  }

  public set Destroyed(b: boolean) {
    this._destroyed = b
  }

  public Destroy(): void {
    if (this.IsIndestructible) return
    this._destroyed = true
    this.save()
  }

  public Repair(): void {
    this._destroyed = false
    this.save()
  }

  public get Loaded(): boolean {
    return this._loaded
  }

  public set Loaded(_loaded: boolean) {
    this._loaded = _loaded
    this.save()
  }

  public get Uses(): number {
    return this.MaxUses - this._missing_uses
  }

  public set Uses(val: number) {
    this._missing_uses = this.MaxUses - val
    this.save()
  }

  public get MissingUses(): number {
    return this._missing_uses
  }

  public get MaxUses(): number {
    return this.max_use_override ? this.max_use_override : this._max_uses
  }

  public getTotalUses(bonus?: number): number {
    const b = bonus ? bonus : 0
    return this.MaxUses + b
  }
}

export { MechEquipment, IMechEquipmentData }
