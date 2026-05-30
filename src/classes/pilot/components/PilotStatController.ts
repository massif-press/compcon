import { Bonus, BonusId } from '../../components/feature/bonus/Bonus'
import { Rules } from '../../utility/Rules'
import { ExpressionContext } from '../../utility/ExpressionContext'
import { IFeatureController } from '../../components/feature/IFeatureController'
import type { Pilot } from '../Pilot'

class PilotStatController {
  private _pilot: Pilot

  constructor(pilot: Pilot) {
    this._pilot = pilot
  }

  public get MaxHP(): number {
    return Bonus.Int(Rules.BasePilotHP + this._pilot.Grit, BonusId.PILOT_HP, this._pilot)
  }

  public get Armor(): number {
    return Bonus.Int(0, BonusId.PILOT_ARMOR, this._pilot)
  }

  public get Speed(): number {
    return Bonus.Int(Rules.BasePilotSpeed, BonusId.PILOT_SPEED, this._pilot)
  }

  public get Evasion(): number {
    return Bonus.Int(Rules.BasePilotEvasion, BonusId.PILOT_EVASION, this._pilot)
  }

  public get EDefense(): number {
    return Bonus.Int(Rules.BasePilotEdef, BonusId.PILOT_EDEF, this._pilot)
  }

  public get LimitedBonus(): number {
    return Bonus.Int(
      Math.floor(this._pilot.MechSkillsController.MechSkills.Eng / 2),
      BonusId.LIMITED_BONUS,
      this._pilot
    )
  }

  public get AttackBonus(): number {
    return Bonus.Int(this._pilot.Grit, BonusId.ATTACK, this._pilot)
  }

  public get TechAttack(): number {
    return Bonus.Int(this._pilot.Grit, BonusId.TECH_ATTACK, this._pilot)
  }

  public getExpressionContext(): ExpressionContext {
    const p = this._pilot
    return {
      ll: p.Level,
      grit: p.Grit,
      hull: p.MechSkillsController.Hull,
      agi: p.MechSkillsController.Agi,
      sys: p.MechSkillsController.Sys,
      eng: p.MechSkillsController.Eng,
      hp: Rules.BasePilotHP + p.Grit,
      armor: 0,
      speed: Rules.BasePilotSpeed,
      evasion: Rules.BasePilotEvasion,
      edef: Rules.BasePilotEdef,
    }
  }

  public getEntityRef(name: string): IFeatureController | null {
    switch (name.toLowerCase()) {
      case 'mech':
        return this._pilot.ActiveMech ?? null
      case 'self':
      case 'pilot':
        return this._pilot
      default:
        return null
    }
  }

  public SetStats(): void {
    const p = this._pilot
    const kvps = [
      { key: 'grit', val: p.Grit },
      { key: 'hp', val: this.MaxHP },
      { key: 'armor', val: this.Armor },
      { key: 'speed', val: this.Speed },
      { key: 'evasion', val: this.Evasion },
      { key: 'edef', val: this.EDefense },
      { key: 'limitedBonus', val: this.LimitedBonus },
      { key: 'activations', val: 1 },
    ] as { key: string; val: number }[]

    p.CombatController.setStats(kvps)

    p.Mechs.forEach(m => {
      m.SetStats()
    })
  }
}

export { PilotStatController }
