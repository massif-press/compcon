import { Rules, HASE } from '../../../class'

class MechSkills {
  private hull: number
  private agi: number
  private sys: number
  private eng: number

  public constructor(arr?: number[]) {
    const d = !arr || arr.length < 4
    this.hull = d ? 0 : arr[0]
    this.agi = d ? 0 : arr[1]
    this.sys = d ? 0 : arr[2]
    this.eng = d ? 0 : arr[3]
  }

  public get Hull(): number {
    return this.hull
  }

  public set Hull(val: number) {
    this.hull = val
  }

  public get Agi(): number {
    return this.agi
  }

  public set Agi(val: number) {
    this.agi = val
  }

  public get Sys(): number {
    return this.sys
  }

  public set Sys(val: number) {
    this.sys = val
  }

  public get Eng(): number {
    return this.eng
  }

  public set Eng(val: number) {
    this.eng = val
  }

  public Increment(field: HASE): void {
    if (this[field] < Rules.MaxHase) this[field] += 1
  }

  public Decrement(field: HASE): void {
    if (this[field] > 0) this[field] -= 1
  }

  public Reset(): void {
    this.hull = 0
    this.agi = 0
    this.sys = 0
    this.eng = 0
  }

  public get Sum(): number {
    return this.hull + this.agi + this.sys + this.eng
  }

  public static Serialize(item: MechSkills): number[] {
    return [item.Hull, item.Agi, item.Sys, item.Eng]
  }

  public static Deserialize(itemData: number[]): MechSkills {
    return new MechSkills(itemData)
  }
}

export default MechSkills
