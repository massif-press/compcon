import { ItemType } from '@/class'

class CustomSkill {
  private _name: string
  private _description: string
  private _detail: string
  private ItemType: ItemType

  public constructor(name: string, description: string, detail: string) {
    this._name = name
    this._description = description
    this._detail = detail
    this.ItemType = ItemType.Skill
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
    return this.ItemType
  }

  public get Brew(): string {
    return 'N/A'
  }

  public get Detail(): string {
    return this._detail
  }

  public set Detail(val: string) {
    this._detail = val
  }

  public get Family(): string {
    return 'Custom'
  }
}

export default CustomSkill
