import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import console from 'node:console'
import process from 'node:process'

export const CLDR_ORDER = ['zero', 'one', 'two', 'few', 'many', 'other']
const SUFFIXED = new RegExp(`^(.+)_(${CLDR_ORDER.join('|')})$`)

export const categoriesFor = code => {
  const found = new Intl.PluralRules(code).resolvedOptions().pluralCategories
  return CLDR_ORDER.filter(c => found.includes(c))
}

const formsOf = value => value.split('|').map(s => s.trim())
const isObj = v => v && typeof v === 'object' && !Array.isArray(v)

const rebuild = (obj, entriesFor) =>
  Object.fromEntries(Object.entries(obj).flatMap(([k, v]) => entriesFor(k, v)))

export function splitPlurals(tree, en = tree, code = 'en') {
  const categories = categoriesFor(code)
  return rebuild(tree, (k, v) => {
    if (isObj(v)) return [[k, splitPlurals(v, isObj(en?.[k]) ? en[k] : {}, code)]]
    if (typeof en?.[k] !== 'string' || !en[k].includes('|') || typeof v !== 'string' || !v)
      return [[k, v]]
    const forms = formsOf(v)
    return categories.map((c, i) => {
      if (forms.length === categories.length) return [`${k}_${c}`, forms[i]]
      if (c === 'other') return [`${k}_${c}`, forms.at(-1)]
      if (c === 'one') return [`${k}_${c}`, forms[0]]
      return [`${k}_${c}`, '']
    })
  })
}

export function joinPlurals(tree, code) {
  const categories = categoriesFor(code)
  const groups = {}
  for (const [k, v] of Object.entries(tree)) {
    const m = typeof v === 'string' && k.match(SUFFIXED)
    if (m) (groups[m[1]] ??= {})[m[2]] = v
  }
  return rebuild(tree, (k, v) => {
    if (isObj(v)) return [[k, joinPlurals(v, code)]]
    const m = typeof v === 'string' && k.match(SUFFIXED)
    if (!m) return [[k, v]]
    const group = groups[m[1]]
    if (!group) return []
    delete groups[m[1]]
    const fallback = group.other || group.one || ''
    const forms = categories.map(c => group[c] || fallback)
    return [[m[1], forms.every(f => !f) ? '' : forms.join(' | ')]]
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [cmd, input, output, code = 'en', enPath] = process.argv.slice(2)
  if (!['split', 'join'].includes(cmd) || !input || !output) {
    console.error(
      'usage: node scripts/locale-plurals.mjs split|join <in.json> <out.json> [code] [en.json]'
    )
    process.exit(1)
  }
  const tree = JSON.parse(readFileSync(input, 'utf8'))
  const en = enPath ? JSON.parse(readFileSync(enPath, 'utf8')) : tree
  const out = cmd === 'split' ? splitPlurals(tree, en, code) : joinPlurals(tree, code)
  writeFileSync(output, JSON.stringify(out, null, 4) + '\n')
}
