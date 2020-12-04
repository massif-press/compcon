import { ItemType } from '@/class'
import { store } from '@/store'
// import { ICompendiumItemData } from '@/interface'

export interface ITagCompendiumData {
  id: string
  name: string
  description: string
  filter_ignore?: boolean
  hidden?: boolean
  brew?: string
}

class Tag {
  public readonly ID: string
  public readonly FilterIgnore: boolean
  public readonly IsHidden: boolean
  public readonly ItemType: ItemType
  public readonly Brew: string
  public readonly IsUnique: boolean
  public readonly IsAI: boolean
  public readonly IsLimited: boolean
  public readonly IsLoading: boolean
  public readonly IsRecharging: boolean
  public readonly IsIndestructible: boolean
  public readonly IsSmart: boolean
  public readonly IsHeatCost: boolean
  private _name: string
  private _val: number | string
  private _description: string

  public constructor(tagData: ITagCompendiumData) {
    this.ID = tagData.id
    this._name = tagData.name
    this._description = tagData.description
    this.Brew = tagData.brew || 'Core'
    this._val = ''
    this.IsHidden = tagData.hidden || false
    this.FilterIgnore = tagData.filter_ignore || this.IsHidden
    this.ItemType = ItemType.Tag
    this.IsUnique = this.ID === 'tg_unique'
    this.IsAI = this.ID === 'tg_ai'
    this.IsLimited = this.ID === 'tg_limited'
    this.IsLoading = this.ID === 'tg_loading'
    this.IsRecharging = this.ID === 'tg_recharge'
    this.IsIndestructible = this.ID === 'tg_indestructible'
    this.IsSmart = this.ID === 'tg_smart'
    this.IsHeatCost = this.ID === 'tg_heat_self'
  }

  public get Name(): string {
    return this._name.replace(/{VAL}/g, 'X')
  }

  public get Value(): number | string {
    return this._val
  }

  public set Value(val: number | string) {
    this._val = val
  }

  public get Description(): string {
    return this._description.replace(/{VAL}/g, 'X')
  }

  public GetDescription(addBonus?: number): string {
    let bonus = 0
    if (this.ID === 'tg_limited') bonus = addBonus || 0
    if (!this._val) return this._description
    if (typeof this._val === 'number') {
      return this._description.replace(
        /{VAL}/g,
        bonus
          ? `${(this._val + bonus).toString()} <span class="caption text--secondary">(Limited ${
              this._val
            } + ${bonus} bonus)</span>`
          : this._val.toString()
      )
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

  public static Deserialize(data: ITagData[], packTags?: ITagCompendiumData[]): Tag[] {
    const output = [] as Tag[]
    if (!data) return output
    data.forEach(x => {
      let t = store.getters.instantiate('Tags', x.id)
      if ((!t || t.err) && packTags) {
        t = new Tag(packTags.find(t => t.id === x.id))
      }
      if (x.val) t.Value = x.val
      output.push(t)
    })
    return output
  }
}

export default Tag
