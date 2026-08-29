import { describe, it, expect } from 'vitest'
import { makePilot } from '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'
import { PilotLicense } from './PilotLicense'
import License from './License'

void makePilot

const licensedFrame = () => CompendiumStore().Frames.find(f => f.LicenseLevel !== 0 && !f.IsHidden)!
const pilotLicense = (rank?: number) =>
  new PilotLicense(License.Deserialize(licensedFrame().ID), rank)

describe('PilotLicense', () => {
  it('starts at rank 1', () => {
    expect(pilotLicense().Rank).toBe(1)
  })

  it('describes itself with source, name, and rank', () => {
    const l = pilotLicense(2)
    expect(l.ToString()).toContain('Rank 2')
    expect(l.ToString()).toContain(l.License!.Name)
  })

  it('increments up to the license maximum', () => {
    const l = pilotLicense()
    const max = l.License!.MaxRank

    while (l.Rank < max) expect(l.Increment()).toBe(true)

    expect(l.Rank).toBe(max)
    expect(l.Increment()).toBe(false)
  })

  it('decrements down to rank 1', () => {
    const l = pilotLicense(2)

    expect(l.Decrement()).toBe(true)
    expect(l.Rank).toBe(1)
    expect(l.Decrement()).toBe(false)
  })
})

describe('PilotLicense.Serialize/Deserialize', () => {
  it('round-trips a compendium license', () => {
    const back = PilotLicense.Deserialize(PilotLicense.Serialize(pilotLicense(2)))

    expect(back.License?.FrameID).toBe(licensedFrame().ID)
    expect(back.Rank).toBe(2)
  })

  it('keeps a stub so an uninstalled license still shows its name', () => {
    const data = PilotLicense.Serialize(pilotLicense(3))
    expect(data.stub).toBeTruthy()

    const back = PilotLicense.Deserialize({ ...data, id: 'mf_uninstalled' })

    expect(back.License).toBeUndefined()
    expect(back.Rank).toBe(3)
    expect(back.Stub.Name).toBe(data.stub!.name)
    expect(back.ToString()).toContain('Rank 3')
  })

  it('falls back to an unknown-license stub with nothing to go on', () => {
    const bare = new PilotLicense()

    expect(bare.Stub.Source).toBe('ERR')
    expect(bare.Rank).toBe(1)
  })
})
