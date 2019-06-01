import {Skill} from '@/class'
import { rules } from 'lancer-data';

class PilotSkill {
  private skill: Skill;
  private rank: number;

  constructor(skill: Skill, rank?: number) {
    this.skill = skill;
    this.rank = rank ? rank : 1;
  }

  public get Title(): string {
    return this.skill.Name;
  }

  public get Skill(): Skill {
    return this.skill;
  }

  public get Rank(): number {
    return this.rank;
  }

  public get Bonus(): number {
    return this.rank * rules.trigger_bonus_per_rank;
  }

  public Increment(): boolean {
    if (this.rank >= rules.max_trigger_rank) return false;
    this.rank += 1;
    return true;
  }

  public Decrement(): boolean {
    if (this.rank <= 1) return false;
    this.rank -= 1;
    return false;
  }

  public static Serialize(item: PilotSkill): IRankedData {
    return { id: item.Skill.ID, rank: item.Rank };
  }

  public static Deserialize(itemData: IRankedData) {
    return new PilotSkill(Skill.Deserialize(itemData.id), itemData.rank);
  }
}



export default PilotSkill