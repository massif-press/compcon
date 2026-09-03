import { Flow } from './Flow'
import type { IFlowStep } from './Flow'
import { targetDefenseFor, critTriggers } from './WeaponAttackFlow'

type RollKind = 'attack' | 'save'

interface ITargetResolutionState {
  target: any
  event: any
  kind: RollKind
}

const DEFENSE_LABEL = { edef: 'E-Defense', evasion: 'Evasion' } as const

function resolveTargetDefense(target: any, event: any): void {
  const against = targetDefenseFor(target.AttackType, event?.TargetDefense)
  target.TargetDefense = DEFENSE_LABEL[against]
  target.TargetDefenseValue =
    target.Combatant?.actor.CombatController.ActiveActor.StatController.getMax(against) || 10
}

const savedHalf: IFlowStep<ITargetResolutionState> = {
  Name: 'saved-half',
  Run: s => {
    if (!s.event?.SaveHalf) return 'continue'
    s.target.SavedHalf =
      s.kind === 'save' ? s.target.SaveResult === 'success' : s.target.HitResult !== 'miss'
    return 'continue'
  },
}

const critTrigger: IFlowStep<ITargetResolutionState> = {
  Name: 'crit-trigger',
  Run: s => {
    if (s.kind !== 'attack') return 'continue'
    const attackerCanCrit =
      s.event?.Initiator?.actor?.CombatController?.ActiveActor?.CombatController?.CanCrit ?? true
    if (
      critTriggers(
        s.target.AttackRolledValue,
        s.target.AttackType,
        s.event?.Effect?.CanCrit,
        attackerCanCrit
      )
    )
      s.event.SetCrit()
    return 'continue'
  },
}

const TargetRollFlow = new Flow<ITargetResolutionState>('TargetRollFlow', [savedHalf, critTrigger])

export { TargetRollFlow, resolveTargetDefense }
export type { ITargetResolutionState, RollKind }
