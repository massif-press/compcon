import { describe, it, expect } from 'vitest'
import JSZip from 'jszip'
import { parseContentPack, getBundledPatches } from './ContentPackParser'

const manifest = {
  name: 'Test Pack',
  author: 'Tester',
  version: '1.0.0',
  item_prefix: 'tp',
}

async function lcp(files: Record<string, unknown>): Promise<string> {
  const zip = new JSZip()
  for (const [name, content] of Object.entries(files)) {
    zip.file(name, typeof content === 'string' ? content : JSON.stringify(content))
  }
  return zip.generateAsync({ type: 'binarystring' })
}

describe('parseContentPack manifest validation', () => {
  it('rejects a zip with no manifest', async () => {
    await expect(parseContentPack(await lcp({ 'tags.json': [] }))).rejects.toThrow(
      'Content pack has no manifest'
    )
  })

  it('rejects a manifest missing required fields', async () => {
    const bad = await lcp({ 'lcp_manifest.json': { name: 'x', author: 'y' } })
    await expect(parseContentPack(bad)).rejects.toThrow('Content manifest is invalid')
  })

  it('derives a stable id from author and name', async () => {
    const a = await parseContentPack(await lcp({ 'lcp_manifest.json': manifest }))
    const b = await parseContentPack(await lcp({ 'lcp_manifest.json': manifest }))
    const other = await parseContentPack(
      await lcp({ 'lcp_manifest.json': { ...manifest, author: 'Someone Else' } })
    )
    expect(a.id).toBe(b.id)
    expect(a.id).not.toBe(other.id)
  })

  it('parses to an inactive pack', async () => {
    const pack = await parseContentPack(await lcp({ 'lcp_manifest.json': manifest }))
    expect(pack.active).toBe(false)
    expect(pack.manifest.name).toBe('Test Pack')
  })
})

describe('parseContentPack id generation', () => {
  it('generates a prefixed id from the name when one is absent', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'frames.json': [{ name: 'Test Frame Mk-II!' }],
      })
    )
    expect(pack.data.frames[0].id).toBe('tp__mf_test_frame_mk_ii')
  })

  it('keeps an id the author supplied', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'weapons.json': [{ id: 'mw_custom', name: 'Custom' }],
      })
    )
    expect(pack.data.weapons[0].id).toBe('mw_custom')
  })

  it('does not generate ids for actions or statuses', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'statuses.json': [{ name: 'Wired', type: 'Status', icon: '', effects: [] }],
      })
    )
    expect(pack.data.statuses[0]).not.toHaveProperty('id')
  })
})

describe('parseContentPack license collections', () => {
  it('routes license members to weapons, mods, and systems by shape', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'license_test.json': [
          { id: 'mf_test', name: 'Test Frame', mechtype: ['Striker'], source: 'TP' },
          { id: 'mw_test', name: 'Test Gun', mount: 'Main' },
          { id: 'wm_test', name: 'Test Mod', allowed_types: ['Rifle'] },
          { id: 'ms_test', name: 'Test System' },
        ],
      })
    )

    expect(pack.data.frames.map(f => f.id)).toEqual(['mf_test'])
    expect(pack.data.weapons.map(w => w.id)).toEqual(['mw_test'])
    expect(pack.data.mods.map(m => m.id)).toEqual(['wm_test'])
    expect(pack.data.systems.map(s => s.id)).toEqual(['ms_test'])
  })

  it('back-fills license, source, and origin from the frame', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'license_test.json': [
          { id: 'mf_test', name: 'Test Frame', mechtype: ['Striker'], source: 'TP' },
          { id: 'ms_test', name: 'Test System' },
        ],
      })
    )

    const system = pack.data.systems[0] as any
    expect(system.license).toBe('Test Frame')
    expect(system.license_id).toBe('mf_test')
    expect(system.source).toBe('TP')
    expect(system.origin).toBe('mf_test')
  })

  it('ignores a license file with no frame in it', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'license_orphan.json': [{ id: 'ms_orphan', name: 'Orphan' }],
      })
    )
    expect(pack.data.systems).toHaveLength(0)
  })
})

describe('parseContentPack NPC collections', () => {
  it('splits an npcc_ collection into a class and its features', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'npcc_test.json': [
          { id: 'npcc_test', name: 'Tester', role: 'striker' },
          { id: 'npcf_test', name: 'Test Feature' },
        ],
      })
    )
    expect(pack.data.npcClasses.map(c => c.id)).toEqual(['npcc_test'])
    expect(pack.data.npcFeatures).toHaveLength(1)
    expect((pack.data.npcFeatures[0] as any).origin).toBe('npcc_test')
  })

  it('splits an npct_ collection into a template and its features', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'npct_test.json': [
          { id: 'npct_test', name: 'Elite', template: true },
          { id: 'npcf_elite', name: 'Elite Feature' },
        ],
      })
    )
    expect(pack.data.npcTemplates.map(t => t.id)).toEqual(['npct_test'])
    expect((pack.data.npcFeatures[0] as any).origin).toBe('npct_test')
  })

  it('files an unattached feature under no-origin', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'npc_features.json': [{ id: 'npcf_loose', name: 'Loose' }],
      })
    )
    expect((pack.data.npcFeatures[0] as any).origin).toBe('no-origin')
  })
})

describe('parseContentPack eidolon layers', () => {
  it('appends the core layer only when the pack ships layers', async () => {
    const without = await parseContentPack(await lcp({ 'lcp_manifest.json': manifest }))
    expect(without.data.eidolonLayers).toHaveLength(0)

    const withLayers = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'eidolon_layers.json': [{ id: 'el_test', name: 'Test Layer' }],
      })
    )
    expect(withLayers.data.eidolonLayers).toHaveLength(2)
  })
})

describe('parseContentPack resilience', () => {
  it('skips a corrupt data file instead of failing the whole pack', async () => {
    const pack = await parseContentPack(
      await lcp({
        'lcp_manifest.json': manifest,
        'tags.json': '{not json',
        'frames.json': [{ id: 'mf_ok', name: 'OK' }],
      })
    )
    expect(pack.data.tags).toEqual([])
    expect(pack.data.frames).toHaveLength(1)
  })

  it('defaults every collection to an empty array', async () => {
    const pack = await parseContentPack(await lcp({ 'lcp_manifest.json': manifest }))
    for (const [key, value] of Object.entries(pack.data)) {
      expect(Array.isArray(value), `${key} should be an array`).toBe(true)
      expect(value).toHaveLength(0)
    }
  })
})

describe('getBundledPatches', () => {
  it('returns only the .llp entries', async () => {
    const patches = await getBundledPatches(
      await lcp({
        'lcp_manifest.json': manifest,
        'de.llp': { locale: 'de', entries: {} },
        'notes.txt': 'ignored',
      })
    )
    expect(patches).toEqual([{ locale: 'de', entries: {} }])
  })

  it('skips a corrupt patch', async () => {
    const patches = await getBundledPatches(
      await lcp({ 'lcp_manifest.json': manifest, 'broken.llp': '{not json' })
    )
    expect(patches).toEqual([])
  })
})
