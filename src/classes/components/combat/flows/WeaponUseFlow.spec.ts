import { describe, it, expect, beforeEach } from 'vitest'
import { WeaponUseFlow, weaponUseState, usableWeapons, unavailableWeapons } from './WeaponUseFlow'
import type { IWeaponUseState } from './WeaponUseFlow'

const weapon = (over: any = {}) => ({
  InstanceID: over.InstanceID ?? 'w1',
  Size: 'Main',
  Skirmish: true,
  Barrage: true,
  IsLoading: false,
  Used: false,
  ...over,
})

let used: string[]
let restored: string[]

const controller = (mounts: any[]) => ({
  ActiveActor: {
    MechLoadoutController: {
      ActiveLoadout: {
        Mounts: mounts,
        Weapons: mounts.flatMap(m => m.Weapons),
      },
    },
  },
  CanFireWeapon: () => true,
  MarkActionUsed: (id: string) => used.push(id),
  DropAttackRevealedStatuses: () => undefined,
  RestoreUse: (id: string) => restored.push(id),
})

const state = (over: Partial<IWeaponUseState> = {}, mounts: any[] = []): IWeaponUseState =>
  weaponUseState({
    cc: controller(mounts),
    actionId: 'act_skirmish',
    mode: 'skirmish',
    makeEvent: (w: any, label: string) => ({ weapon: w, label, BaseEvent: { Staged: true } }),
    ...over,
  } as any)

beforeEach(() => {
  used = []
  restored = []
})

