import { store } from '@/store'
import { CompendiumItem } from '@/class'
import { ICompendiumItemData, ITagCompendiumData } from '@/interface'

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
  private _ranks: TalentRank[]
  private _icon_url: string

  public constructor(data: any, packTags?: ITagCompendiumData[], packName?: string) {
    super(data, packTags, packName)
    this.Terse = data.terse || ''
    this._icon_url = data.icon_url || ''
    this._ranks = data.ranks.map(x => new TalentRank(x))
  }

  public get Ranks(): TalentRank[] {
    return this._ranks
  }

  public get Image(): string {
    if (this._icon_url) return this._icon_url
    return `/img/talent/${this.Name.toUpperCase()}.svg`
  }

  public Rank(rank: number): TalentRank {
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
