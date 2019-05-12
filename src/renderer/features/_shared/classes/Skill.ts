import store from '@/store';
import { CompendiumItem } from "./Item";

class Skill extends CompendiumItem {
  private detail: string
  private family: SkillFamily

  constructor(id: string) {
    const skillData = store.getters.getItemById('Skills', id)
    super(skillData)
    this.detail = skillData.detail,
    this.family = SkillFamily[skillData.family] as SkillFamily
  }

  public get Detail(): string {
    return this.detail
  }

  public get Family(): string {
    return this.family
  }
}

export default Skill