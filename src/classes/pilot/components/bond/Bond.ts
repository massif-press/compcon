import { ContentPack } from '../../../ContentPack'
import { ItemType } from '../../../enums'
import { CompendiumStore } from '../../../../stores'
import { BrewInfo } from '@/classes/components/brew/BrewController'
import { applyLcpTracking, type ILcpTracked } from '@/classes/LcpItemMixin'
import { localize } from '@/i18n/localize'
import { bondPowerPrefix } from '@/i18n/contentKeys'

type prompt = {
  question: string
  options: string[]
}

export type BondPower = {
  name: string
  description: string
  frequency: string
  veteran: boolean
  master: boolean
  prerequisite?: string
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
  public readonly _powers: BondPower[]
  public LcpName: string = ''
  public InLcp: boolean = false
  public readonly ItemType: ItemType = ItemType.Bond
  public readonly Brew: BrewInfo
  public FromInstance: boolean = false

  public constructor(data: IBondData, pack?: ContentPack) {
    this.ID = data.id
    this.ItemData = data
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
        V3: pack.v3,
      }
    } else this.Brew = {} as BrewInfo
  }

  public get Name(): string {
    return localize(this.ID, 'name', this.ItemData.name)
  }

  public get MajorIdeals(): string[] {
    return (this.ItemData.major_ideals ?? []).map((v, i) =>
      localize(this.ID, `major_ideal_${i}`, v)
    )
  }

  public get MinorIdeals(): string[] {
    return (this.ItemData.minor_ideals ?? []).map((v, i) =>
      localize(this.ID, `minor_ideal_${i}`, v)
    )
  }

  public get Questions(): prompt[] {
    return (this.ItemData.questions ?? []).map((q, i) => ({
      question: localize(this.ID, `question_${i}`, q.question),
      options: (q.options ?? []).map((v, j) => localize(this.ID, `question_${i}_option_${j}`, v)),
    }))
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
    return CompendiumStore().referenceByID('Bonds', id) as unknown as Bond
  }

  public get Icon(): string {
    return 'mdi-cards-playing-outline'
  }

  public get Image(): string {
    return `/img/bond/${this.ItemData.name.replace(/The /g, '').toLowerCase()}.webp`
  }
}

function localizePower(p: BondPower): BondPower {
  const key = bondPowerPrefix(p.origin, p.name)
  return {
    ...p,
    name: localize(key, 'name', p.name),
    description: localize(key, 'description', p.description),
    frequency: p.frequency && localize(key, 'frequency', p.frequency),
    prerequisite: p.prerequisite && localize(key, 'prerequisite', p.prerequisite),
  }
}

export { Bond, localizePower }
export type { IBondData }
