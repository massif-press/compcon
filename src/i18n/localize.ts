import { getActivePinia } from 'pinia'
import { keyPrefixes, tableRowPrefix } from './contentKeys'
import type { RollableTable, ITableRoll } from '@/classes/narrative/elements/RollableTable'

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

export function localizeTableRow(tableId: string, row: ITableRoll): ITableRoll {
  const prefix = tableRowPrefix(tableId, row)
  return {
    ...row,
    title: localize(prefix, 'title', row.title ?? ''),
    result: localize(prefix, 'result', row.result),
  }
}

export function localizeTable(table: RollableTable): RollableTable {
  return Object.assign(Object.create(Object.getPrototypeOf(table)), table, {
    Title: localize(table.ID, 'title', table.Title),
    Description: localize(table.ID, 'description', table.Description),
    Results: table.Results.map(row => localizeTableRow(table.ID, row)),
  })
}
