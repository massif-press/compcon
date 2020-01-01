import { Talent } from '@/class'

class PilotTalent {
  private talent: Talent
  private rank: number

  public constructor(talent: Talent, rank?: number) {
    this.talent = talent
    this.rank = rank ? rank : 1
  }

  public get Talent(): Talent {
    return this.talent
  }

  public get Rank(): number {
    return this.rank
  }

  public Increment(): boolean {
    if (this.talent.Ranks.length === this.rank) return false
    this.rank += 1
    return true
  }

  public Decrement(): boolean {
    if (this.rank <= 1) return false
    this.rank -= 1
    return false
  }

  public static Serialize(item: PilotTalent): IRankedData {
    return { id: item.Talent.ID, rank: item.Rank }
  }

  public static Deserialize(itemData: IRankedData): PilotTalent {
    return new PilotTalent(Talent.Deserialize(itemData.id), itemData.rank)
  }
}

export default PilotTalent
