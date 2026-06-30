#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { nestedEntries, glossaryId } from '../src/i18n/contentKeys.mjs'

const _require = createRequire(import.meta.url)

export const ALLOWLIST = {
  actions: ['name', 'terse', 'detail', 'trigger'],
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
  weapons: ['name', 'description', 'effect'],
  downtime_actions: ['name', 'terse', 'detail'],
}

export function buildContent() {
  const data = _require('@massif/lancer-data')
  const { version } = _require('@massif/lancer-data/package.json')
  const catalogs = {}

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
        const str = Array.isArray(val)
          ? val.join('\n')
          : typeof val === 'object'
            ? (val.detail ?? '') // on_hit/on_crit/on_attack
            : String(val)
        if (!str.trim()) continue
        catalog[`${item.id}.${field}`] = str
      }

      for (const { prefix, fields } of nestedEntries(collection, item)) {
        for (const [field, val] of Object.entries(fields)) {
          const str = Array.isArray(val) ? val.join('\n') : String(val)
          if (str.trim()) catalog[`${prefix}.${field}`] = str
        }
      }
    }

    catalogs[collection] = {
      items: items.length,
      catalog: Object.fromEntries(Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b))),
    }
  }

  // glossary: id-less top-level collection, keyed by name (matches Glossary.vue's `glossary_<name>`)
  const glossary = data.glossary ?? []
  const gcat = {}
  for (const g of glossary) {
    if (!g?.name) continue
    if (String(g.name).trim()) gcat[`${glossaryId(g.name)}.name`] = g.name
    if (g.description && String(g.description).trim())
      gcat[`${glossaryId(g.name)}.description`] = g.description
  }
  catalogs.glossary = {
    items: glossary.length,
    catalog: Object.fromEntries(Object.entries(gcat).sort(([a], [b]) => a.localeCompare(b))),
  }

  return { version, catalogs }
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const outDir = resolve(root, 'content/en')
  const metaPath = resolve(root, 'content/_meta.json')
  mkdirSync(outDir, { recursive: true })

  const { version, catalogs } = buildContent()
  const meta = {
    lancerDataVersion: version,
    extractedAt: new Date().toISOString(),
    collections: {},
  }

  const merged = {}
  for (const [collection, { items, catalog }] of Object.entries(catalogs)) {
    Object.assign(merged, catalog)
    const keyCount = Object.keys(catalog).length
    meta.collections[collection] = { items, keys: keyCount }
    console.log(
      `  ${collection.padEnd(18)} ${items.toString().padStart(3)} items  ${keyCount.toString().padStart(4)} keys`
    )
  }

  const sorted = Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(`${outDir}/lancer-data.json`, JSON.stringify(sorted, null, 2) + '\n')
  writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
  console.log(
    `\nDone. lancer-data ${version} -> content/en/lancer-data.json (${Object.keys(sorted).length} keys)`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main()
