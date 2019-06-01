import store from '@/store'
import { CompendiumItem } from './Item'

interface ITalentRank {
  name: string
  description: string
}

class Talent extends CompendiumItem {
  private ranks: ITalentRank[];

  constructor(talentData: any) {
    super(talentData);
    this.ranks = talentData.ranks;
  }

  public get Ranks(): ITalentRank[] {
    return this.ranks;
  }

  public Rank(rank: number): ITalentRank {
    if (this.ranks[rank - 1]) return this.ranks[rank - 1];
    console.error(
      `Talent ${this.ID}/${this.Name} does not contain rank ${rank} data`
    );
    return { name: "", description: "" };
  }

  public static Deserialize(id: string): Talent {
    return store.getters.getItemById("Talents", id);
  }
}

export default Talent