import { markRaw } from 'vue'
import { Action } from '@/classes/Action'
import { ActivationType, DamageType } from '../../enums'
import { ActiveEffect } from '../feature/active_effects/ActiveEffect'
import { ITimedEffectAction, TimedEffect } from '../feature/active_effects/TimedEffect'
import type { CombatController } from './CombatController'
import { isDue, roundsRemaining } from './Duration'

class TimedEffectController {
  private _parent: CombatController

  public TimedEffects: TimedEffect[] = []

  constructor(parent: CombatController) {
    this._parent = parent
  }

  public Push(data: any): void {
    this.TimedEffects.push(markRaw(new TimedEffect(data)))
  }

  public Pending(...kinds: string[]): TimedEffect | undefined {
    return this.TimedEffects.find(t => kinds.includes(t.Apply?.other as string))
  }

  public ApplyInitialSelfEffects(matches: (duration?: string) => boolean): void {
    this._parent.ActiveEffects.filter(ae => ae.InitialSelfApplied && matches(ae.Duration)).forEach(
      ae => this._setFromActiveEffect(ae)
    )
  }

  private _setFromActiveEffect(ae: ActiveEffect): void {
    const apply = {} as ITimedEffectAction
    if (ae.AddResist.length)
      apply.resist = ae.AddResist.map(x => ({ type: x.Resist, value: x.ResistType }))
    if (ae.AddSpecial.length)
      apply.special = ae.AddSpecial.map(x => ({ attribute: x.Attribute, detail: x.Detail }))
    if (ae.AddStatus.length) apply.status = ae.AddStatus.map(x => x.Status.ID)

    this.Push({
      name: ae.Name,
      origin: ae.Origin.Name,
      detail: ae.Detail,
      round: this._parent.Round,
      apply,
    })
  }

  public EndOfTurnEffects(): { effect: TimedEffect; fromOther: boolean }[] {
    const own = this._parent.Parent.ID
    return this.TimedEffects.filter(t => isDue(t, this._parent.Round))
      .map(t => ({ effect: t, fromOther: !!t.Origin && t.Origin !== own }))
      .sort((a, b) => Number(b.fromOther) - Number(a.fromOther))
  }

  public get SelfDestructWindow(): number[] {
    const round = this._parent.Round
    return [round + 1, round + 2, round + 3]
  }

  public get MeltdownCountdown(): number {
    return roundsRemaining(this.Pending('self_destruct', 'reactor_meltdown'), this._parent.Round)
  }

  public SetSelfDestructRound(round: number): boolean {
    if (!this.SelfDestructWindow.includes(round)) return false
    const pending = this.Pending('self_destruct')
    if (!pending) return false
    this.TimedEffects = this.TimedEffects.filter(t => t !== pending)
    this.Push({
      name: pending.Name,
      detail: pending.Detail,
      round,
      apply: { other: 'self_destruct' },
    })
    this._parent.Record('meltdown', { state: 'self_destruct', round })
    return true
  }

  public ScheduleReactorMeltdown(turns: number): void {
    const pending = this.Pending('reactor_meltdown')
    if (pending) {
      if (pending.Round <= this._parent.Round + turns) return
      this.TimedEffects.splice(this.TimedEffects.indexOf(pending), 1)
    }
    this.Push({
      name: 'Reactor Meltdown',
      detail: `This mech's reactor will melt down, annihilating it and killing everyone inside, dealing 4d6 explosive damage to all targets in a burst 2 area around it.`,
      round: this._parent.Round + turns,
      apply: { other: 'reactor_meltdown' },
    })
    this._parent.Record('meltdown', { state: 'scheduled', turns })
  }

  public RetryMeltdownCheck(success: boolean): boolean {
    const index = this.TimedEffects.findIndex(t => t.Apply?.other === 'reactor_meltdown')
    if (index === -1) return false
    this._parent.SetCombatAction('full', false)
    if (!success) return false
    this.TimedEffects.splice(index, 1)
    this._parent.Record('meltdown', { state: 'averted' })
    return true
  }

  public get MeltdownAction(): Action {
    return new Action({
      id: 'self_destruct_internal',
      name: 'Deal Meltdown Damage',
      activation: ActivationType.None,
      detail:
        'The reactor explosion deals 4d6 explosive damage to all targets in a burst 2 area around this mech.',
      damage: [
        {
          type: DamageType.Explosive,
          val: '4d6',
          aoe: 'Burst 2',
          save: 'agility',
          save_half: true,
        },
      ],
    })
  }

  public Serialize(target: any): void {
    target.timed_effects = this.TimedEffects.map(te => TimedEffect.Serialize(te))
  }

  public Deserialize(data: any): void {
    this.TimedEffects = (data?.timed_effects || []).map((te: any) => TimedEffect.Deserialize(te))
  }
}

export { TimedEffectController }
