import { ItemType } from '@/class'
import { store } from '@/store'

class Tag {
  private id: string
  private name: string
  private description: string
  private val: number | string
  private filter_ignore: boolean
  private hidden: boolean
  private item_type: ItemType
  private brew: string

  constructor(tagData: any) {
    this.id = tagData.id
    this.name = tagData.name
    this.description = tagData.description
    this.brew = tagData.brew || 'Core'
    this.val = ''
    this.hidden = tagData.hidden || false
    this.filter_ignore = tagData.filter_ignore || this.hidden
    this.item_type = ItemType.Tag
  }

  public get Value(): number | string {
    return this.val
  }

  public set Value(val: number | string) {
    this.val = val
  }

  public get FilterIgnore(): boolean {
    return this.filter_ignore
  }

  public get IsHidden(): boolean {
    return this.hidden
  }

  public get Description(): string {
    return this.description.replace(/{VAL}/g, 'X')
  }

  public GetDescription(add_bonus?: number): string {
    let bonus = 0
    if (this.ID === 'limited') bonus = add_bonus || 0
    if (!this.val) return this.description
    if (typeof this.val === 'number') {
      return this.description.replace(/{VAL}/g, (this.val + bonus).toString())
    } else {
      var str = this.val as string
      if (str.includes('+')) {
        const split = str.split('+')
        let newVal = `${split[0]}+${parseInt(split[1]) + bonus}`
        let newDesc = this.description.replace(/{VAL}/g, newVal)
        return bonus ? `${newDesc} (+${bonus})` : newDesc
      } else {
        return bonus > 0
          ? this.description.replace(/{VAL}/g, `${this.val}+${bonus}`)
          : this.description.replace(/{VAL}/g, this.val)
      }
    }
  }

  public get ID(): string {
    return this.id
  }

  public get Name(): string {
    return this.name.replace(/{VAL}/g, 'X')
  }

  public GetName(add_bonus?: number): string {
    let bonus = 0
    if (this.ID === 'limited') bonus = add_bonus || 0
    if (!this.val) return this.name
    if (typeof this.val === 'number') {
      return this.name.replace(/{VAL}/g, (this.val + bonus).toString())
    } else {
      var str = this.val as string
      if (str.includes('+')) {
        const split = str.split('+')
        let newVal = `${split[0]}+${parseInt(split[1]) + bonus}`
        let newName = this.name.replace(/{VAL}/g, newVal)
        return bonus ? `${newName} (+${bonus})` : newName
      } else {
        return bonus > 0
          ? this.name.replace(/{VAL}/g, `${this.val}+${bonus}`)
          : this.name.replace(/{VAL}/g, this.val)
      }
    }
  }

  public get ItemType(): ItemType {
    return this.item_type
  }

  public get Brew(): string {
    return this.brew
  }

  public get IsUnique(): boolean {
    return this.id === 'unique'
  }

  public get IsLimited(): boolean {
    return this.id === 'limited'
  }

  public get IsLoading(): boolean {
    return this.id === 'loading'
  }

  public static Deserialize(data: ITagData[]): Tag[] {
    let output = [] as Tag[]
    if (!data) return output
    data.forEach(x => {
      let t = new Tag(store.getters.getItemById('Tags', x.id))
      if (x.val) t.Value = x.val
      output.push(t)
    })
    return output
  }
}

export default Tag
