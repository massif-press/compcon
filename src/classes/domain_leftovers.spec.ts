import { describe, it, expect } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'
import { expiration } from './components/combat/Expiration'
import { DeployableInstance } from './components/feature/deployable/DeployableInstance'
import { ContentCollection } from './components/cloud/ContentCollection'
import { LicenseStub } from './pilot/components/license/LicenseStub'
import { PilotEquipment } from './pilot/components/Loadout/equipment/PilotEquipment'
import Project from './pilot/components/reserves/Project'
import { NarrativeController } from './narrative/NarrativeController'
import { Character } from './narrative/Character'
import { assertController } from './utility/assertController'
import { resolveSpecialEquipment, resolveIntegratedEquipment } from './components/_equipmentUtils'
import { EncounterDataContainer } from './campaign/EncounterDataContainer'
import { NarrativeDataContainer } from './campaign/NarrativeDataContainer'
import { Campaign } from './campaign/Campaign'

describe('expiration', () => {
  it('reads the period and edge out of the phrase', () => {
    expect(new expiration('end of round').Period).toBe('round')
    expect(new expiration('start of turn').Period).toBe('turn')
    expect(new expiration('start of turn').EndsOn).toBe('start')
    expect(new expiration('end of turn').EndsOn).toBe('end')
  })

  it('defaults to lasting the encounter', () => {
    const exp = new expiration('')

    expect(exp.Period).toBe('encounter')
    expect(exp.EndsOn).toBe('end')
  })

  it('round-trips', () => {
    const exp = new expiration('end of round')
    const back = expiration.Deserialize(expiration.Serialize(exp))

    expect(back.Raw).toBe('end of round')
    expect(back.Period).toBe('round')
  })

  it('serializes nothing for a missing expiration', () => {
    expect(expiration.Serialize(null as never)).toBeNull()
  })

  it('deserializes a bare string or nothing at all', () => {
    expect(expiration.Deserialize('end of turn').Raw).toBe('end of turn')
    expect(expiration.Deserialize(null).Raw).toBe('')
  })
})

describe('DeployableInstance', () => {
  it('round-trips its deployable data', () => {
    const pilot = makePilot()
    const mech = makeMech(pilot)
    const combatant = { actor: mech, deployables: [] } as never

    const instance = new DeployableInstance(
      { name: 'Turret', type: 'Drone', detail: 'shoots' } as never,
      combatant
    )

    const back = DeployableInstance.Deserialize(
      JSON.parse(JSON.stringify(DeployableInstance.Serialize(instance))),
      combatant
    )

    expect(back.Name).toContain('Turret')
  })
})

describe('ContentCollection', () => {
  it('round-trips its identity', () => {
    const collection = new ContentCollection({ name: 'My Packs' } as never)
    const back = ContentCollection.Deserialize(
      JSON.parse(JSON.stringify(ContentCollection.Serialize(collection)))
    )

    expect(back.Name).toBe('My Packs')
    expect(back.ID).toBe(collection.ID)
  })
})

describe('LicenseStub', () => {
  it('round-trips the fields the UI shows when a license is missing', () => {
    const stub = LicenseStub.Deserialize({
      id: 'mf_everest',
      name: 'Everest',
      source: 'GMS',
      frameName: 'Everest',
    })

    const back = LicenseStub.Deserialize(LicenseStub.Serialize(stub))

    expect(back.ID).toBe('mf_everest')
    expect(back.Name).toBe('Everest')
    expect(back.Source).toBe('GMS')
  })
})

describe('PilotEquipment', () => {
  it('serializes nothing for a missing item', () => {
    expect(PilotEquipment.Serialize(null as never)).toBeNull()
  })

  it('serializes an equipped item with its instance id', () => {
    const gear = CompendiumStore().PilotGear[0]
    if (!gear) return

    const data = PilotEquipment.Serialize(gear)

    expect(data?.id).toBe(gear.ID)
    expect(data?.instanceId).toBe(gear.InstanceID)
  })
})

describe('Project', () => {
  it('round-trips its progress fields', () => {
    const reserve = CompendiumStore().Reserves[0]
    const project = new Project({
      ...(reserve.ItemData as any),
      complicated: true,
      can_finish: false,
      finished: false,
      progress: 3,
      requirements: ['parts'],
    })

    const back = Project.Deserialize(JSON.parse(JSON.stringify(Project.Serialize(project))))

    expect(back.IsComplicated).toBe(true)
    expect(back.Progress).toBe(3)
    expect(back.Requirements).toEqual(['parts'])
  })
})

describe('NarrativeController', () => {
  it('round-trips its narrative block', () => {
    const character = new Character()
    character.NarrativeController.AddClock()

    const target: any = {}
    NarrativeController.Serialize(character, target)

    const other = new Character()
    NarrativeController.Deserialize(other, target.narrative)

    expect(other.NarrativeController.Clocks).toHaveLength(1)
  })
})

describe('assertController', () => {
  it('passes for a controller that exists', () => {
    expect(() => assertController({}, 'TestController')).not.toThrow()
  })

  it('throws a named error for a missing controller', () => {
    expect(() => assertController(undefined, 'TestController')).toThrow('TestController')
  })
})

describe('equipment resolution helpers', () => {
  it('resolves an id the compendium knows', () => {
    const weaponId = CompendiumStore().MechWeapons.find(w => !w.IsHidden)!.ID

    expect(resolveIntegratedEquipment([weaponId])[0].ID).toBe(weaponId)
    expect(resolveSpecialEquipment([weaponId])[0].ID).toBe(weaponId)
  })

  it('leaves a falsy hole for an id it cannot resolve, rather than dropping it', () => {
    expect(resolveSpecialEquipment(['nope'])).toEqual([false])
    expect(resolveIntegratedEquipment(['nope'])).toEqual([undefined])
  })

  it('is empty for no ids', () => {
    expect(resolveSpecialEquipment([])).toEqual([])
    expect(resolveIntegratedEquipment([])).toEqual([])
    expect(resolveSpecialEquipment(null as never)).toEqual([])
  })
})

describe('campaign data containers', () => {
  it('serialize their contents', () => {
    const campaign = new Campaign()

    expect(
      EncounterDataContainer.Serialize(new EncounterDataContainer(campaign as never))
    ).toBeTruthy()
    expect(
      NarrativeDataContainer.Serialize(new NarrativeDataContainer(campaign as never))
    ).toBeTruthy()
  })
})