describe('WeaponUseFlow', () => {
  it('runs its steps in the documented order', () => {
    expect(WeaponUseFlow.Steps).toEqual([
      'weapon-selected',
      'weapon-eligibility',
      'superheavy-limit',
      'build-events',
      'staging',
      'application-guard',
      'consume-uses',
      'reveal',
    ])
  })

  it('declares an inverse for every step that mutates, and names the one that has none', () => {
    expect(WeaponUseFlow.UndoCoverage).toEqual({
      'weapon-selected': 'none',
      'weapon-eligibility': 'none',
      'superheavy-limit': 'undo',
      'build-events': 'none',
      staging: 'none',
      'application-guard': 'none',
      'consume-uses': 'undo',
      reveal: 'irreversible',
    })
  })

  it('halts with nothing selected, but still offers the options the picker needs', () => {
    const a = weapon({ InstanceID: 'a' })
    const r = WeaponUseFlow.Begin(state({ selected: [] }, [{ Weapons: [a] }]))

    expect(r.outcome).toBe('halted')
    expect(r.state.blockedBy).toBe('no_weapon')
    expect(r.state.options.map(w => w.InstanceID)).toEqual(['a'])
    expect(used).toEqual([])
  })

  it('flags a weapon the actor may not fire, and still builds the attack for the table to force', () => {
    const w = weapon()
    const s = state({ selected: [w] }, [{ Weapons: [w] }])
    s.cc.CanFireWeapon = () => false

    const r = WeaponUseFlow.Begin(s)
    expect(r.state.blockedBy).toBe('ordnance')
    expect(r.state.entries[0].event).toBeTruthy()
    expect(r.outcome).not.toBe('halted')
  })

  it('a superheavy collapses a barrage to that weapon alone', () => {
    const heavy = weapon({ InstanceID: 'heavy', Size: 'Superheavy' })
    const other = weapon({ InstanceID: 'other' })
    const s = state({ mode: 'barrage', capacity: 2, selected: [heavy, other] }, [
      { Weapons: [heavy, other] },
    ])

    const r = WeaponUseFlow.Begin(s)

    expect(r.outcome).toBe('complete')
    expect(r.state.selected.map(w => w.InstanceID)).toEqual(['heavy'])
    expect(used).toEqual(['act_skirmish', 'heavy'])
  })

  it('a barrage takes no more weapons than its capacity', () => {
    const a = weapon({ InstanceID: 'a' })
    const b = weapon({ InstanceID: 'b' })
    const c = weapon({ InstanceID: 'c' })
    const s = state({ mode: 'barrage', capacity: 2, selected: [a, b, c] }, [{ Weapons: [a, b, c] }])

    WeaponUseFlow.Begin(s)
    expect(s.selected.map(w => w.InstanceID)).toEqual(['a', 'b'])
  })

  it('derives the additional aux attacks from the same mount, minus what fired', () => {
    const main = weapon({ InstanceID: 'main' })
    const aux = weapon({ InstanceID: 'aux', Size: 'Auxiliary' })
    const s = state({ selected: [main] }, [{ Weapons: [main, aux] }])

    const r = WeaponUseFlow.Begin(s)

    expect(r.outcome).toBe('complete')
    expect(r.state.entries[0].auxes.map(w => w.InstanceID)).toEqual(['aux'])
    expect(r.state.entries[0].auxEvents[0].label).toBe('Additional Aux Attack')
    expect(r.state.entries[0].include).toEqual([true])
  })

  it.each([
    ['destroyed', { Destroyed: true }],
    ['already used', { Used: true }],
    // Uses counts what has been spent, so exhausted is Uses >= MaxUses
    ['out of limited uses', { IsLimited: true, Uses: 2, MaxUses: 2 }],
  ])('hides a weapon that is %s until the table asks for it', (_label, broken) => {
    const unusable = weapon({ InstanceID: 'bad', ...broken })
    const usable = weapon({ InstanceID: 'ok' })
    const s = state({ selected: [] }, [{ Weapons: [unusable, usable] }])

    WeaponUseFlow.Begin(s)
    expect(s.options.map((w: any) => w.InstanceID)).toEqual(['ok'])
    expect(unavailableWeapons(s).map((w: any) => w.InstanceID)).toEqual(['bad'])

    s.showUnavailable = true
    expect(usableWeapons(s).map((w: any) => w.InstanceID)).toEqual(['ok', 'bad'])
  })

  it('still offers a limited weapon that has uses left', () => {
    const fresh = weapon({ InstanceID: 'fresh', IsLimited: true, Uses: 0, MaxUses: 2 })
    const part = weapon({ InstanceID: 'part', IsLimited: true, Uses: 1, MaxUses: 2 })
    const s = state({ selected: [] }, [{ Weapons: [fresh, part] }])

    WeaponUseFlow.Begin(s)

    expect(s.options.map((w: any) => w.InstanceID)).toEqual(['fresh', 'part'])
  })

  it('keeps the event it already built for a weapon that is still selected', () => {
    const w1 = weapon({ InstanceID: 'w1' })
    const w2 = weapon({ InstanceID: 'w2' })
    const s = state({ mode: 'barrage', selected: [w1] })

    WeaponUseFlow.Begin(s)
    const first = s.entries[0].event
    // the player has filled the first weapon's inputs in by now
    ;(first as any).rolled = 17

    // choosing a second weapon re-runs the flow
    s.selected = [w1, w2]
    WeaponUseFlow.Begin(s)

    expect(s.entries).toHaveLength(2)
    expect(s.entries[0].event).toBe(first)
    expect((s.entries[0].event as any).rolled).toBe(17)
    expect(s.entries[1].event).not.toBe(first)
  })

  it('builds a fresh event for a weapon that was swapped out and back', () => {
    const w1 = weapon({ InstanceID: 'w1' })
    const w2 = weapon({ InstanceID: 'w2' })
    const s = state({ mode: 'barrage', selected: [w1] })

    WeaponUseFlow.Begin(s)
    const first = s.entries[0].event

    s.selected = [w2]
    WeaponUseFlow.Begin(s)
    s.selected = [w1]
    WeaponUseFlow.Begin(s)

    expect(s.entries[0].event).not.toBe(first)
  })

  it('preserves the include flag of an aux that is still eligible', () => {
    const w1 = weapon({ InstanceID: 'w1' })
    const aux = weapon({ InstanceID: 'aux1', Size: 'Auxiliary' })
    const mounts = [{ Weapons: [w1, aux] }]
    const s = state({ mode: 'barrage', selected: [w1] }, mounts)

    WeaponUseFlow.Begin(s)
    expect(s.entries[0].auxes).toHaveLength(1)
    s.entries[0].include[0] = false
    const auxEvent = s.entries[0].auxEvents[0]

    WeaponUseFlow.Begin(s)
    expect(s.entries[0].include[0]).toBe(false)
    expect(s.entries[0].auxEvents[0]).toBe(auxEvent)
  })

  it('waits for every included event to be staged, naming the ones that are not', () => {
    const main = weapon({ InstanceID: 'main' })
    const aux = weapon({ InstanceID: 'aux', Size: 'Auxiliary' })
    const s = state({ selected: [main] }, [{ Weapons: [main, aux] }])
    s.makeEvent = (w: any, label: string) => ({ weapon: w, label, BaseEvent: { Staged: false } })

    const first = WeaponUseFlow.Begin(s)

    expect(first.outcome).toBe('awaiting')
    expect(first.pending).toBe('staging')
    expect(first.request).toEqual({ kind: 'stage', label: 'attackInputs', events: [0, 1] })
    expect(used).toEqual([])

    first.state.entries[0].event.BaseEvent.Staged = true
    const second = WeaponUseFlow.Resume(first)
    expect(second.outcome).toBe('awaiting')
    expect(second.request).toEqual({ kind: 'stage', label: 'attackInputs', events: [1] })

    first.state.entries[0].auxEvents[0].BaseEvent.Staged = true
    const third = WeaponUseFlow.Resume(second)
    expect(third.outcome).toBe('complete')
    expect(used).toEqual(['act_skirmish', 'main'])
  })

  it('an excluded aux attack is not waited on', () => {
    const main = weapon({ InstanceID: 'main' })
    const aux = weapon({ InstanceID: 'aux', Size: 'Auxiliary' })
    const s = state({ selected: [main] }, [{ Weapons: [main, aux] }])
    s.makeEvent = (w: any, label: string) => ({
      weapon: w,
      label,
      BaseEvent: { Staged: label !== 'Additional Aux Attack' },
    })

    const first = WeaponUseFlow.Begin(s)
    expect(first.outcome).toBe('awaiting')

    first.state.entries[0].include = [false]
    expect(WeaponUseFlow.Resume(first).outcome).toBe('complete')
  })

  it('marks a loading weapon used, and spends the attack action once however often it resumes', () => {
    const w = weapon({ IsLoading: true })
    const s = state({ selected: [w] }, [{ Weapons: [w] }])

    const first = WeaponUseFlow.Begin(s)
    expect(first.outcome).toBe('complete')
    expect(w.Used).toBe(true)
    expect(used).toEqual(['act_skirmish', 'w1'])

    const again = WeaponUseFlow.Begin(s)
    expect(again.outcome).toBe('halted')
    expect(again.state.blockedBy).toBe('already_applied')
    expect(used).toEqual(['act_skirmish', 'w1'])
  })

  it('takes nothing back from an attack that never landed', () => {
    const w = weapon({ IsLoading: true, Used: true })
    const s = state({ selected: [] }, [{ Weapons: [w] }])

    const r = WeaponUseFlow.Begin(s)
    expect(r.outcome).toBe('halted')
    expect(r.state.blockedBy).toBe('no_weapon')

    WeaponUseFlow.UndoAll(s)
    expect(w.Used).toBe(true)
    expect(restored).toEqual([])
  })

  it('takes the attack back through its own inverse', () => {
    const w = weapon({ IsLoading: true })
    const s = state({ selected: [w] }, [{ Weapons: [w] }])

    WeaponUseFlow.Begin(s)
    expect(WeaponUseFlow.UndoAll(s)).toEqual(['reveal'])

    expect(w.Used).toBe(false)
    expect(restored).toEqual(['w1', 'act_skirmish'])
    expect(s.applied).toBe(false)
  })

  it('offers only the weapons the mode allows, minus the ones already taken', () => {
    const a = weapon({ InstanceID: 'a' })
    const b = weapon({ InstanceID: 'b', Skirmish: false })
    const s = state({ selected: [] }, [{ Weapons: [a, b] }])

    expect(usableWeapons(s).map(w => w.InstanceID)).toEqual(['a'])

    const barrage = state({ mode: 'barrage', selected: [a] }, [{ Weapons: [a, b] }])
    expect(usableWeapons(barrage).map(w => w.InstanceID)).toEqual(['b'])
  })

  it('takes an NPC actor pool from its features, and gets no aux attacks from it', () => {
    const a = { InstanceID: 'a', IsSuperheavy: false }
    const heavy = { InstanceID: 'heavy', IsSuperheavy: true }
    const npc = {
      ActiveActor: {
        NpcFeatureController: {
          BarrageWeapons: [a, heavy],
          SkirmishWeapons: [a],
        },
      },
      CanFireWeapon: () => true,
      MarkActionUsed: (id: string) => used.push(id),
      DropAttackRevealedStatuses: () => undefined,
      RestoreUse: (id: string) => restored.push(id),
    }
    const skirmish = state({ cc: npc, selected: [] } as any)
    expect(usableWeapons(skirmish).map(w => w.InstanceID)).toEqual(['a'])

    const barrage = state({ cc: npc, mode: 'barrage', selected: [] } as any)
    expect(usableWeapons(barrage).map(w => w.InstanceID)).toEqual(['a', 'heavy'])

    const withHeavy = state({ cc: npc, mode: 'barrage', selected: [heavy, a] } as any)
    const r = WeaponUseFlow.Begin(withHeavy)
    expect(r.state.selected.map(w => w.InstanceID)).toEqual(['heavy'])
    expect(r.state.entries[0].auxes).toEqual([])
  })

  it('takes a pilot fight pool from the pilot loadout, and gets no aux attacks from it', () => {
    const a = { InstanceID: 'a', IsLoading: false, Used: false }
    const pilot = {
      RootActor: { Loadout: { Weapons: [a] } },
      CanFireWeapon: () => true,
      MarkActionUsed: (id: string) => used.push(id),
      DropAttackRevealedStatuses: () => undefined,
      RestoreUse: (id: string) => restored.push(id),
    }
    const s = state({ cc: pilot, mode: 'fight', selected: [] } as any)
    expect(usableWeapons(s).map(w => w.InstanceID)).toEqual(['a'])

    const firing = state({ cc: pilot, mode: 'fight', selected: [a] } as any)
    const r = WeaponUseFlow.Begin(firing)

    expect(r.outcome).toBe('complete')
    expect(r.state.entries[0].auxes).toEqual([])
    expect(used).toEqual(['act_skirmish', 'a'])
  })

  it('narrows the options to a preset weapon', () => {
    const a = weapon({ InstanceID: 'a' })
    const b = weapon({ InstanceID: 'b' })
    const s = state({ selected: [], presetWeapon: b }, [{ Weapons: [a, b] }])

    expect(usableWeapons(s).map(w => w.InstanceID)).toEqual(['b'])
  })
})
