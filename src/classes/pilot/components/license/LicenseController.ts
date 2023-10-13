import _ from 'lodash';
import { IRankedData } from '../../../../interface';
import { Pilot } from '../../Pilot';
import License from './License';
import { PilotLicense } from './PilotLicense';
import { CompendiumItem, ItemType, LicensedItem } from '@/class';
import { CompendiumStore } from '@/stores';

interface ILicenseSaveData {
  licenses: IRankedData[];
}

class LicenseController {
  public readonly Parent: Pilot;
  private _licenses: PilotLicense[];

  public constructor(parent: Pilot) {
    this.Parent = parent;
    this._licenses = [];
  }

  public get Licenses(): PilotLicense[] {
    return this._licenses;
  }

  public get LicensedItems(): LicensedItem[] {
    return this._licenses
      .flatMap((x) => x.License.UnlocksByTotalRank(x.Rank))
      .concat(this.Parent.SpecialEquipment as LicensedItem[])
      .concat(LicensedItem.AllUnlicensedItems());
  }

  public AllowedItems(type: ItemType): LicensedItem[] {
    const unlocked = this.LicensedItems.filter((x) => x.ItemType === type);
    const special = this.Parent.SpecialEquipment.filter(
      (x) => x.ItemType === type
    ) as LicensedItem[];

    return unlocked.concat(special);
  }

  public set Licenses(licenses: PilotLicense[]) {
    this._licenses = licenses;
    this.Parent.SaveController.save();
  }

  public LicenseLevel(manufacturerID: string): number {
    return this.Licenses.filter(
      (x) => x.License.Source.toLowerCase() === manufacturerID.toLowerCase()
    ).reduce((a, b) => +a + +b.Rank, 0);
  }

  public get CurrentLicensePoints(): number {
    return this._licenses.reduce((sum, license) => sum + license.Rank, 0);
  }

  public get MaxLicensePoints(): number {
    const bonus = this.Parent.ReservesController.Reserves.filter(
      (x) => x.ID === 'reserve_license'
    ).length;
    return this.Parent.Level + bonus;
  }

  public get IsMissingLicenses(): boolean {
    return this.CurrentLicensePoints < this.MaxLicensePoints;
  }

  public get HasLicenses(): boolean {
    return this.CurrentLicensePoints === this.MaxLicensePoints;
  }

  public getLicenseRank(_name: string): number {
    const index = this._licenses.findIndex((x) => x.License.Name === _name);
    return index > -1 ? this._licenses[index].Rank : 0;
  }

  public AddLicense(license: License): void {
    const index = this._licenses.findIndex((x) => x.License.FrameID === license.FrameID);
    if (index === -1) {
      this._licenses.push(new PilotLicense(license, 1));
    } else {
      this._licenses[index].Increment();
    }
    this.Parent.SaveController.save();
  }

  public RemoveLicense(license: License): void {
    const index = this._licenses.findIndex((x) => x.License.FrameID === license.FrameID);
    if (index === -1) {
      console.error(
        `License "${license.ToString()}" does not exist on Pilot ${this.Parent.Callsign}`
      );
    } else {
      if (this._licenses[index].Rank > 1) {
        this._licenses[index].Decrement();
      } else {
        this._licenses.splice(index, 1);
      }
    }
    this.Parent.SaveController.save();
  }

  public ClearLicenses(): void {
    for (let i = this._licenses.length - 1; i >= 0; i--) {
      while (this._licenses[i]) {
        this.RemoveLicense(this._licenses[i].License);
      }
    }
  }

  public static Serialize(parent: Pilot, target: any) {
    target.licenses = parent.LicenseController.Licenses.map((x) => PilotLicense.Serialize(x));
  }

  public static Deserialize(parent: Pilot, data: ILicenseSaveData) {
    if (!parent.LicenseController)
      throw new Error(
        `LicenseController not found on parent (${typeof parent}). New LicenseControllers must be instantiated in the parent's constructor method.`
      );

    parent.LicenseController._licenses = data.licenses.map((x: IRankedData) =>
      PilotLicense.Deserialize(x)
    );
  }
}

export { LicenseController };
export type { ILicenseSaveData };
