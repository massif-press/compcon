// LCP language patch (.llp) validation

export function patchKey(target, lang) {
  return `${target}::${lang}`
}

export function validatePatch(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw))
    return { ok: false, error: 'patch must be a JSON object' }
  if (typeof raw.lang !== 'string' || !raw.lang.trim())
    return { ok: false, error: 'patch is missing a "lang" string' }
  if (!raw.data || typeof raw.data !== 'object' || Array.isArray(raw.data))
    return { ok: false, error: 'patch is missing a "data" object' }
  for (const [k, v] of Object.entries(raw.data)) {
    if (typeof v !== 'string') return { ok: false, error: `data["${k}"] must be a string` }
  }
  const lang = raw.lang.trim()
  const target = typeof raw.target === 'string' && raw.target.trim() ? raw.target.trim() : 'unknown'
  return {
    ok: true,
    patch: { ...raw, lang, target, id: patchKey(target, lang), data: raw.data },
  }
}
