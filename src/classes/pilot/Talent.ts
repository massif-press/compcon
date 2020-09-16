import { store } from '@/store'
import { CompendiumItem } from '@/class'
import { ICompendiumItemData } from '@/interface'

interface ITalentRankData extends ICompendiumItemData {
  exclusive: boolean
}

interface ITalentData extends ICompendiumItemData {
  terse: string
  ranks: ITalentRankData[]
}

class TalentRank extends CompendiumItem {
  public readonly Exclusive: boolean

  public constructor(data: ITalentRankData) {
    super(data)
    this.Exclusive = data.exclusive
  }
}

class Talent extends CompendiumItem {
  public readonly Terse: string
  // public readonly Icon: string
  private _ranks: ITalentRankData[]

  public constructor(data: any) {
    super(data)
    this.Terse = data.terse || ''
    // this.Icon = data.icon || 'GENERIC TALENT'
    this._ranks = data.ranks.map(x => new TalentRank(x))
  }

  public get Ranks(): ITalentRankData[] {
    return this._ranks
  }

  public Rank(rank: number): ITalentRankData {
    try {
      return this._ranks[rank - 1]
    } catch (err) {
      console.error(`Talent ${this.ID}/${this.Name} does not contain rank ${rank} data, ${err}`)
    }
  }

  public static Deserialize(id: string): Talent {
    return store.getters.referenceByID('Talents', id)
  }
}

export { Talent, TalentRank, ITalentData }
