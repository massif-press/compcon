import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import console from 'node:console'
import process from 'node:process'

const [mapPath, ...flags] = process.argv.slice(2)
if (!mapPath) {
  console.error('usage: node scripts/rename-locale-keys.mjs <map.json> [--write] [--locales <dir>]')
  process.exit(1)
}
const write = flags.includes('--write')
const localesRepo = flags.includes('--locales')
  ? flags[flags.indexOf('--locales') + 1]
  : existsSync('../compcon-locales') && '../compcon-locales'

const map = JSON.parse(readFileSync(mapPath, 'utf8'))
if (!Object.keys(map).length) {
  console.error('rename map is empty')
  process.exit(1)
}

const PLURAL_CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other']

const renameIn = (tree, from, to, suffixed = false) => {
  const fromParts = from.split('.')
  const toParts = to.split('.')
  const parentOf = (parts, create) => {
    let o = tree
    for (const p of parts.slice(0, -1)) {
      if (!o[p] || typeof o[p] !== 'object') {
        if (!create) return null
        o[p] = {}
      }
      o = o[p]
    }
    return o
  }
  const src = parentOf(fromParts, false)
  const leaf = fromParts.at(-1)
  if (!src) return false
  if (!(leaf in src))
    return (
      !suffixed &&
      PLURAL_CATEGORIES.map(c => renameIn(tree, `${from}_${c}`, `${to}_${c}`, true)).some(Boolean)
    )
  const value = src[leaf]
  const dest = parentOf(toParts, false)
  if (dest && toParts.at(-1) in dest) {
    if (dest[toParts.at(-1)] === '') dest[toParts.at(-1)] = value
    delete src[leaf]
    return true
  }
  const sameParent = fromParts.slice(0, -1).join('.') === toParts.slice(0, -1).join('.')
  if (sameParent) {
    const entries = Object.entries(src).map(([k, v]) => (k === leaf ? [toParts.at(-1), v] : [k, v]))
    for (const k of Object.keys(src)) delete src[k]
    Object.assign(src, Object.fromEntries(entries))
  } else {
    delete src[leaf]
    parentOf(toParts, true)[toParts.at(-1)] = value
  }
  return true
}

const relink = tree => {
  let n = 0
  ;(function walk(o) {
    for (const [k, v] of Object.entries(o)) {
      if (v && typeof v === 'object') walk(v)
      else if (typeof v === 'string' && v.includes("@:{'"))
        o[k] = v.replace(/@:\{'([\w.]+)'\}/g, (m, key) => {
          if (!(key in map)) return m
          n++
          return `@:{'${map[key]}'}`
        })
    }
  })(tree)
  return n
}

const prune = o => {
  for (const [k, v] of Object.entries(o))
    if (v && typeof v === 'object') {
      prune(v)
      if (!Object.keys(v).length) delete o[k]
    }
}

const catalogs = readdirSync('src/i18n/locales')
  .filter(f => f.endsWith('.json'))
  .map(f => join('src/i18n/locales', f))
if (localesRepo)
  catalogs.push(
    ...readdirSync(join(localesRepo, 'ui'))
      .filter(f => f.endsWith('.json'))
      .map(f => join(localesRepo, 'ui', f))
  )

for (const file of catalogs) {
  const text = readFileSync(file, 'utf8')
  const indent = text.match(/\n( +)"/)?.[1].length ?? 2
  const tree = JSON.parse(text)
  let moved = 0
  for (const [from, to] of Object.entries(map)) if (renameIn(tree, from, to)) moved++
  const links = relink(tree)
  prune(tree)
  if (write && (moved || links)) writeFileSync(file, JSON.stringify(tree, null, indent) + '\n')
  console.log(`${file}: ${moved} key(s) renamed, ${links} link(s) updated`)
}

const sources = []
;(function collect(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) collect(p)
    else if (/\.(vue|ts|js|mjs)$/.test(f)) sources.push(p)
  }
})('src')

const quoted = new RegExp(
  `(['"\`])(${Object.keys(map)
    .map(k => k.replace(/\./g, '\\.'))
    .join('|')})\\1`,
  'g'
)
let refs = 0
for (const file of sources) {
  const text = readFileSync(file, 'utf8')
  let n = 0
  const next = text.replace(quoted, (m, q, key) => {
    n++
    return `${q}${map[key]}${q}`
  })
  if (!n) continue
  refs += n
  if (write) writeFileSync(file, next)
  console.log(`${file}: ${n} reference(s)`)
}
console.log(`${refs} source reference(s) ${write ? 'rewritten' : 'found (dry run, pass --write)'}`)
