import { ItemType } from '@/class'
// items that are stored as compendium data, refernced by ID and contain
// at minimum a name, itemtype, and brew
abstract class CompendiumItem {
  private id: string
  protected name: string
  protected description: string
  protected item_type: ItemType
  private brew: string
  private err?: string

  constructor(itemData?: any) {
    if (itemData) {
      this.id = itemData.id
      this.name = itemData.name
      this.description = itemData.description
      this.item_type = ItemType.None
      this.brew = itemData.brew || 'Core'
    } else {
      this.id = this.name = this.description = this.brew = ''
      this.item_type = ItemType.None
      this.err = 'Item data not found!'
    }
  }

  public get ID(): string {
    return this.id
  }

  public get Name(): string {
    return this.name
  }

  public get Description(): string {
    return this.description
  }

  public get ItemType(): ItemType {
    return this.item_type
  }

  public get Brew(): string {
    return this.brew
  }

  public get Err(): string {
    return this.err || ''
  }
}

// these items are unlocked via pilots ranking up in a specific frame license
abstract class LicensedItem extends CompendiumItem {
  private source: string
  private license: string
  private license_level: number

  constructor(itemData?: any) {
    super(itemData)
    this.source = itemData.source || ''
    this.license = itemData.license || ''
    this.license_level = this.source === 'GMS' ? 0 : itemData.license_level
  }

  public get Source(): string {
    return this.source.toUpperCase()
  }

  public get License(): string {
    return this.ItemType === ItemType.Frame ? this.Name : this.license
  }

  public get LicenseLevel(): number {
    return this.ItemType === ItemType.Frame ? 2 : this.license_level
  }

  public get LicenseString(): string {
    if (this.license) return `${this.license} ${this.license_level}`
    return this.source
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
