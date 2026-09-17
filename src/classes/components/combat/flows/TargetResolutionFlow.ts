import { targetDefenseFor, critTriggers } from './WeaponAttackFlow'

type RollKind = 'attack' | 'save'

interface ITargetResolutionState {
  target: any
  event: any
  kind: RollKind
}

const DEFENSE_LABEL = { edef: 'E-Defense', evasion: 'Evasion' } as const

export function resolveTargetDefense(target: any, event: any): void {
  const against = targetDefenseFor(target.AttackType, event?.TargetDefense)
  target.TargetDefense = DEFENSE_LABEL[against]
  target.TargetDefenseValue =
    target.Combatant?.actor.CombatController.ActiveActor.StatController.getMax(against) || 10
}

export function resolveTargetRoll(s: ITargetResolutionState): void {
  if (s.event?.SaveHalf)
    s.target.SavedHalf =
      s.kind === 'save' ? s.target.SaveResult === 'success' : s.target.HitResult !== 'miss'

  if (s.kind !== 'attack') return

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
}
