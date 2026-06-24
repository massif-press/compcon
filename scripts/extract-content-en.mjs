#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _require = createRequire(import.meta.url)
const data = _require('@massif/lancer-data')
const { version: lancerDataVersion } = _require('@massif/lancer-data/package.json')

const ALLOWLIST = {
  actions: ['name', 'terse', 'detail'],
  backgrounds: ['name', 'description'],
  core_bonuses: ['name', 'description', 'effect', 'mounted_effect'],
  environments: ['name', 'description'],
  frames: ['name', 'description'],
  manufacturers: ['name', 'description', 'quote'],
  mods: ['name', 'description', 'effect'],
  pilot_gear: ['name', 'description', 'effect'],
  reserves: ['name', 'description'],
  sitreps: ['name', 'description', 'objective', 'deployment', 'controlZone', 'extraction'],
  skills: ['name', 'description', 'detail'],
  statuses: ['name', 'terse', 'effects'],
  systems: ['name', 'description', 'effect'],
  tags: ['name', 'description'],
  talents: ['name', 'terse', 'description'],
  weapons: ['name', 'description'],
  downtime_actions: ['name', 'terse', 'detail'],
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'content/en')
const metaPath = resolve(root, 'content/_meta.json')

mkdirSync(outDir, { recursive: true })

const meta = {
  lancerDataVersion,
  extractedAt: new Date().toISOString(),
  collections: {},
}

for (const [collection, fields] of Object.entries(ALLOWLIST)) {
  const items = data[collection] ?? []
  const catalog = {}

  for (const item of items) {
    if (!item.id) {
      console.warn(`[${collection}] item without id skipped:`, item.name ?? '?')
      continue
    }
    for (const field of fields) {
      const val = item[field]
      if (val == null || val === '') continue
      const str = Array.isArray(val) ? val.join('\n') : String(val)
      if (!str.trim()) continue
      catalog[`${item.id}.${field}`] = str
    }
  }

  const sorted = Object.fromEntries(Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(`${outDir}/${collection}.json`, JSON.stringify(sorted, null, 2) + '\n')

  const keyCount = Object.keys(sorted).length
  meta.collections[collection] = { items: items.length, keys: keyCount }
  console.log(
    `  ${collection.padEnd(18)} ${items.length.toString().padStart(3)} items  ${keyCount.toString().padStart(4)} keys`
  )
}

writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
console.log(`\nDone. lancer-data ${lancerDataVersion} to content/en/`)
