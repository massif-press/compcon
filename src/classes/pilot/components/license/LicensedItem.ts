import { CompendiumStore } from '../../../../stores';
import { CompendiumItem, ContentPack, Frame, ItemType, Manufacturer } from '../../../../class';
import { ICompendiumItemData, IContentPack, ITagCompendiumData } from '../../../../interface';

interface ILicenseRequirement {
  source: string;
  name: string;
  rank: number;
  items: string[];
  missing?: boolean;
}

interface ILicensedItemData extends ICompendiumItemData {
  source: string;
  license: string;
  license_level: number;
  license_id?: string;
}

abstract class LicensedItem extends CompendiumItem {
  public IsIntegrated: boolean = false;

  public readonly Source: string;
  public readonly LicenseLevel: number;
  private _license: string;
  private _license_id: string;

  public constructor(data: ILicensedItemData, pack?: ContentPack) {
    super(data, pack);
    this.Source = data.source ? data.source.toUpperCase() : '';
    if (!this.Source) this.IsIntegrated = true;
    this._license = data.license || '';
    this._license_id = data.license_id || '';
    this.LicenseLevel = parseInt(data.license_level as any) || 0;
  }

  public get Manufacturer(): Manufacturer {
    if (this.Source === 'EXOTIC') return undefined as any;
    return CompendiumStore().referenceByID('Manufacturers', this.Source);
  }

  public get License(): string {
    return this.ItemType === ItemType.Frame ? this.Name : this._license;
  }

  public get LicenseString(): string {
    if (this._license) return `${this._license} ${this.LicenseLevel}`;
    return this.Source;
  }

  public get LicenseID(): string {
    return this._license_id;
  }

  public get ManufacturerColor(): string {
    return this.Manufacturer.Color;
  }

  public get RequiredLicense(): ILicenseRequirement {
    return {
      source: this.Source,
      name: this.getLicenseName(),
      rank: this.LicenseLevel,
      items: [this.ItemType === ItemType.Frame ? `${this.Name} Frame` : this.Name],
    };
  }

  private getLicenseName(): string {
    if (this.ItemType === ItemType.Frame) {
      const f = this as unknown as Frame;
      if (f.IsVariantFrame) return f.Variant;
      return this.License;
    }
    return this.License;
  }

  // for the purposes of this function, Exotic and Integrated equipment is not considered licensed
  public static AllUnlicensedItems(): LicensedItem[] {
    return CompendiumStore()
      .allEquipment.filter((x) => !x.LicenseLevel)
      .filter((x) => !x.IsExotic)
      .filter((x) => !x.IsIntegrated);
  }
}

export { LicensedItem };
export type { ILicensedItemData, ILicenseRequirement };
