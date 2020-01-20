import { CompendiumItem, ItemType, Manufacturer } from '@/class'
import { store } from '@/store'
import { ICompendiumItemData } from '@/interface'

interface ICoreBonusData extends ICompendiumItemData {
  source: string
  effect: string
  mounted_effect?: string
}

class CoreBonus extends CompendiumItem {
  private _source: string
  private _effect: string
  private _mounted_effect: string

  public constructor(cbData?: ICoreBonusData) {
    super(cbData)
    this._source = cbData.source
    this._effect = cbData.effect
    this._mounted_effect = cbData.mounted_effect || ''
    this._item_type = ItemType.CoreBonus
  }

  public get Source(): string {
    return this._source
  }

  public get Manufacturer(): Manufacturer {
    return store.getters.getItemCollection('Manufacturers').find(x => x.Short === this._source)
  }

  public get Effect(): string {
    return this._effect
  }

  public get IsMountable(): boolean {
    return !!this.MountedEffect
  }

  public get MountedEffect(): string {
    return this._mounted_effect
  }

  public static Deserialize(id: string): CoreBonus {
    return store.getters.referenceByID('CoreBonuses', id)
  }
}

export { CoreBonus, ICoreBonusData }
