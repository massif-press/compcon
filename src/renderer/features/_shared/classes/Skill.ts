import store from '@/store'
import { CompendiumItem, SkillFamily, ItemType } from '@/class'

class Skill extends CompendiumItem {
  private detail: string
  private family: SkillFamily

  constructor(skillData: any) {
    super(skillData)
    ;(this.detail = skillData.detail),
      (this.family = SkillFamily[skillData.family] as SkillFamily)
    this.item_type = ItemType.Skill
  }

  public get Detail(): string {
    return this.detail
  }

  public get Trigger(): string {
    return this.name
  }

  public get Family(): string {
    return this.family
  }

  public static Deserialize(id: string): Skill {
    return store.getters.getItemById('Skills', id)
  }
}

export default Skill
