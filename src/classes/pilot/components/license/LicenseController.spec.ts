import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot } from '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'
import { LicenseController } from './LicenseController'
import License from './License'
import { ItemType } from '@/classes/enums'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

const licenses = () => pilot.LicenseController
const licensedFrames = () =>
  CompendiumStore().Frames.filter(f => f.LicenseLevel !== 0 && !f.IsHidden)
const license = (i = 0) => License.Deserialize(licensedFrames()[i].ID)

beforeEach(() => {
  pilot = makePilot({ level: 4 })
})

describe('LicenseController points', () => {
  it('grants one point per pilot level', () => {
    expect(licenses().MaxLicensePoints).toBe(4)
  })

  it('counts ranks, not entries', () => {
    licenses().AddLicense(license())
    licenses().AddLicense(license())

    expect(licenses().Licenses).toHaveLength(1)
    expect(licenses().CurrentLicensePoints).toBe(2)
    expect(licenses().IsMissingLicenses).toBe(true)
  })
})

describe('LicenseController.AddLicense', () => {
  it('adds at rank 1 then increments', () => {
    licenses().AddLicense(license())
    expect(licenses().Licenses[0].Rank).toBe(1)

    licenses().AddLicense(license())
    expect(licenses().Licenses[0].Rank).toBe(2)
  })

  it('reports a rank by license name, and 0 when absent', () => {
    licenses().AddLicense(license())

    expect(licenses().getLicenseRank(license().Name)).toBe(1)
    expect(licenses().getLicenseRank('Not A License')).toBe(0)
  })

  it('sums ranks per manufacturer', () => {
    const l = license()
    licenses().AddLicense(l)
    licenses().AddLicense(l)

    expect(licenses().LicenseLevel(l.Source)).toBe(2)
    expect(licenses().LicenseLevel('NOT_A_MANUFACTURER')).toBe(0)
  })
})

describe('LicenseController.RemoveLicense', () => {
  it('decrements before removing', () => {
    licenses().AddLicense(license())
    licenses().AddLicense(license())

    licenses().RemoveLicense(license())
    expect(licenses().Licenses[0].Rank).toBe(1)

    licenses().RemoveLicense(license())
    expect(licenses().Licenses).toEqual([])
  })

  it('survives removing something the pilot does not have', () => {
    expect(() => licenses().RemoveLicense(license())).not.toThrow()
  })

  it('clears everything', () => {
    licenses().AddLicense(license(0))
    licenses().AddLicense(license(1))

    licenses().ClearLicenses()

    expect(licenses().Licenses).toEqual([])
  })
})

describe('LicenseController.LicensedItems', () => {
  it('unlocks the frame gear a taken license covers', () => {
    licenses().AddLicense(license())
    const items = licenses().LicensedItems

    expect(items.length).toBeGreaterThan(0)
  })

  it('filters allowed items by type', () => {
    licenses().AddLicense(license())
    const frames = licenses().AllowedItems(ItemType.Frame)

    expect(frames.every(f => f.ItemType === ItemType.Frame)).toBe(true)
  })
})

describe('LicenseController.Serialize/Deserialize', () => {
  it('round-trips the license sheet', () => {
    licenses().AddLicense(license(0))
    licenses().AddLicense(license(0))
    licenses().AddLicense(license(1))

    const target: any = {}
    LicenseController.Serialize(pilot, target)

    const other = makePilot()
    LicenseController.Deserialize(other, target)

    expect(other.LicenseController.Licenses.map(l => [l.License?.FrameID, l.Rank])).toEqual(
      licenses().Licenses.map(l => [l.License?.FrameID, l.Rank])
    )
  })

  it('reports a license whose frame is gone as missing', () => {
    licenses().AddLicense(license())

    const target: any = {}
    LicenseController.Serialize(pilot, target)
    target.licenses[0].id = 'mf_uninstalled'

    const other = makePilot()
    LicenseController.Deserialize(other, target)

    expect(other.LicenseController.MissingLicenses).toHaveLength(1)
  })
})
