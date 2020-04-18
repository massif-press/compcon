import { ItemType } from '@/class'
import { store } from '@/store'
import { ICompendiumItemData } from '@/interface'

export interface ITagCompendiumData extends ICompendiumItemData {
  id: string
  name: string
  description: string
  filter_ignore?: boolean
  hidden?: boolean
}

class Tag {
  private _id: string
  private _name: string
  private _description: string
  private _val: number | string
  private _filter_ignore: boolean
  private _hidden: boolean
  private _item_type: ItemType
  private _brew: string

  public constructor(tagData: ITagCompendiumData) {
    this._id = tagData.id
    this._name = tagData.name
    this._description = tagData.description
    this._brew = tagData.brew || 'Core'
    this._val = ''
    this._hidden = tagData.hidden || false
    this._filter_ignore = tagData.filter_ignore || this._hidden
    this._item_type = ItemType.Tag
  }

  public get Value(): number | string {
    return this._val
  }

  public set Value(val: number | string) {
    this._val = val
  }

  public get FilterIgnore(): boolean {
    return this._filter_ignore
  }

  public get IsHidden(): boolean {
    return this._hidden
  }

  public get Description(): string {
    return this._description.replace(/{VAL}/g, 'X')
  }

  public GetDescription(addBonus?: number): string {
    let bonus = 0
    if (this.ID === 'tg_limited') bonus = addBonus || 0
    if (!this._val) return this._description
    if (typeof this._val === 'number') {
      return this._description.replace(/{VAL}/g, (this._val + bonus).toString())
    } else {
      const str = this._val as string
      if (str.includes('+')) {
        const split = str.split('+')
        const newVal = `${split[0]}+${parseInt(split[1]) + bonus}`
        const newDesc = this._description.replace(/{VAL}/g, newVal)
        return bonus ? `${newDesc} (+${bonus})` : newDesc
      } else {
        return bonus > 0
          ? this._description.replace(/{VAL}/g, `${this._val}+${bonus}`)
          : this._description.replace(/{VAL}/g, this._val)
      }
    }
  }

  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return this._name.replace(/{VAL}/g, 'X')
  }

  public GetName(addBonus?: number): string {
    let bonus = 0
    if (this.IsLimited) bonus = addBonus || 0
    if (!this._val) return this._name
    if (typeof this._val === 'number') {
      return this._name.replace(/{VAL}/g, (this._val + bonus).toString())
    } else {
      const str = this._val as string
      if (str.includes('+')) {
        const split = str.split('+')
        const newVal = `${split[0]}+${parseInt(split[1]) + bonus}`
        const newName = this._name.replace(/{VAL}/g, newVal)
        return bonus ? `${newName} (+${bonus})` : newName
      } else {
        return bonus > 0
          ? this._name.replace(/{VAL}/g, `${this._val}+${bonus}`)
          : this._name.replace(/{VAL}/g, this._val)
      }
    }
  }

  public get ItemType(): ItemType {
    return this._item_type
  }

  public get Brew(): string {
    return this._brew
  }

  public get IsUnique(): boolean {
    return this._id === 'tg_unique'
  }

  public get IsAI(): boolean {
    return this._id === 'tg_ai'
  }

  public get IsLimited(): boolean {
    return this._id === 'tg_limited'
  }

  public get IsLoading(): boolean {
    return this._id === 'tg_loading'
  }

  public get IsRecharging(): boolean {
    return this._id === 'tg_recharge'
  }

  public get IsIndestructible(): boolean {
    return this._id === 'tg_indestructible'
  }

  public static Deserialize(data: ITagData[]): Tag[] {
    const output = [] as Tag[]
    if (!data) return output
    data.forEach(x => {
      const t = store.getters.instantiate('Tags', x.id)
      if (x.val) t.Value = x.val
      output.push(t)
    })
    return output
  }
}

export default Tag
