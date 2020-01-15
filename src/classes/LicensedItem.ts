import { store } from '@/store'
import { CompendiumItem, ItemType, Manufacturer } from '@/class'
import { ICompendiumItemData } from '@/interface'

interface ILicensedItemData extends ICompendiumItemData {
  source: string
  license: string
  license_level: number
}

// these items are unlocked via pilots ranking up in a specific frame license
abstract class LicensedItem extends CompendiumItem {
  private _source: string
  private _license: string
  private _license_level: number

  public constructor(itemData: ILicensedItemData) {
    super(itemData)
    this._source = itemData.source || ''
    this._license = itemData.license || ''
    this._license_level = this._source === 'GMS' ? 0 : itemData.license_level
  }

  public get Source(): string {
    return this._source.toUpperCase()
  }

  public get Manufacturer(): Manufacturer {
    return store.getters.getItemCollection('Manufacturers').find(x => x.Short === this.Source)
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

export { LicensedItem, ILicensedItemData }
