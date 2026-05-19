export type FieldTimestamps = Record<string, number>

export function mergeTs(a: FieldTimestamps, b: FieldTimestamps): FieldTimestamps {
  const result: FieldTimestamps = { ...a }
  for (const [k, v] of Object.entries(b)) {
    result[k] = result[k] !== undefined ? Math.max(result[k], v) : v
  }
  return result
}

function isEntity(val: any): val is Record<string, any> {
  return (
    val !== null && typeof val === 'object' && !Array.isArray(val) && typeof val.id === 'string'
  )
}

function isEntityArr(val: any): val is Array<Record<string, any>> {
  return Array.isArray(val) && val.length > 0 && typeof val[0]?.id === 'string'
}

function entityMaxTs(prefix: string, ts: FieldTimestamps, fallback: number): number {
  const dot = prefix + '.'
  let max = -1
  for (const [k, v] of Object.entries(ts)) {
    if (k.startsWith(dot)) max = max < 0 ? v : Math.max(max, v)
  }
  return max >= 0 ? max : fallback
}

function stampObj(
  prefix: string,
  current: Record<string, any>,
  synced: Record<string, any> | null,
  result: FieldTimestamps,
  base: number,
  now: number
): void {
  for (const key of Object.keys(current)) {
    if (key === '_ts') continue
    const tsKey = prefix ? `${prefix}.${key}` : key
    const cv = current[key]
    const sv = synced?.[key]

    if (isEntityArr(cv) || isEntityArr(sv)) {
      const syncedById: Record<string, any> = {}
      if (Array.isArray(sv))
        for (const e of sv) {
          if (e?.id) syncedById[e.id] = e
        }

      if (Array.isArray(cv)) {
        for (const e of cv) {
          if (e?.id) stampObj(`${tsKey}.${e.id}`, e, syncedById[e.id] ?? null, result, base, now)
        }
      }
      // tombstone entities removed since last sync
      const curIds = new Set(
        Array.isArray(cv) ? cv.filter((e: any) => e?.id).map((e: any) => e.id) : []
      )
      for (const id of Object.keys(syncedById)) {
        if (!curIds.has(id)) {
          const tombKey = `${tsKey}.${id}`
          result[tombKey] = Math.max(now, (result[tombKey] ?? base) + 1)
        }
      }
    } else if (isEntity(cv) || isEntity(sv)) {
      stampObj(tsKey, isEntity(cv) ? cv : {}, isEntity(sv) ? sv : null, result, base, now)
    } else {
      const cs = JSON.stringify(cv)
      const ss = synced !== null ? JSON.stringify(sv) : null
      if (ss === null || cs !== ss) {
        result[tsKey] = Math.max(now, (result[tsKey] ?? base) + 1)
      }
    }
  }

  // tombstone keys removed from current since last sync
  if (synced) {
    for (const key of Object.keys(synced)) {
      if (key === '_ts' || key in current) continue
      const tsKey = prefix ? `${prefix}.${key}` : key
      const sv = synced[key]
      if (isEntityArr(sv)) {
        for (const e of sv) {
          if (e?.id) {
            const tombKey = `${tsKey}.${e.id}`
            result[tombKey] = Math.max(now, (result[tombKey] ?? base) + 1)
          }
        }
      } else {
        result[tsKey] = Math.max(now, (result[tsKey] ?? base) + 1)
      }
    }
  }
}

// diff current serialized item against last-synced snapshot.
// On first sync (lastSynced === null), all fields are stamped with itemModified.
// entity arrays (`id` string) are recursed into so that each subfield carries its
// own timestamp instead of the whole array being one LWW unit.
export function stampChangedFields(
  current: Record<string, any>,
  lastSynced: Record<string, any> | null,
  existingTs: FieldTimestamps,
  itemModified: number
): FieldTimestamps {
  const result: FieldTimestamps = { ...existingTs }
  const now = Date.now()
  stampObj('', current, lastSynced, result, itemModified, now)
  return result
}

