import { Rules, Skill, CustomSkill } from '@/class'

class PilotSkill {
  private _skill: Skill | CustomSkill
  private _rank: number
  private _isCustom: boolean

  public constructor(skill: Skill | CustomSkill, rank?: number) {
    this._skill = skill
    this._rank = rank ? rank : 1
    this._isCustom = skill instanceof CustomSkill
  }

  public get Title(): string {
    return this._skill.Name
  }

  public get Skill(): Skill | CustomSkill {
    return this._skill
  }

  public get Rank(): number {
    return this._rank
  }

  public get Bonus(): number {
    return this._rank * Rules.TriggerBonusPerRank
  }

  public get IsCustom(): boolean {
    return this._isCustom
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
      }
    return { id: item.Skill.ID, rank: item.Rank }
  }

  public static Deserialize(itemData: IRankedData): PilotSkill {
    if (itemData.custom)
      return new PilotSkill(new CustomSkill(itemData.id, itemData.custom_desc), itemData.rank)
    return new PilotSkill(Skill.Deserialize(itemData.id), itemData.rank)
  }
}

export default PilotSkill
