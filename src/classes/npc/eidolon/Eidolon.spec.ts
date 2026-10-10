import { describe, it, expect, afterEach } from 'vitest'
import { Eidolon, EidolonData } from './Eidolon'
import { Encounter, makeCombatant } from '@/classes/encounter/Encounter'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { StatKey } from '@/classes/components/combat/stats/Stats'
import { StatController } from '@/classes/components/combat/stats/StatController'
import { DamageType, NpcStatus } from '@/classes/enums'
import { deriveOutcome } from '@/classes/components/combat/log/outcome'
import { reduceEvents } from '@/classes/components/combat/log/telemetry'
import { isOutOfAction } from '@/classes/components/combat/ActorIdentity'
import {
  buildFieldHashMap,
  mergeFields,
  stampChangedFields,
} from '@/classes/components/cloud/fieldMerge'
import { makeEidolon, makeEidolonLayer, makeMech, makePilot } from '@/__tests__/factories'

const roundTrip = (e: Eidolon) =>
  Eidolon.Deserialize(JSON.parse(JSON.stringify(Eidolon.Serialize(e))))

const combatantFor = (e: Eidolon) => makeCombatant(e, 'eidolon')

function legacy(e: Eidolon, hpMax: number): EidolonData {
  const data = JSON.parse(JSON.stringify(Eidolon.Serialize(e)))
  delete data.activeLayer
  data.layer_data = data.layer_data.map((l: { id: string; data: object }) => ({
    id: l.id,
    data: l.data,
    description: `Test Description ${l.id}`,
    stats: {
      max: { hp: hpMax, armor: 0, size: 2, activations: 1 },
      current: { hp: hpMax - 4, armor: 0, size: 2, activations: 1 },
      stat_version: 1,
      user_added_keys: [],
    },
  }))
  return data
}

const hp = (e: Eidolon, layer: number) =>
  e.Layers[layer].StatController.getCurrent(StatKey.HP) as number

describe('Eidolon save data', () => {
  it('keeps the active layer', () => {
    const e = makeEidolon()
    e.SetActiveLayer(1)

    expect(roundTrip(e).ActiveLayerIndex).toBe(1)
  })

  it('keeps the manifesting mark', () => {
    const e = makeEidolon()
    e.DestroyActiveLayer(combatantFor(e))

    expect(roundTrip(e).Manifesting).toBe(true)
  })

  it('keeps each layer status and HP', () => {
    const e = makeEidolon()
    e.CombatController.AddStatus('impaired')
    e.StatController.setCurrentStat(StatKey.HP, 4)

    const back = roundTrip(e)

    expect(back.CombatController.HasStatus('impaired')).toBe(true)
    expect(hp(back, 3)).toBe(4)
    expect(hp(back, 2)).toBe(10)
  })

  it('keeps the per-player HP so scaling twice adds it once', () => {
    const e = makeEidolon()
    e.PrepareForEncounter(3, 3)

    const back = roundTrip(e)
    back.ScaleToEncounter(3, 3)

    expect(back.StatController.getMax(StatKey.HP)).toBe(10 + 15)
  })

  it('loads a save from before layers held combat data, with stats from the definition', () => {
    const back = Eidolon.Deserialize(legacy(makeEidolon(), 15))

    expect(back.Layers.map(l => l.ID)).toEqual([
      'el_core',
      'test_elayer_1',
      'test_elayer_2',
      'test_elayer_3',
    ])
    expect(back.Layers[1].Description).toBe('Test Description test_elayer_1')
    expect(back.ActiveLayerIndex).toBe(3)
    expect(hp(back, 3)).toBe(10)
    expect(hp(back, 0)).toBe(1)
  })

  it('scales an encounter saved before layers held combat data when it loads', () => {
    const encounter = new Encounter()
    encounter.AddCombatant(makeEidolon())
    const pilots = [1, 2, 3].map(n => {
      const p = makePilot({ name: `Test Pilot ${n}`, callsign: `TEST${n}` })
      makeMech(p)
      return p
    })
    const data = JSON.parse(
      JSON.stringify(new EncounterInstance(undefined, encounter, pilots).Serialize())
    )
    const saved = data.combatants.find((c: { type: string }) => c.type === 'eidolon')
    saved.actor = legacy(Eidolon.Deserialize(saved.actor), 15)

    const loaded = EncounterInstance.Deserialize(data)
    loaded.ScaleEidolons()
    loaded.ScaleEidolons()

    const eidolon = loaded.Combatants.find(c => c.type === 'eidolon')!.actor as unknown as Eidolon
    expect(eidolon.StatController.getMax(StatKey.HP)).toBe(10 + 15)
  })
})

