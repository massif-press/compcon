import store from '@/store'
import { CompendiumItem, SkillFamily, ItemType } from '@/class'

class Skill extends CompendiumItem {
  private detail: string
  private family: SkillFamily

  constructor(skillData: any) {
    super(skillData)
    ;(this.detail = skillData.detail), (this.family = SkillFamily[skillData.family] as SkillFamily)
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

class CustomSkill {
  private name: string
  private item_type: ItemType

  constructor(name: string) {
    this.name = name
    this.item_type = ItemType.Skill
  }

  public get ID(): string {
    return this.name
  }

  public get Name(): string {
    return this.name
  }

  public get Description(): string {
    return 'Custom Skill Trigger'
  }

  public get ItemType(): ItemType {
    return this.item_type
  }

  public get Brew(): string {
    return 'N/A'
  }

  public get Detail(): string {
    return 'Custom Skill Trigger'
  }

  public get Trigger(): string {
    return this.name
  }

  public get Family(): string {
    return 'Custom'
  }
}

export { Skill, CustomSkill }
