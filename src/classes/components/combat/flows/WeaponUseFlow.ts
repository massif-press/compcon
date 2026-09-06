import { Flow, step } from './Flow'
import type { IFlowStep } from './Flow'
import {
  additionalAuxAttacks,
  suppressBonusDamage,
  weaponPool,
  mountWeapons,
  isSelectableWeapon,
  isSuperheavy,
} from '../AttackRules'
import type { WeaponUseMode } from '../AttackRules'
import { consumeWeaponUses, applicationGuard } from './WeaponAttackFlow'
import type { BlockedReason } from '../log/events'
import { combatLogHooks } from './logHooks'

interface IWeaponUseEntry {
  weapon: any
  event: any
  auxes: any[]
  auxEvents: any[]
  include: boolean[]
}

export interface IWeaponUseState {
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
  showUnavailable?: boolean
  applied: boolean
  blockedBy?: BlockedReason
}

const AUX_LABEL = 'Additional Aux Attack'

function offered(state: IWeaponUseState): any[] {
  const taken = state.selected.filter(Boolean).map((w: any) => w.InstanceID)
  const eligible = weaponPool(state.cc, state.mode).filter(
    (w: any) => !taken.includes(w.InstanceID)
  )
  if (!state.presetWeapon) return eligible
  return eligible.filter((w: any) => w.InstanceID === state.presetWeapon.InstanceID)
}

export function usableWeapons(state: IWeaponUseState): any[] {
  const all = offered(state)
  if (!state.showUnavailable) return all.filter(isSelectableWeapon)
  return [...all].sort(
    (a: any, b: any) => Number(isSelectableWeapon(b)) - Number(isSelectableWeapon(a))
  )
}

export function unavailableWeapons(state: IWeaponUseState): any[] {
  return offered(state).filter((w: any) => !isSelectableWeapon(w))
}

const weaponSelected: IFlowStep<IWeaponUseState> = {
  Name: 'weapon-selected',
  Run: s => {
    s.options = usableWeapons(s)
    if (s.selected.filter(Boolean).length) return 'continue'
    s.blockedBy = 'no_weapon'
    return 'halt'
  },
}

const weaponEligibility = step<IWeaponUseState>('weapon-eligibility', s => {
  const blocked = s.selected.filter(Boolean).some((w: any) => !s.cc.CanFireWeapon(w))
  s.blockedBy = blocked ? 'ordnance' : undefined
})

const superheavyLimit = step<IWeaponUseState>(
  'superheavy-limit',
  s => {
    const chosen = s.selected.filter(Boolean)
    s.requested = chosen
    const superheavy = chosen.find(isSuperheavy)
    if (superheavy) s.selected = [superheavy]
    else s.selected = chosen.slice(0, s.capacity)
  },
  {
    Undo: s => {
      if (s.requested) s.selected = s.requested
    },
  }
)

const buildEvents = step<IWeaponUseState>('build-events', s => {
  const fired = s.selected.map((w: any) => w.InstanceID)
  const held = new Map<string, IWeaponUseEntry>(
    s.entries.filter(e => e.weapon?.InstanceID).map(e => [e.weapon.InstanceID, e])
  )

  s.entries = s.selected.map((weapon: any) => {
    const prior = held.get(weapon.InstanceID)
    const auxes = additionalAuxAttacks(mountWeapons(s.cc, weapon), fired)

    const reused = auxes.map((a: any) =>
      prior ? prior.auxes.findIndex((p: any) => p.InstanceID === a.InstanceID) : -1
    )

    return {
      weapon,
      event: prior?.event ?? s.makeEvent(weapon, s.mode === 'barrage' ? 'Barrage' : 'Skirmish'),
      auxes,
      auxEvents: reused.map((at, i) =>
        at === -1 ? suppressBonusDamage(s.makeEvent(auxes[i], AUX_LABEL)) : prior!.auxEvents[at]
      ),
      include: reused.map(at => (at === -1 ? true : prior!.include[at])),
    }
  })
})

export function activeEvents(s: IWeaponUseState): any[] {
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
  Request: s => ({ kind: 'stage', label: 'attackInputs', events: unstaged(s) }),
}

const consumeUses = step<IWeaponUseState>(
  'consume-uses',
  s => {
    s.cc.MarkActionUsed(s.actionId)
    s.selected.forEach((weapon: any) => {
      s.cc.MarkActionUsed(weapon.InstanceID)
      consumeWeaponUses(weapon)
    })
  },
  {
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
)

const reveal = step<IWeaponUseState>(
  'reveal',
  s => {
    s.cc.DropAttackRevealedStatuses()
  },
  {
    Undo: 'irreversible',
  }
)

export const WeaponUseFlow = new Flow<IWeaponUseState>(
  'WeaponUseFlow',
  [
    weaponSelected,
    weaponEligibility,
    superheavyLimit,
    buildEvents,
    staging,
    applicationGuard<IWeaponUseState>(),
    consumeUses,
    reveal,
  ],
  combatLogHooks
)

export function weaponUseState(
  over: Partial<IWeaponUseState> & Pick<IWeaponUseState, 'cc' | 'actionId' | 'mode' | 'makeEvent'>
): IWeaponUseState {
  return {
    capacity: over.mode === 'barrage' ? 2 : 1,
    selected: [],
    entries: [],
    options: [],
    applied: false,
    ...over,
  }
}
