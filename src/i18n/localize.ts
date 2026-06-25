import { getActivePinia } from 'pinia'
import { keyPrefixes } from './contentKeys'

export function localize(id: string, field: string, fallback: string): string {
  const pinia = getActivePinia()
  if (!pinia) return fallback
  const stores = (pinia as unknown as { _s: Map<string, unknown> })._s
  const store = stores?.get('localization') as { catalog: Record<string, string> } | undefined
  return store?.catalog[`${id}.${field}`] ?? fallback
}

export function localizeNested(obj: object, field: string, fallback: string): string {
  const prefix = keyPrefixes.get(obj)
  return prefix ? localize(prefix, field, fallback) : fallback
}
