import { store } from '@/store'
import { rules } from 'lancer-data'
import { HASE } from '@/class'

class MechSkills {
  private hull: number
  private agi: number
  private sys: number
  private eng: number

  constructor(h?: number, a?: number, s?: number, e?: number) {
    this.hull = h || 0
    this.agi = a || 0
    this.sys = s || 0
    this.eng = e || 0
  }

  public get Hull(): number {
    return this.hull
  }
  public get Agi(): number {
    return this.agi
  }
  public get Sys(): number {
    return this.sys
  }
  public get Eng(): number {
    return this.eng
  }
  public set Hull(val: number) {
    this.hull = val
  }
  public set Agi(val: number) {
    this.agi = val
  }
  public set Sys(val: number) {
    this.sys = val
  }
  public set Eng(val: number) {
    this.eng = val
  }

  private save() {
    store.dispatch('saveData')
  }

  public Increment(field: HASE) {
    if (this[field] < rules.max_hase) this[field] += 1
    this.save()
  }

  public Decrement(field: HASE) {
    if (this[field] > 0) this[field] -= 1
    this.save()
  }

  public get Sum(): number {
    return this.hull + this.agi + this.sys + this.eng
  }

  public static Serialize(item: MechSkills): number[] {
    return [item.Hull, item.Agi, item.Sys, item.Eng]
  }

  public static Deserialize(itemData: number[]) {
    return new MechSkills(itemData[0], itemData[1], itemData[2], itemData[3])
  }
}

export default MechSkills
