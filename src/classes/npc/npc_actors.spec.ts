import { describe, it, expect } from 'vitest'
import { makeNpc } from '@/__tests__/factories'
import { Doodad } from './doodad/Doodad'
import { Eidolon } from './eidolon/Eidolon'
import { Unit } from './unit/Unit'
import { transformV2NpcFeatureData } from './feature/v2compat'
import { NpcFeatureController } from './feature/NpcFeatureController'
import { NpcClassController } from './class/NpcClassController'
import { NpcTemplateController } from './template/NpcTemplateController'

void makeNpc

describe('Doodad', () => {
  it('round-trips', () => {
    const d = new Doodad()
    d.Name = 'Test Doodad'

    const back = Doodad.Deserialize(JSON.parse(JSON.stringify(Doodad.Serialize(d, false as never))))

    expect(back.ID).toBe(d.ID)
    expect(back.Name).toBe('Test Doodad')
  })

  it.each([
    ['Doodad', () => new Doodad()],
    ['Eidolon', () => new Eidolon()],
  ])('%s mints an instance that points back at the origin', (_name, make) => {
    const actor = make()
    const instance = actor.CreateInstance() as any

    expect(instance.is_instance).toBe(true)
    expect(instance.originId).toBe(actor.ID)
    expect(instance.id).toBe(instance.instanceId)
    expect(instance.id).not.toBe(actor.ID)
  })

  it('clones under a new id', () => {
    const d = new Doodad()
    d.Name = 'Clone Doodad'

    const clone = d.Clone() as unknown as Doodad

    expect(clone.ID).not.toBe(d.ID)
    expect(clone.Name).toContain('Clone Doodad')
  })
})

describe('Eidolon', () => {
  it('round-trips', () => {
    const e = new Eidolon()
    e.Name = 'Test Eidolon'

    const back = Eidolon.Deserialize(JSON.parse(JSON.stringify(Eidolon.Serialize(e))))

    expect(back.ID).toBe(e.ID)
    expect(back.Name).toBe('Test Eidolon')
  })

  it('keeps its tier through a round-trip', () => {
    const e = new Eidolon()
    e.Tier = 2

    const back = Eidolon.Deserialize(JSON.parse(JSON.stringify(Eidolon.Serialize(e))))

    expect(back.Tier).toBe(2)
  })
})

describe('Unit controllers', () => {
  it('serializes the class, template, and feature blocks', () => {
    const unit = new Unit()
    const target: any = {}

    NpcClassController.Serialize(unit, target)
    NpcTemplateController.Serialize(unit, target)
    NpcFeatureController.Serialize(unit, target)

    expect(target).toHaveProperty('features')
    expect(Array.isArray(target.features)).toBe(true)
  })

  it('loads them back onto a fresh unit', () => {
    const unit = new Unit()
    const target: any = {}

    NpcClassController.Serialize(unit, target)
    NpcTemplateController.Serialize(unit, target)
    NpcFeatureController.Serialize(unit, target)

    const other = new Unit()

    expect(() => {
      NpcClassController.Deserialize(other, target)
      NpcTemplateController.Deserialize(other, target)
      NpcFeatureController.Deserialize(other, target)
    }).not.toThrow()

    expect(other.NpcFeatureController.Features).toEqual([])
  })
})

describe('transformV2NpcFeatureData', () => {
  it('turns a v2 bonus object into bonus entries', () => {
    const data: Record<string, any> = { bonus: { hp: 5, armor: 1 } }

    transformV2NpcFeatureData(data)

    expect(data.bonus).toBeUndefined()
    expect(data.bonuses.map((b: any) => b.id).sort()).toEqual(['armor', 'hp'])
  })

  it('marks an override as overwriting', () => {
    const data: Record<string, any> = { override: { speed: 6 } }

    transformV2NpcFeatureData(data)

    expect(data.override).toBeUndefined()
    expect(data.bonuses[0]).toMatchObject({ id: 'speed', overwrite: true })
  })

  it('maps the v2 stat aliases onto v3 bonus ids', () => {
    const data: Record<string, any> = { bonus: { edefense: 2, sensorrange: 5, savetarget: 11 } }

    transformV2NpcFeatureData(data)

    expect(data.bonuses.map((b: any) => b.id).sort()).toEqual(['edef', 'save', 'sensor'])
  })

  it('leaves data with no v2 blocks alone', () => {
    const data: Record<string, any> = { name: 'Feature' }

    transformV2NpcFeatureData(data)

    expect(data).toEqual({ name: 'Feature' })
  })
})
