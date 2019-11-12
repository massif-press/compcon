import { store } from '@/store'
import { CompendiumItem, SkillFamily, ItemType } from '@/class'
import { ICompendiumItemData } from '@/interface'

interface ISkillData extends ICompendiumItemData {
  detail: string
  family: string
}

class Skill extends CompendiumItem {
  private _detail: string
  private _family: SkillFamily

  public constructor(data: ISkillData) {
    super(data)
    this._detail = data.detail
    this._family = SkillFamily[data.family] as SkillFamily
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

export { Skill, ISkillData }
