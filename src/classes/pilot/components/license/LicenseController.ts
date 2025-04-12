import _ from 'lodash';
import { IRankedData } from '../../../../interface';
import { Pilot } from '../../Pilot';
import License from './License';
import { PilotLicense } from './PilotLicense';
import { CompendiumItem, ItemType, LicensedItem } from '@/class';
import { CompendiumStore } from '@/stores';
import { AchievementEventSystem } from '@/user/achievements/AchievementEvent';
import logger from '@/user/logger';

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

    if (!this.Parent.IsLevelEdit) {
      const index = this._licenses.findIndex((x) => x.License.FrameID === license.FrameID);
      const source = this._licenses[index].License.Source.toLowerCase();
      AchievementEventSystem.emit(`ll_${source}`, 1);

      // the following are all per-pilot, so cannot use increments
      const level = this._licenses[index].Rank;
      if (level === 3) {
        AchievementEventSystem.emit('ll_any_single', 3);
        AchievementEventSystem.emit(`ll_${source}_single`, 3);
      }

      if (this.Parent.Level === 12 && !this.IsMissingLicenses) {
        if (!this._licenses.filter((license) => license.Rank === 3).length) {
          AchievementEventSystem.emit('multiclass');
        }

        if (this._licenses.filter((license) => license.Rank === 3).length === 4) {
          AchievementEventSystem.emit('rank_4_total', 4);
        }

        // collect total license levels by source, for each source:
        const sourceLevels = this._licenses.reduce(
          (acc, license) => {
            const source = license.License.Source.toLowerCase();
            if (!acc[source]) {
              acc[source] = 0;
            }
            acc[source] += license.Rank;
            return acc;
          },
          {} as Record<string, number>
        );

        if (Object.keys(sourceLevels).length === 1) {
          switch (Object.keys(sourceLevels)[0]) {
            case 'ips-n':
              AchievementEventSystem.emit('ll_ips-n', 12);
              break;
            case 'ssc':
              AchievementEventSystem.emit('ll_ssc', 12);
              break;
            case 'ha':
              AchievementEventSystem.emit('ll_ha', 12);
              break;
            case 'horus':
              AchievementEventSystem.emit('ll_horus', 12);
              break;
          }
        }
      }
    }

    this.Parent.SaveController.save();
  }

  public RemoveLicense(license: License): void {
    const index = this._licenses.findIndex((x) => x.License.FrameID === license.FrameID);
    if (index === -1) {
      logger.error(
        `License "${license.ToString()}" does not exist on Pilot ${this.Parent.Callsign}`,
        this
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
