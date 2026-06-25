#!/usr/bin/env node
import { createRequire } from 'node:module'
import console from 'node:console'
import { ALLOWLIST } from './extract-content-en.mjs'
import { nestedEntries } from '../src/i18n/contentKeys.mjs'

const _require = createRequire(import.meta.url)
const data = _require('@massif/lancer-data')

const walkCovered = new Map()
for (const [coll, arr] of Object.entries(data)) {
  if (!Array.isArray(arr)) continue
  for (const item of arr)
    for (const { obj, fields } of nestedEntries(coll, item))
      walkCovered.set(obj, new Set(Object.keys(fields)))
}

const PROSE = new Set([
  'name',
  'description',
  'detail',
  'effect',
  'terse',
  'trigger',
  'quote',
  'summary',
  'flavor',
  'caption',
  'mounted_effect',
  'active_name',
  'active_effect',
  'passive_name',
  'passive_effect',
  'on_attack',
  'on_hit',
  'on_crit',
  'on_attached',
  'on_destroyed',
  'objective',
  'deployment',
  'controlZone',
  'extraction',
  'effects',
  'requirements',
  'note',
])

const cls = {
  COVERED: 0,
  WIDEN_ALLOWLIST: 0,
  EXCLUDED_COLLECTION: 0,
  NESTED_HAS_ID: 0,
  NESTED_NO_ID: 0,
}
const byCollectionMissed = {}
const shapes = {}

function rec(node, coll, shape, depth) {
  if (Array.isArray(node)) {
    for (const el of node) rec(el, coll, shape + '[]', depth)
    return
  }
  if (!node || typeof node !== 'object') return
  for (const [k, v] of Object.entries(node)) {
    const leaf = typeof v === 'string' || (Array.isArray(v) && v.every(x => typeof x === 'string'))
    if (leaf) {
      if (!PROSE.has(k)) continue
      const text = typeof v === 'string' ? v : v.join('')
      if (!text.trim()) continue
      const isTop = depth === 1
      const inAllow = Object.keys(ALLOWLIST).includes(coll)
      const covered =
        (isTop && node.id != null && (ALLOWLIST[coll] || []).includes(k)) ||
        !!walkCovered.get(node)?.has(k) ||
        (coll === 'glossary' && (k === 'name' || k === 'description'))
      let c
      if (covered) c = 'COVERED'
      else if (!inAllow) c = 'EXCLUDED_COLLECTION'
      else if (isTop && node.id != null) c = 'WIDEN_ALLOWLIST'
      else if (node.id != null) c = 'NESTED_HAS_ID'
      else c = 'NESTED_NO_ID'
      cls[c]++
      if (c !== 'COVERED') {
        byCollectionMissed[coll] = (byCollectionMissed[coll] || 0) + 1
        const key = `${coll}${shape}.${k}`
        shapes[key] = shapes[key] || { count: 0, cls: c, hasId: node.id != null }
        shapes[key].count++
      }
    } else if (v && typeof v === 'object') {
      const topAllowed = depth === 1 && node.id != null && (ALLOWLIST[coll] || []).includes(k)
      if (topAllowed && typeof v.detail === 'string' && v.detail.trim()) {
        cls.COVERED++
        continue
      }
      rec(v, coll, shape + '.' + k, depth + 1)
    }
  }
}

for (const [coll, arr] of Object.entries(data)) {
  if (!Array.isArray(arr)) continue
  for (const item of arr) rec(item, coll, '[]', 1)
}

const missed = cls.WIDEN_ALLOWLIST + cls.EXCLUDED_COLLECTION + cls.NESTED_HAS_ID + cls.NESTED_NO_ID
console.log('=== content extraction coverage ===\n')
console.log('COVERED (current allowlist):', cls.COVERED)
console.log('MISSED total:', missed)
console.log(
  '  WIDEN_ALLOWLIST (top-level field on id item, add to allowlist):',
  cls.WIDEN_ALLOWLIST
)
console.log('  EXCLUDED_COLLECTION (collection not in allowlist):', cls.EXCLUDED_COLLECTION)
console.log('  NESTED_HAS_ID (nested but element has own id):', cls.NESTED_HAS_ID)
console.log('  NESTED_NO_ID (keyless nested):', cls.NESTED_NO_ID)

console.log('\n=== missed by collection ===')
for (const [c, n] of Object.entries(byCollectionMissed).sort((a, b) => b[1] - a[1]))
  console.log(`  ${c.padEnd(16)} ${n}`)

console.log('\n=== missed path shapes (count / class) ===')
for (const [shape, info] of Object.entries(shapes).sort((a, b) => b[1].count - a[1].count))
  console.log(
    `  ${String(info.count).padStart(4)}  ${shape}  [${info.cls}${info.hasId ? ' id' : ''}]`
  )
