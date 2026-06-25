import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import console from 'node:console'
import process from 'node:process'

const DEST = 'src/i18n/locales'
const REMOTE = 'https://github.com/massif-press/compcon-locales.git'

const PROTECTED_BASE = 'en.json'

// Weblate locale code -> app locale code. Weblate has BCP-47 subtags (zh_Hans);
// the app uses the shorter code (zh) to match language/a11y
const ALIAS = { zh_Hans: 'zh', pt_BR: 'pt' }

const codes = new Set(
  [...readFileSync('src/i18n/index.ts', 'utf8').matchAll(/code:\s*'([^']+)'/g)].map(m => m[1])
)
function mergeAppWins(app, incoming) {
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v)
  if (!isObj(app)) return app === undefined ? incoming : app
  const out = isObj(incoming) ? { ...incoming } : {}
  for (const k of Object.keys(app)) {
    out[k] = isObj(app[k]) && isObj(out[k]) ? mergeAppWins(app[k], out[k]) : app[k]
  }
  return out
}

const countLeaves = o => {
  let n = 0
  ;(function w(x) {
    if (x && typeof x === 'object') for (const k in x) w(x[k])
    else n++
  })(o)
  return n
}

let src = process.env.LOCALES_REPO || (existsSync('../compcon-locales') ? '../compcon-locales' : '')
let tmp = ''
if (!src) {
  tmp = mkdtempSync(join(tmpdir(), 'compcon-locales-'))
  execFileSync('git', ['clone', '--depth', '1', REMOTE, tmp], { stdio: 'inherit' })
  src = tmp
}

const uiDir = join(src, 'ui')
let pulled = 0
for (const file of readdirSync(uiDir)) {
  if (!file.endsWith('.json')) continue
  if (file === PROTECTED_BASE) continue // never write the English source of truth
  const rawCode = file.slice(0, -'.json'.length)
  const code = ALIAS[rawCode] ?? rawCode
  if (!codes.has(code)) continue

  const destPath = join(DEST, `${code}.json`)
  if (destPath === join(DEST, PROTECTED_BASE))
    throw new Error(`refusing to write ${PROTECTED_BASE}`)

  const incoming = JSON.parse(readFileSync(join(uiDir, file), 'utf8'))
  const existing = existsSync(destPath) ? JSON.parse(readFileSync(destPath, 'utf8')) : {}
  const merged = mergeAppWins(existing, incoming)
  const added = countLeaves(merged) - countLeaves(existing)
  writeFileSync(destPath, JSON.stringify(merged, null, 2) + '\n')
  const src = rawCode === code ? file : `${file} -> ${code}.json`
  console.log(
    `${src}: +${added} new key(s) from Weblate; ${countLeaves(existing)} app value(s) preserved`
  )
  pulled++
}

if (tmp) rmSync(tmp, { recursive: true, force: true })
console.log(`locales:pull done (${pulled} catalog${pulled === 1 ? '' : 's'} merged, app-wins).`)
