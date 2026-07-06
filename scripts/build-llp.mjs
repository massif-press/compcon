#!/usr/bin/env node
// Build LCP language patches (.llp). Two modes:
//
//   extract <lcp-dir> [--lang <code>] [--out <file>]
//     Walk an unpacked LCP's JSON collections and emit an English base .llp holding every
//     translatable key + its English source string. Copy it, change `lang`, translate the values.
//
//   pack <flat.json> --target <pack-id> [--lang <code>] [--out <file>]
//     Wrap an already-translated flat `<id>.<field>` map (e.g. a Weblate content/<c>/<lang>.json)
//     in a .llp header. Weblate locale codes are normalized to the app's (zh_Hans->zh, pt_BR->pt).
//
// Keys match exactly what the app's localize() resolver reads, so authors never hand-guess them.
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join, basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { nestedEntries } from '../src/i18n/contentKeys.mjs'
import { ALLOWLIST } from './extract-content-en.mjs'

// Weblate locale code -> app locale code (mirrors scripts/pull-locales.mjs ALIAS).
const ALIAS = { zh_Hans: 'zh', pt_BR: 'pt' }
const appLocale = code => ALIAS[code] ?? code

const readJson = p => JSON.parse(readFileSync(p, 'utf8'))

function extractFromLcp(dir) {
  const libDir = existsSync(join(dir, 'lib')) ? join(dir, 'lib') : dir
  const manifestPath = join(libDir, 'lcp_manifest.json')
  const manifest = existsSync(manifestPath) ? readJson(manifestPath) : {}
  const data = {}

  for (const [collection, fields] of Object.entries(ALLOWLIST)) {
    const file = join(libDir, `${collection}.json`)
    if (!existsSync(file)) continue
    const items = readJson(file)
    if (!Array.isArray(items)) continue

    for (const item of items) {
      if (!item?.id) continue
      for (const field of fields) {
        const val = item[field]
        if (val == null || val === '') continue
        const str = Array.isArray(val)
          ? val.join('\n')
          : typeof val === 'object'
            ? (val.detail ?? '')
            : String(val)
        if (str.trim()) data[`${item.id}.${field}`] = str
      }
      for (const { prefix, fields: nf } of nestedEntries(collection, item)) {
        for (const [field, val] of Object.entries(nf)) {
          const str = Array.isArray(val) ? val.join('\n') : String(val)
          if (str.trim()) data[`${prefix}.${field}`] = str
        }
      }
    }
  }
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
    console.log(`extract: ${Object.keys(data).length} keys -> ${out}`)
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
    const { default: JSZip } = await import('jszip')
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
    'usage: build-llp.mjs extract <lcp-dir> | pack <flat.json> --target <id> | bundle <file.lcp> <patch.llp...>'
  )
  process.exit(1)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch(e => {
    console.error(e)
    process.exit(1)
  })
