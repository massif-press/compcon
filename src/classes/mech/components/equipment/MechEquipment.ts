import { ITagData } from '@/classes/Tag'
import { ContentPack } from '../../../ContentPack'
import { ILicensedItemData, LicensedItem } from '../../../pilot/components/license/LicensedItem'
import { localize, localizeNested } from '@/i18n/localize'
import { TAG, hasTag, findTag } from '@/classes/TagRules'

export interface IEquipmentData {
  id: string
  instanceId?: string
  note: string
  flavorName?: string
  flavorDescription?: string
  customDamageType?: string
  data?: any

  // combat props
  maxUses?: number
  currentUses?: number
  destroyed?: boolean
  isUsed?: boolean
}

interface IMechEquipmentData extends ILicensedItemData {
  sp: number
  tags: ITagData[]
  effect: string
  talent_item?: boolean
  frame_id?: boolean
  ammo?: any[]
  no_mods?: boolean
  no_bonuses?: boolean
  no_synergies?: boolean
}

abstract class MechEquipment extends LicensedItem {
  public override IsIntegrated: boolean
  public readonly SP: number
  public get Effect(): string {
    return localize(this.ID, 'effect', this._effect)
  }
  private _effect: string = ''
  public readonly IsUnique: boolean = false
  public readonly IsLimited: boolean = false
  public readonly IsLoading: boolean = false
  public readonly IsAI: boolean = false
  public readonly NoCascade: boolean = false
  public readonly IsIndestructible: boolean = false
  public IsCascading: boolean = false
  public readonly CanSetDamage: boolean = false
  public readonly CanSetUses: boolean = false
  public readonly NoMods: boolean
  public readonly NoBonuses: boolean
  public readonly NoSynergies: boolean
  private readonly _ammo: any[]

  public constructor(data: IMechEquipmentData, pack?: ContentPack) {
    super(data, pack)
    this.SP = parseInt(data.sp as any) || 0
    this._effect = data?.effect
      ? typeof data.effect === 'string'
        ? data.effect
        : (data.effect as any).description
      : ''
    this.IsIntegrated = data.talent_item || data.frame_id || data.id.includes('_integrated')
    if (data.tags) {
      const ltd = findTag(data.tags, TAG.Limited)
      this.IsLimited = !!ltd
      this.MaxUses = ltd && typeof ltd.val === 'number' ? parseInt(ltd.val as any) : 0
      this.IsUnique = hasTag(data.tags, TAG.Unique)
      this.IsLoading = hasTag(data.tags, TAG.Loading)
      this.IsAI = hasTag(data.tags, TAG.AI)
      if (this.ID === 'ms_technophile_3') {
        this.IsAI = false // hardcode enlightenment ai system workaround
      }
      this.NoCascade = hasTag(data.tags, TAG.NoCascade)
      this.IsIndestructible = hasTag(data.tags, TAG.Indestructible)
      this.CanSetDamage = hasTag(data.tags, TAG.SetDamageType)
      this.CanSetUses = hasTag(data.tags, TAG.SetMaxUses)
    }
    this._ammo = data.ammo || []
    this.NoMods = data.no_mods || false
    this.NoBonuses = data.no_bonuses || false
    this.NoSynergies = data.no_synergies || false
  }

  public get Ammo(): any[] {
    return this._ammo.map(a => ({
      ...a,
      name: localizeNested(a, 'name', a.name),
      detail: localizeNested(a, 'detail', a.detail),
    }))
  }


  public getTotalUses(bonus?: number): number {
    const b = bonus ? bonus : 0
    return this.MaxUses + b
  }
}

export { MechEquipment }
export type { IMechEquipmentData }
