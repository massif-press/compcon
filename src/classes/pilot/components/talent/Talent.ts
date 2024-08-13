import { CompendiumStore } from '../../../../stores';
import { CompendiumItem, ContentPack, ItemType } from '../../../../class';
import { ICompendiumItemData, IContentPack, ITagCompendiumData } from '../../../../interface';

interface ITalentRankData extends ICompendiumItemData {
  exclusive: boolean;
}

interface ITalentData extends ICompendiumItemData {
  terse: string;
  ranks: ITalentRankData[];
}

class TalentRank extends CompendiumItem {
  public readonly Exclusive: boolean;

  public constructor(data: ITalentRankData) {
    super(data);
    this.Exclusive = data.exclusive;
  }
}

class Talent extends CompendiumItem {
  public readonly Terse: string;
  private _ranks: TalentRank[];
  private _icon_url: string;

  public constructor(data: any, pack?: ContentPack) {
    super(data, pack);
    this.Terse = data.terse || '';
    this._icon_url = data.icon_url || '';
    this._ranks = data.ranks.map((x) => new TalentRank(x));
    this.ItemType = ItemType.Talent;
  }

  public get Ranks(): TalentRank[] {
    return this._ranks;
  }

  public get Image(): string {
    if (this._icon_url) return this._icon_url;
    return `/talent/${this.Name.toUpperCase()}.svg`;
  }

  public get Color(): string {
    return 'accent';
  }

  public Rank(rank: number): TalentRank {
    try {
      return this._ranks[rank - 1];
    } catch (err) {
      throw new Error(`Talent ${this.ID}/${this.Name} does not contain rank ${rank} data, ${err}`);
    }
  }

  public static Deserialize(id: string): Talent {
    return CompendiumStore().referenceByID('Talents', id);
  }
}

export { Talent, TalentRank };
export type { ITalentData };
