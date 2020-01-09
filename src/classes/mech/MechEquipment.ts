import { LicensedItem, Tag } from '@/class'
import { ILicensedItemData } from '@/interface'

interface IMechEquipmentData extends ILicensedItemData {
  sp: number
  tags: ITagData[]
  effect: string
  talent_item?: boolean
  frame_id?: boolean
}

abstract class MechEquipment extends LicensedItem {
  protected sp: number
  protected tags: ITagData[]
  private _effect: string
  private _integrated: boolean
  private _uses: number
  private _max_uses: number
  private _destroyed: boolean
  private _unshackled: boolean
  private _loaded: boolean

  public constructor(itemData: IMechEquipmentData) {
    super(itemData)
    this.sp = itemData.sp || 0
    this.tags = itemData.tags
    this._effect = itemData.effect
    this._integrated = itemData.talent_item || itemData.frame_id || false
    this._uses = 0
    this._destroyed = false
    this._unshackled = false
    this._loaded = true
    if (itemData.tags) {
      const ltd = itemData.tags.find(x => x.id === 'limited')
      this._max_uses = ltd && typeof ltd.val === 'number' ? ltd.val : 0
    } else {
      this._max_uses = 0
    }
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this.tags)
  }

  public get Effect(): string {
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

  public get IsUnshackled(): boolean {
    return this._unshackled
  }

  public set IsUnshackled(b: boolean) {
    this._unshackled = b
  }

  public Unshackle(): void {
    if (!this.IsAI) return
    this._unshackled = true
    this.save()
  }

  public Shackle(): void {
    this._unshackled = false
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
    this._destroyed = true
    this.save()
  }

  public Repair(): void {
    this._destroyed = false
    this.save()
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
    return this._max_uses
  }

  public getTotalUses(bonus?: number): number {
    const b = bonus ? bonus : 0
    return this.MaxUses + b
  }
}

export { MechEquipment, IMechEquipmentData }
