import { describe, it, expect } from 'vitest'
import { DamageType } from '@/classes/enums'
import { Eidolon } from '@/classes/npc/eidolon/Eidolon'
import { EidolonLayer } from '@/classes/npc/eidolon/EidolonLayer'
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon'
import {
  Encounter,
  makeCombatant,
  statusGroupKey,
  type CombatantData,
} from '@/classes/encounter/Encounter'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { Placeholder } from '@/classes/encounter/Placeholder'
import { NpcStatus } from '@/classes/enums'
import { makeEidolon, makeEidolonLayer, makeMech, makeNpc, makePilot } from '@/__tests__/factories'
import { cur, max, StatKey } from './_helpers'

function fight(source: Eidolon, players: number) {
  const encounter = new Encounter()
  encounter.AddCombatant(source)
  const pilots = Array.from({ length: players }, (_, i) => {
    const p = makePilot({ name: `Test Pilot ${i + 1}`, callsign: `TEST${i + 1}` })
    makeMech(p)
    return p
  })
  const instance = new EncounterInstance(undefined, encounter, pilots)
  const combatant = instance.Combatants.find(c => c.type === 'eidolon') as CombatantData
  return { instance, combatant, eidolon: combatant.actor as unknown as Eidolon }
}

const shards = (c: CombatantData) => c.deployables

describe('building', () => {
  it('T-EIDOLON-class-01: class is the layer count above the core', () => {
    const e = makeEidolon()
    expect(e.EidolonClass).toBe('1')

    e.AddLayer(makeEidolonLayer(4))
    expect(e.EidolonClass).toBe('2')

    e.AddLayer(makeEidolonLayer(5))
    expect(e.EidolonClass).toBe('3')
  })

  it('T-EIDOLON-class-01: the core is the innermost layer and cannot be removed', () => {
    const e = makeEidolon()

    e.RemoveLayer(0)

    expect(e.Layers[0].Layer.IsCore).toBe(true)
    expect(e.Layers).toHaveLength(4)
  })

  it('T-EIDOLON-layerstats-01: a layer has the tier table stats, one structure and one stress', () => {
    const e = makeEidolon()
    e.Tier = 2
    const c = e.Layers[1].CombatController

    expect(max(c, StatKey.HULL)).toBe(2)
    expect(max(c, StatKey.AGI)).toBe(2)
    expect(max(c, StatKey.SYS)).toBe(2)
    expect(max(c, StatKey.ENG)).toBe(2)
    expect(max(c, StatKey.HP)).toBe(15)
    expect(max(c, StatKey.SIZE)).toBe(2)
    expect(max(c, StatKey.ARMOR)).toBe(0)
    expect(max(c, StatKey.HEATCAP)).toBe(10)
    expect(max(c, StatKey.EVASION)).toBe(12)
    expect(max(c, StatKey.EDEF)).toBe(12)
    expect(max(c, StatKey.SAVE_TARGET)).toBe(14)
    expect(max(c, StatKey.SPEED)).toBe(5)
    expect(max(c, StatKey.SENSOR_RANGE)).toBe(20)
    expect(max(c, StatKey.STRUCTURE)).toBe(1)
    expect(max(c, StatKey.STRESS)).toBe(1)
  })

  it('T-NPC-grappleram-01: an Eidolon layer takes the tiered grapple and ram bonus', () => {
    const e = makeEidolon()
    e.Tier = 3
    const c = e.Layers[1].CombatController

    expect(c.Tier).toBe(3)
    expect(max(c, StatKey.GRAPPLE)).toBe(3)
    expect(max(c, StatKey.RAM)).toBe(3)
  })

  it('T-EIDOLON-layerstats-01: a layer adds no tier attack bonus to the bonus its weapons state', () => {
    const e = makeEidolon()
    e.Tier = 3

    expect(e.Layers[1].CombatController.AttackBonus).toBe(0)
  })

  it('T-EIDOLON-layerstats-01: a layer gains 5 HP per player', () => {
    const { eidolon } = fight(makeEidolon(), 3)

    expect(max(eidolon.CombatController, StatKey.HP)).toBe(10 + 15)
    expect(cur(eidolon.CombatController, StatKey.HP)).toBe(10 + 15)
  })

  it('T-EIDOLON-layerstats-01: players are the pilots and the allied pilot placeholders', () => {
    const { instance, eidolon } = fight(makeEidolon(), 2)
    const stub = (side: 'ally' | 'enemy', type: string) => {
      const ph = new Placeholder({ id: `test-${side}-${type}`, name: 'Test Stub', side, type })
      return makeCombatant(ph, 'placeholder', { id: ph.ID, side })
    }

    instance.Combatants.push(stub('ally', 'pilot'), stub('ally', 'npc'), stub('enemy', 'pilot'))
    instance.ScaleEidolons()

    expect(instance.PlayerCount).toBe(3)
    expect(max(eidolon.CombatController, StatKey.HP)).toBe(10 + 15)
  })

  it('T-EIDOLON-layerstats-02: a layer stat line replaces the table value', () => {
    const layer = makeEidolonLayer(1, { stats: { armor: [10, 15, 20], evade: 20, size: 3 } })
    const e = makeEidolon([layer])
    e.Tier = 3
    const c = e.Layers[1].CombatController

    expect(max(c, StatKey.ARMOR)).toBe(20)
    expect(max(c, StatKey.EVASION)).toBe(20)
    expect(max(c, StatKey.SIZE)).toBe(3)
    expect(max(c, StatKey.EDEF)).toBe(14)
  })

  it('T-EIDOLON-layerstats-02: a stated HP is not scaled per player', () => {
    const layer = makeEidolonLayer(1, { stats: { hp: [45, 55, 65] } })
    const { eidolon } = fight(makeEidolon([layer]), 4)

    expect(max(eidolon.Layers[1].CombatController, StatKey.HP)).toBe(45)
    expect(max(eidolon.Layers[0].CombatController, StatKey.HP)).toBe(1)
    expect(max(eidolon.Layers[0].CombatController, StatKey.SIZE)).toBe(0.5)
  })
})

