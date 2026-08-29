import { describe, it, expect } from 'vitest'
import JSZip from 'jszip'
import { ContentPack } from './ContentPack'
import { parseContentPack } from '@/io/ContentPackParser'
import { CompendiumStore } from '@/features/compendium/store'

const manifest = {
  name: 'Test Pack',
  author: 'Tester',
  version: '1.0.0',
  item_prefix: 'tp',
}

async function lcp(files: Record<string, unknown>): Promise<string> {
  const zip = new JSZip()
  zip.file('lcp_manifest.json', JSON.stringify(manifest))
  for (const [name, content] of Object.entries(files)) zip.file(name, JSON.stringify(content))
  return zip.generateAsync({ type: 'binarystring' })
}

const pack = async (files: Record<string, unknown> = {}) =>
  new ContentPack(await parseContentPack(await lcp(files)))

const frameData = () => ({
  ...(CompendiumStore().Frames.find(f => !f.IsHidden)!.ItemData as unknown as Record<
    string,
    unknown
  >),
  id: 'mf_test',
  name: 'Test Frame',
})

describe('ContentPack manifest', () => {
  it('reads name, author, and version off the manifest', async () => {
    const p = await pack()

    expect(p.Name).toBe('Test Pack')
    expect(p.Author).toBe('Tester')
    expect(p.Version).toBe('1.0.0')
  })

  it('is inactive until installed', async () => {
    expect((await pack()).Active).toBe(false)
  })
})

describe('ContentPack.SetActive', () => {
  it('toggles activation', async () => {
    const p = await pack()

    p.SetActive(true)
    expect(p.Active).toBe(true)

    p.SetActive(false)
    expect(p.Active).toBe(false)
  })

  it('hides the pack contents while inactive and reveals them when active', async () => {
    const p = await pack({ 'frames.json': [frameData()] })

    expect(p.Frames[0].IsHidden).toBe(true)

    p.SetActive(true)
    expect(p.Frames[0].IsHidden).toBe(false)
  })
})

describe('ContentPack contents', () => {
  it('hydrates the collections it was given', async () => {
    const p = await pack({
      'frames.json': [frameData()],
      'statuses.json': [{ id: 'st_test', name: 'Wired', type: 'Status', icon: '', effects: [] }],
    })

    expect(p.Frames.map(f => f.Name)).toEqual(['Test Frame'])
    expect(p.Statuses.map(s => s.Name)).toEqual(['Wired'])
  })

  it('leaves every other collection empty', async () => {
    const p = await pack()

    expect(p.Frames).toEqual([])
    expect(p.MechWeapons).toEqual([])
    expect(p.NpcClasses).toEqual([])
  })

  it('indexes its items for search', async () => {
    const p = await pack({ 'frames.json': [frameData()] })
    expect(p.GetIndexItems().length).toBeGreaterThan(0)
  })
})

describe('ContentPack.Serialize', () => {
  it('round-trips through the constructor', async () => {
    const p = await pack({ 'frames.json': [frameData()] })
    p.SetActive(true)

    const once = p.Serialize()
    const back = new ContentPack(JSON.parse(JSON.stringify(once)))

    expect(back.Serialize()).toEqual(once)
    expect(back.ID).toBe(p.ID)
    expect(back.Frames.map(f => f.ID)).toEqual(p.Frames.map(f => f.ID))
  })

  it('records the active flag', async () => {
    const p = await pack()
    p.SetActive(true)
    expect(p.Serialize().active).toBe(true)
  })
})
