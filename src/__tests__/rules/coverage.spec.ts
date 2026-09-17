import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import source from './lancer-rules.json'

const here = dirname(fileURLToPath(import.meta.url))

type Spec = { name: string; modifier: string }

const ruleFiles = () =>
  readdirSync(here).filter(f => f.endsWith('.spec.ts') && f !== 'coverage.spec.ts')

const specs = (): Spec[] => {
  const out: Spec[] = []
  for (const file of ruleFiles()) {
    const src = readFileSync(join(here, file), 'utf8')
    for (const m of src.matchAll(/\b(?:it|test)(\.\w+)?\(\s*(['"`])(.+?)\2/g)) {
      out.push({ name: m[3], modifier: m[1] ?? '' })
    }
  }
  return out
}

const suiteModifiers = (): string[] => {
  const out: string[] = []
  for (const file of ruleFiles()) {
    const src = readFileSync(join(here, file), 'utf8')
    for (const m of src.matchAll(/\bdescribe(\.\w+)\(/g)) out.push(`${file}: describe${m[1]}`)
  }
  return out
}

describe('rule coverage', () => {
  const all = specs()
  const rules = source.rules
  const interactions = source.interactions
  const names = all.map(s => s.name)
  const idOf = (n: string) => /^(T-[A-Z]+-[a-z_]+-\d+)\s*:/.exec(n)?.[1]
  const running = new Set(
    all
      .filter(s => s.modifier === '')
      .map(s => idOf(s.name))
      .filter(Boolean) as string[]
  )

  it('every rule has a running test', () => {
    const missing = rules.map(r => r.id).filter(id => !running.has(id))
    expect(missing, `${missing.length} of ${rules.length} rules have no running test`).toEqual([])
  })

  it('every interaction rule has a running test', () => {
    const missing = interactions.map(r => r.id).filter(id => !running.has(id))
    expect(
      missing,
      `${missing.length} of ${interactions.length} interaction rules have no running test`
    ).toEqual([])
  })

  it('every rule-prefixed test names a rule that exists', () => {
    const known = new Set([...rules.map(r => r.id), ...interactions.map(r => r.id)])
    const covered = new Set(names.map(idOf).filter(Boolean) as string[])
    expect([...covered].filter(id => !known.has(id))).toEqual([])
  })

  it('every interaction rule composes rules that exist', () => {
    const known = new Set(rules.map(r => r.id))
    const dangling = interactions.flatMap(r => r.composes.filter(c => !known.has(c)))
    expect(dangling).toEqual([])
  })

  it('has no suite-level modifier, which would hide skipped tests from this gate', () => {
    expect(suiteModifiers()).toEqual([])
  })

  it('every test in this directory is prefixed with a rule id', () => {
    const unprefixed = names.filter(n => !/^T-[A-Z]+-[a-z_]+-\d+\s*:/.test(n))
    expect(unprefixed).toEqual([])
  })
})
