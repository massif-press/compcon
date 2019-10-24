import { store } from '@/store'
import { CompendiumItem, SkillFamily, ItemType } from '@/class'

class Skill extends CompendiumItem {
  private _detail: string
  private _family: SkillFamily

  public constructor(skillData: { detail: string; family: string }) {
    super(skillData)
    this._detail = skillData.detail
    this._family = SkillFamily[skillData.family] as SkillFamily
    this._item_type = ItemType.Skill
  }

  public get Detail(): string {
    return this._detail
  }

  public get Trigger(): string {
    return this._name
  }

  public get Family(): string {
    return this._family
  }

  public static Deserialize(id: string): Skill {
    return store.getters.referenceByID('Skills', id)
  }
}

class CustomSkill {
  private _name: string
  private _item_type: ItemType

  public constructor(name: string) {
    this._name = name
    this._item_type = ItemType.Skill
  }

  public get ID(): string {
    return this._name
  }

  public get Name(): string {
    return this._name
  }

  public get Description(): string {
    return 'Custom Skill Trigger'
  }

  public get ItemType(): ItemType {
    return this._item_type
  }

  public get Brew(): string {
    return 'N/A'
  }

  public get Detail(): string {
    return ''
  }

  public get Trigger(): string {
    return this._name
  }

  public get Family(): string {
    return 'Custom'
  }
}

export { Skill, CustomSkill }
