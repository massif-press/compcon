import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const DEST = 'src/i18n/locales'
const REMOTE = 'https://github.com/massif-press/compcon-locales.git'

const codes = new Set(
  [...readFileSync('src/i18n/index.ts', 'utf8').matchAll(/code:\s*'([^']+)'/g)].map(m => m[1])
)

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
  if (!file.endsWith('.json') || file === 'en.json') continue
  const code = file.slice(0, -'.json'.length)
  if (!codes.has(code)) continue
  cpSync(join(uiDir, file), join(DEST, file))
  console.log(`vendored ${file}`)
  pulled++
}

if (tmp) rmSync(tmp, { recursive: true, force: true })
console.log(`locales:pull done (${pulled} catalog${pulled === 1 ? '' : 's'} vendored).`)
