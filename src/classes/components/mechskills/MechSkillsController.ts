import { Bonus } from '../feature/bonus/Bonus';
import { HASE } from '../../enums';
import { Pilot } from '../../pilot/Pilot';
import { Rules } from '../../utility/Rules';
import { IHASEContainer } from './IHASEContainer';
import MechSkills from './MechSkills';

interface IMechSkillsData {
  mechSkills: number[];
}

class MechSkillsController {
  public readonly Parent: Pilot;
  private _mechSkills: MechSkills;

  public constructor(parent: Pilot) {
    this.Parent = parent;
    this._mechSkills = new MechSkills();
  }

  public get MechSkills(): MechSkills {
    return this._mechSkills;
  }

  public set MechSkills(mechskills: MechSkills) {
    this._mechSkills = mechskills;
    this.Parent.SaveController.save();
  }

  public Increment(field: HASE): void {
    this._mechSkills.Increment(field);
    this.Parent.SaveController.save();
  }

  public Decrement(field: HASE): void {
    this._mechSkills.Decrement(field);
    this.Parent.SaveController.save();
  }

  public Reset(): void {
    this._mechSkills.Reset();
    this.Parent.SaveController.save();
  }

  public get CurrentHASEPoints(): number {
    return this._mechSkills.Sum;
  }

  //TODO: requires target change as part of bonus rework
  public get MaxHASEPoints(): number {
    return Bonus.Int(Rules.MinimumMechSkills + this.Parent.Level, 'mech_skill_point', this.Parent);
  }

  public get IsMissingHASE(): boolean {
    return this.CurrentHASEPoints < this.MaxHASEPoints;
  }

  public get HasFullHASE(): boolean {
    return this.CurrentHASEPoints === this.MaxHASEPoints;
  }

  public static Serialize(parent: Pilot, target: any) {
    target.mechSkills = MechSkills.Serialize(parent.MechSkillsController.MechSkills);
  }

  public static Deserialize(parent: Pilot, data: IMechSkillsData) {
    if (!parent.MechSkillsController)
      throw new Error(
        `MechSkillsController not found on parent (${typeof parent}). New MechSkillsControllers must be instantiated in the parent's constructor method.`
      );

    parent.MechSkillsController._mechSkills = MechSkills.Deserialize(data.mechSkills);
  }
}

export { MechSkillsController };
export type { IMechSkillsData };
