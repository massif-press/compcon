import type { BlockedReason } from '../log/events'
import type { CombatController } from '../CombatController'
import { StatKey } from '../stats/Stats'
import { StatusController } from '../StatusController'
import { EffectSpecial } from '../../feature/active_effects/effect_subtype/EffectSpecial'
import { Frequency } from '@/classes/Frequency'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { itemRef } from '../log/refs'

interface IPerformOpts {
  target?: any
  success?: boolean
  smaller?: any
  willing?: boolean
  options?: string[]
  value?: number
  force?: boolean
}

interface IBaseActionRule {
  activation: string
  needsTarget?: boolean
  contested?: boolean
  melee?: boolean
  reason?: BlockedReason
  can?: (cc: CombatController, opts: IPerformOpts) => boolean
  run: (cc: CombatController, opts: IPerformOpts) => boolean
}

type StabilizeChoice =
  | 'cool'
  | 'repair'
  | 'reload'
  | 'clear_burn'
  | 'clear_self'
  | 'clear_ally'
  | 'npc'

function boost(cc: CombatController): boolean {
  const bonus = Number(cc.StatController.getMax(StatKey.SPEED)) || 0
  if (bonus <= 0) return false
  cc.BoostBonus += bonus
  cc.StatController.bumpCurrentStat(StatKey.SPEED, bonus, { silent: true })
  cc.Record('move', { spent: 0, mode: 'boost', granted: bonus })
  cc.DropHostileActionStatuses()
  return true
}

function shutDown(cc: CombatController): void {
  if (cc.HasStatus('shut-down')) return
  cc.ClearHeat('shutdown')
  cc.RemoveStatus('exposed')
  if (cc.InCascade) {
    cc.RemoveCustomStatus(StatusController.CASCADE_ATTRIBUTE)
    cc.AIControl = false
  }
  cc.DropTechActionStatuses()
  cc.AddStatus('shut-down')
}

function bootUp(cc: CombatController): boolean {
  if (!cc.HasStatus('shut-down')) return false
  cc.RemoveStatus('shut-down')
  cc.RemoveStatus('stunned')
  return true
}

function ram(cc: CombatController, target: any, outcome: { hit: boolean }): boolean {
  if (!outcome.hit) return false
  target?.AddStatus('prone')
  return true
}

function grapple(
  cc: CombatController,
  target: any,
  outcome: { hit: boolean; smaller?: any }
): boolean {
  if (!outcome.hit) return false
  cc.AddStatus('engaged')
  target?.AddStatus('engaged')
  ;(outcome.smaller ?? target)?.AddStatus('immobilized')
  return true
}

function invade(
  cc: CombatController,
  target: any,
  opts: { willing?: boolean } = {}
): { automatic: boolean; isAttack: boolean } {
  if (target?.ImmuneTo('tech', 'invade')) return { automatic: false, isAttack: false }
  if (opts.willing) return { automatic: true, isAttack: false }
  return { automatic: false, isAttack: true }
}

function npcInvade(cc: CombatController, target: any): void {
  target.ApplyHeat(2)
  target.AddStatus('impaired')
}

function eject(cc: CombatController): boolean {
  if (!cc.Mounted) return false
  cc.Record('mount', { mounted: false, ejected: true })
  cc.ToggleMounted()
  cc.AddStatus('impaired')
  return true
}

function dismount(cc: CombatController): boolean {
  if (!cc.Mounted) return false
  cc.ToggleMounted()
  return true
}

function prepare(cc: CombatController): void {
  if (cc.Prepared) return
  cc.Prepared = true
  cc.SetCombatAction('full', false)
  cc.SetCombatAction('reaction', false)
  cc.StatController.setCurrentStat(StatKey.SPEED, 0, { silent: true })
  cc.Record('prepare', { prepared: true })
}

function releasePrepared(cc: CombatController): void {
  if (!cc.Prepared) return
  cc.Prepared = false
  cc.SetCombatAction('reaction', true)
  cc.Record('prepare', { prepared: false })
}

function search(cc: CombatController, target: any, outcome: { success: boolean }): boolean {
  if (!outcome.success) return false
  target?.RemoveStatus('hidden')
  return true
}

function lockOn(cc: CombatController, target: any): boolean {
  if (target?.ImmuneTo?.('tech', 'lockon')) {
    cc.Record('blocked', { action: { id: 'act_lockon', name: 'LOCK ON' }, reason: 'immune' })
    return false
  }
  target?.AddStatus('lockon')
  cc.DropHostileActionStatuses()
  return true
}

function jockey(cc: CombatController, target: any, outcome: { success: boolean }): boolean {
  return outcome.success
}

