import { getActivePinia } from 'pinia'

// Resolve a localized string from the content catalog.
// Falls back to `fallback` (the English source value) when the catalog is empty or the key is missing.
// Uses getActivePinia() to avoid a circular import between the class layer and the store layer.
export function localize(id: string, field: string, fallback: string): string {
  const pinia = getActivePinia()
  if (!pinia) return fallback
  const stores = (pinia as unknown as { _s: Map<string, unknown> })._s
  const store = stores?.get('localization') as { catalog: Record<string, string> } | undefined
  return store?.catalog[`${id}.${field}`] ?? fallback
}
