import { v4 as uuid } from 'uuid';

interface IEnvironmentData {
  id?: string;
  name: string;
  description: string;
}

class Environment {
  public readonly ID: string;
  public readonly InstanceID: string;
  public readonly Name: string;
  public readonly Description: string;
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly ItemType: string = 'Environment';
  public readonly Icon: string = 'mdi-map';

  public constructor(data: IEnvironmentData, packName?: string) {
    this.ID = data.id
      ? data.id
      : `${packName || 'LANCER Core Book'}_${data.name}`.replace(/ /g, '_');
    this.InstanceID = uuid();
    this.Name = data.name;
    this.Description = data.description;
    this.LcpName = packName || 'LANCER Core Book';
    this.InLcp = packName ? true : false;
  }
}

export { Environment };
export type { IEnvironmentData };
