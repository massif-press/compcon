import { Bonus } from '../feature/bonus/Bonus'
import { HASE } from '../../enums'
import { Pilot } from '../../pilot/Pilot'
import { Rules } from '../../utility/Rules'
import MechSkills from './MechSkills'

interface IMechSkillsData {
  mechSkills: number[]
}

class MechSkillsController {
  public readonly Parent: Pilot
  private _mechSkills: MechSkills

  public constructor(parent: Pilot) {
    this.Parent = parent
    this._mechSkills = new MechSkills()
  }

  public get Hull(): number {
    return this._mechSkills.Hull
  }
  public set Hull(value: number) {
    this.setSkill('Hull', value)
  }

  public get Agi(): number {
    return this._mechSkills.Agi
  }
  public set Agi(value: number) {
    this.setSkill('Agi', value)
  }

  public get Sys(): number {
    return this._mechSkills.Sys
  }
  public set Sys(value: number) {
    this.setSkill('Sys', value)
  }

  public get Eng(): number {
    return this._mechSkills.Eng
  }
  public set Eng(value: number) {
    this.setSkill('Eng', value)
  }

  private setSkill(field: 'Hull' | 'Agi' | 'Sys' | 'Eng', value: number): void {
    if (value < 0 || value > 6) return
    if (value > this._mechSkills[field] && this.HASERemaining < value - this._mechSkills[field]) value = this._mechSkills[field] + this.HASERemaining
    this._mechSkills[field] = value
    this.Parent.SaveController.save()
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

  public get MaxHASEPoints(): number {
    return Bonus.Int(Rules.MinimumMechSkills + this.Parent.Level, 'mech_skill_point', this.Parent)
  }

  public get HASERemaining(): number {
    return this.MaxHASEPoints - this.CurrentHASEPoints
  }

  public get IsMissingHASE(): boolean {
    return this.CurrentHASEPoints < this.MaxHASEPoints
  }

  public get HasFullHASE(): boolean {
    return this.CurrentHASEPoints === this.MaxHASEPoints
  }

  public static Serialize(parent: Pilot, target: any) {
    target.mechSkills = MechSkills.Serialize(parent.MechSkillsController.MechSkills)
  }

  public static Deserialize(parent: Pilot, data: IMechSkillsData) {
    if (!parent.MechSkillsController)
      throw new Error(
        `MechSkillsController not found on parent (${typeof parent}). New MechSkillsControllers must be instantiated in the parent's constructor method.`
      )

    parent.MechSkillsController._mechSkills = MechSkills.Deserialize(data.mechSkills)
  }
}

export { MechSkillsController }
export type { IMechSkillsData }
