import { readFileSync, writeFileSync } from 'node:fs'
import console from 'node:console'

const STATS_URL = 'https://hosted.weblate.org/api/components/compcon/ui/statistics/'
const DEST = 'src/i18n/completeness.json'

// weblate -> app
const ALIAS = { zh_Hans: 'zh' }

const codes = new Set(
  [...readFileSync('src/i18n/index.ts', 'utf8').matchAll(/code:\s*'([^']+)'/g)].map(m => m[1])
)

const map = {}
let url = STATS_URL
while (url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weblate stats ${res.status} ${res.statusText}`)
  const data = await res.json()
  for (const s of data.results ?? []) {
    const raw = s.code ?? s.language_code
    const code = ALIAS[raw] ?? raw
    if (code && codes.has(code)) map[code] = Math.round(s.translated_percent ?? 0)
  }
  url = data.next ?? null
}

const ordered = Object.fromEntries(
  Object.keys(map)
    .sort()
    .map(k => [k, map[k]])
)
writeFileSync(DEST, JSON.stringify(ordered, null, 2) + '\n')
console.log(`completeness:pull done (${Object.keys(ordered).length} locales).`)
