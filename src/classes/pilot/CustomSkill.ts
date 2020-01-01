import { ItemType } from '@/class'

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

export default CustomSkill
