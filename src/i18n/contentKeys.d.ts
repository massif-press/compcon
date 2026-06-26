export function slug(s: unknown): string

export function nestedEntries(
  _collection: unknown,
  item: any
): Array<{ prefix: string; obj: object; fields: Record<string, string> }>

export function glossaryId(name: unknown): string

export const keyPrefixes: WeakMap<object, string>

export function stampContentKeys(data: unknown): void
