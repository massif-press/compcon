import { rules } from 'lancer-data';

enum HASE {
  H = 'hull',
  A = 'agi',
  S = 'sys',
  E = 'eng'
}

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

  public get Hull(): number { return this.hull }
  public get Agi(): number { return this.agi }
  public get Sys(): number { return this.sys }
  public get Eng(): number { return this.eng }

  public Increment(field: HASE) {
    if (this[field] < rules.max_hase)
    this[field] += 1
  }

  public Decrement(field: HASE) {
    if (this[field] > 0)
    this[field] -= 1
  }
}

export default MechSkills