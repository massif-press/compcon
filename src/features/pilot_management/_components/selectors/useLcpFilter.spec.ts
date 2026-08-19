import { describe, it, expect } from 'vitest'
import { filterByLcpConfig } from './useLcpFilter'

const core = { name: 'Everest', InLcp: false }
const brewed = (id: string, name: string) => ({
  name,
  InLcp: true,
  Brew: { LcpId: id, LcpName: name },
})

describe('filterByLcpConfig', () => {
  it('returns everything when there is no config', () => {
    const items = [core, brewed('lcp1', 'Pack One')]

    expect(filterByLcpConfig(items, null)).toEqual(items)
    expect(filterByLcpConfig(items, undefined)).toEqual(items)
  })

  it('copies rather than returning the same array', () => {
    const items = [core]
    expect(filterByLcpConfig(items, null)).not.toBe(items)
  })

  it('always keeps core content', () => {
    expect(filterByLcpConfig([core], { packList: [] })).toEqual([core])
  })

  it('keeps brewed content whose pack is enabled by id', () => {
    const pack = brewed('lcp1', 'Pack One')

    expect(filterByLcpConfig([pack], { packList: [{ packID: 'lcp1' }] })).toEqual([pack])
  })

  it('keeps brewed content whose pack is enabled by name', () => {
    const pack = brewed('lcp1', 'Pack One')

    expect(filterByLcpConfig([pack], { packList: [{ packName: 'Pack One' }] })).toEqual([pack])
  })

  it('drops brewed content from a pack that is not enabled', () => {
    expect(
      filterByLcpConfig([brewed('lcp1', 'Pack One')], { packList: [{ packID: 'other' }] })
    ).toEqual([])
  })

  it('reads the brew fields off the item itself when there is no Brew block', () => {
    const item = { name: 'x', InLcp: true, LcpId: 'lcp1', LcpName: 'Pack One' }

    expect(filterByLcpConfig([item], { packList: [{ packID: 'lcp1' }] })).toEqual([item])
  })
})
