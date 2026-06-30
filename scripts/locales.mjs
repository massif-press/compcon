import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import console from 'node:console'
import process from 'node:process'

const here = dirname(fileURLToPath(import.meta.url))

const SCRIPTS = {
  extract: ['extract-content-en.mjs', 'extract-srd-en.mjs'],
  check: ['check-locale-syntax.mjs', 'i18n-check.mjs', 'check-content-drift.mjs', 'check-content-keys.mjs'],
  pull: ['pull-locales.mjs', 'pull-completeness.mjs'],
}
SCRIPTS.all = [...SCRIPTS.extract, ...SCRIPTS.check, ...SCRIPTS.pull]

const cmd = process.argv[2] ?? 'check'
const scripts = SCRIPTS[cmd]
if (!scripts) {
  console.error(`locales: unknown command '${cmd}'. Use one of: ${Object.keys(SCRIPTS).join(', ')}`)
  process.exit(1)
}

for (const s of scripts) {
  console.log(`\n› ${s}`)
  const r = spawnSync(process.execPath, [resolve(here, s)], { stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
