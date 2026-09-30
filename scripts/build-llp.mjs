#!/usr/bin/env node

/*!
Build LCP language patches (.llp). Two modes:

  extract <lcp-dir> [--lang <code>] [--out <file>]
    Walk an unpacked LCP's JSON collections and emit an English base .llp holding every
    translatable key + its English source string. Copy it, change `lang`, translate the values.

  pack <flat.json> --target <pack-id> [--lang <code>] [--out <file>]
    Wrap an already-translated flat `<id>.<field>` map (like a Weblate content/<c>/<lang>.json)
    in a .llp header.

Keys match exactly what the localize() resolver reads, so authors don't need to guess paths.
*/

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join, basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import {
  nestedEntries,
  ALLOWLIST,
  LCP_FIELDS,
  eidolonTraitId,
  bondEntries,
  bondPowerEntries,
  normalizeMarkup,
  markupFault,
} from '../src/i18n/contentKeys.mjs'
import CoreLayer from '../src/classes/npc/eidolon/core_layer.json' with { type: 'json' }
import PersistentTraits from '../src/classes/npc/eidolon/persistent_traits.json' with { type: 'json' }

// Weblate locale code -> app locale code
const ALIAS = { zh_Hans: 'zh', pt_BR: 'pt' }
const appLocale = code => ALIAS[code] ?? code

const readJson = p => JSON.parse(readFileSync(p, 'utf8'))

function lcpCollections(libDir) {
  const files = readdirSync(libDir)
  const read = f => (files.includes(f) ? readJson(join(libDir, f)) : [])
  const out = Object.fromEntries(Object.keys(LCP_FIELDS).map(k => [k, []]))

  out.npc_classes.push(...read('npc_classes.json'))
  out.npc_templates.push(...read('npc_templates.json'))
  for (const f of files.filter(
    f => f.startsWith('npc_') && !f.includes('classes') && !f.includes('templates')
  ))
    out.npc_features.push(...read(f))

  for (const [prefix, head, collection] of [
    ['npcc_', 'role', 'npc_classes'],
    ['npct_', 'template', 'npc_templates'],
  ]) {
    for (const f of files.filter(f => f.startsWith(prefix))) {
      const items = read(f)
      const main = items.find(x => x?.[head])
      if (!main) {
        console.warn(`${f}: no element with "${head}", skipped`)
        continue
      }
      out[collection].push(main)
      out.npc_features.push(...items.filter(x => x !== main))
    }
  }

  const layers = read('eidolon_layers.json')
  if (layers.length) {
    for (const layer of [...layers, CoreLayer]) {
      out.eidolon_layers.push({ ...layer, shard_detail: layer.shards?.detail })
      out.npc_features.push(...(layer.features ?? []), ...(layer.shards?.features ?? []))
    }
    out.eidolon_traits = PersistentTraits.map(t => ({ ...t, id: eidolonTraitId(t.name) }))
  }

  out.npc_classes = out.npc_classes.map(c => ({ ...c, ...c.info }))
  out.npc_features = out.npc_features.map(f =>
    !f.effect && f.detail ? { ...f, effect: f.detail } : f
  )
  return { out, bonds: read('bonds.json'), bondPowers: read('bond_powers.json') }
}

function extractFromLcp(dir) {
  const libDir = existsSync(join(dir, 'lib')) ? join(dir, 'lib') : dir
  const manifestPath = join(libDir, 'lcp_manifest.json')
  const manifest = existsSync(manifestPath) ? readJson(manifestPath) : {}
  const data = {}
  const put = (key, val) => {
    const str = Array.isArray(val) ? val.join('\n') : String(val)
    if (str.trim()) data[key] = normalizeMarkup(str)
  }

  const collect = (collection, fields, items, nested = true) => {
    for (const item of items) {
      if (!item?.id) continue
      for (const field of fields) {
        const val = item[field]
        if (val == null || val === '') continue
        put(
          `${item.id}.${field}`,
          typeof val === 'object' && !Array.isArray(val) ? (val.detail ?? '') : val
        )
      }
      if (!nested) continue
      for (const { prefix, fields: nf } of nestedEntries(collection, item))
        for (const [field, val] of Object.entries(nf)) put(`${prefix}.${field}`, val)
    }
  }

  for (const [collection, fields] of Object.entries(ALLOWLIST)) {
    const file = join(libDir, `${collection}.json`)
    if (!existsSync(file)) continue
    const items = readJson(file)
    if (Array.isArray(items)) collect(collection, fields, items)
  }

  const { out, bonds, bondPowers } = lcpCollections(libDir)
  for (const [collection, fields] of Object.entries(LCP_FIELDS))
    collect(collection, fields, out[collection], collection.startsWith('npc_'))
  for (const [key, val] of bonds.flatMap(bondEntries)) put(key, val)
  for (const [key, val] of bondPowers.flatMap(p => bondPowerEntries(p))) put(key, val)

  return { manifest, data }
}