function mergeEntityFields(
  prefix: string,
  local: Record<string, any>,
  remote: Record<string, any>,
  localTs: FieldTimestamps,
  remoteTs: FieldTimestamps,
  localBase: number,
  remoteBase: number
): Record<string, any> {
  const merged: Record<string, any> = { ...local }
  for (const key of Object.keys(remote)) {
    if (key === '_ts') continue
    const fk = `${prefix}.${key}`
    const lv = local[key]
    const rv = remote[key]
    if (isEntityArr(rv) || isEntityArr(lv)) {
      merged[key] = mergeEntityArrField(fk, lv, rv, localTs, remoteTs, localBase, remoteBase)
    } else if (isEntity(rv) || isEntity(lv)) {
      merged[key] = mergeEntityObjField(fk, lv, rv, localTs, remoteTs, localBase, remoteBase)
    } else {
      const lt = localTs[fk] ?? localBase
      const rt = remoteTs[fk] ?? remoteBase
      if (rt > lt) merged[key] = rv
    }
  }
  return merged
}

function mergeEntityArrField(
  prefix: string,
  localArr: any,
  remoteArr: any,
  localTs: FieldTimestamps,
  remoteTs: FieldTimestamps,
  localBase: number,
  remoteBase: number
): any[] {
  const localMap = new Map<string, any>()
  const remoteMap = new Map<string, any>()
  if (Array.isArray(localArr))
    for (const e of localArr) {
      if (e?.id) localMap.set(e.id, e)
    }
  if (Array.isArray(remoteArr))
    for (const e of remoteArr) {
      if (e?.id) remoteMap.set(e.id, e)
    }

  const result: any[] = []
  const seen = new Set<string>()

  // local order first to preserve ordering
  for (const [id, le] of localMap) {
    seen.add(id)
    const re = remoteMap.get(id)
    const ek = `${prefix}.${id}`
    if (re) {
      result.push(mergeEntityFields(ek, le, re, localTs, remoteTs, localBase, remoteBase))
    } else {
      // entity missing on remote = keep unless remote has a newer tombstone
      const remoteTomb = remoteTs[ek] ?? remoteBase
      if (remoteTomb <= entityMaxTs(ek, localTs, localBase)) result.push(le)
    }
  }

  // append remote-only entities, skip if local has a newer tombstone
  for (const [id, re] of remoteMap) {
    if (seen.has(id)) continue
    const ek = `${prefix}.${id}`
    const localTomb = localTs[ek] ?? localBase
    if (localTomb <= entityMaxTs(ek, remoteTs, remoteBase)) result.push(re)
  }

  return result
}

function mergeEntityObjField(
  prefix: string,
  local: any,
  remote: any,
  localTs: FieldTimestamps,
  remoteTs: FieldTimestamps,
  localBase: number,
  remoteBase: number
): any {
  if (!isEntity(local) && !isEntity(remote)) return local ?? remote
  if (!isEntity(local)) {
    const localTomb = localTs[prefix] ?? localBase
    return localTomb > entityMaxTs(prefix, remoteTs, remoteBase) ? local : remote
  }
  if (!isEntity(remote)) {
    const remoteTomb = remoteTs[prefix] ?? remoteBase
    return remoteTomb > entityMaxTs(prefix, localTs, localBase) ? remote : local
  }
  return mergeEntityFields(prefix, local, remote, localTs, remoteTs, localBase, remoteBase)
}

// later timestamp wins per field. Falls back to item_modified when a field has no _ts entry.
// entity arrays are merged element-by-element so a change to one entity never overwrites another.
export function mergeFields(
  local: Record<string, any>,
  remote: Record<string, any>
): Record<string, any> {
  const localTs: FieldTimestamps = local._ts ?? {}
  const remoteTs: FieldTimestamps = remote._ts ?? {}
  const localBase: number = local.item_modified ?? 0
  const remoteBase: number = remote.item_modified ?? 0

  const merged: Record<string, any> = { ...local }

  for (const key of Object.keys(remote)) {
    if (key === '_ts') continue
    const lv = local[key]
    const rv = remote[key]
    if (isEntityArr(rv) || isEntityArr(lv)) {
      merged[key] = mergeEntityArrField(key, lv, rv, localTs, remoteTs, localBase, remoteBase)
    } else if (isEntity(rv) || isEntity(lv)) {
      merged[key] = mergeEntityObjField(key, lv, rv, localTs, remoteTs, localBase, remoteBase)
    } else {
      const lt = localTs[key] ?? localBase
      const rt = remoteTs[key] ?? remoteBase
      if (rt > lt) merged[key] = rv
    }
  }

  merged._ts = mergeTs(localTs, remoteTs)
  return merged
}
