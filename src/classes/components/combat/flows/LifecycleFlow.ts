import { markRaw } from 'vue'
import { Flow } from './Flow'
import type { IFlowStep } from './Flow'
import { StatKey } from '../stats/Stats'
import { ActivePeriod } from '@/classes/Frequency'
import { DEFAULT_COMBAT_ACTIONS } from '../ActionPoolController'
import { EffectSpecial } from '../../feature/active_effects/effect_subtype/EffectSpecial'
import { TimedEffect } from '../../feature/active_effects/TimedEffect'
import { expiration } from '../Expiration'
import { expiredIn } from '../Duration'
import type { CombatController } from '../CombatController'

interface IEndTurnState {
  cc: CombatController
  encounter?: any
  burnResolved: boolean
}

interface IEndRoundState {
  cc: CombatController
  encounter?: any
}

const BRACE_COOLDOWN_DETAIL =
  'Due to the stress of bracing, until the end of this turn you can only take one quick action – you cannot take reactions, overcharge, move normally, take full actions, or take free actions.'

const burnCheck: IFlowStep<IEndTurnState> = {
  Name: 'burn-check',
  Run: (s, input) => {
    if (s.burnResolved) return 'continue'
    if (!s.cc.StatController.getCurrent(StatKey.BURN)) return 'continue'
    const answer = input as { success?: boolean; skip?: boolean } | undefined
    if (!answer) return 'await'
    if (answer.skip) {
      s.burnResolved = true
      s.cc.log('Burn check skipped; the burn carries over')
      return 'continue'
    }
    if (typeof answer.success !== 'boolean') return 'await'
    s.cc.ResolveBurn(answer.success)
    s.burnResolved = true
    return 'continue'
  },
  Request: () => ({ kind: 'check', label: 'burn' }),
}

const pendingChecks: IFlowStep<IEndTurnState> = {
  Name: 'pending-checks',
  Run: s => (s.cc.PendingChecks.length ? 'await' : 'continue'),
  Request: s => ({
    kind: 'check',
    label: 'structure or stress check',
    pending: s.cc.PendingChecks.map(p => p.kind),
  }),
}

const clearOvercharge: IFlowStep<IEndTurnState> = {
  Name: 'clear-overcharge',
  Run: s => {
    s.cc.ActionPoolController.InOvercharge = false
    return 'continue'
  },
}

const spendActivation: IFlowStep<IEndTurnState> = {
  Name: 'spend-activation',
  Run: s => {
    s.cc.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      s.cc.StatController.getCurrent(StatKey.ACTIVATIONS) - 1
    )
    return 'continue'
  },
}

const clearTurnUses: IFlowStep<IEndTurnState> = {
  Name: 'clear-turn-uses',
  Run: s => {
    s.cc.ClearUses(ActivePeriod.Turn)
    s.cc.Counterpart?.ClearUses(ActivePeriod.Turn)
    return 'continue'
  },
}

const nextActivation: IFlowStep<IEndTurnState> = {
  Name: 'next-activation',
  Run: s => {
    const remaining = s.cc.StatController.getCurrent(StatKey.ACTIVATIONS)
    if (remaining < 1) return 'continue'
    s.cc.Reset(ActivePeriod.Turn)
    if (s.cc.RefreshesReactionsEachTurn) s.cc.ActionPoolController.ClearReactionUses()
    s.cc.StartTurn()
    s.cc.StatController.setCurrentStat(StatKey.ACTIVATIONS, remaining)
    s.cc.Turn++
    s.cc.CombatLog.AddTurn()
    s.cc.CombatLog.LogSimpleEvent(
      `Turn complete. ${s.cc.StatController.getCurrent(StatKey.ACTIVATIONS)} turns remaining this round.`
    )
    return 'continue'
  },
}

const refreshTableReactions: IFlowStep<IEndTurnState> = {
  Name: 'refresh-table-reactions',
  Run: s => {
    s.cc.RefreshTurnReactions(s.encounter)
    return 'continue'
  },
}

const EndTurnFlow = new Flow<IEndTurnState>('EndTurnFlow', [
  burnCheck,
  pendingChecks,
  clearOvercharge,
  spendActivation,
  clearTurnUses,
  nextActivation,
  refreshTableReactions,
])

const braceTeardown: IFlowStep<IEndRoundState> = {
  Name: 'brace-teardown',
  Run: s => {
    s.cc.Turn = 1
    if (!s.cc.Braced) {
      s.cc.StatController.setCurrentStat(
        StatKey.SPEED,
        s.cc.StatController.getMax(StatKey.SPEED)
      )
      s.cc.CombatActions = { ...DEFAULT_COMBAT_ACTIONS }
      return 'continue'
    }
    s.cc.Braced = false
    s.cc.CustomStatuses.push({
      status: new EffectSpecial({
        attribute: 'Brace Cooldown',
        detail: BRACE_COOLDOWN_DETAIL,
      }),
      expires: markRaw(
        new expiration('end_turn_self', s.cc.Parent.CombatController, s.cc, s.encounter)
      ),
    })
    s.cc.ClearBraceResistance()
    s.cc.log('Brace ended; entered Brace Cooldown period')
    s.cc.CombatActions = {
      ...DEFAULT_COMBAT_ACTIONS,
      Protocol: false,
      Full: false,
      Quick2: false,
      Overcharge: false,
      Reaction: false,
    }
    return 'continue'
  },
}

const refillActivations: IFlowStep<IEndRoundState> = {
  Name: 'refill-activations',
  Run: s => {
    s.cc.ActionPoolController.ClearReactionUses()
    s.cc.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      s.cc.StatController.getMax(StatKey.ACTIVATIONS)
    )
    s.cc.ClearUses(ActivePeriod.Round)
    return 'continue'
  },
}

const expireStatuses: IFlowStep<IEndRoundState> = {
  Name: 'expire-statuses',
  Run: s => {
    const newEffects: TimedEffect[] = []

    s.cc.getExpiredStatuses(s.cc.Round, s.cc.Parent.ID).forEach(x => {
      s.cc.log(`Status expired: ${x.status.Name}`)
      newEffects.push(
        new TimedEffect({
          name: `Status/Condition Expired`,
          detail: `${x.status.Name} status has expired.`,
          round: s.cc.Round,
          remove: { status: [x.status.ID] },
        })
      )
    })

    expiredIn(s.cc.CustomStatuses, s.cc.DurationContext()).forEach(x => {
      s.cc.log(`Special status expired: ${x.status.Attribute}`)
      newEffects.push(
        new TimedEffect({
          name: `Special Status Expired`,
          detail: `${x.status.Attribute} special status has expired.`,
          round: s.cc.Round,
          remove: { special: [{ attribute: x.status.Attribute, detail: x.status.Detail }] },
        })
      )
    })

    if (newEffects.length) s.cc.TimedEffects.push(...newEffects.map(markRaw))
    return 'continue'
  },
}

const advanceRound: IFlowStep<IEndRoundState> = {
  Name: 'advance-round',
  Run: s => {
    s.cc.Round++
    s.cc.CombatLog.EndRound()
    s.cc.StartRound()
    return 'continue'
  },
}

const EndRoundFlow = new Flow<IEndRoundState>('EndRoundFlow', [
  braceTeardown,
  refillActivations,
  expireStatuses,
  advanceRound,
])

export { EndTurnFlow, EndRoundFlow }
export type { IEndTurnState, IEndRoundState }