function standUp(cc: CombatController): boolean {
  if (!cc.HasStatus('prone')) return false
  if (cc.HasStatus('immobilized')) {
    cc.Record('blocked', {
      action: { id: 'act_stand_up', name: 'STAND UP' },
      reason: 'immobilized',
    })
    return false
  }
  cc.RemoveStatus('prone')
  cc.SpendMovement(cc.StatController.getCurrent(StatKey.SPEED))
  return true
}

function hide(cc: CombatController): boolean {
  if (cc.HasStatus('engaged')) {
    cc.Record('blocked', { action: { id: 'act_hide', name: 'HIDE' }, reason: 'engaged' })
    return false
  }
  cc.AddStatus('hidden')
  return true
}

function disengage(cc: CombatController): boolean {
  cc.Disengaged = true
  if (cc.HasStatus('engaged')) cc.RemoveStatus('engaged')
  return true
}

function clearCondition(cc: CombatController, statusID: string, target: any): boolean {
  if (!target.ClearableConditions().some((c: any) => c.status.ID === statusID)) return false
  target.RemoveStatus(statusID, 'cleared')
  return true
}

function carry(cc: CombatController, mode: 'drag' | 'lift' | 'none'): void {
  const status = { drag: 'slow', lift: 'immobilized' } as const
  if (cc.Carrying !== 'none') cc.RemoveStatus(status[cc.Carrying])
  cc.Carrying = mode
  cc.Record('carry', { mode })
  if (mode === 'none') return
  cc.AddStatus(status[mode], undefined, { selfInflicted: true })
}

function setUnlicensed(cc: CombatController, unlicensed: boolean): void {
  if (unlicensed) {
    cc.AddStatus('impaired', undefined, { selfInflicted: true })
    cc.AddStatus('slow', undefined, { selfInflicted: true })
    return
  }
  cc.RemoveStatus('impaired')
  cc.RemoveStatus('slow')
}

function bolster(cc: CombatController): void {
  if (cc.HasCustomStatus('Bolster')) return
  cc.ApplyCustomStatus(
    new EffectSpecial({ attribute: 'Bolster', detail: '+2 accuracy on the next roll.' }),
    '',
    cc,
    cc,
    undefined as any
  )
}

function useFullTech(cc: CombatController, options: string[]): boolean {
  if (!cc.CanTakeTechActions) return false
  if (cc.IsNpc && options.length === 2 && options[0] === options[1]) return false
  const frequency = new Frequency(`${Math.max(1, options.length)}/turn`)
  options.forEach(o => cc.MarkActionUsed(o, frequency))
  return true
}

function reloadOptions(cc: CombatController): any[] {
  return cc.AllEquipment.filter(eq => eq.IsLoading && eq.Used)
}

function reload(cc: CombatController, weapon?: any): boolean {
  const targets = weapon ? [weapon] : cc.ReloadOptions()
  if (!targets.length) return false
  targets.forEach(eq => {
    eq.Used = false
  })
  cc.Record('reload', { items: targets.map(itemRef) })
  return true
}

function rollRecharge(cc: CombatController, features: any[]): number {
  const recharging = (features || []).filter(f => f?.Recharge > 0 && f.Used)
  if (!recharging.length) return 0
  const roll = DiceRoller.rollDie(6)
  cc.RechargeRolledRound = cc.Round
  recharging.forEach(f => {
    const recharged = roll >= f.Recharge
    if (recharged) f.Used = false
    cc.Record('recharge', { item: itemRef(f), roll, recharged })
  })
  return roll
}

function stabilize(cc: CombatController, action: StabilizeChoice): void {
  switch (action) {
    case 'cool':
      cc.ClearHeat('stabilize')
      cc.RemoveStatus('exposed')
      break
    case 'repair':
      cc.StatController.setCurrentStat(StatKey.HP, cc.StatController.getMax(StatKey.HP))
      cc.StatController.bumpCurrentStat(StatKey.REPAIR_CAPACITY, -1)
      break
    case 'reload':
      cc.Reload()
      break
    case 'clear_burn':
      cc.StatController.setCurrentStat(StatKey.BURN, 0)
      break
    case 'npc':
      cc.Reload()
      cc.ClearHeat('stabilize')
      cc.RemoveStatus('exposed')
      break
    case 'clear_self':
    case 'clear_ally':
      break
    default:
      return
  }
  cc.Record('stabilize', { choices: [action] })
}

