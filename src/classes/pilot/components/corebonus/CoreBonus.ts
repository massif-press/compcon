import { CompendiumItem, ICompendiumItemData } from '../../../CompendiumItem'
import { ContentPack } from '../../../ContentPack'
import { ItemType } from '../../../enums'
import { Manufacturer } from '../../../Manufacturer'
import { CompendiumStore } from '../../../../stores'
import { localize } from '@/i18n/localize'

interface ICoreBonusData extends ICompendiumItemData {
  source: string
  effect: string | any
  mounted_effect?: string
}

class CoreBonus extends CompendiumItem {
  public readonly Source: string
  private _effect: string
  private _mountedEffect: string

  public constructor(data?: ICoreBonusData, pack?: ContentPack) {
    super(data, pack)
    this.ItemType = ItemType.CoreBonus
    this.Source = data?.source ? data.source.toUpperCase() : ''
    this._effect = data?.effect || ''
    this._mountedEffect = data?.mounted_effect || ''
  }

  public get Effect(): string {
    return localize(this.ID, 'effect', this._effect)
  }

  public get MountedEffect(): string {
    return localize(this.ID, 'mounted_effect', this._mountedEffect)
  }

  public get Manufacturer(): Manufacturer {
    return CompendiumStore().referenceByID('Manufacturers', this.Source) as unknown as Manufacturer
  }

  public get IsMountable(): boolean {
    return !!this.MountedEffect
  }

  public static Deserialize(data: ICoreBonusData, pack?: ContentPack): CoreBonus {
    return new CoreBonus(data, pack)
  }
}

export { CoreBonus }
export type { ICoreBonusData }
