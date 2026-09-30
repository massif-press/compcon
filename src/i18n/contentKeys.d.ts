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

export const LCP_FIELDS: Record<string, string[]>

export function eidolonTraitId(name: unknown): string

export function bondPowerPrefix(origin: unknown, name: unknown): string

export function bondPowerEntries(power: any, origin?: string): Array<[string, string]>

export function bondEntries(bond: any): Array<[string, string]>
