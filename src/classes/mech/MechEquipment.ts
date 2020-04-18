import { LicensedItem, Tag, ItemEffect } from '@/class'
import { ILicensedItemData } from '@/interface'

interface IMechEquipmentData extends ILicensedItemData {
  sp: number
  tags: ITagData[]
  effect: string | object | object[]
  talent_item?: boolean
  frame_id?: boolean
}

abstract class MechEquipment extends LicensedItem {
  protected sp: number
  protected _uses: number
  protected _destroyed: boolean
  protected _cascading: boolean
  protected _loaded: boolean
  private _effect: ItemEffect[]
  private _integrated: boolean
  private _max_uses: number
  protected _tags: ITagData[]
  protected max_use_override: number

  public constructor(itemData: IMechEquipmentData) {
    super(itemData)
    this.sp = itemData.sp || 0
    this._tags = itemData.tags
    this._effect = this.getItemData(itemData.effect)
    this._integrated =
      itemData.talent_item || itemData.frame_id || itemData.id.includes('_integrated')
    this._uses = 0
    this._destroyed = false
    this._cascading = false
    this._loaded = true
    if (itemData.tags) {
      const ltd = itemData.tags.find(x => x.id === 'tg_limited')
      this._max_uses = ltd && typeof ltd.val === 'number' ? ltd.val : 0
    } else {
      this._max_uses = 0
    }
  }

  private getItemData(data: any): ItemEffect[] {
    if (!Array.isArray(data)) {
      return [ItemEffect.Generate(data)]
    } else return data.map(x => ItemEffect.Generate(x))
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }

  public get Effect(): ItemEffect[] {
    return this._effect
  }

  public get IsIntegrated(): boolean {
    return this._integrated
  }

  public get IsUnique(): boolean {
    return this.Tags.some(x => x.IsUnique)
  }

  public get IsAI(): boolean {
    return this.Tags.some(x => x.IsAI)
  }

  public get IsIndestructible(): boolean {
    return this.Tags.some(x => x.IsIndestructible)
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

  public get IsLimited(): boolean {
    return this.Tags.some(x => x.IsLimited)
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

  public get CanSetDamage(): boolean {
    return this._tags.some(x => x.id === 'tg_set_damage_type')
  }

  public get CanSetUses(): boolean {
    return this._tags.some(x => x.id === 'tg_set_max_uses')
  }

  public get IsLoading(): boolean {
    return this.Tags.some(x => x.IsLoading)
  }

  public get Loaded(): boolean {
    return this._loaded
  }

  public set Loaded(_loaded: boolean) {
    this._loaded = _loaded
    this.save()
  }

  public get Uses(): number {
    return this._uses
  }

  public set Uses(val: number) {
    this._uses = val
    this.save()
  }

  public get MaxUses(): number {
    if (this.max_use_override) return this.max_use_override
    return this._max_uses
  }

  public getTotalUses(bonus?: number): number {
    const b = bonus ? bonus : 0
    return this.MaxUses + b
  }
}

export { MechEquipment, IMechEquipmentData }