describe('Eidolon layers', () => {
  it('allows two copies of one layer', () => {
    const e = makeEidolon([makeEidolonLayer(1), makeEidolonLayer(1)])

    expect(e.Layers.map(l => l.ID)).toEqual(['el_core', 'test_elayer_1', 'test_elayer_1'])
    expect(e.Layers[1].Key).not.toBe(e.Layers[2].Key)
  })

  it.each([1, 2])('removing copy %i of two tombstones the slot that disappears', index => {
    const e = makeEidolon([makeEidolonLayer(1), makeEidolonLayer(1)])

    e.RemoveLayer(index)

    expect(e.Layers.map(l => l.ID)).toEqual(['el_core', 'test_elayer_1'])
    expect(e.CloudController._fieldTs['layer_data.test_elayer_1#1']).toBeTypeOf('number')
    expect(e.CloudController._fieldTs['layer_data.test_elayer_1']).toBeUndefined()
  })

  it('removing the first of two copies leaves the survivor on another device', () => {
    const e = makeEidolon([makeEidolonLayer(1), makeEidolonLayer(1)])
    e.Layers[1].Description = 'Test Description 1'
    e.Layers[2].Description = 'Test Description 2'
    const synced = JSON.parse(JSON.stringify(Eidolon.Serialize(e)))
    const hashes = buildFieldHashMap(synced)

    e.RemoveLayer(1)
    const remote = JSON.parse(JSON.stringify(Eidolon.Serialize(e)))
    remote._ts = stampChangedFields(remote, hashes, e.CloudController._fieldTs, 1)

    const merged = mergeFields(synced, remote)

    expect(merged.layer_data.map((l: { description: string }) => l.description)).toEqual([
      '',
      'Test Description 2',
    ])
  })

  it('removes a stray second core but never the innermost layer', () => {
    const e = makeEidolon()
    const data = JSON.parse(JSON.stringify(Eidolon.Serialize(e))) as EidolonData
    data.layer_data.push({ ...data.layer_data[0] })
    const back = Eidolon.Deserialize(data)

    back.RemoveLayer(0)
    back.RemoveLayer(4)

    expect(back.Layers.map(l => l.ID)).toEqual([
      'el_core',
      'test_elayer_1',
      'test_elayer_2',
      'test_elayer_3',
    ])
  })

  it('keeps the outermost layer active as layers are added', () => {
    const e = makeEidolon()
    e.AddLayer(makeEidolonLayer(4))

    expect(e.ActiveLayerIndex).toBe(4)
  })

  it('copies layers from another Eidolon with their descriptions', () => {
    const source = makeEidolon()
    source.Layers[2].Description = 'Test Description'
    const target = makeEidolon([makeEidolonLayer(4)])

    target.CopyLayersFrom(source)

    expect(target.Layers.map(l => l.ID)).toEqual(source.Layers.map(l => l.ID))
    expect(target.Layers[2].Description).toBe('Test Description')
    expect(target.Layers[2].Parent).toBe(target)
  })

  it('carries round, turn and remaining activations to the layer it switches to', () => {
    const e = makeEidolon()
    e.PrepareForEncounter(4, 4)
    e.CombatController.Round = 3
    e.CombatController.Turn = 2
    e.StatController.setCurrentStat(StatKey.ACTIVATIONS, 1)

    e.SetActiveLayer(1)

    expect(e.CombatController.Round).toBe(3)
    expect(e.CombatController.Turn).toBe(2)
    expect(e.StatController.getCurrent(StatKey.ACTIVATIONS)).toBe(1)
  })

  it('changing the player count keeps the damage a layer has taken', () => {
    const e = makeEidolon()
    e.PrepareForEncounter(2, 2)
    e.StatController.setCurrentStat(StatKey.HP, 6)

    e.ScaleToEncounter(3, 3)

    expect(e.StatController.getMax(StatKey.HP)).toBe(10 + 15)
    expect(hp(e, 3)).toBe(6 + 5)
  })

  it('leaves another Eidolon of a different tier with its own shard stats', () => {
    const layer = makeEidolonLayer(1)
    const low = makeEidolon([layer])
    const high = makeEidolon([layer])
    high.Tier = 3
    const lowCombatant = combatantFor(low)
    const highCombatant = combatantFor(high)

    high.CreateShards(highCombatant, 2)
    low.CreateShards(lowCombatant, 2)

    const shardHp = (c: typeof lowCombatant) =>
      c.deployables[0].CombatController.StatController.getMax(StatKey.HP)
    expect(shardHp(lowCombatant)).toBe(5)
    expect(shardHp(highCombatant)).toBe(8)
  })

  it('reports edited stats only after a stat is changed', () => {
    const e = makeEidolon()
    expect(e.HasEditedStats).toBe(false)

    e.Layers[1].StatController.setMax(StatKey.ARMOR, 3)

    expect(e.HasEditedStats).toBe(true)
  })
})

