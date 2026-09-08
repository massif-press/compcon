import { Flow, step } from './Flow'
import type { IActivationState } from './ActivationFlow'
import { combatLogHooks } from './logHooks'
import { BASE_ACTIONS } from '../actions/BaseActions'
import type { IBaseActionRule, IPerformOpts } from '../actions/BaseActions'
import type { CombatController } from '../CombatController'

export interface IBaseActionState extends IActivationState {
  id: string
  opts: IPerformOpts
  activate: boolean
  ok: boolean
}

function actionRef(s: IBaseActionState) {
  return { id: s.id, name: s.cc.FindAction(s.id)?.Name ?? s.id }
}

function actionFlow(id: string, rule: IBaseActionRule): Flow<IBaseActionState> {
  return new Flow<IBaseActionState>(
    id,
    [
      {
        Name: 'target',
        Run: s => {
          if (!rule.needsTarget || s.opts.target) return 'continue'
          s.blockedBy = 'no_target'
          return 'halt'
        },
        ReportHalt: true,
      },
      {
        Name: 'legality',
        Run: s => {
          if (!rule.can || rule.can(s.cc, s.opts)) return 'continue'
          s.blockedBy = rule.reason ?? 'unavailable'
          if (!s.opts.force) return 'halt'
          s.cc.Record('blocked', { action: actionRef(s), reason: s.blockedBy, overridden: true })
          return 'continue'
        },
        ReportHalt: true,
      },
      {
        Name: 'activation',
        Run: s => {
          if (!s.activate) return 'continue'
          if (s.cc.Activate(s.activation, { actionId: s.id, force: s.opts.force }))
            return 'continue'
          s.blockedBy = 'insufficient'
          return 'halt'
        },
      },
      step<IBaseActionState>('effect', s => {
        s.ok = rule.run(s.cc, s.opts)
      }),
    ],
    combatLogHooks
  )
}

export const ACTION_FLOWS: Record<string, Flow<IBaseActionState>> = Object.fromEntries(
  Object.entries(BASE_ACTIONS).map(([id, rule]) => [id, actionFlow(id, rule)])
)

export function baseActionState(
  cc: CombatController,
  id: string,
  opts: IPerformOpts,
  activate: boolean
): IBaseActionState {
  return {
    cc,
    id,
    opts,
    activate,
    activation: BASE_ACTIONS[id].activation,
    actionId: id,
    force: opts.force,
    legal: false,
    ok: false,
  }
}
