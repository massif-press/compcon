import {Talent} from '..'

class PilotTalent {
  private talent: Talent
  private rank: number

  constructor(id: string) {
    this.talent = new Talent(id)
    this.rank = 1
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
}

export default PilotTalent