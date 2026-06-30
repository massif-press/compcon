#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import console from 'node:console'
import process from 'node:process'
import { nestedEntries, stampContentKeys, keyPrefixes } from '../src/i18n/contentKeys.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const _require = createRequire(import.meta.url)
const data = _require('@massif/lancer-data')
const catalogPath = resolve(root, 'content/en/lancer-data.json')
const catalog = existsSync(catalogPath) ? JSON.parse(readFileSync(catalogPath, 'utf8')) : {}
const catalogKeys = new Set(Object.keys(catalog))

const walkKeys = new Set()
for (const [coll, arr] of Object.entries(data)) {
  if (!Array.isArray(arr)) continue
  for (const item of arr)
    for (const { prefix, fields } of nestedEntries(coll, item))
      for (const f of Object.keys(fields)) walkKeys.add(`${prefix}.${f}`)
}
const missingFromCatalog = [...walkKeys].filter(k => !catalogKeys.has(k))

stampContentKeys(data)
let stampMismatch = 0
for (const arr of Object.values(data)) {
  if (!Array.isArray(arr)) continue
  for (const item of arr) {
    for (const e of nestedEntries(null, item)) {
      if (e.obj && keyPrefixes.get(e.obj) !== e.prefix) stampMismatch++
    }
  }
}

let ok = true
console.log(`content keys: ${walkKeys.size} nested keys from the shared walk`)
if (missingFromCatalog.length) {
  ok = false
  console.error(
    `\n${missingFromCatalog.length} walk key(s) missing from catalog (re-run extraction):`
  )
  for (const k of missingFromCatalog.slice(0, 10)) console.error(`  - ${k}`)
}
if (stampMismatch) {
  ok = false
  console.error(
    `\n${stampMismatch} stamp/walk prefix mismatch(es). runtime map disagrees with walk.`
  )
}
if (!ok) process.exit(1)
console.log('content keys: walk / catalog / stamp all agree.')
