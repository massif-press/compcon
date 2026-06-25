#!/usr/bin/env node
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import console from 'node:console'
import process from 'node:process'
import { buildContent } from './extract-content-en.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const mergedPath = resolve(root, 'content/en/lancer-data.json')
const metaPath = resolve(root, 'content/_meta.json')

const readJson = p => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null)

const { version: installedVersion, catalogs } = buildContent()

const fresh = {}
const keyToCollection = {}
const idToCollection = {}
for (const [collection, { catalog }] of Object.entries(catalogs)) {
  for (const [k, v] of Object.entries(catalog)) {
    fresh[k] = v
    keyToCollection[k] = collection
    idToCollection[k.slice(0, k.lastIndexOf('.'))] = collection
  }
}
const collOf = k =>
  keyToCollection[k] ?? idToCollection[k.slice(0, k.lastIndexOf('.'))] ?? '(removed item)'

const committed = readJson(mergedPath) ?? {}
const committedVersion = readJson(metaPath)?.lancerDataVersion ?? '(none)'

const freshKeys = new Set(Object.keys(fresh))
const committedKeys = new Set(Object.keys(committed))

const added = [...freshKeys].filter(k => !committedKeys.has(k))
const removed = [...committedKeys].filter(k => !freshKeys.has(k))
const modified = [...freshKeys].filter(k => committedKeys.has(k) && fresh[k] !== committed[k])

const addedByValue = new Map(added.map(k => [fresh[k], k]))
const renamed = new Set(removed.filter(k => addedByValue.has(committed[k])))

const tally = {}
const bump = (coll, field) => {
  ;(tally[coll] ??= { added: 0, removed: 0, modified: 0, renamed: 0 })[field]++
}
for (const k of added) bump(collOf(k), 'added')
for (const k of modified) bump(collOf(k), 'modified')
for (const k of removed) {
  bump(collOf(k), 'removed')
  if (renamed.has(k)) bump(collOf(k), 'renamed')
}

const versionMismatch = installedVersion !== committedVersion
const drift = versionMismatch || added.length > 0 || removed.length > 0 || modified.length > 0

const lines = []
lines.push('## Content drift report')
lines.push('')
lines.push(
  `lancer-data: committed \`${committedVersion}\` vs installed \`${installedVersion}\`` +
    (versionMismatch ? ' ⚠️ **mismatch**' : ' ✅')
)
lines.push('')
const collections = Object.keys(tally).sort()
if (collections.length) {
  lines.push('| collection | added | removed | modified | renamed? |')
  lines.push('|---|---|---|---|---|')
  for (const c of collections) {
    const t = tally[c]
    lines.push(`| ${c} | ${t.added} | ${t.removed} | ${t.modified} | ${t.renamed || ''} |`)
  }
} else {
  lines.push('No key-level changes.')
}
const report = lines.join('\n')

console.log(report)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n')

if (drift) {
  console.error(
    '\ncontent drift: committed content/en/lancer-data.json is out of sync with installed @massif/lancer-data.'
  )
  console.error('Re-run `node scripts/extract-content-en.mjs` and commit the result.')
  process.exit(1)
}

console.log('\ncontent: 0 drift. content/en/lancer-data.json matches installed lancer-data.')
