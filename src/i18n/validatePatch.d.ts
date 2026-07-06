export interface LanguagePatch {
  id: string
  lang: string
  target: string
  target_version?: string
  translation_version?: string
  last_update?: string
  translator?: string
  website?: string
  changelog?: unknown[]
  data: Record<string, string>
}

export function patchKey(target: string, lang: string): string

export function validatePatch(
  raw: unknown
): { ok: true; patch: LanguagePatch } | { ok: false; error: string }
