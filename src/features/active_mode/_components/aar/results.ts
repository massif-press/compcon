import { i18n } from '@/i18n'
import { slug } from '@/i18n/contentKeys.mjs'

const ENCOUNTER_RESULTS = ['PC VICTORY', 'ENEMY VICTORY', 'STALEMATE']

function resultLabel(value: string): string {
  const key = `active.endEnc.results.${slug(value)}`
  const g = i18n.global as unknown as { te: (k: string) => boolean; t: (k: string) => string }
  return g.te(key) ? g.t(key) : value
}

export { ENCOUNTER_RESULTS, resultLabel }