describe('layers in combat', () => {
  it('T-EIDOLON-order-01: combat starts on the outermost layer', () => {
    const { eidolon } = fight(makeEidolon(), 2)

    expect(eidolon.ActiveLayerIndex).toBe(3)
    expect(eidolon.CombatController).toBe(eidolon.Layers[3].CombatController)
  })

  it('T-EIDOLON-order-01: only the active layer takes damage', () => {
    const { eidolon } = fight(makeEidolon(), 2)
    const inner = eidolon.Layers.slice(0, 3).map(l => cur(l.CombatController, StatKey.HP))

    eidolon.CombatController.ApplyDamage(DamageType.Kinetic, 3)

    expect(cur(eidolon.Layers[3].CombatController, StatKey.HP)).toBe(20 - 3)
    expect(eidolon.Layers.slice(0, 3).map(l => cur(l.CombatController, StatKey.HP))).toEqual(inner)
  })

  it('T-EIDOLON-metamorphosis-01: a layer at 0 HP is destroyed without a structure check', () => {
    const { eidolon } = fight(makeEidolon(), 2)
    const c = eidolon.CombatController

    c.ApplyDamage(DamageType.Kinetic, 20)

    expect(c.IsDestroyed).toBe(true)
    expect(c.PendingChecks).toHaveLength(0)
    expect(eidolon.IsDefeated).toBe(false)
  })

  it('T-EIDOLON-metamorphosis-01: destroying a layer clears statuses from the Eidolon and its shards and advances inward', () => {
    const { eidolon, combatant, instance } = fight(makeEidolon(), 2)
    eidolon.CreateShards(combatant, instance.HostileCount)
    const destroyed = eidolon.CombatController
    destroyed.AddStatus('impaired')
    shards(combatant)[0].CombatController.AddStatus('slowed')

    eidolon.DestroyActiveLayer(combatant)

    expect(destroyed.HasStatus('impaired')).toBe(false)
    expect(shards(combatant)[0].CombatController.HasStatus('slowed')).toBe(false)
    expect(destroyed.IsDestroyed).toBe(true)
    expect(eidolon.ActiveLayerIndex).toBe(2)
    expect(eidolon.CombatController.IsDestroyed).toBe(false)
  })

  it('T-EIDOLON-metamorphosis-02: the next layer is marked as manifesting until it is manifested', () => {
    const { eidolon, combatant } = fight(makeEidolon(), 2)

    eidolon.DestroyActiveLayer(combatant)
    expect(eidolon.Manifesting).toBe(true)

    eidolon.Manifest(combatant, 2)
    expect(eidolon.Manifesting).toBe(false)
  })

  it('T-EIDOLON-metamorphosis-02: manifesting a layer creates its shards', () => {
    const { eidolon, combatant } = fight(makeEidolon(), 2)

    eidolon.DestroyActiveLayer(combatant)
    eidolon.Manifest(combatant, 2)

    expect(shards(combatant)).toHaveLength(2)
  })

  it('T-EIDOLON-core-01: revealing the core destroys every shard', () => {
    const { eidolon, combatant } = fight(makeEidolon([makeEidolonLayer(1)]), 2)
    eidolon.CreateShards(combatant, 2)
    expect(shards(combatant)).toHaveLength(2)

    eidolon.DestroyActiveLayer(combatant)
    eidolon.Manifest(combatant, 2)

    expect(eidolon.ActiveLayer.Layer.IsCore).toBe(true)
    expect(shards(combatant)).toHaveLength(0)
  })

  it('T-EIDOLON-core-01: the Eidolon is defeated only when the core is destroyed', () => {
    const { eidolon, combatant } = fight(makeEidolon([makeEidolonLayer(1)]), 2)

    eidolon.CombatController.SetDestroyed(true)
    expect(statusGroupKey(combatant)).toBeNull()

    eidolon.DestroyActiveLayer(combatant)
    eidolon.CombatController.ApplyDamage(DamageType.Kinetic, 1)

    expect(eidolon.IsDefeated).toBe(true)
    expect(statusGroupKey(combatant)).toBe(NpcStatus.Destroyed)
  })

  it('T-EIDOLON-overheat-01: an overheating layer becomes exposed and makes no check', () => {
    const { eidolon } = fight(makeEidolon(), 2)
    const c = eidolon.CombatController

    c.ApplyHeat(11)

    expect(c.HasStatus('exposed')).toBe(true)
    expect(cur(c, StatKey.STRESS)).toBe(1)
    expect(c.PendingChecks).toHaveLength(0)
  })

  it('T-EIDOLON-scan-01: a scan yields the active layer hints', () => {
    const { eidolon, combatant } = fight(makeEidolon(), 2)
    expect(eidolon.Scan).toBe('Test Hint 3')

    eidolon.DestroyActiveLayer(combatant)
    expect(eidolon.Scan).toBe('Test Hint 2')
  })
})

