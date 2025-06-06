import _ from 'lodash';
import License from './License';
import { BrewInfo } from '@/classes/components/brew/BrewController';

interface LicenseStubData {
  id: string;
  name: string;
  source: string;
  frameName: string;
  brew?: BrewInfo;
}

class LicenseStub {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Source: string;
  public readonly FrameName: string;
  public readonly Brew: BrewInfo;
  public readonly ItemType: string = 'LicenseStub';

  public constructor(license: License) {
    this.Name = license.Name;
    this.Source = license.Source;
    this.FrameName = license.FrameName;
    this.Brew = license.Frame.Brew;
    this.ID = license.FrameID || license.ID;
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
      FrameName: data.frameName,
      Frame: { Brew: data.brew || {} } as any,
    } as License);
  }

  public static Serialize(item: LicenseStub): LicenseStubData {
    return {
      id: item.ID,
      name: item.Name,
      source: item.Source,
      frameName: item.FrameName,
      brew: item.Brew,
    };
  }
}

export { LicenseStub };
export type { LicenseStubData };