describe('Eidolon tier change', () => {
  const edited = () => {
    const e = makeEidolon()
    const stats = e.Layers[1].StatController
    stats.setMax(StatKey.HP, 14)
    stats.setMax(StatKey.ARMOR, 3)
    stats.setMax(StatKey.SIZE, 3)
    return { e, stats }
  }

  it('resets edited stats to the new tier by default', () => {
    const { e, stats } = edited()

    e.Tier = 2

    expect(stats.getMax(StatKey.HP)).toBe(15)
    expect(stats.getMax(StatKey.ARMOR)).toBe(0)
    expect(stats.getMax(StatKey.SIZE)).toBe(2)
  })

  it('preserves edited values and moves the rest to the new tier', () => {
    const { e, stats } = edited()

    e.ChangeTier(2, 'preserve')

    expect(stats.getMax(StatKey.HP)).toBe(14)
    expect(stats.getMax(StatKey.ARMOR)).toBe(3)
    expect(stats.getMax(StatKey.SIZE)).toBe(3)
    expect(stats.getMax(StatKey.EVASION)).toBe(12)
  })

  it('projects each edit onto the new tier as the same difference', () => {
    const { e, stats } = edited()

    e.ChangeTier(2, 'project')

    expect(stats.getMax(StatKey.HP)).toBe(15 + 4)
    expect(stats.getMax(StatKey.ARMOR)).toBe(3)
    expect(stats.getMax(StatKey.SIZE)).toBe(3)
    expect(stats.getMax(StatKey.EVASION)).toBe(12)
  })

  it('leaves the edits on one layer off the others', () => {
    const { e } = edited()

    e.ChangeTier(3, 'project')

    expect(e.Layers[2].StatController.getMax(StatKey.HP)).toBe(20)
    expect(e.Layers[0].StatController.getMax(StatKey.HP)).toBe(1)
  })
})

describe('Eidolon layer tier', () => {
  afterEach(() => StatController.ClearCustomStats())

  it('every layer reads the tier of its Eidolon', () => {
    const e = makeEidolon()

    e.Tier = 3

    for (const l of e.Layers) {
      expect(l.Tier).toBe(3)
      expect(l.CombatController.Tier).toBe(3)
    }
    expect(e.CombatController.Tier).toBe(3)
  })

  it('a tiered custom stat follows the Eidolon tier on every layer', () => {
    StatController.RegisterCustomStat({
      key: 'teststat',
      title: 'Test Stat',
      trackable: false,
      default: '1/2/3',
    })
    const e = makeEidolon()
    expect(e.Layers[1].StatController.getMax('teststat')).toBe(1)

    e.Tier = 2

    for (const l of e.Layers) expect(l.StatController.getMax('teststat')).toBe(2)
  })

  it('a tiered shard count is labeled for the tier, or in full without one', () => {
    const shards = makeEidolonLayer(1, { shards: { count: [4, 5, 6], detail: '' } }).Shards!

    expect(shards.CountLabel(3)).toBe('6')
    expect(shards.CountLabel()).toBe('4/5/6')
  })
})

