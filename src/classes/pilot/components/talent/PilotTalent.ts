import { Talent } from '../../../../class'
import { IRankedData } from '../../../../interface'
import { TalentRank } from './Talent'

class PilotTalent {
  public readonly Talent: Talent
  private _rank: number

  public constructor(talent: Talent, rank?: number) {
    this.Talent = talent
    this._rank = rank ? rank : 1
  }

  public get Rank(): number {
    return this._rank
  }

  public get UnlockedRanks(): TalentRank[] {
    const allRanks = []
    for (let i = 1; i <= this._rank; i++) {
      if (this.Talent.Rank(i).Exclusive && i < this._rank) continue
      else allRanks.push(this.Talent.Rank(i))
    }
    return allRanks
  }

  public Increment(): TalentRank {
    if (this.Talent.Ranks.length === this._rank) return null
    this._rank += 1
    return this.Talent.Ranks[this._rank-1]
  }

  public Decrement(): TalentRank {
    if (this._rank <= 0) return null
    this._rank -= 1
    return this.Talent.Ranks[this._rank]
  }

  public static Serialize(item: PilotTalent): IRankedData {
    return { id: item.Talent.ID, rank: item.Rank }
  }

  public static Deserialize(itemData: IRankedData): PilotTalent {
    return new PilotTalent(Talent.Deserialize(itemData.id), itemData.rank)
  }
}

export default PilotTalent
