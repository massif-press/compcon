import { store } from '@/store'
import { ItemType } from '@/class'
import { ICounterData } from '@/interface'

// items that are stored as compendium data, refernced by ID and contain
// at minimum a name, itemtype, and brew

interface ICompendiumItemData {
  id: string
  name: string
  description: string
  brew?: string,
  counters?: ICounterData[]
}

abstract class CompendiumItem {
  private _id: string
  protected _name: string
  protected _description: string
  protected _note: string
  protected _item_type: ItemType
  private _brew: string
  private _err?: string

  public readonly Counters: ICounterData[]

  public constructor(itemData?: ICompendiumItemData) {
    if (itemData) {
      this._id = itemData.id
      this._name = itemData.name
      this._description = itemData.description
      this._item_type = ItemType.None
      this._brew = itemData.brew || 'Core'

      this.Counters = itemData.counters || []

    } else {
      this._id = this._name = this._description = this._note = this._brew = ''
      this._item_type = ItemType.None
      this._err = 'Item data not found!'
    }
  }

  protected save(): void {
    store.dispatch('saveData')
  }

  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return this._name
  }

  public get Description(): string {
    return this._description
  }

  public get ItemType(): ItemType {
    return this._item_type
  }

  public get Brew(): string {
    return this._brew
  }

  public get Err(): string {
    return this._err || ''
  }

  public get Note(): string {
    return this._note
  }

  public set Note(note: string) {
    this._note = note
    this.save()
  }
}

export { CompendiumItem, ICompendiumItemData }
