import { CompendiumStore } from '@/stores';
import { IRankedData } from '../../../../interface';
import License from './License';
import { LicenseStub } from './LicenseStub';

class PilotLicense {
  public readonly License?: License;
  public readonly Stub: LicenseStub;
  private rank: number;

  public constructor(license?: License, rank?: number, stub?: LicenseStub) {
    if (license) {
      this.License = license;
      this.Stub = new LicenseStub(license);
    } else if (stub) this.Stub = stub;
    else
      this.Stub = LicenseStub.Deserialize({
        id: '',
        name: 'Unknown License',
        source: 'ERR',
        frameName: '',
      });
    this.rank = rank || 1;
  }

  public get Rank(): number {
    return this.rank;
  }

  public ToString(): string {
    if (this.License) return `${this.License.Source} ${this.License.Name}, Rank ${this.rank}`;
    else if (this.Stub) return `${this.Stub.Source} ${this.Stub.Name}, Rank ${this.rank}`;
    return `Custom License, Rank ${this.rank}`;
  }

  public Increment(): boolean {
    if (this.License && this.rank < this.License.MaxRank) {
      this.rank += 1;
      return true;
    }
    return false;
  }

  public Decrement(): boolean {
    if (this.rank > 1) {
      this.rank -= 1;
      return true;
    }
    return false;
  }

  public static Serialize(item: PilotLicense): IRankedData {
    return {
      id: item.License?.FrameID || item.Stub?.ID || '',
      rank: item.Rank,
      stub: item.Stub ? LicenseStub.Serialize(item.Stub) : undefined,
    };
  }

  public static Deserialize(itemData: IRankedData): PilotLicense {
    if (CompendiumStore().has('Frames', itemData.id))
      return new PilotLicense(License.Deserialize(itemData.id), itemData.rank);
    else return new PilotLicense(undefined, itemData.rank, LicenseStub.Deserialize(itemData.stub));
  }
}

export { PilotLicense };
