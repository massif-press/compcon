import { Skill, CustomSkill } from '@/class'
import { rules } from 'lancer-data'

class PilotSkill {
  private skill: Skill | CustomSkill
  private rank: number
  private isCustom: boolean

  constructor(skill: Skill | CustomSkill, rank?: number) {
    this.skill = skill
    this.rank = rank ? rank : 1
    this.isCustom = skill instanceof CustomSkill
  }

  public get Title(): string {
    return this.skill.Name
  }

  public get Skill(): Skill | CustomSkill {
    return this.skill
  }

  public get Rank(): number {
    return this.rank
  }

  public get Bonus(): number {
    return this.rank * rules.trigger_bonus_per_rank
  }

  public get IsCustom(): boolean {
    return this.isCustom
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

  public static Serialize(item: PilotSkill): IRankedData {
    if (item.IsCustom) return { id: item.Skill.Name, rank: item.Rank, custom: true }
    return { id: item.Skill.ID, rank: item.Rank }
  }

  public static Deserialize(itemData: IRankedData) {
    if (itemData.custom) return new PilotSkill(new CustomSkill(itemData.id), itemData.rank)
    return new PilotSkill(Skill.Deserialize(itemData.id), itemData.rank)
  }
}

export default PilotSkill
