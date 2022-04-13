import { Rules, Skill, CustomSkill } from '../../../../class'
import { IRankedData } from '../../../../interface'

class PilotSkill {
  public readonly Skill: Skill | CustomSkill
  public readonly IsCustom: boolean
  private _rank: number

  public constructor(skill: Skill | CustomSkill, rank?: number) {
    this.Skill = skill
    this._rank = rank ? rank : 1
    this.IsCustom = skill instanceof CustomSkill
  }

  public get Title(): string {
    return this.Skill.Name
  }

  public get Rank(): number {
    return this._rank
  }

  public get Bonus(): number {
    return this._rank * Rules.TriggerBonusPerRank
  }

  public Increment(): boolean {
    if (this._rank >= Rules.MaxTriggerRank) return false
    this._rank += 1
    return true
  }

  public Decrement(): boolean {
    if (this._rank <= 1) return false
    this._rank -= 1
    return false
  }

  public static Serialize(item: PilotSkill): IRankedData {
    if (item.IsCustom)
      return {
        id: item.Skill.Name,
        rank: item.Rank,
        custom: true,
        custom_desc: item.Skill.Description,
        custom_detail: item.Skill.Detail,
      }
    return { id: item.Skill.ID, rank: item.Rank }
  }

  public static Deserialize(itemData: IRankedData): PilotSkill {
    if (itemData.custom)
      return new PilotSkill(
        new CustomSkill(itemData.id, itemData.custom_desc, itemData.custom_detail),
        itemData.rank
      )
    return new PilotSkill(Skill.Deserialize(itemData.id), itemData.rank)
  }
}

export default PilotSkill
