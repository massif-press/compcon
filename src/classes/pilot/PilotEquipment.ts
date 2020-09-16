import { store } from '@/store'
import { CompendiumItem } from '@/class'
import { ICompendiumItemData } from '@/interface'

interface IPilotEquipmentData extends ICompendiumItemData {
  type?: string
  tags: ITagData[]
}

abstract class PilotEquipment extends CompendiumItem {
  protected current_uses: number
  protected _custom_damage_type?: string
  protected _uses: number
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
  public readonly IsIndestructible: boolean
  public readonly CanSetDamage: boolean
  public readonly CanSetUses: boolean

  public constructor(data: IPilotEquipmentData) {
    super(data)
    this._uses = 0
    this._destroyed = false
    this._cascading = false
    this._loaded = true
    if (data.tags) {
      const ltd = data.tags.find(x => x.id === 'tg_limited')
      this.IsLimited = !!ltd
      this._max_uses = ltd && typeof ltd.val === 'number' ? ltd.val : 0
      this.IsUnique = data.tags.some(x => x.id === 'tg_unique')
      this.IsLoading = data.tags.some(x => x.id === 'tg_set_max_uses')
      this.IsAI = data.tags.some(x => x.id === 'tg_set_max_uses')
      this.IsIndestructible = data.tags.some(x => x.id === 'tg_set_max_uses')
      this.CanSetDamage = data.tags.some(x => x.id === 'tg_set_damage_type')
      this.CanSetUses = data.tags.some(x => x.id === 'tg_set_max_uses')
    } else {
      this._max_uses = 0
    }
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

  public static Serialize(item: PilotEquipment | null): IEquipmentData | null {
    if (!item) return null
    return {
      id: item.ID,
      destroyed: false,
      uses: item.current_uses,
      cascading: false,
      note: item.Note,
      flavorName: item._flavor_name,
      flavorDescription: item._flavor_description,
      customDamageType: item._custom_damage_type || null,
    }
  }

  public static Deserialize(itemData: IEquipmentData | null): PilotEquipment | null {
    if (!itemData) return null
    const item = store.getters.instantiate('PilotGear', itemData.id)
    item.current_uses = itemData.uses
    item._note = itemData.note
    item._flavor_name = itemData.flavorName
    item._flavor_description = itemData.flavorDescription
    item._custom_damage_type = itemData.customDamageType || null
    return item
  }
}

export { PilotEquipment, IPilotEquipmentData }
