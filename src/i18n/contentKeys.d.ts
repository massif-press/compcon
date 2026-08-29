export function slug(s: unknown): string

export const ALLOWLIST: Record<string, string[]>

export function nestedEntries(
  _collection: unknown,
  item: any
): Array<{ prefix: string; obj: object; fields: Record<string, string> }>

export function glossaryId(name: unknown): string

export function normalizeMarkup(str: unknown): string

export function markupFault(str: unknown): string | null

export const keyPrefixes: WeakMap<object, string>

export function stampContentKeys(data: unknown): void
