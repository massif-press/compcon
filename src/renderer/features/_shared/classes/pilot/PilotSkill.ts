import {Skill} from '..'
import { rules } from 'lancer-data';

class PilotSkill {
  private skill: Skill
  private rank: number

  constructor(id: string) {
    this.skill = new Skill(id)
    this.rank = 1
  }

  public get Skill(): Skill {
    return this.skill
  }

  public get Rank(): number {
    return this.rank
  }

  public get Bonus(): number {
    return (this.rank * rules.trigger_bonus_per_rank)
  }

  public Increment(): boolean {
    if (this.rank >= rules.max_trigger_rank) return false
    this.rank += 1
    return true
  }

  public Decrement(): boolean {
    if (this.rank <= 1) return false
    this.rank -= 1
    return false
  }

}



export default PilotSkill