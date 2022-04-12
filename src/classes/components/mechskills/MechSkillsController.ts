import { Bonus } from '../feature/bonus/Bonus'
import { HASE } from '../../enums'
import { Pilot } from '../../pilot/Pilot'
import { Rules } from '../../utility/Rules'
import { IHASEContainer } from './IHASEContainer'
import MechSkills from './MechSkills'

interface IMechSkillsData {
  mechSkills: number[]
}

class MechSkillsController {
  public readonly Parent: IHASEContainer
  private _mechSkills: MechSkills

  public constructor(parent: IHASEContainer) {
    this.Parent = parent
    this._mechSkills = new MechSkills()
  }

  public get MechSkills(): MechSkills {
    return this._mechSkills
  }

  public set MechSkills(mechskills: MechSkills) {
    this._mechSkills = mechskills
    this.Parent.SaveController.save()
  }

  public Increment(field: HASE): void {
    this._mechSkills.Increment(field)
    this.Parent.SaveController.save()
  }

  public Decrement(field: HASE): void {
    this._mechSkills.Decrement(field)
    this.Parent.SaveController.save()
  }

  public Reset(): void {
    this._mechSkills.Reset()
    this.Parent.SaveController.save()
  }

  public get CurrentHASEPoints(): number {
    return this._mechSkills.Sum
  }

  //TODO: requires target change as part of bonus rework
  public get MaxHASEPoints(): number {
    const p = this.Parent as any
    if (!p.Level) return Rules.MinimumMechSkills
    return Bonus.Int(Rules.MinimumMechSkills + p.Level, 'mech_skill_point', this.Parent as Pilot)
  }

  public get IsMissingHASE(): boolean {
    return this.CurrentHASEPoints < this.MaxHASEPoints
  }

  public get HasFullHASE(): boolean {
    return this.CurrentHASEPoints === this.MaxHASEPoints
  }

  public static Serialize(parent: IHASEContainer, target: any) {
    target.mechSkills = MechSkills.Serialize(parent.MechSkillsController.MechSkills)
  }

  public static Deserialize(parent: IHASEContainer, data: IMechSkillsData) {
    if (!parent.MechSkillsController)
      throw new Error(
        `MechSkillsController not found on parent (${typeof parent}). New MechSkillsControllers must be instantiated in the parent's constructor method.`
      )

    parent.MechSkillsController._mechSkills = MechSkills.Deserialize(data.mechSkills)
  }
}

export { IMechSkillsData, MechSkillsController }