describe('shards', () => {
  it('T-EIDOLON-shardstats-01: a shard has the tier table stats', () => {
    const source = makeEidolon()
    source.Tier = 3
    const { eidolon, combatant } = fight(source, 2)

    eidolon.CreateShards(combatant, 2)
    const c = shards(combatant)[0].CombatController

    expect(max(c, StatKey.HP)).toBe(8)
    expect(max(c, StatKey.SIZE)).toBe(0.5)
    expect(max(c, StatKey.HEATCAP)).toBe(5)
    expect(max(c, StatKey.EVASION)).toBe(14)
    expect(max(c, StatKey.EDEF)).toBe(14)
    expect(max(c, StatKey.SPEED)).toBe(5)
  })

  it('T-EIDOLON-shardstats-01: a layer shard stat line replaces the table value', () => {
    const layer = makeEidolonLayer(1, {
      shards: { count: 1, detail: '', stats: { hp: 1, speed: 2 } },
    })
    const { eidolon, combatant } = fight(makeEidolon([layer]), 2)

    eidolon.CreateShards(combatant, 2)
    const c = shards(combatant)[0].CombatController

    expect(max(c, StatKey.HP)).toBe(1)
    expect(max(c, StatKey.SPEED)).toBe(2)
    expect(max(c, StatKey.EVASION)).toBe(10)
  })

  it('T-EIDOLON-shards-01: a tiered count creates the count for the tier', () => {
    const source = makeEidolon([makeEidolonLayer(1, { shards: { count: [4, 5, 6], detail: '' } })])
    source.Tier = 2
    const { eidolon, combatant } = fight(source, 2)

    eidolon.CreateShards(combatant, 2)

    expect(shards(combatant)).toHaveLength(5)
  })

  it('T-EIDOLON-shards-01: a per-hostile count creates one shard per hostile character', () => {
    const layer = makeEidolonLayer(1, { shards: { count: 'hostile_characters', detail: '' } })
    const { eidolon, combatant, instance } = fight(makeEidolon([layer]), 3)

    eidolon.CreateShards(combatant, instance.HostileCount)

    expect(shards(combatant)).toHaveLength(3)
  })

  it('T-EIDOLON-shards-01: surviving shards carry over to the next layer', () => {
    const { eidolon, combatant } = fight(makeEidolon(), 2)
    eidolon.CreateShards(combatant, 2)

    eidolon.DestroyActiveLayer(combatant)
    eidolon.Manifest(combatant, 2)

    expect(shards(combatant)).toHaveLength(4)
  })

  it('T-EIDOLON-shards-01: shards bound to their layer are destroyed with it', () => {
    const bound = makeEidolonLayer(2, {
      shards: { count: 2, detail: '', destroyed_with_layer: true },
    })
    const { eidolon, combatant } = fight(makeEidolon([makeEidolonLayer(1), bound]), 2)
    eidolon.CreateShards(combatant, 2)

    eidolon.DestroyActiveLayer(combatant)

    expect(shards(combatant)).toHaveLength(0)
  })
})

