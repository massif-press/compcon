import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeNpc } from '@/__tests__/factories'
import { FolderController } from './folder/FolderController'
import { PortraitController } from './portrait/PortraitController'
import { MechSkillsController } from './mechskills/MechSkillsController'
import MechSkills from './mechskills/MechSkills'
import { BrewController } from './brew/BrewController'
import { CounterController } from './combat/counters/CounterController'
import { HASE } from '@/classes/enums'
import { Rules } from '@/classes/utility/Rules'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

beforeEach(() => {
  pilot = makePilot({ level: 4 })
})

describe('FolderController', () => {
  it('defaults to no folder', () => {
    const npc = makeNpc()

    expect(npc.FolderController.Folder).toBe('')
    expect(npc.FolderController.SortIndex).toBe(0)
  })

  it('round-trips folder and sort index', () => {
    const npc = makeNpc()
    npc.FolderController.Folder = 'Squad A'
    npc.FolderController.SortIndex = 3

    const target: any = {}
    FolderController.Serialize(npc, target)

    const other = makeNpc()
    FolderController.Deserialize(other, target.folder)

    expect(other.FolderController.Folder).toBe('Squad A')
    expect(other.FolderController.SortIndex).toBe(3)
  })

  it('loads an item that was never filed', () => {
    const other = makeNpc()
    FolderController.Deserialize(other, undefined as never)

    expect(other.FolderController.Folder).toBe('')
    expect(other.FolderController.SortIndex).toBe(0)
  })
})

describe('PortraitController', () => {
  it('reports no image on a new pilot', () => {
    expect(pilot.PortraitController.HasImage).toBe(false)
  })

  it('takes a local image', () => {
    pilot.PortraitController.SetLocalImage('portrait.png')

    expect(pilot.PortraitController.HasImage).toBe(true)
    expect(pilot.PortraitController.LocalImage).toBe('portrait.png')
  })

  it('prefers a cloud image when both are set', () => {
    pilot.PortraitController.SetLocalImage('local.png')
    pilot.PortraitController.SetCloudImage('https://cloud/img.png')

    expect(pilot.PortraitController.CloudImage).toBe('https://cloud/img.png')
    expect(pilot.PortraitController.Image).toBe('https://cloud/img.png')
  })

  it('clears back to no image', () => {
    pilot.PortraitController.SetLocalImage('local.png')
    pilot.PortraitController.Clear()

    expect(pilot.PortraitController.HasImage).toBe(false)
  })

  it('offers the local portrait as a fallback only when a cloud image is also set', () => {
    pilot.PortraitController.SetLocalImage('local.png')
    expect(pilot.PortraitController.FallbackPortrait).toBe('')

    pilot.PortraitController.SetCloudImage('https://cloud/img.png')
    expect(pilot.PortraitController.FallbackPortrait).toBe('local.png')
  })

  it('round-trips the image block', () => {
    pilot.PortraitController.SetLocalImage('local.png')
    pilot.PortraitController.SetCloudImage('https://cloud/img.png')

    const target: any = {}
    PortraitController.Serialize(pilot, target)

    const other = makePilot()
    PortraitController.Deserialize(other, target.img)

    expect(other.PortraitController.LocalImage).toBe('local.png')
    expect(other.PortraitController.CloudImage).toBe('https://cloud/img.png')
  })

  it('loads an item with no image data', () => {
    const other = makePilot()
    expect(() => PortraitController.Deserialize(other, undefined as never)).not.toThrow()
  })
})

describe('MechSkills', () => {
  it('starts at zero and sums', () => {
    const skills = new MechSkills()

    expect(skills.Sum).toBe(0)

    skills.Increment(HASE.H)
    skills.Increment(HASE.A)

    expect(skills.Hull).toBe(1)
    expect(skills.Sum).toBe(2)
  })

  it('decrements and resets', () => {
    const skills = new MechSkills([2, 2, 2, 2])

    skills.Decrement(HASE.S)
    expect(skills.Sys).toBe(1)

    skills.Reset()
    expect(skills.Sum).toBe(0)
  })

  it('round-trips as a four number array', () => {
    const data = MechSkills.Serialize(new MechSkills([1, 2, 3, 4]))

    expect(data).toEqual([1, 2, 3, 4])
    expect(MechSkills.Deserialize(data).Eng).toBe(4)
  })
})

describe('MechSkillsController', () => {
  const hase = () => pilot.MechSkillsController

  it('grants points from the pilot level', () => {
    expect(hase().MaxHASEPoints).toBe(Rules.MinimumMechSkills + 4)
    expect(hase().CurrentHASEPoints).toBe(0)
    expect(hase().IsMissingHASE).toBe(true)
  })

  it('tracks the remaining points as skills are taken', () => {
    const before = hase().HASERemaining

    hase().Increment(HASE.H)

    expect(hase().Hull).toBe(1)
    expect(hase().HASERemaining).toBe(before - 1)
  })

  it('resets every skill', () => {
    hase().Increment(HASE.H)
    hase().Increment(HASE.A)

    hase().Reset()

    expect(hase().CurrentHASEPoints).toBe(0)
  })

  it('round-trips the HASE block', () => {
    hase().Hull = 2
    hase().Eng = 1

    const target: any = {}
    MechSkillsController.Serialize(pilot, target)

    const other = makePilot()
    MechSkillsController.Deserialize(other, target)

    expect(other.MechSkillsController.Hull).toBe(2)
    expect(other.MechSkillsController.Eng).toBe(1)
  })
})

describe('BrewController', () => {
  it('reports no error for a pilot built from core content', () => {
    expect(pilot.BrewController.HasError).toBe(false)
  })

  it('round-trips the brew list', () => {
    const target: any = {}
    BrewController.Serialize(pilot, target)

    expect(Array.isArray(target.brews)).toBe(true)

    const other = makePilot()
    BrewController.Deserialize(other, target)

    expect(other.BrewController.Brews).toEqual(pilot.BrewController.Brews)
  })
})

describe('CounterController', () => {
  it('round-trips counter data', () => {
    const target: any = {}
    CounterController.Serialize(pilot.CombatController, target)

    expect(target).toHaveProperty('counter_data')
    expect(target).toHaveProperty('custom_counters')

    const other = makePilot()
    expect(() => CounterController.Deserialize(other.CombatController, target)).not.toThrow()
  })
})
