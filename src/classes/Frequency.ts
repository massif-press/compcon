import { i18n } from '@/i18n'

enum ActivePeriod {
  Turn = 'Turn',
  Round = 'Round',
  Scene = 'Scene',
  Mission = 'Mission',
  Unlimited = 'Unlimited',
}

const periodRank: Record<ActivePeriod, number> = {
  [ActivePeriod.Unlimited]: 0,
  [ActivePeriod.Turn]: 1,
  [ActivePeriod.Round]: 2,
  [ActivePeriod.Scene]: 3,
  [ActivePeriod.Mission]: 4,
}

const periodAliases: Record<string, ActivePeriod> = {
  turn: ActivePeriod.Turn,
  round: ActivePeriod.Round,
  scene: ActivePeriod.Scene,
  encounter: ActivePeriod.Scene,
  mission: ActivePeriod.Mission,
}

const regainsOn = (duration: ActivePeriod, event: ActivePeriod): boolean =>
  event !== ActivePeriod.Unlimited && periodRank[duration] <= periodRank[event]

class Frequency {
  public readonly Uses: number
  public readonly Duration: ActivePeriod
  public readonly FreqText: string
  public readonly Unlimited: boolean

  public constructor(frq: string) {
    this.FreqText = frq || ''

    const [usesText, periodText] = this.FreqText.split('/')
    const uses = parseInt(usesText)
    const period = periodAliases[(periodText || '').trim().toLowerCase()]

    if (!period || !Number.isInteger(uses) || uses < 1) {
      this.Uses = 1
      this.Duration = ActivePeriod.Unlimited
      this.Unlimited = true
      return
    }

    this.Uses = uses
    this.Duration = period
    this.Unlimited = false
  }

  public ToString(): string {
    const durationLocal = i18n.global.t(`enums.duration.${this.Duration.toLowerCase()}`)
    if (this.Unlimited) return durationLocal
    return `${this.Uses}/${durationLocal}`
  }
}

export { Frequency, ActivePeriod, regainsOn }
