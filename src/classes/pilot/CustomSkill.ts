import { ItemType } from '@/class'

class CustomSkill {
  private _name: string
  private _description: string
  private _item_type: ItemType

  public constructor(name: string, description: string) {
    this._name = name
    this._description = description
    this._item_type = ItemType.Skill
  }

  public get ID(): string {
    return this._name
  }

  public get Name(): string {
    return this._name
  }

  public get Trigger(): string {
    return this._name
  }

  public get Description(): string {
    return this._description
  }

  public set Description(val: string) {
    this._description = val
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

  public get Family(): string {
    return 'Custom'
  }
}

export default CustomSkill
