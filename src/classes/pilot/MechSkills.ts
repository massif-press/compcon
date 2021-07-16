import { Rules, HASE } from '@/class'
import { Pilot } from './Pilot'

class MechSkills {
  private owner: Pilot
  private hull: number
  private agi: number
  private sys: number
  private eng: number

  public constructor(owner: Pilot, h?: number, a?: number, s?: number, e?: number) {
    this.owner = owner
    this.hull = h || 0
    this.agi = a || 0
    this.sys = s || 0
    this.eng = e || 0
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
    this.owner.save()
  }

  public Decrement(field: HASE): void {
    if (this[field] > 0) this[field] -= 1
    this.owner.save()
  }

  public Reset(): void {
    this.hull = 0
    this.agi = 0
    this.sys = 0
    this.eng = 0
    this.owner.save()
  }

  public get Sum(): number {
    return this.hull + this.agi + this.sys + this.eng
  }

  public static Serialize(item: MechSkills): number[] {
    return [item.Hull, item.Agi, item.Sys, item.Eng]
  }

  public static Deserialize(p: Pilot, itemData: number[]): MechSkills {
    return new MechSkills(p, itemData[0], itemData[1], itemData[2], itemData[3])
  }
}

export default MechSkills
