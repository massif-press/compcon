import { describe, it, expect, beforeEach } from 'vitest'
import { makeMech, makeNpc, makePilot } from '@/__tests__/factories'
import { MechStatus, NpcStatus, PilotStatus } from '@/classes/enums'
import { StatKey } from '../stats/Stats'
import { reduceEvents } from './telemetry'
import {
  commitOutcome,
  deriveOutcome,
  fromEventStatus,
  seedOutcomes,
  toEventStatus,
} from './outcome'
import type { IOutcome } from './outcome'
import type { ILogEvent } from './events'
import type { Pilot } from '@/classes/pilot/Pilot'
import type { Unit } from '@/classes/npc/unit/Unit'

let pilot: Pilot
let npc: Unit

const pilotRow = (over: Record<string, unknown> = {}) => ({
  id: pilot.ID,
  type: 'pilot',
  actor: pilot,
  pilotStatus: PilotStatus.Active,
  mechStatus: MechStatus.Operational,
  ...over,
})
const npcRow = (over: Record<string, unknown> = {}) => ({
  id: npc.ID,
  type: 'unit',
  actor: npc,
  status: NpcStatus.Operational,
  ...over,
})

const pilotEvents = (): ILogEvent[] => [
  ...pilot.CombatController.CombatLog.Events,
  ...(pilot.ActiveMech?.CombatController.CombatLog.Events ?? []),
]
const kinds = (events: ILogEvent[]) => events.map(e => e.kind)

beforeEach(() => {
  pilot = makePilot()
  const mech = makeMech(pilot)
  mech.SetStats()
  mech.CombatController.StatController.resetCurrentStats()
  pilot.CombatController.StatController.resetCurrentStats()
  pilot.CombatController.CombatLog.Clear()
  mech.CombatController.CombatLog.Clear()

  npc = makeNpc()
  npc.CombatController.CombatLog.Clear()
})

describe('mapping statuses to event values', () => {
  it('round-trips every enum value', () => {
    for (const v of Object.values(PilotStatus))
      expect(fromEventStatus('pilot.status', toEventStatus('pilot.status', v))).toBe(v)
    for (const v of Object.values(MechStatus))
      expect(fromEventStatus('mech.status', toEventStatus('mech.status', v))).toBe(v)
    for (const v of Object.values(NpcStatus))
      expect(fromEventStatus('npc.status', toEventStatus('npc.status', v))).toBe(v)
  })

  it('matches the values automation already records', () => {
    expect(toEventStatus('pilot.status', PilotStatus.KIA)).toBe('kia')
    expect(toEventStatus('mech.status', MechStatus.Destroyed)).toBe('destroyed')
    expect(toEventStatus('mech.status', MechStatus.ReactorMeltdown)).toBe('reactor_destroyed')
  })

  it('keeps custom text verbatim', () => {
    expect(toEventStatus('npc.status', ' Captured ')).toBe('Captured')
  })
})

describe('deriving the default outcome', () => {
  it('prefers KIA over injured', () => {
    pilot.CombatController.StatController.setCurrentStat(StatKey.HP, 1)
    pilot.CombatController.IsDead = true
    expect(deriveOutcome(pilotRow()).pilotStatus).toBe(PilotStatus.KIA)
  })

  it('reads a wounded pilot as injured', () => {
    pilot.CombatController.StatController.setCurrentStat(StatKey.HP, 1)
    expect(deriveOutcome(pilotRow()).pilotStatus).toBe(PilotStatus.Injured)
  })

  it('keeps a status the GM set during the fight', () => {
    expect(deriveOutcome(pilotRow({ pilotStatus: PilotStatus.MIA })).pilotStatus).toBe(
      PilotStatus.MIA
    )
    expect(deriveOutcome(npcRow({ status: NpcStatus.Routed })).status).toBe(NpcStatus.Routed)
  })

  it('reads a destroyed mech and a destroyed npc', () => {
    pilot.ActiveMech!.CombatController.SetDestroyed(true)
    const wreck = { type: 'unit', actor: { CombatController: { IsDestroyed: true } } }
    expect(deriveOutcome(pilotRow()).mechStatus).toBe(MechStatus.Destroyed)
    expect(deriveOutcome({ ...wreck, status: NpcStatus.Routed }).status).toBe(NpcStatus.Destroyed)
  })

  it('omits the mech for a pilot without one', () => {
    const bare = makePilot()
    expect(deriveOutcome({ type: 'pilot', actor: bare })).toEqual({
      pilotStatus: PilotStatus.Active,
    })
  })
})

