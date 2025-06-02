import _ from 'lodash';
import License from './License';

interface LicenseStubData {
  id: string;
  name: string;
  source: string;
  frameName: string;
  lcpName: string;
  lcpAuthor: string;
}

class LicenseStub {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Source: string;
  public readonly FrameName: string;
  public readonly LcpName: string;
  public readonly LcpAuthor: string;
  public readonly ItemType: string = 'LicenseStub';

  public constructor(license: License) {
    this.Name = license.Name;
    this.Source = license.Source;
    this.FrameName = license.FrameName;
    this.LcpName = license.LcpName;
    this.LcpAuthor = license.LcpAuthor;
    this.ID = license.FrameID;
  }

  public ToString(): string {
    return `${this.Source} ${this.Name}`;
  }

  public get Icon(): string {
    return 'cc:license';
  }

  public static Deserialize(data: LicenseStubData): LicenseStub {
    return new LicenseStub({
      ID: data.id,
      Name: data.name,
      Source: data.source,
      FrameID: data.id,
      FrameName: data.frameName,
      LcpName: data.lcpName,
      LcpAuthor: data.lcpAuthor,
    } as License);
  }

  public static Serialize(item: LicenseStub): LicenseStubData {
    return {
      id: item.ID,
      name: item.Name,
      source: item.Source,
      frameName: item.FrameName,
      lcpName: item.LcpName,
      lcpAuthor: item.LcpAuthor,
    };
  }
}

export { LicenseStub };
export type { LicenseStubData };
