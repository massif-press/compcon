import { Bonus, BonusId } from '../../../components/feature/bonus/Bonus'
import { Rules } from '../../../utility/Rules'
import CustomSkill from './CustomSkill'
import { Pilot } from '../../Pilot'
import PilotSkill from './PilotSkill'
import { Skill } from './Skill'
import { CompendiumItem } from '../../../CompendiumItem'
import logger from '@/user/logger'
import { IRankedData } from '../license/License'
import { assertController } from '../../../utility/assertController'
import { RankedCollectionController } from '../RankedCollectionController'

interface ISkillsData {
  skills: IRankedData[]
}

class SkillsController extends RankedCollectionController<Skill | CustomSkill, PilotSkill> {
  protected _findIndex(raw: Skill | CustomSkill): number {
    return this._collection.findIndex(x => x.Skill.ID === raw.ID)
  }

  protected _createWrapper(raw: Skill | CustomSkill): PilotSkill {
    return new PilotSkill(raw)
  }

  protected _getRaw(wrapper: PilotSkill): Skill | CustomSkill {
    return wrapper.Skill
  }

  protected _sort(): void {
    this._collection = this._collection.sort((a, b) => (a.Title > b.Title ? 1 : -1))
  }

  public get MaxPoints(): number {
    return Bonus.Int(Rules.MinimumPilotSkills + this.Parent.Level, BonusId.SKILL_POINT, this.Parent)
  }

  public get Skills(): PilotSkill[] {
    return this._collection
  }

  public set Skills(skills: PilotSkill[]) {
    this._collection = skills
    this._sort()
    this.Parent.SaveController.save()
  }

  public get CurrentSkillPoints(): number {
    return this.CurrentPoints
  }

  public get MaxSkillPoints(): number {
    return this.MaxPoints
  }

  public get IsMissingSkills(): boolean {
    return this.IsMissing
  }

  public get HasFullSkills(): boolean {
    return this.HasFull
  }

  public GetSkill(id: string): PilotSkill | undefined {
    return this._collection.find(x => x.Skill.ID === id)
  }

  public CanAddSkill(skill: Skill | CustomSkill): boolean {
    const hasMinSkills = this._collection.length >= Rules.MinimumPilotSkills
    return (
      this.IsMissingSkills &&
      (!this.Parent.has('Skill', skill.ID) ||
        (hasMinSkills &&
          (this._collection.find(x => x.Skill.ID === skill.ID)?.Rank || 0) < Rules.MaxTriggerRank))
    )
  }

  public AddSkill(skill: Skill | CustomSkill): void {
    this._addItem(skill)
  }

  public AddCustomSkill(cs: { skill: string; description: string; detail: string }): void {
    this.AddSkill(new CustomSkill(cs.skill, cs.description, cs.detail))
  }

  public CanRemoveSkill(skill: Skill | CustomSkill): boolean {
    return this.Parent.has('Skill', skill.ID)
  }

  public RemoveSkill(skill: Skill | CustomSkill): void {
    if (this._findIndex(skill) === -1) {
      logger.error(
        `Skill Trigger "${skill.Name}" does not exist on Pilot ${this.Parent.Callsign}`,
        this
      )
    }
    this._removeItem(skill)
  }

  public RemovePilotSkill(pSkill: PilotSkill): void {
    const index = this._collection.findIndex(
      x => x.Skill.ID === pSkill.Skill.ID || (x.Skill as CompendiumItem).Err
    )
    if (index === -1) {
      logger.error(
        `Skill Trigger "${pSkill.Skill.Name}" does not exist on Pilot ${this.Parent.Callsign}`,
        this
      )
    } else {
      this._collection.splice(index, 1)
    }
  }

  public ClearSkills(): void {
    this._clearCollection()
  }

  public static Serialize(parent: Pilot, target: any) {
    target.skills = parent.SkillsController.Skills.map(x => PilotSkill.Serialize(x))
  }

  public static Deserialize(parent: Pilot, data: ISkillsData) {
    assertController(parent.SkillsController, 'SkillsController')
    parent.SkillsController._collection = data.skills.map((x: IRankedData) =>
      PilotSkill.Deserialize(x)
    )
  }
}

export { SkillsController }
export type { ISkillsData }
