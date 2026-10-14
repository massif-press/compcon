import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import console from 'node:console'
import process from 'node:process'

const [opsPath, ...flags] = process.argv.slice(2)
if (!opsPath) {
  console.error(
    'usage: node scripts/edit-locale-values.mjs <ops.mjs> [--write] [--locales <dir>] [--seeded <out.txt>]'
  )
  process.exit(1)
}
const flag = name => (flags.includes(name) ? flags[flags.indexOf(name) + 1] : null)
const write = flags.includes('--write')
const localesRepo = flag('--locales') ?? '../compcon-locales'
const ALIAS = { zh_Hans: 'zh', pt_BR: 'pt' }
const PLURAL_CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other']

const { default: ops } = await import(resolve(opsPath))

const get = (tree, key) =>
  key.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), tree)
const set = (tree, key, value) => {
  const parts = key.split('.')
  let o = tree
  for (const p of parts.slice(0, -1)) o = o[p] ??= {}
  o[parts.at(-1)] = value
}
const del = (tree, key) => {
  const parts = key.split('.')
  const stack = [tree]
  for (const p of parts.slice(0, -1)) {
    const next = stack.at(-1)?.[p]
    if (!next || typeof next !== 'object') return false
    stack.push(next)
  }
  const parent = stack.at(-1)
  const leaves = [parts.at(-1), ...PLURAL_CATEGORIES.map(c => `${parts.at(-1)}_${c}`)].filter(
    l => l in parent
  )
  if (!leaves.length) return false
  for (const l of leaves) delete parent[l]
  for (let i = stack.length - 1; i > 0 && !Object.keys(stack[i]).length; i--)
    delete stack[i - 1][parts[i - 1]]
  return true
}

const load = file => {
  const text = readFileSync(file, 'utf8')
  return { file, indent: text.match(/\n( +)"/)?.[1].length ?? 2, tree: JSON.parse(text) }
}
const appDir = 'src/i18n/locales'
const uiDir = join(localesRepo, 'ui')
const english = [load(join(appDir, 'en.json')), load(join(uiDir, 'en.json'))]
const translated = [
  ...readdirSync(appDir)
    .filter(f => f.endsWith('.json') && f !== 'en.json')
    .map(f => load(join(appDir, f))),
  ...readdirSync(uiDir)
    .filter(f => f.endsWith('.json') && f !== 'en.json')
    .map(f => load(join(uiDir, f))),
]
const langOf = file => {
  const code = file.split('/').at(-1).slice(0, -5)
  return ALIAS[code] ?? code
}

const seeded = new Set()
const counts = new Map()
const bump = (file, what) => {
  const c = counts.get(file) ?? {}
  c[what] = (c[what] ?? 0) + 1
  counts.set(file, c)
}

for (const op of ops) {
  const enApp = get(english[0].tree, op.key)
  if (op.op !== 'add' && enApp === undefined) throw new Error(`${op.op} ${op.key}: not in en.json`)
  if (op.op === 'add' && enApp !== undefined) throw new Error(`add ${op.key}: already in en.json`)
  for (const cat of english) {
    if (op.op === 'del') {
      if (del(cat.tree, op.key)) bump(cat.file, 'deleted')
    } else {
      set(cat.tree, op.key, op.en)
      bump(cat.file, op.op === 'add' ? 'added' : 'edited')
    }
  }
  for (const cat of translated) {
    if (op.op === 'del') {
      if (del(cat.tree, op.key)) bump(cat.file, 'deleted')
      continue
    }
    const fn = op.op === 'add' ? op.seed : op.tf
    if (!fn) continue
    const current = get(cat.tree, op.key)
    if (op.op === 'set' && !current) continue
    const lookup = k => get(cat.tree, k) || undefined
    const next =
      op.op === 'add' ? fn(lookup, langOf(cat.file)) : fn(current, lookup, langOf(cat.file))
    if (next === undefined || next === current) continue
    set(cat.tree, op.key, next)
    bump(cat.file, op.op === 'add' ? 'seeded' : 'transformed')
    seeded.add(op.key)
  }
}

for (const cat of [...english, ...translated]) {
  const c = counts.get(cat.file)
  if (!c) continue
  console.log(
    `${cat.file}: ${Object.entries(c)
      .map(([k, v]) => `${v} ${k}`)
      .join(', ')}`
  )
  if (write) writeFileSync(cat.file, JSON.stringify(cat.tree, null, cat.indent) + '\n')
}
const seededOut = flag('--seeded')
if (seededOut && write) writeFileSync(seededOut, [...seeded].sort().join('\n') + '\n')
console.log(
  `${ops.length} op(s), ${seeded.size} key(s) with carried-over translations${write ? '' : ' (dry run, pass --write)'}`
)
