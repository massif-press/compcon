const raw = import.meta.glob('./fixtures/*.{pilot,mech,npc,encounter,json}', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

export type FixtureKind = 'pilot' | 'npc' | 'encounter'
export type FixtureVersion = 'v2' | 'v3'
export type Fixture = { name: string; kind: FixtureKind; version: FixtureVersion; data: any }

function classify(data: any): { kind: FixtureKind; version: FixtureVersion } | null {
  if (!data || typeof data !== 'object') return null

  if (Array.isArray(data)) {
    return data[0]?.npcs !== undefined ? { kind: 'encounter', version: 'v2' } : null
  }

  if (data.itemType === 'pilot') return { kind: 'pilot', version: 'v3' }
  if (data.itemType === 'Encounter') return { kind: 'encounter', version: 'v3' }
  if (data.npcType) return { kind: 'npc', version: 'v3' }

  if (data.callsign !== undefined) return { kind: 'pilot', version: 'v2' }
  if (data.cc_ver !== undefined || (typeof data.class === 'string' && data.items !== undefined))
    return { kind: 'npc', version: 'v2' }
  if (Array.isArray(data.npcs)) return { kind: 'encounter', version: 'v2' }

  return null
}

const all: Fixture[] = Object.entries(raw)
  .map(([path, text]) => {
    const parsed = JSON.parse(text)
    const data = parsed?.EXPORT_TYPE ? parsed.data : parsed
    const classified = classify(data)
    if (!classified) return null
    return { name: path.split('/').pop() as string, data, ...classified }
  })
  .filter((f): f is Fixture => f !== null)

export function fixtures(kind: FixtureKind, version?: FixtureVersion): Fixture[] {
  return all.filter(f => f.kind === kind && (!version || f.version === version))
}

export const missingFixtures = (kind: string) =>
  `no ${kind} fixtures in src/__tests__/fixtures/ — drop real exports there (see its README)`
