import _ from 'lodash';
import { CompendiumStore } from '../../../../stores';
import { Manufacturer } from '../../../Manufacturer';
import { Frame } from '../../../mech/components/frame/Frame';
import { Pilot } from '../../Pilot';
import { LicensedItem } from './LicensedItem';
import { ContentPack } from '@/class';

class License {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Source: string;
  public readonly FrameID: string;
  public readonly FrameName: string;
  public readonly Specialty: boolean;
  public readonly Prerequisite?: {
    source: string;
    min_rank: number;
    cumulative?: boolean;
  };
  public readonly Hidden: boolean = false;
  public readonly LcpName: string;
  public readonly LcpAuthor: string;
  public readonly ItemType: string = 'License';

  public constructor(frame: Frame, pack?: ContentPack) {
    this.Name = frame.Name;
    this.Source = frame.Source;
    this.FrameID = frame.ID;
    this.FrameName = frame.Name.toLowerCase();
    this.ID = `${frame.ID}_License`;
    this.LcpName = frame.LcpName;
    this.LcpAuthor = frame.LcpAuthor;

    this.Specialty = !!frame.Specialty;
    if (typeof frame.Specialty !== 'boolean') {
      this.Prerequisite = frame.Specialty || 0;
    }

    if (frame.Variant) this.Hidden = true;
  }

  public CanSelect(pilot: Pilot): boolean {
    if (!pilot.LicenseController.IsMissingLicenses) return false;
    if (!this.Specialty || !this.Prerequisite) return true;

    if (this.Prerequisite.cumulative) {
      const rankTotal = pilot.LicenseController.Licenses.filter(
        (x) => x.License && x.License.Source === this.Prerequisite?.source && x.Rank
      ).reduce((a, b) => +a + +b.Rank, 0);
      return rankTotal >= this.Prerequisite.min_rank;
    }
    return pilot.LicenseController.Licenses.some(
      (x) =>
        x.License &&
        x.License.Source === this.Prerequisite?.source &&
        x.Rank >= this.Prerequisite.min_rank
    );
  }

  public get Manufacturer(): Manufacturer {
    return CompendiumStore().referenceByID('Manufacturers', this.Source);
  }

  public get Frame(): Frame {
    return CompendiumStore().referenceByID('Frames', this.FrameID);
  }

  private licenseMatch(licenseItem: LicensedItem): boolean {
    if (!!licenseItem.LicenseID) {
      return licenseItem.LicenseID === this.FrameID;
    } else if ((licenseItem as Frame).Variant) {
      return (licenseItem as Frame).Variant.toLowerCase() === this.FrameName;
    } else {
      return (
        licenseItem.License.toLowerCase() === this.licenseFrame.Name.toLowerCase() &&
        licenseItem.Source.toLowerCase() === this.licenseFrame.Source.toLowerCase()
      );
    }
  }

  private get licenseFrame(): Frame {
    return CompendiumStore().referenceByID('Frames', this.FrameID);
  }

  public get Unlocks(): LicensedItem[][] {
    const items: LicensedItem[] = [
      ...CompendiumStore().getItemCollection('MechWeapons'),
      ...CompendiumStore().getItemCollection('WeaponMods'),
      ...CompendiumStore().getItemCollection('MechSystems'),
      ...CompendiumStore().getItemCollection('Frames'),
    ].filter((x: LicensedItem) => this.licenseMatch(x));

    const lls = [...items].map((i) => i.LicenseLevel);

    const max = lls.length ? Math.max(...lls) : this.licenseFrame.LicenseLevel;

    const unlocks = new Array<LicensedItem[]>(max).fill([]);

    for (let i = 0; i < unlocks.length; i++) {
      unlocks[i] = items.filter((x) => x.LicenseLevel === i + 1);
    }

    return unlocks;
  }

  public get MaxRank(): number {
    return this.Unlocks.length;
  }

  public UnlockByRank(rank: number): LicensedItem[] {
    return this.Unlocks[rank - 1];
  }

  public UnlocksByTotalRank(rank: number): LicensedItem[] {
    let out = this.Unlocks.flatMap((x) => x);
    out = out.filter((x) => x.LicenseLevel <= rank);
    return out;
  }

  public ToString(): string {
    return `${this.Source} ${this.Name}`;
  }

  public get Icon(): string {
    return 'cc:license';
  }

  public static Deserialize(frameId: string): License {
    return new License(CompendiumStore().referenceByID('Frames', frameId));
  }

  public get InLcp(): boolean {
    return this.Frame.InLcp;
  }

  public static LicenseSort(a: License, b: License): number {
    const groupA = a.Specialty ? 2 : a.InLcp ? 1 : 0;
    const groupB = b.Specialty ? 2 : b.InLcp ? 1 : 0;

    if (groupA !== groupB) return groupA - groupB;

    if (groupA === 0) {
      return a.Name.localeCompare(b.Name);
    } else if (groupA === 1) {
      if (a.LcpAuthor === 'Massif Press') return 0;
      if (b.LcpAuthor === 'Massif Press') return 1;

      const lcpCompare = a.LcpName.localeCompare(b.LcpName);
      if (lcpCompare !== 0) return lcpCompare;
      return a.Name.localeCompare(b.Name);
    } else {
      const lcpCompare = a.LcpName.localeCompare(b.LcpName);
      if (lcpCompare !== 0) return lcpCompare;
      return (a.Prerequisite?.min_rank || 0) - (b.Prerequisite?.min_rank || 0);
    }
  }
}

export default License;