const BASE_ACTIONS: Record<string, IBaseActionRule> = {
  act_shut_down: {
    activation: 'quick',
    reason: 'shut_down',
    can: cc => !cc.HasStatus('shut-down'),
    run: cc => {
      shutDown(cc)
      return true
    },
  },
  act_boot_up: {
    activation: 'full',
    reason: 'unavailable',
    can: cc => cc.HasStatus('shut-down'),
    run: cc => bootUp(cc),
  },
  act_hide: {
    activation: 'quick',
    reason: 'engaged',
    can: cc => !cc.HasStatus('engaged'),
    run: cc => hide(cc),
  },
  act_disengage: { activation: 'full', run: cc => disengage(cc) },
  act_eject: {
    activation: 'quick',
    reason: 'unmounted',
    can: cc => cc.Mounted,
    run: cc => eject(cc),
  },
  act_dismount: {
    activation: 'full',
    reason: 'unmounted',
    can: cc => cc.Mounted,
    run: cc => dismount(cc),
  },
  act_mount: {
    activation: 'full',
    reason: 'mounted',
    can: cc => !cc.Mounted,
    run: cc => {
      cc.ToggleMounted()
      return true
    },
  },
  act_prepare: {
    activation: 'quick',
    reason: 'unavailable',
    can: cc => !cc.Prepared,
    run: cc => {
      prepare(cc)
      return true
    },
  },
  act_stand_up: {
    activation: 'free',
    reason: 'prone',
    can: cc => cc.HasStatus('prone') && !cc.HasStatus('immobilized'),
    run: cc => standUp(cc),
  },
  act_self_destruct: {
    activation: 'quick',
    reason: 'unavailable',
    can: cc => !cc.IsInSelfDestruct,
    run: cc => {
      cc.StartSelfDestruct()
      return true
    },
  },
  act_grapple: {
    activation: 'grapple',
    needsTarget: true,
    melee: true,
    run: (cc, o) => grapple(cc, o.target, { hit: o.success !== false, smaller: o.smaller }),
  },
  act_ram: {
    activation: 'ram',
    needsTarget: true,
    melee: true,
    run: (cc, o) => ram(cc, o.target, { hit: o.success !== false }),
  },
  act_boost: {
    activation: 'boost',
    reason: 'unavailable',
    run: cc => boost(cc),
  },
  act_search: {
    activation: 'quick',
    needsTarget: true,
    contested: true,
    run: (cc, o) => search(cc, o.target, { success: o.success !== false }),
  },
  act_jockey: {
    activation: 'jockey',
    run: (cc, o) => (o.target ? jockey(cc, o.target, { success: o.success !== false }) : true),
  },
  act_lockon: {
    activation: 'quicktech',
    needsTarget: true,
    run: (cc, o) => lockOn(cc, o.target),
  },
  act_bolster: {
    activation: 'quicktech',
    needsTarget: true,
    run: (cc, o) => {
      o.target?.Bolster()
      return true
    },
  },
  act_invade: {
    activation: 'quicktech',
    run: (cc, o) => {
      if (!o.target) return true
      if (cc.IsNpc) {
        npcInvade(cc, o.target)
        return true
      }
      return invade(cc, o.target, { willing: o.willing }).automatic
    },
  },
  act_full_tech: { activation: 'fulltech', run: (cc, o) => useFullTech(cc, o.options ?? []) },
  act_stabilize: {
    activation: 'full',
    run: (cc, o) => {
      ;(o.options ?? []).forEach(choice => stabilize(cc, choice as StabilizeChoice))
      return true
    },
  },
  act_stabilize_npc: {
    activation: 'full',
    run: cc => {
      stabilize(cc, 'npc')
      return true
    },
  },
  act_reload: {
    activation: 'quick',
    reason: 'no_uses',
    can: cc => cc.ReloadOptions().length > 0,
    run: (cc, o) => reload(cc, o.target),
  },
  act_brace: {
    activation: 'brace',
    reason: 'unavailable',
    run: cc => cc.SetBraced(true, true),
  },
  act_overwatch: {
    activation: 'overwatch',
    reason: 'unavailable',
    run: cc => cc.SetOverwatch(true, true),
  },
  act_overcharge: {
    activation: 'free',
    reason: 'unavailable',
    can: cc => cc.CanActivate('overcharge'),
    run: (cc, o) => {
      cc.Overcharge(typeof o.value === 'number' ? o.value : undefined)
      return true
    },
  },
}

const ACTION_ID_ALIASES: Record<string, string> = {
  act_lock_on: 'act_lockon',
  act_grapple_npc: 'act_grapple',
  act_ram_npc: 'act_ram',
}

for (const [alias, canonical] of Object.entries(ACTION_ID_ALIASES))
  BASE_ACTIONS[alias] = BASE_ACTIONS[canonical]

export {
  BASE_ACTIONS,
  ACTION_ID_ALIASES,
  boost,
  shutDown,
  bootUp,
  ram,
  grapple,
  invade,
  npcInvade,
  eject,
  dismount,
  prepare,
  releasePrepared,
  search,
  lockOn,
  jockey,
  standUp,
  hide,
  disengage,
  clearCondition,
  carry,
  setUnlicensed,
  bolster,
  useFullTech,
  reloadOptions,
  reload,
  rollRecharge,
  stabilize,
}
export type { IPerformOpts, IBaseActionRule }
