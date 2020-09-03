import { store } from '@/store'
import { CompendiumItem, ItemType, Manufacturer } from '@/class'
import { ICompendiumItemData } from '@/interface'

interface ILicensedItemData extends ICompendiumItemData {
  source: string
  license: string
  license_level: number
}

abstract class LicensedItem extends CompendiumItem {
  public readonly Source: string
  public readonly LicenseLevel: number
  private _license: string

  public constructor(itemData: ILicensedItemData) {
    super(itemData)
    this.Source = itemData.source.toUpperCase() || ''
    this._license = itemData.license || ''
    this.LicenseLevel = itemData.license_level || 0
  }

  public get Manufacturer(): Manufacturer {
    return store.getters.referenceByID('Manufacturers', this.Source)
  }

  public get License(): string {
    return this.ItemType === ItemType.Frame ? this.Name : this._license
  }

  public get LicenseString(): string {
    if (this._license) return `${this._license} ${this.LicenseLevel}`
    return this.Source
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