describe('committing the outcome', () => {
  it('records nothing when nothing changed', () => {
    commitOutcome(pilotRow(), {
      pilotStatus: PilotStatus.Active,
      mechStatus: MechStatus.Operational,
    })
    expect(pilotEvents()).toEqual([])
  })

  it('records a manual override once', () => {
    const row = pilotRow()
    commitOutcome(row, { pilotStatus: PilotStatus.KIA })
    const [e] = pilotEvents()
    expect(e.kind).toBe('pilot.status')
    expect(e.payload).toEqual({ from: 'active', to: 'kia', manual: true })
    expect(row.pilotStatus).toBe(PilotStatus.KIA)
  })

  it('skips an already destroyed mech', () => {
    pilot.ActiveMech!.CombatController.Record('mech.status', { to: 'destroyed' })
    commitOutcome(pilotRow(), { mechStatus: MechStatus.Destroyed })
    expect(kinds(pilotEvents())).toEqual(['mech.status'])
    expect(reduceEvents(pilotEvents(), pilot.ID).mechsLost).toBe(1)
  })

  it('nets a reversed mech loss back to zero', () => {
    pilot.ActiveMech!.CombatController.Record('mech.status', { to: 'destroyed' })
    commitOutcome(pilotRow(), { mechStatus: MechStatus.Operational })
    const r = reduceEvents(pilotEvents(), pilot.ID)
    expect(r.mechsLost).toBe(0)
    expect(r.outcome).toEqual({ mech: 'operational' })
  })

  it('carries the final status on the rollup', () => {
    commitOutcome(pilotRow(), {
      pilotStatus: PilotStatus.Injured,
      mechStatus: MechStatus.ReactorMeltdown,
    })
    expect(reduceEvents(pilotEvents(), pilot.ID).outcome).toEqual({
      pilot: 'injured',
      mech: 'reactor_destroyed',
    })
  })

  it('scopes npc destruction to its telemetry', () => {
    commitOutcome(npcRow(), { status: NpcStatus.Destroyed })
    const events = npc.CombatController.CombatLog.Events
    expect(kinds(events)).toEqual(['npc.status'])

    const own = reduceEvents(events, npc.ID)
    expect(own.destroyed).toBe(true)
    expect(own.outcome).toEqual({ npc: 'destroyed' })

    const everyone = reduceEvents(events)
    expect(everyone.killsConfirmed + everyone.killsSelfReported).toBe(0)
  })

  it('skips an already destroyed npc', () => {
    npc.CombatController.Record('mech.status', { to: 'destroyed' })
    commitOutcome(npcRow(), { status: NpcStatus.Destroyed })
    expect(kinds(npc.CombatController.CombatLog.Events)).toEqual(['mech.status'])
  })
})

describe('seeding the dialog on each open', () => {
  it('refreshes on open, keeping edits', () => {
    const pc = pilotRow()
    const foe = npcRow()
    const rows: Record<string, IOutcome> = {}
    const edited = new Set<string>()

    seedOutcomes([pc, foe], rows, edited)
    expect(rows[pilot.ID].pilotStatus).toBe(PilotStatus.Active)

    pilot.CombatController.IsDead = true
    foe.status = NpcStatus.Routed
    seedOutcomes([pc, foe], rows, edited)
    expect(rows[pilot.ID].pilotStatus).toBe(PilotStatus.KIA)
    expect(rows[npc.ID].status).toBe(NpcStatus.Routed)

    rows[npc.ID].status = NpcStatus.Disengaged
    edited.add(npc.ID)
    seedOutcomes([pc, foe], rows, edited)
    expect(rows[npc.ID].status).toBe(NpcStatus.Disengaged)
  })
})
