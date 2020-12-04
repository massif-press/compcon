import { store } from '@/store'
import { CompendiumItem, ItemType, Manufacturer } from '@/class'
import { ICompendiumItemData, ITagCompendiumData } from '@/interface'

interface ILicensedItemData extends ICompendiumItemData {
  source: string
  license: string
  license_level: number
}

abstract class LicensedItem extends CompendiumItem {
  public readonly Source: string
  public readonly LicenseLevel: number
  private _license: string

  public constructor(data: ILicensedItemData, packTags?: ITagCompendiumData[]) {
    super(data, packTags)
    this.Source = data.source ? data.source.toUpperCase() : ''
    this._license = data.license || ''
    this.LicenseLevel = data.license_level || 0
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
