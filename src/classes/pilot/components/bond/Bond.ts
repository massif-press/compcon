import { store } from '../../../../store'

type prompt = {
  question: string
  answers: string[]
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
  majorIdeals: string[]
  minorIdeals: string[]
  prompts: prompt[]
  powers: BondPower[]
}

class Bond {
  public readonly ID: string
  public readonly Name: string
  public readonly MajorIdeals: string[]
  public readonly MinorIdeals: string[]
  public readonly Prompts: prompt[]
  public readonly Powers: BondPower[]

  public constructor(data: IBondData) {
    this.ID = data.id
    this.Name = data.name
    this.MajorIdeals = data.majorIdeals
    this.MinorIdeals = data.minorIdeals
    this.Prompts = data.prompts
    this.Powers = data.powers
  }

  public static Deserialize(id: string): Bond {
    return store.getters.referenceByID('Bonds', id)
  }
}

export { Bond, IBondData, BondPower }
