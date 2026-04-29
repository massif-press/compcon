import { CompendiumStore } from '../../../../stores'
import {
  CompendiumItem,
  ContentPack,
  Frame,
  ItemType,
  Manufacturer,
  Pilot,
} from '../../../../class'
import { ICompendiumItemData } from '../../../../interface'

interface ILicenseRequirement {
  source: string
  name: string
  rank: number
  items: string[]
  license_id?: string
  missing?: boolean
}

interface ILicensedItemData extends ICompendiumItemData {
  license: string
  license_level: number
  source?: string
  license_id?: string
}

abstract class LicensedItem extends CompendiumItem {
  public IsIntegrated: boolean = false

  public readonly Source: string
  public readonly LicenseLevel: number
  private _license: string
  private _license_id: string

  public constructor(data: ILicensedItemData, pack?: ContentPack) {
    super(data, pack)
    this.Source = data.source ? data.source.toUpperCase() : ''
    if (!this.Source) this.IsIntegrated = true
    this._license = data.license || ''
    this._license_id = data.license_id || ''
    this.LicenseLevel = parseInt(data.license_level as any) || 0
  }

  public get Manufacturer(): Manufacturer {
    if (this.Source === 'EXOTIC') return undefined as any
    if (!CompendiumStore().has('Manufacturers', this.Source)) return undefined as any
    return CompendiumStore().referenceByID('Manufacturers', this.Source)
  }

  public get License(): string {
    return this.ItemType === ItemType.Frame ? this.Name : this._license
  }

  public get LicenseString(): string {
    if (this._license) return `${this._license} ${this.LicenseLevel}`
    return this.Source
  }

  public get LicenseID(): string {
    return this._license_id
  }

  public get ManufacturerColor(): string {
    return this.Manufacturer?.Color || 'panel'
  }

  public get ManufacturerIcon(): string {
    return this.Manufacturer?.Icon || 'cc:manufacturer'
  }

  public get RequiredLicense(): ILicenseRequirement {
    return {
      source: this.Source,
      name: this.getLicenseName(),
      rank: this.LicenseLevel,
      license_id: this.getLicenseId(),
      items: [this.ItemType === ItemType.Frame ? `${this.Name} Frame` : this.Name],
    }
  }

  private getLicenseName(): string {
    if (this.ItemType === ItemType.Frame) {
      const f = this as unknown as Frame
      if (f.Variant) return f.Variant
    }
    return this.License
  }

  private getLicenseId(): string {
    if (this.ItemType === ItemType.Frame) {
      const f = this as unknown as Frame
      if (f.Variant)
        return (
          CompendiumStore().Frames.find(x => x.ID.toLowerCase().includes(f.Variant.toLowerCase()))
            ?.ID ||
          CompendiumStore().Frames.find(x => x.Name.toLowerCase().includes(f.Variant.toLowerCase()))
            ?.ID ||
          this.LicenseID
        )
    }
    return this.LicenseID
  }

  // for the purposes of this function, Exotic and Integrated equipment is not considered licensed
  public static AllUnlicensedItems(pilot: Pilot): LicensedItem[] {
    let arr = CompendiumStore()
      .allEquipment.filter(x => !x.LicenseLevel)
      .filter(x => !x.IsExotic)
      .filter(x => !x.IsIntegrated)

    if (pilot.LcpConfig) {
      arr = arr.filter(
        x =>
          !x.InLcp ||
          pilot.LcpConfig?.packList.some(y => y.packID === x.Brew?.LcpId) ||
          pilot.LcpConfig?.packList.some(y => y.packName === x.Brew?.LcpName)
      )
    }

    return arr as LicensedItem[]
  }
}

export { LicensedItem }
export type { ILicensedItemData, ILicenseRequirement }