describe('turns', () => {
  it('T-EIDOLON-activations-01: one turn per two hostile characters, from one to four', () => {
    expect([1, 2, 3, 4, 6, 8, 12].map(n => Eidolon.ActivationsFor(n))).toEqual([
      1, 1, 1, 2, 3, 4, 4,
    ])
  })

  it('T-EIDOLON-activations-01: hostile characters are the pilots, placeholders and units on the allied side', () => {
    const { instance } = fight(makeEidolon(), 2)
    const unit = (side: 'ally' | 'enemy' | 'neutral') =>
      makeCombatant(makeNpc(`Test NPC ${side}`), 'unit', { id: `test-${side}`, side })
    expect(instance.HostileCount).toBe(2)

    instance.Combatants.push(unit('ally'), unit('enemy'), unit('neutral'))

    expect(instance.HostileCount).toBe(3)
  })

  it('T-EIDOLON-activations-01: every layer takes the turn count for the encounter', () => {
    const { eidolon } = fight(makeEidolon(), 4)

    for (const l of eidolon.Layers) expect(max(l.CombatController, StatKey.ACTIVATIONS)).toBe(2)
  })

  it('T-EIDOLON-activations-02: reactions refresh on each of its turns', () => {
    const { eidolon } = fight(makeEidolon(), 4)
    const c = eidolon.CombatController

    c.UseReaction('overwatch')
    expect(c.CanUseReaction('overwatch')).toBe(false)

    c.EndTurn()

    expect(c.CanUseReaction('overwatch')).toBe(true)
  })
})

describe('memetic weapons', () => {
  const memetic = () =>
    new NpcWeapon({
      id: 'test_memetic_weapon',
      name: 'Test Memetic Weapon',
      origin: 'test_elayer_1',
      type: 'Weapon',
      weapon_type: 'Heavy Memetic',
      damage: [{ type: 'Kinetic', val: [3, 4, 5] }],
      range: [{ type: 'Range', val: 15 }],
    } as any)

  it('T-EIDOLON-memetic-01: a memetic weapon attacks as ranged', () => {
    expect(memetic().toActiveEffectData(makeEidolon()).attack).toBe('ranged')
  })

  it('T-EIDOLON-memetic-01: an engaged layer takes no difficulty on its ranged attacks', () => {
    const c = makeEidolon().CombatController
    c.AddStatus('engaged')

    expect(c.DifficultyFor('ranged')).toBe(0)
  })

  it('T-EIDOLON-memetic-01: an impaired layer still takes difficulty on its ranged attacks', () => {
    const c = makeEidolon().CombatController
    c.AddStatus('impaired')

    expect(c.DifficultyFor('ranged')).toBe(1)
  })
})
