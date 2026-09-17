import { IEquipmentData } from '@/classes/mech/components/equipment/MechEquipment'
import { ITagData } from '@/classes/Tag'
import { CompendiumItem, ICompendiumItemData } from '../../../../CompendiumItem'
import { ContentPack } from '../../../../ContentPack'
import { TAG, hasTag, findTag } from '@/classes/TagRules'

interface IPilotEquipmentData extends ICompendiumItemData {
  type?: string
  tags: ITagData[]
  effect?: string
}

abstract class PilotEquipment extends CompendiumItem {
  protected _custom_damage_type?: string | null
  protected _missing_uses: number
  protected _destroyed: boolean
  protected _cascading: boolean
  protected _loaded: boolean
  protected _used: boolean
  protected max_use_override: number | null
  private _max_uses: number
  public readonly SP: number = 0
  public readonly Effect: string = ''
  public readonly IsIntegrated: boolean = false
  public readonly IsUnique: boolean = false
  public readonly IsLimited: boolean = false
  public readonly IsLoading: boolean = false
  public readonly IsAI: boolean = false
  public readonly IsIndestructible: boolean = false
  public readonly CanSetDamage: boolean = false
  public readonly CanSetUses: boolean = false
  public readonly NoCascade: boolean = false

  public constructor(data: IPilotEquipmentData, pack?: ContentPack) {
    super(data, pack)
    this._used = false
    this._destroyed = false
    this._cascading = false
    this._loaded = true
    this._custom_damage_type = null
    this.Effect = data?.effect
      ? typeof data.effect === 'string'
        ? data.effect
        : (data.effect as any).description
      : ''
    if (data.tags) {
      const ltd = findTag(data.tags, TAG.Limited)
      this.IsLimited = !!ltd
      this._max_uses = ltd && typeof ltd.val === 'number' ? ltd.val : 0
      this.IsUnique = hasTag(data.tags, TAG.Unique)
      this.IsLoading = hasTag(data.tags, TAG.Loading)
      this.IsAI = hasTag(data.tags, TAG.AI)
      this.NoCascade = hasTag(data.tags, TAG.NoCascade)
      this.IsIndestructible = hasTag(data.tags, TAG.Indestructible)
      this.CanSetDamage = hasTag(data.tags, TAG.SetDamageType)
      this.CanSetUses = hasTag(data.tags, TAG.SetMaxUses)
      this.max_use_override = this.CanSetUses ? 0 : null
    } else {
      this._max_uses = 0
      this.max_use_override = null
    }
    this._missing_uses = 0
  }

  public getTotalUses(bonus?: number): number {
    const b = bonus ? bonus : 0
    return this.max_use_override !== null ? this.max_use_override : this._max_uses + b
  }

  public get Type(): string {
    return this.ItemType.replace(/([A-Z])/g, ' $1')
  }

  public static Serialize(item: PilotEquipment): IEquipmentData | null {
    if (!item) return null
    return {
      id: item.ID,
      instanceId: item.InstanceID,
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
    } as IEquipmentData
  }
}

export { PilotEquipment }
export type { IPilotEquipmentData }
