import { ContentPack } from '@/classes/ContentPack';
import { v4 as uuid } from 'uuid';

interface ITableRoll {
  min: number;
  max: number;
  result: string;
}

interface IRollableTableData {
  id?: string;
  title?: string;
  description?: string;
  die?: number;
  mult?: number;
  results?: ITableRoll[];
  gm_only?: boolean;
}

class RollableTable {
  public readonly ID: string;
  public Title: string;
  public Description: string;
  public Die: number;
  public Mult: number;
  public Results: ITableRoll[];
  public GmOnly: boolean;
  public ItemType: string = 'RollableTable';

  public InLcp: boolean = false;
  public LcpName: string = '';
  public LcpAuthor: string = '';

  public constructor(data?: IRollableTableData, lcp?: ContentPack) {
    this.ID = data?.id || uuid();
    this.Title = data?.title || '';
    this.Description = data?.description || '';
    this.Mult = data?.mult || 1;
    this.Die = data?.die || 6;
    this.Results = data?.results || [];
    this.GmOnly = data?.gm_only || false;
    if (!this.Results.length) this.setArray(2);

    this.InLcp = !!lcp;
    this.LcpName = lcp?.Name || 'Lancer Core Book';
    this.LcpAuthor = lcp?.Author || 'Massif Press';
  }

  public get Min(): number {
    return this.Mult;
  }

  public get Max(): number {
    return this.Mult * this.Die;
  }

  public Roll() {
    const roll = Math.floor(Math.random() * this.Die) + 1;
    for (const r of this.Results) {
      if (roll >= r.min && roll <= r.max) {
        return {
          roll,
          result: r.result,
        };
      }
    }
    return '';
  }

  public setArray(step) {
    if (this.Results.length) this.Results.splice(0, this.Results.length);
    for (let i = 1; i <= this.Max; i += step) {
      if (i < this.Min && i + step - 1 < this.Min) continue;
      if (i < this.Min) this.Results.push({ min: this.Min, max: i + step - 1, result: '' });
      else if (i + step - 1 >= this.Max) this.Results.push({ min: i, max: this.Max, result: '' });
      else this.Results.push({ min: i, max: i + step - 1, result: '' });
    }
  }

  public static Serialize(c: RollableTable): IRollableTableData {
    return {
      id: c.ID,
      title: c.Title,
      description: c.Description,
      die: c.Die,
      mult: c.Mult,
      results: c.Results,
      gm_only: c.GmOnly,
    };
  }

  public static Deserialize(data: IRollableTableData): RollableTable {
    return new RollableTable(data);
  }
}

export { RollableTable };
export type { IRollableTableData };
