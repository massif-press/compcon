import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import console from 'node:console'
import process from 'node:process'

const here = dirname(fileURLToPath(import.meta.url))

const SUITES = {
  extract: ['extract-content-en.mjs', 'extract-srd-en.mjs'],
  check: ['i18n-check.mjs', 'check-content-drift.mjs'],
  pull: ['pull-locales.mjs', 'pull-completeness.mjs'],
}
SUITES.all = [...SUITES.extract, ...SUITES.check, ...SUITES.pull]

const cmd = process.argv[2] ?? 'check'
const scripts = SUITES[cmd]
if (!scripts) {
  console.error(`locales: unknown command '${cmd}'. Use one of: ${Object.keys(SUITES).join(', ')}`)
  process.exit(1)
}

for (const s of scripts) {
  console.log(`\n› ${s}`)
  const r = spawnSync(process.execPath, [resolve(here, s)], { stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