describe('Eidolon combat log', () => {
  function fight() {
    const encounter = new Encounter()
    encounter.AddCombatant(makeEidolon())
    const pilot = makePilot({ name: 'Test Pilot 1', callsign: 'TEST1' })
    makeMech(pilot)
    const instance = new EncounterInstance(undefined, encounter, [pilot])
    const combatant = instance.Combatants.find(c => c.type === 'eidolon')!
    return { instance, combatant, eidolon: combatant.actor as unknown as Eidolon }
  }

  it('records every layer under the Eidolon', () => {
    const { instance, combatant, eidolon } = fight()

    eidolon.CombatController.TakeDamage(DamageType.Kinetic, 4)
    eidolon.DestroyActiveLayer(combatant)
    eidolon.CombatController.TakeDamage(DamageType.Kinetic, 3)

    const stream = instance.Stream
    const mine = stream.events.filter(e => e.kind === 'damage')
    expect(mine).toHaveLength(2)
    expect(new Set(mine.map(e => e.actorId))).toEqual(new Set([eidolon.ID]))
    expect(mine.map(e => (e.payload as { targetId?: string }).targetId)).toEqual([
      eidolon.ID,
      eidolon.ID,
    ])
  })

  it('appears once in the stream, as itself', () => {
    const { instance, combatant, eidolon } = fight()
    eidolon.DestroyActiveLayer(combatant)

    const refs = instance.Stream.participants.filter(p => p.type === 'eidolon')

    expect(refs).toHaveLength(1)
    expect(refs[0].id).toBe(eidolon.ID)
    expect(refs[0].name).toBe('Test Eidolon #1')
    expect(refs[0].originId).toBe(eidolon.OriginId)
  })

  it('rolls damage taken on every layer up to the Eidolon', () => {
    const { instance, combatant, eidolon } = fight()

    eidolon.CombatController.TakeDamage(DamageType.Kinetic, 4)
    eidolon.DestroyActiveLayer(combatant)
    eidolon.CombatController.TakeDamage(DamageType.Kinetic, 3)

    expect(reduceEvents(instance.Stream.events, eidolon.ID).totalTaken).toBe(7)
  })

  it('is logged as destroyed once, when the core dies', () => {
    const { instance, combatant, eidolon } = fight()
    const destroyedEvents = () =>
      instance.Stream.events.filter(
        e =>
          e.actorId === eidolon.ID &&
          ['mech.status', 'npc.status', 'actor.destroy'].includes(e.kind) &&
          (e.kind === 'actor.destroy' || (e.payload as { to?: string }).to === 'destroyed')
      )
    const lost = () => reduceEvents(instance.Stream.events, eidolon.ID)

    while (eidolon.ActiveLayerIndex > 0) {
      eidolon.CombatController.TakeDamage(DamageType.Kinetic, 999)
      expect(eidolon.CombatController.IsDestroyed).toBe(true)
      expect(deriveOutcome(combatant).status).not.toBe(NpcStatus.Destroyed)
      eidolon.DestroyActiveLayer(combatant)
    }
    expect(destroyedEvents()).toHaveLength(0)
    expect(lost().mechsLost).toBe(0)
    expect(lost().destroyed).toBe(false)

    eidolon.CombatController.TakeDamage(DamageType.Kinetic, 1)

    expect(destroyedEvents()).toHaveLength(1)
    expect(deriveOutcome(combatant).status).toBe(NpcStatus.Destroyed)
  })

  it('is out of action only when the core is destroyed', () => {
    const { combatant, eidolon } = fight()
    const outer = eidolon.CombatController

    outer.SetDestroyed(true)
    expect(isOutOfAction(outer)).toBe(false)

    while (eidolon.ActiveLayerIndex > 0) eidolon.DestroyActiveLayer(combatant)
    eidolon.CombatController.SetDestroyed(true)

    expect(isOutOfAction(outer)).toBe(true)
  })

  it('names itself, not its layer, to the rest of the table', () => {
    const { combatant, eidolon } = fight()

    expect(eidolon.CombatController.CombatName).toBe('Test Eidolon')
    expect(eidolon.CombatController.RootActor).toBe(eidolon)
    expect(combatant.Label).toBe('Test Eidolon #1')
  })
})
