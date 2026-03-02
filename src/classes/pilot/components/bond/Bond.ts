import { ContentPack, ItemType } from '@/class'
import { CompendiumStore } from '../../../../stores'
import { BrewInfo } from '@/classes/components/brew/BrewController'
import { applyLcpTracking, type ILcpTracked } from '@/classes/LcpItemMixin'

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
  origin?: string
}

interface IBondData {
  id: string
  name: string
  major_ideals: string[]
  minor_ideals: string[]
  questions: prompt[]
  powers: BondPower[]
  brew?: BrewInfo
}

class Bond implements ILcpTracked {
  public readonly ID: string
  public readonly ItemData: IBondData
  public readonly Name: string
  public readonly MajorIdeals: string[]
  public readonly MinorIdeals: string[]
  public readonly Questions: prompt[]
  public readonly _powers: BondPower[]
  public LcpName: string = ''
  public InLcp: boolean = false
  public readonly ItemType: ItemType = ItemType.Bond
  public readonly Brew: BrewInfo
  public FromInstance: boolean = false

  public constructor(data: IBondData, pack?: ContentPack) {
    this.ID = data.id
    this.ItemData = data
    this.Name = data.name
    this.MajorIdeals = data.major_ideals
    this.MinorIdeals = data.minor_ideals
    this.Questions = data.questions
    this._powers = data.powers
    this._powers.forEach(power => {
      power.origin = this.ID
    })
    applyLcpTracking(this, pack)
    if (data.brew) {
      this.Brew = data.brew
    }
    if (pack) {
      this.Brew = {
        LcpId: pack.ID,
        LcpName: pack.Name,
        LcpVersion: pack.Version,
        Website: pack.Website || '',
        Status: 'OK',
      }
    } else this.Brew = {} as BrewInfo
  }

  public get Powers() {
    return this._powers.concat(CompendiumStore().ExtraBondPowers.filter(x => x.origin === this.ID))
  }

  public get Boon() {
    return this._powers.find(x => x.veteran)
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
    return CompendiumStore().referenceByID('Bonds', id)
  }

  public get Icon(): string {
    return 'mdi-cards-playing-outline'
  }

  public get Image(): string {
    return `/img/bond/${this.Name.replace(/The /g, '').toLowerCase()}.png`
  }
}

export { Bond }
export type { IBondData, BondPower }
