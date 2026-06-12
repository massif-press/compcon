import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const DYNAMIC_NAMESPACES = ['nav.']

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

const missing = report.missingKeys ?? []
const unused = (report.unusedKeys ?? []).filter(
  k => !DYNAMIC_NAMESPACES.some(ns => k.path.startsWith(ns))
)

const SHARED_NAMESPACES = ['common', 'stats', 'notify', 'classes']
const catalog = JSON.parse(readFileSync('./src/i18n/locales/en.json', 'utf8'))
const flat = {}
;(function walk(o, p) {
  if (o && typeof o === 'object')
    for (const [k, v] of Object.entries(o)) walk(v, p ? `${p}.${k}` : k)
  else if (typeof o === 'string') flat[p] = o
})(catalog, '')

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
