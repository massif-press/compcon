import { Flow } from './Flow'
import type { IFlowStep } from './Flow'
import {
  additionalAuxAttacks,
  suppressBonusDamage,
  weaponPool,
  mountWeapons,
  isSuperheavy,
} from '../AttackRules'
import type { WeaponUseMode } from '../AttackRules'
import { consumeWeaponUses } from './WeaponAttackFlow'

interface IWeaponUseEntry {
  weapon: any
  event: any
  auxes: any[]
  auxEvents: any[]
  include: boolean[]
}

interface IWeaponUseState {
  cc: any
  actionId: string
  mode: WeaponUseMode
  capacity: number
  presetWeapon?: any
  makeEvent: (weapon: any, label: string) => any
  selected: any[]
  requested?: any[]
  entries: IWeaponUseEntry[]
  options: any[]
  applied: boolean
  blockedBy?: string
}

const AUX_LABEL = 'Additional Aux Attack'

function usableWeapons(state: IWeaponUseState): any[] {
  const taken = state.selected.filter(Boolean).map((w: any) => w.InstanceID)
  const eligible = weaponPool(state.cc, state.mode).filter(
    (w: any) => !taken.includes(w.InstanceID)
  )
  if (!state.presetWeapon) return eligible
  return eligible.filter((w: any) => w.InstanceID === state.presetWeapon.InstanceID)
}

const weaponEligibility: IFlowStep<IWeaponUseState> = {
  Name: 'weapon-eligibility',
  Run: s => {
    s.options = usableWeapons(s)
    const chosen = s.selected.filter(Boolean)
    if (!chosen.length) {
      s.blockedBy = 'no-weapon'
      return 'halt'
    }
    if (chosen.some((w: any) => !s.cc.CanFireWeapon(w))) {
      s.blockedBy = 'ordnance'
      return 'halt'
    }
    return 'continue'
  },
}

const superheavyLimit: IFlowStep<IWeaponUseState> = {
  Name: 'superheavy-limit',
  Run: s => {
    const chosen = s.selected.filter(Boolean)
    s.requested = chosen
    const superheavy = chosen.find(isSuperheavy)
    if (superheavy) s.selected = [superheavy]
    else s.selected = chosen.slice(0, s.capacity)
    return 'continue'
  },
  Undo: s => {
    if (s.requested) s.selected = s.requested
  },
}

const buildEvents: IFlowStep<IWeaponUseState> = {
  Name: 'build-events',
  Run: s => {
    const fired = s.selected.map((w: any) => w.InstanceID)
    s.entries = s.selected.map((weapon: any) => {
      const auxes = additionalAuxAttacks(mountWeapons(s.cc, weapon), fired)
      const auxEvents = auxes.map((a: any) => suppressBonusDamage(s.makeEvent(a, AUX_LABEL)))
      return {
        weapon,
        event: s.makeEvent(weapon, s.mode === 'barrage' ? 'Barrage' : 'Skirmish'),
        auxes,
        auxEvents,
        include: auxEvents.map(() => true),
      }
    })
    return 'continue'
  },
}

function activeEvents(s: IWeaponUseState): any[] {
  return s.entries.flatMap(e => [e.event, ...e.auxEvents.filter((_, i) => e.include[i])])
}

function unstaged(s: IWeaponUseState): number[] {
  return activeEvents(s)
    .map((e, i) => (e?.BaseEvent?.Staged ? -1 : i))
    .filter(i => i !== -1)
}

const staging: IFlowStep<IWeaponUseState> = {
  Name: 'staging',
  Run: s => (unstaged(s).length ? 'await' : 'continue'),
  Request: s => ({ kind: 'stage', label: 'attack inputs', events: unstaged(s) }),
}

const applicationGuard: IFlowStep<IWeaponUseState> = {
  Name: 'application-guard',
  Run: s => {
    if (s.applied) {
      s.blockedBy = 'applied'
      return 'halt'
    }
    s.applied = true
    return 'continue'
  },
}

const consumeUses: IFlowStep<IWeaponUseState> = {
  Name: 'consume-uses',
  Run: s => {
    s.cc.MarkActionUsed(s.actionId)
    s.selected.forEach((weapon: any) => {
      s.cc.MarkActionUsed(weapon.InstanceID)
      consumeWeaponUses(weapon)
    })
    return 'continue'
  },
  Undo: s => {
    if (!s.applied) return
    s.selected.forEach((weapon: any) => {
      s.cc.RestoreUse(weapon.InstanceID)
      if (weapon?.IsLoading) weapon.Used = false
    })
    s.cc.RestoreUse(s.actionId)
    s.applied = false
  },
}

const reveal: IFlowStep<IWeaponUseState> = {
  Name: 'reveal',
  Run: s => {
    s.cc.DropAttackRevealedStatuses()
    return 'continue'
  },
  Undo: 'irreversible',
}

const WeaponUseFlow = new Flow<IWeaponUseState>('WeaponUseFlow', [
  weaponEligibility,
  superheavyLimit,
  buildEvents,
  staging,
  applicationGuard,
  consumeUses,
  reveal,
])

function weaponUseState(over: Partial<IWeaponUseState> & Pick<IWeaponUseState, 'cc' | 'actionId' | 'mode' | 'makeEvent'>): IWeaponUseState {
  return {
    capacity: over.mode === 'barrage' ? 2 : 1,
    selected: [],
    entries: [],
    options: [],
    applied: false,
    ...over,
  }
}

export { WeaponUseFlow, weaponUseState, usableWeapons, activeEvents }
export type { IWeaponUseState, IWeaponUseEntry, WeaponUseMode }
