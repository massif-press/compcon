import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getLancerData, collect } from './compendium/store/compendiumUtils'
import { useLcpFilter } from './pilot_management/_components/loadout/mech_loadout/components/_composables/useLcpFilter'
import { useGroupSortable } from './pilot_management/Roster/components/useGroupSortable'
import PilotSheet from './pilot_management/store/PilotSheet'
import { makePilot, makeMech } from '@/__tests__/factories'
import { Frame } from '@/classes/mech/components/frame/Frame'
import { computed, ref } from 'vue'

describe('getLancerData', () => {
  it('reads a collection straight out of lancer-data', () => {
    expect(getLancerData('frames').length).toBeGreaterThan(0)
  })

  it('hydrates into classes when given a constructor', () => {
    expect(getLancerData('frames', Frame)[0]).toBeInstanceOf(Frame)
  })

  it('caches, so repeated reads hand back the same array', () => {
    expect(getLancerData('frames')).toBe(getLancerData('frames'))
  })

  it('is empty for a collection lancer-data does not ship', () => {
    expect(getLancerData('not_a_collection')).toEqual([])
  })
})

describe('collect', () => {
  it('returns core data when no packs are active', () => {
    expect(collect([], 'frames').length).toBe(getLancerData('frames').length)
  })

  it('appends the contents of active packs', () => {
    const pack = {
      Active: true,
      Frames: [{ id: 'mf_test' }],
    } as never

    expect(collect([pack], 'frames').length).toBe(getLancerData('frames').length + 1)
  })

  it('ignores inactive packs', () => {
    const pack = { Active: false, Frames: [{ id: 'mf_test' }] } as never

    expect(collect([pack], 'frames').length).toBe(getLancerData('frames').length)
  })
})

describe('useLcpFilter (mech loadout)', () => {
  const core = { InLcp: false }
  const brewed = { InLcp: true, Brew: { LcpId: 'lcp1', LcpName: 'Pack One' } }

  it('returns everything when the pilot has no pack config', () => {
    const pilot = makePilot()
    const mech = makeMech(pilot)

    const { filterByLcp } = useLcpFilter(ref(mech) as never)

    expect(filterByLcp([core, brewed])).toHaveLength(2)
  })

  it('keeps core content and drops packs the pilot has not enabled', () => {
    const pilot = makePilot()
    const mech = makeMech(pilot)
    ;(pilot as any)._lcpConfig = { packList: [{ packID: 'other' }] }

    const { filterByLcp } = useLcpFilter(ref(mech) as never)

    expect(filterByLcp([core, brewed])).toEqual([core])
  })

  it('keeps a pack the pilot enabled', () => {
    const pilot = makePilot()
    const mech = makeMech(pilot)
    ;(pilot as any)._lcpConfig = { packList: [{ packID: 'lcp1' }] }

    const { filterByLcp } = useLcpFilter(ref(mech) as never)

    expect(filterByLcp([core, brewed])).toHaveLength(2)
  })
})

describe('useGroupSortable', () => {
  it('wires up drag state for a roster group', () => {
    const api = useGroupSortable(
      { ID: 'group-1', Pilots: [] },
      computed(() => []) as never,
      ref(''),
      { value: false },
      { value: false },
      { value: 0 },
      vi.fn()
    )

    expect(api).toBeTruthy()
    expect(typeof api.onPointerDown).toBe('function')
  })
})

describe('PilotSheet', () => {
  let pilot: ReturnType<typeof makePilot>

  beforeEach(() => {
    pilot = makePilot({ name: 'Nelson', callsign: 'HAMMER' })
    makeMech(pilot)
  })

  it('wraps a pilot for active mode and round-trips', () => {
    const sheet = PilotSheet.FromPilot(pilot)

    const back = PilotSheet.Deserialize(JSON.parse(JSON.stringify(PilotSheet.Serialize(sheet))))

    expect(back.ID).toBe(sheet.ID)
    expect(back.Name).toBe(sheet.Name)
    expect(back.Combatant.actor.Callsign).toBe('HAMMER')
  })

  it('copies the pilot rather than holding the roster object', () => {
    const sheet = PilotSheet.FromPilot(pilot)

    expect(sheet.Combatant.actor).not.toBe(pilot)
    expect(sheet.Combatant.actor.ID).toBe(pilot.ID)
  })
})
