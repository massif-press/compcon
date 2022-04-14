import { store } from '../../../../store'

type prompt = {
  question: string
  options: string[]
}

type BondPower = {
  name: string
  description: string
  frequency: string
  veteran: boolean
  master: boolean
}

interface IBondData {
  id: string
  name: string
  major_ideals: string[]
  minor_ideals: string[]
  questions: prompt[]
  powers: BondPower[]
}

class Bond {
  public readonly ID: string
  public readonly Name: string
  public readonly MajorIdeals: string[]
  public readonly MinorIdeals: string[]
  public readonly Questions: prompt[]
  public readonly Powers: BondPower[]
  public readonly LcpName: string
  public readonly InLcp: boolean

  public constructor(data: IBondData, packName?: string) {
    this.ID = data.id
    this.Name = data.name
    this.MajorIdeals = data.major_ideals
    this.MinorIdeals = data.minor_ideals
    this.Questions = data.questions
    this.Powers = data.powers
    this.LcpName = packName || 'LANCER Core Book'
    this.InLcp = packName ? true : false
  }

  public RandomOption(qIdx: number): string {
    if (!this.Questions[qIdx]) return ''
    return this.Questions[qIdx].options[
      Math.floor(Math.random() * this.Questions[qIdx].options.length)
    ]
  }

  public RandomIdeal(selection: 'Major' | 'Minor'): string {
    return this[`${selection}Ideals`][Math.floor(Math.random() * this[`${selection}Ideals`].length)]
  }

  public static Deserialize(id: string): Bond {
    return store.getters.referenceByID('Bonds', id)
  }
}

export { Bond, IBondData, BondPower }
