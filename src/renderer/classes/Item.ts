import { store } from '@/store'
import { ItemType } from '@/class'
// items that are stored as compendium data, refernced by ID and contain
// at minimum a name, itemtype, and brew
abstract class CompendiumItem {
  private _id: string
  protected _name: string
  protected _description: string
  protected _note: string
  protected _item_type: ItemType
  private _brew: string
  private _err?: string

  public constructor(itemData?: any) {
    if (itemData) {
      this._id = itemData.id
      this._name = itemData.name
      this._description = itemData.description
      this._item_type = ItemType.None
      this._brew = itemData.brew || 'Core'
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

// these items are unlocked via pilots ranking up in a specific frame license
abstract class LicensedItem extends CompendiumItem {
  private _source: string
  private _license: string
  private _license_level: number

  public constructor(itemData?: any) {
    super(itemData)
    this._source = itemData.source || ''
    this._license = itemData.license || ''
    this._license_level = this._source === 'GMS' ? 0 : itemData.license_level
  }

  public get Source(): string {
    return this._source.toUpperCase()
  }

  public get License(): string {
    return this.ItemType === ItemType.Frame ? this.Name : this._license
  }

  public get LicenseLevel(): number {
    return this.ItemType === ItemType.Frame ? 2 : this._license_level
  }

  public get LicenseString(): string {
    if (this._license) return `${this._license} ${this._license_level}`
    return this._source
  }

  public get RequiredLicense(): ILicenseRequirement {
    return {
      source: this.Source,
      name: this.License,
      rank: this.LicenseLevel,
      items: [this.ItemType === ItemType.Frame ? `${this.Name} Frame` : this.Name],
    }
  }
}

export { CompendiumItem, LicensedItem }
