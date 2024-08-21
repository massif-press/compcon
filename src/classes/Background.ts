import { ContentPack } from './ContentPack';

interface IBackgroundData {
  id: string;
  name: string;
  description: string;
}

class Background {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Description: string;
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly ItemType: string = 'Background';

  public constructor(data: IBackgroundData, pack?: ContentPack) {
    this.ID = data.id;
    this.Name = data.name;
    this.Description = data.description;
    this.LcpName = pack?.Name || 'LANCER Core Book';
    this.InLcp = !!pack;
  }

  public get Icon(): string {
    return 'cc:orbit';
  }

  public get Terse(): string {
    return this.Description.split('<i>')[0];
  }
}

export { Background };
export type { IBackgroundData };
