import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import manifest from './canonical-rules.json'
import interactions from './interaction-rules.json'

const here = dirname(fileURLToPath(import.meta.url))

type Spec = { name: string; modifier: string }

const specs = (): Spec[] => {
  const out: Spec[] = []
  for (const file of readdirSync(here)) {
    if (!file.endsWith('.spec.ts') || file === 'coverage.spec.ts') continue
    const src = readFileSync(join(here, file), 'utf8')
    for (const m of src.matchAll(/\b(?:it|test)(\.\w+)?\(\s*(['"`])(.+?)\2/g)) {
      out.push({ name: m[3], modifier: m[1] ?? '' })
    }
  }
  return out
}

describe('canonical rule coverage', () => {
  const all = specs()
  const names = all.map(s => s.name)
  const idOf = (n: string) => /^(T-[A-Z]+-[a-z_]+-\d+)\s*:/.exec(n)?.[1]
  const covered = new Set(names.map(idOf).filter(Boolean) as string[])
  const active = new Set(
    all.filter(s => s.modifier === '').map(s => idOf(s.name)).filter(Boolean) as string[]
  )

  it('every canonical rule has at least one test', () => {
    const missing = manifest.rules.map(r => r.id).filter(id => !covered.has(id))
    expect(missing, `${missing.length} of ${manifest.rules.length} canonical rules have no test`).toEqual([])
  })

  it('every rule-prefixed test names a rule that exists', () => {
    const known = new Set([
      ...manifest.rules.map(r => r.id),
      ...interactions.rules.map(r => r.id),
    ])
    expect([...covered].filter(id => !known.has(id))).toEqual([])
  })

  it('every interaction rule has at least one test', () => {
    const missing = interactions.rules.map(r => r.id).filter(id => !covered.has(id))
    expect(missing, `${missing.length} of ${interactions.rules.length} interaction rules have no test`).toEqual([])
  })

  it('every interaction rule composes canonical rules that exist', () => {
    const known = new Set(manifest.rules.map(r => r.id))
    const dangling = interactions.rules.flatMap(r => r.composes.filter(c => !known.has(c)))
    expect(dangling).toEqual([])
  })

  it('every test in this directory is prefixed with a rule id', () => {
    const unprefixed = names.filter(n => !/^T-[A-Z]+-[a-z_]+-\d+\s*:/.test(n))
    expect(unprefixed).toEqual([])
  })

  it('every rule the audit calls correct has a running test', () => {
    const shouldRun = manifest.rules.filter(r => r.status === 'MATCH').map(r => r.id)
    expect(shouldRun.filter(id => !active.has(id))).toEqual([])
  })

  it('every rule the audit calls broken has at least one pending test', () => {
    const pending = new Set(
      all.filter(s => s.modifier !== '').map(s => idOf(s.name)).filter(Boolean) as string[]
    )
    const broken = manifest.rules.filter(r => r.status !== 'MATCH').map(r => r.id)
    expect(broken.filter(id => !pending.has(id))).toEqual([])
  })
})
