import { IRankedData } from '../../../../interface';
import { Bonus } from '../../../components/feature/bonus/Bonus';
import { Rules } from '../../../utility/Rules';
import CustomSkill from './CustomSkill';
import { Pilot } from '../../Pilot';
import PilotSkill from './PilotSkill';
import { Skill } from './Skill';
import { CompendiumItem } from '@/class';

interface ISkillsData {
  skills: IRankedData[];
}

class SkillsController {
  public readonly Parent: Pilot;
  private _skills: PilotSkill[];

  public constructor(parent: Pilot) {
    this.Parent = parent;
    this._skills = [];
  }

  public get Skills(): PilotSkill[] {
    return this._skills;
  }

  public set Skills(skills: PilotSkill[]) {
    this._skills = skills;
    this.skillSort();
    this.Parent.SaveController.save();
  }

  private skillSort(): void {
    this._skills = this._skills.sort(function (a, b) {
      return a.Title > b.Title ? 1 : -1;
    });
  }

  public get CurrentSkillPoints(): number {
    return this._skills.reduce((sum, skill) => sum + skill.Rank, 0);
  }

  public get MaxSkillPoints(): number {
    return Bonus.Int(Rules.MinimumPilotSkills + this.Parent.Level, 'skill_point', this.Parent);
  }

  public get IsMissingSkills(): boolean {
    return this.CurrentSkillPoints < this.MaxSkillPoints;
  }

  public get HasFullSkills(): boolean {
    return this.CurrentSkillPoints === this.MaxSkillPoints;
  }

  public CanAddSkill(skill: Skill | CustomSkill): boolean {
    const hasMinSkills = this._skills.length >= Rules.MinimumPilotSkills;
    return (
      this.IsMissingSkills &&
      (!this.Parent.has('Skill', skill.ID) ||
        (hasMinSkills &&
          this._skills.find((x) => x.Skill.ID === skill.ID).Rank < Rules.MaxTriggerRank))
    );
  }

  public AddSkill(skill: Skill | CustomSkill): void {
    const index = this._skills.findIndex((x) => x.Skill.ID === skill.ID);
    if (index === -1) {
      this._skills.push(new PilotSkill(skill));
    } else {
      this._skills[index].Increment();
    }
    this.skillSort();
    this.Parent.SaveController.save();
  }

  public AddCustomSkill(cs: { skill: string; description: string; detail: string }): void {
    this.AddSkill(new CustomSkill(cs.skill, cs.description, cs.detail));
  }

  public CanRemoveSkill(skill: Skill | CustomSkill): boolean {
    return this.Parent.has('Skill', skill.ID);
  }

  public RemoveSkill(skill: Skill | CustomSkill): void {
    const index = this._skills.findIndex((x) => x.Skill.ID === skill.ID);
    if (index === -1) {
      console.error(
        `Skill Trigger "${skill.Name}" does not exist on Pilot ${this.Parent.Callsign}`
      );
    } else {
      if (this._skills[index].Rank > 1) {
        this._skills[index].Decrement();
      } else {
        this._skills.splice(index, 1);
      }
    }
    this.skillSort();
    this.Parent.SaveController.save();
  }

  public RemovePilotSkill(pSkill: PilotSkill): void {
    const index = this._skills.findIndex(
      (x) => x.Skill.ID === pSkill.Skill.ID || (x.Skill as CompendiumItem).Err
    );
    if (index === -1) {
      console.error(
        `Skill Trigger "${pSkill.Skill.Name}" does not exist on Pilot ${this.Parent.Callsign}`
      );
    } else {
      this._skills.splice(index, 1);
    }
  }

  public ClearSkills(): void {
    for (let i = this._skills.length - 1; i >= 0; i--) {
      while (this._skills[i]) {
        this.RemoveSkill(this._skills[i].Skill);
      }
    }
  }

  public static Serialize(parent: Pilot, target: any) {
    target.skills = parent.SkillsController.Skills.map((x) => PilotSkill.Serialize(x));
  }

  public static Deserialize(parent: Pilot, data: ISkillsData) {
    if (!parent.SkillsController)
      throw new Error(
        `SkillsController not found on parent (${typeof parent}). New SkillsControllers must be instantiated in the parent's constructor method.`
      );

    parent.SkillsController._skills = data.skills.map((x: IRankedData) =>
      PilotSkill.Deserialize(x)
    );
  }
}

export { SkillsController, ISkillsData };