const sortKeys = obj =>
  Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))

function makeLlp({ lang, target, version, data }) {
  return {
    lang,
    target,
    ...(version ? { target_version: `>=${version}` } : {}),
    translation_version: '0.1.0',
    last_update: new Date().toISOString().slice(0, 10),
    translator: '',
    data: sortKeys(data),
  }
}

function parseFlags(args) {
  const flags = {}
  const positional = []
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) flags[args[i].slice(2)] = args[++i]
    else positional.push(args[i])
  }
  return { flags, positional }
}

async function main() {
  const [mode, ...rest] = process.argv.slice(2)
  const { flags, positional } = parseFlags(rest)

  if (mode === 'extract') {
    const input = positional[0]
    if (!input || !existsSync(input) || !statSync(input).isDirectory()) {
      console.error('extract: pass an unpacked LCP directory (containing lib/ or the *.json files)')
      process.exit(1)
    }
    const { manifest, data } = extractFromLcp(input)
    const target = manifest.item_prefix || manifest.name || basename(resolve(input))
    const llp = makeLlp({
      lang: appLocale(flags.lang || 'en'),
      target,
      version: manifest.version,
      data,
    })
    const out = flags.out || `${target}.${llp.lang}.llp`
    writeFileSync(out, JSON.stringify(llp, null, 2) + '\n')
    const faults = Object.entries(data)
      .map(([k, v]) => [k, markupFault(v)])
      .filter(([, f]) => f)
    console.log(`extract: ${Object.keys(data).length} keys -> ${out}`)
    if (faults.length) {
      console.error(`${faults.length} string(s) still unparseable as XML (fix in the pack source):`)
      for (const [k, f] of faults) console.error(`  ${k}: ${f}`)
      process.exit(1)
    }
    return
  }

  if (mode === 'pack') {
    const input = positional[0]
    if (!input || !existsSync(input)) {
      console.error('pack: pass a flat "<id>.<field>": "text" JSON file')
      process.exit(1)
    }
    const target = flags.target
    if (!target) {
      console.error('pack: --target <pack-id> is required')
      process.exit(1)
    }
    const data = readJson(input)
    const lang = appLocale(flags.lang || basename(input).replace(/\.json$/, ''))
    const llp = makeLlp({ lang, target, version: flags.version, data })
    const out = flags.out || `${target}.${lang}.llp`
    writeFileSync(out, JSON.stringify(llp, null, 2) + '\n')
    console.log(`pack: ${Object.keys(data).length} keys -> ${out}`)
    return
  }

  if (mode === 'bundle') {
    const [lcpPath, ...llpPaths] = positional
    if (!lcpPath || !existsSync(lcpPath) || llpPaths.length === 0) {
      console.error('bundle: usage: bundle <file.lcp> <patch.llp> [more.llp ...] [--out <file>]')
      process.exit(1)
    }
    const JSZip = await import('jszip')
      .then(m => m.default)
      .catch(() => {
        console.error('bundle: this mode needs jszip. run: npm i jszip')
        process.exit(1)
      })
    const zip = await JSZip.loadAsync(readFileSync(lcpPath))
    for (const p of llpPaths) {
      if (!existsSync(p)) {
        console.error(`bundle: missing ${p}`)
        process.exit(1)
      }
      zip.file(basename(p), readFileSync(p, 'utf8'))
    }
    const out = flags.out || lcpPath
    writeFileSync(out, await zip.generateAsync({ type: 'nodebuffer' }))
    console.log(`bundle: added ${llpPaths.length} patch(es) -> ${out}`)
    return
  }

  console.error(
    `usage: ${basename(process.argv[1])} extract <lcp-dir> | pack <flat.json> --target <id> | bundle <file.lcp> <patch.llp...>`
  )
  process.exit(1)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch(e => {
    console.error(e)
    process.exit(1)
  })
