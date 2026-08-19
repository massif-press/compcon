import { HASE } from '../../enums'
import { Rules } from '../../utility/Rules'
class MechSkills {
  public Hull: number
  public Agi: number
  public Sys: number
  public Eng: number

  public constructor(arr?: number[]) {
    const d = !arr || arr.length < 4
    this.Hull = d ? 0 : arr[0]
    this.Agi = d ? 0 : arr[1]
    this.Sys = d ? 0 : arr[2]
    this.Eng = d ? 0 : arr[3]
  }

  private static key(field: HASE): 'Hull' | 'Agi' | 'Sys' | 'Eng' {
    const f = String(field)
    return (f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()) as 'Hull' | 'Agi' | 'Sys' | 'Eng'
  }

  public Increment(field: HASE): void {
    const key = MechSkills.key(field)
    if (this[key] < Rules.MaxHase) this[key] += 1
  }

  public Decrement(field: HASE): void {
    const key = MechSkills.key(field)
    if (this[key] > 0) this[key] -= 1
  }

  public Reset(): void {
    this.Hull = 0
    this.Agi = 0
    this.Sys = 0
    this.Eng = 0
  }

  public get Sum(): number {
    return this.Hull + this.Agi + this.Sys + this.Eng
  }

  public static Serialize(item: MechSkills): number[] {
    return [item.Hull, item.Agi, item.Sys, item.Eng]
  }

  public static Deserialize(itemData: number[]): MechSkills {
    return new MechSkills(itemData)
  }
}

export default MechSkills
