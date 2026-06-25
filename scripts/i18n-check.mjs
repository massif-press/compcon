import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import console from 'node:console'
import process from 'node:process'

const DYNAMIC_NAMESPACES = ['nav.', 'language.components.']

const selectorCodes = [
  ...readFileSync('src/i18n/index.ts', 'utf8').matchAll(/code:\s*'([^']+)'/g),
].map(m => m[1])
const missingCatalogs = selectorCodes.filter(
  c => !existsSync(join('src/i18n/locales', `${c}.json`))
)
if (missingCatalogs.length) {
  console.error(
    `\ni18n: ${missingCatalogs.length} selector locale(s) have no catalog file in src/i18n/locales:`
  )
  for (const c of missingCatalogs) console.error(`  - ${c}  (add src/i18n/locales/${c}.json)`)
  process.exit(1)
}

const LITERAL_ATTRS = [
  'title',
  'header',
  'subtitle',
  'label',
  'placeholder',
  'hint',
  'text',
  'tooltip',
  'alt',
]
const LITERAL_ALLOW = new Set(['CC-ID', 'CC-username', 'N/A', 'HP', 'E-DEF', 'E-DEFENSE'])
const LITERAL_SKIP_FILES = [
  'src/features/ui_test/',
  'src/ui/components/print/CombatRef.vue',
  'src/ui/components/tables/CCRefStructureTable.vue',
  'src/ui/components/tables/CCRefStressTable.vue',
  'src/features/active_mode/runner/gm/InfoPanels/QuickReferencePanel.vue',
]
const looksLikeDisplayText = v => {
  if (LITERAL_ALLOW.has(v.trim())) return false
  if (!/[A-Za-z]/.test(v)) return false // no letters (numbers/symbols/icons)
  if (/^(mdi-|cc:|cci-|https?:|#|\$|@:|\{)/.test(v)) return false // icon/url/interpolation/linked
  if (/^[a-z][a-zA-Z0-9]*$/.test(v)) return false // single lowercase token = prop identifier/enum
  if (v.includes('<') || v.includes('>') || v.includes('//') || v.startsWith('CC.')) return false // markup/diegetic
  return true
}
const collectVue = (d, a = []) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) collectVue(p, a)
    else if (p.endsWith('.vue')) a.push(p)
  }
  return a
}
const propLiterals = []
for (const file of collectVue('src')) {
  if (LITERAL_SKIP_FILES.some(s => file.replace(/\\/g, '/').includes(s))) continue
  const src = readFileSync(file, 'utf8')
  const tEnd = src.indexOf('<script')
  const tmpl = tEnd === -1 ? src : src.slice(0, tEnd)
  for (const attr of LITERAL_ATTRS) {
    const re = new RegExp(`(\\s)${attr}="([^"]*)"`, 'g')
    let m
    while ((m = re.exec(tmpl))) {
      if (looksLikeDisplayText(m[2])) propLiterals.push({ file, attr, value: m[2] })
    }
  }
}
if (propLiterals.length) {
  console.error(
    `\ni18n: ${propLiterals.length} hardcoded prop literal(s) escape no-raw-text (bind via :attr="$t('key')"):`
  )
  for (const p of propLiterals)
    console.error(`  - ${p.attr}=${JSON.stringify(p.value).slice(0, 60)}  (${p.file})`)
  process.exit(1)
}

const out = join(tmpdir(), `vue-i18n-report.${process.pid}.json`)

try {
  execFileSync(
    'npx',
    [
      'vue-i18n-extract',
      'report',
      '--vueFiles',
      './src/**/*.?(js|ts|vue)',
      '--languageFiles',
      './src/i18n/locales/en.json',
      '--output',
      out,
    ],
    { stdio: 'ignore' }
  )
} catch {
  // ignore nonzero exit
}

const report = JSON.parse(readFileSync(out, 'utf8'))
rmSync(out, { force: true })

const catalog = JSON.parse(readFileSync('./src/i18n/locales/en.json', 'utf8'))
const flat = {}
;(function walk(o, p) {
  if (o && typeof o === 'object')
    for (const [k, v] of Object.entries(o)) walk(v, p ? `${p}.${k}` : k)
  else if (typeof o === 'string') flat[p] = o
})(catalog, '')

const linkTargets = new Set()
for (const v of Object.values(flat))
  for (const m of v.matchAll(/@(?:\.[a-z]+)?:[{('"]*([\w.]+)/g)) linkTargets.add(m[1])

const missing = report.missingKeys ?? []
const unused = (report.unusedKeys ?? []).filter(
  k => !DYNAMIC_NAMESPACES.some(ns => k.path.startsWith(ns)) && !linkTargets.has(k.path)
)

const SHARED_NAMESPACES = ['common', 'stats', 'notify', 'classes']

const canonByValue = new Map()
for (const [k, v] of Object.entries(flat)) {
  if (SHARED_NAMESPACES.includes(k.split('.')[0])) canonByValue.set(v, k)
}
const redeclared = []
for (const [k, v] of Object.entries(flat)) {
  const top = k.split('.')[0]
  if (SHARED_NAMESPACES.includes(top) || DYNAMIC_NAMESPACES.some(ns => `${top}.`.startsWith(ns)))
    continue
  if (canonByValue.has(v)) redeclared.push({ path: k, canonical: canonByValue.get(v), value: v })
}
if (redeclared.length) {
  console.log(
    `\ni18n: ${redeclared.length} keys redeclare a value that already has a shared canonical:`
  )
  for (const r of redeclared)
    console.log(`  - ${r.path}  ->  ${r.canonical}  (${JSON.stringify(r.value)})`)
  console.log('Consider repointing call sites to the canonical, unless this is variable context.')
}

if (unused.length) {
  console.log(`i18n: ${unused.length} unused keys in en.json:`)
  for (const k of unused) console.log(`  - ${k.path}`)
}

if (missing.length) {
  console.error(`\ni18n: ${missing.length} keys used in source but MISSING from en.json:`)
  for (const k of missing) console.error(`  - ${k.path}  (${k.file})`)
  console.error('\nAdd these keys to src/i18n/locales/en.json.')
  process.exit(1)
}

console.log('i18n: 0 missing keys. en.json is complete.')
