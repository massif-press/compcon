// as long as core names don't change (why would they?), we can use them as stable keys for weblate.
export function slug(s) {
  return (
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'x'
  )
}

// anything not is not emitted
const ARRAY_CONTAINERS = {
  traits: 'trait',
  ranks: 'rank',
  profiles: 'profile',
  actions: 'action',
  active_actions: 'active_action',
  passive_actions: 'passive_action',
  active_effects: 'active_effect',
  passive_effects: 'passive_effect',
  deployables: 'deployable',
  active_deployables: 'active_deployable',
  synergies: 'synergy',
  active_synergies: 'active_synergy',
  passive_synergies: 'passive_synergy',
  ammo: 'ammo',
  add_special: 'special',
  counters: 'counter',
  active_counters: 'counter',
}
const SINGLE_CONTAINERS = {
  core_system: 'core_system',
  bonus_damage: 'bonus_damage',
  table: 'table',
}
const EMIT_FIELDS = [
  'name',
  'description',
  'terse',
  'detail',
  'effect',
  'trigger',
  'active_name',
  'active_effect',
  'passive_name',
  'passive_effect',
]

const fieldText = v =>
  typeof v === 'string' ? v : v && typeof v === 'object' ? v.detail : undefined

export function nestedEntries(_collection, item) {
  const out = []
  if (!item || item.id == null) return out

  const emit = (obj, prefix) => {
    const fields = {}
    for (const f of EMIT_FIELDS) {
      const t = fieldText(obj[f])
      if (t != null && String(t).trim()) fields[f] = t
    }
    if (Object.keys(fields).length) out.push({ prefix, obj, fields })
  }

  const walk = (obj, prefix) => {
    for (const key in SINGLE_CONTAINERS) {
      const v = obj[key]
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        const p = `${prefix}.${SINGLE_CONTAINERS[key]}`
        emit(v, p)
        walk(v, p)
      }
    }
    const seen = new Map()
    for (const key in ARRAY_CONTAINERS) {
      const arr = obj[key]
      if (!Array.isArray(arr)) continue
      arr.forEach((el, idx) => {
        if (!el || typeof el !== 'object') return
        let p
        if (el.id != null) {
          p = String(el.id)
        } else {
          const base = el.name
            ? `${ARRAY_CONTAINERS[key]}_${slug(el.name)}`
            : `${ARRAY_CONTAINERS[key]}_${idx}`
          const n = seen.get(base) || 0
          seen.set(base, n + 1)
          p = `${prefix}.${n ? `${base}_${n + 1}` : base}`
        }
        emit(el, p)
        walk(el, p)
      })
    }
  }

  walk(item, item.id)
  return out
}

// glossary has no id and is rendered directly
export function glossaryId(name) {
  return `glossary_${String(name).replace(/\W/g, '')}`
}

export const keyPrefixes = new WeakMap()

export function stampContentKeys(data) {
  if (!data) return
  for (const arr of Object.values(data)) {
    if (!Array.isArray(arr)) continue
    for (const item of arr)
      for (const e of nestedEntries(null, item)) keyPrefixes.set(e.obj, e.prefix)
  }
}
