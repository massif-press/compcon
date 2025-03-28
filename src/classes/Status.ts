import { v4 as uuid } from 'uuid';
import { ContentPack } from './ContentPack';

interface IStatusData {
  id?: string;
  name: string;
  type: string;
  icon: string;
  effects: string[];
  terse?: string;
}

class Status {
  public readonly ID: string;
  public readonly InstanceID: string;
  public readonly Name: string;
  public readonly Effects: string[];
  public readonly Terse: string;
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly ItemType: string = 'Status';
  public readonly StatusType: string = 'Status';
  private _icon: string;

  public constructor(data: IStatusData, pack?: ContentPack) {
    this.ID = data.id || `${pack?.Name || 'LANCER Core Book'}_${data.name}`.replace(/ /g, '_');
    this.InstanceID = uuid();
    this.Name = data.name;
    this.Effects = data.effects;
    if (data.terse) this.Terse = data.terse;
    else if (Array.isArray(data.effects)) this.Terse = data.effects.join(', ');
    else this.Terse = data.effects;
    this._icon = data.icon;
    this.StatusType = data.type;
    this.LcpName = pack?.Name || 'LANCER Core Book';
    this.InLcp = !!pack;
  }

  public get Icon(): string {
    if (!this._icon) return 'cc:talent';
    return `cc:${this.StatusType.toLowerCase()}_${this._icon.replaceAll(/-|_/g, '').toLowerCase()}`;
  }
}

export { Status };
export type { IStatusData };
