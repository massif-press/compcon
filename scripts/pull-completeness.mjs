import { readFileSync, writeFileSync } from 'node:fs'
import console from 'node:console'

const COMPONENTS = ['ui', 'lancer-data', 'lancer-srd']
const STATS_URL = slug => `https://hosted.weblate.org/api/components/compcon/${slug}/statistics/`
const DEST = 'src/i18n/completeness.json'

const ALIAS = { zh_Hans: 'zh', pt_BR: 'pt' }

const codes = new Set(
  [...readFileSync('src/i18n/index.ts', 'utf8').matchAll(/code:\s*'([^']+)'/g)].map(m => m[1])
)

const out = {}
for (const comp of COMPONENTS) {
  const map = {}
  let url = STATS_URL(comp)
  let found = true
  while (url) {
    const res = await fetch(url)
    if (res.status === 404) {
      found = false
      break
    }
    if (!res.ok) throw new Error(`Weblate stats ${comp}: ${res.status} ${res.statusText}`)
    const data = await res.json()
    for (const s of data.results ?? []) {
      const raw = s.code ?? s.language_code
      const code = ALIAS[raw] ?? raw
      if (code && codes.has(code)) map[code] = Math.round(s.translated_percent ?? 0)
    }
    url = data.next ?? null
  }
  out[comp] = Object.fromEntries(
    Object.keys(map)
      .sort()
      .map(k => [k, map[k]])
  )
  console.log(
    found
      ? `  ${comp}: ${Object.keys(out[comp]).length} locales`
      : `  ${comp}: component not found (skipped)`
  )
}

writeFileSync(DEST, JSON.stringify(out, null, 2) + '\n')
console.log(`completeness:pull done (${COMPONENTS.length} components).`)
