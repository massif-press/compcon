import { ContentPack } from './ContentPack';

interface IDowntimeActionData {
  id: string;
  name: string;
  terse: string;
  detail: string;
  table?: {
    detail: string;
    die: string;
    results: TableResult[];
  };
}

type TableResult = {
  min: number;
  max: number;
  text: string;
};

class DowntimeAction {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Terse: string;
  public readonly Detail: string;
  public readonly Table?: {
    detail: string;
    die: string;
    results: TableResult[];
  };
  public readonly ItemType: string = 'DowntimeAction';
  public readonly LcpName: string;
  public readonly InLcp: boolean;

  public constructor(data: IDowntimeActionData, pack?: ContentPack) {
    this.ID = data.id;
    this.Name = data.name;
    this.Terse = data.terse;
    this.Detail = data.detail;
    if (data.table) {
      this.Table = {
        detail: data.table.detail,
        die: data.table.die,
        results: data.table.results,
      };
    }
    this.LcpName = pack?.Name || 'Lancer Core Book';
    this.InLcp = !!pack;
  }

  public get Icon(): string {
    return 'cc:downtime';
  }
}

export { DowntimeAction };
export type { IDowntimeActionData };
