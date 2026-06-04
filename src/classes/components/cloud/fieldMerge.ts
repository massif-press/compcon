export type FieldTimestamps = Record<string, number>
export type FieldHashMap = Record<string, string>

let _serverTimeOffset = 0

export function setServerTimeOffset(serverTime: number): void {
  _serverTimeOffset = serverTime - Date.now()
}

function syncedNow(): number {
  return Date.now() + _serverTimeOffset
}

export function mergeTs(a: FieldTimestamps, b: FieldTimestamps): FieldTimestamps {
  const result: FieldTimestamps = { ...a }
  for (const [k, v] of Object.entries(b)) {
    result[k] = result[k] !== undefined ? Math.max(result[k], v) : v
  }
  return result
}

function isEntityArr(val: any): val is Array<Record<string, any>> {
  return Array.isArray(val) && val.length > 0 && val.some((e: any) => typeof e?.id === 'string')
}

function isPlainRecord(val: any): val is Record<string, any> {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

// derives a stable per-element key within an entity array: the first element of
// a given content id keeps the bare id (so legacy singletons are untouched),
// later duplicates get an occurrence suffix so the merge can keep all copies
function nextEntityKey(id: string, seen: Map<string, number>): string {
  const n = seen.get(id) ?? 0
  seen.set(id, n + 1)
  return n === 0 ? id : `${id}#${n}`
}

function keyedEntities(arr: any): Map<string, any> {
  const map = new Map<string, any>()
  if (!Array.isArray(arr)) return map
  const seen = new Map<string, number>()
  for (const e of arr) {
    if (e?.id) map.set(nextEntityKey(e.id, seen), e)
  }
  return map
}

function entityMaxTs(prefix: string, ts: FieldTimestamps, fallback: number): number {
  const dot = prefix + '.'
  let max = -1
  for (const [k, v] of Object.entries(ts)) {
    if (k.startsWith(dot)) max = max < 0 ? v : Math.max(max, v)
  }
  return max >= 0 ? max : fallback
}

function stableHashValue(val: any): string {
  const s = val === undefined ? '\x00' : JSON.stringify(val)
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0
  }
  return h.toString(36)
}

function buildHashMapInto(prefix: string, obj: any, result: FieldHashMap): void {
  if (!obj || typeof obj !== 'object') return
  for (const key of Object.keys(obj)) {
    if (key === '_ts' || key === 'save' || key === 'cloud') continue
    const tsKey = prefix ? `${prefix}.${key}` : key
    const val = obj[key]
    if (isEntityArr(val)) {
      const seen = new Map<string, number>()
      const keys: string[] = []
      for (const e of val) {
        if (!e?.id) continue
        const k = nextEntityKey(e.id, seen)
        keys.push(k)
        buildHashMapInto(`${tsKey}.${k}`, e, result)
      }
      result[`${tsKey}.__ids`] = keys.sort().join(',')
    } else if (isPlainRecord(val)) {
      buildHashMapInto(tsKey, val, result)
    } else {
      result[tsKey] = stableHashValue(val)
    }
  }
}

export function buildFieldHashMap(data: Record<string, any>): FieldHashMap {
  const result: FieldHashMap = {}
  buildHashMapInto('', data, result)
  return result
}

function stampObjHashed(
  prefix: string,
  current: Record<string, any>,
  hashes: FieldHashMap | null,
  result: FieldTimestamps,
  base: number,
  now: number
): void {
  for (const key of Object.keys(current)) {
    if (key === '_ts' || key === 'save' || key === 'cloud') continue
    const tsKey = prefix ? `${prefix}.${key}` : key
    const cv = current[key]

    if (isEntityArr(cv)) {
      const prevIdsStr = hashes ? hashes[`${tsKey}.__ids`] : undefined
      const prevIds = prevIdsStr
        ? new Set(prevIdsStr.split(',').filter(Boolean))
        : new Set<string>()
      const seen = new Map<string, number>()
      const curIds = new Set<string>()
      for (const e of cv) {
        if (!e?.id) continue
        const k = nextEntityKey(e.id, seen)
        curIds.add(k)
        stampObjHashed(`${tsKey}.${k}`, e, hashes, result, base, now)
      }
      for (const id of prevIds) {
        if (!curIds.has(id)) {
          const tombKey = `${tsKey}.${id}`
          result[tombKey] = Math.max(now, (result[tombKey] ?? base) + 1)
        }
      }
    } else if (isPlainRecord(cv)) {
      stampObjHashed(tsKey, cv, hashes, result, base, now)
    } else {
      const prevHash = hashes ? hashes[tsKey] : undefined
      if (prevHash === undefined || stableHashValue(cv) !== prevHash) {
        result[tsKey] = Math.max(now, (result[tsKey] ?? base) + 1)
      }
    }
  }
}

// diff current serialized item against last-synced hash map
export function stampChangedFields(
  current: Record<string, any>,
  lastHashes: FieldHashMap | null,
  existingTs: FieldTimestamps,
  itemModified: number
): FieldTimestamps {
  const result: FieldTimestamps = { ...existingTs }
  const now = syncedNow()
  stampObjHashed('', current, lastHashes, result, itemModified, now)
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
    if (key === '_ts' || key === 'save' || key === 'cloud') continue
    const fk = `${prefix}.${key}`
    const lv = local[key]
    const rv = remote[key]
    if (isEntityArr(rv) || isEntityArr(lv)) {
      merged[key] = mergeEntityArrField(fk, lv, rv, localTs, remoteTs, localBase, remoteBase)
    } else if (isPlainRecord(rv) || isPlainRecord(lv)) {
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
  const localMap = keyedEntities(localArr)
  const remoteMap = keyedEntities(remoteArr)

  const result: any[] = []
  const seen = new Set<string>()

  for (const [id, le] of localMap) {
    seen.add(id)
    const re = remoteMap.get(id)
    const ek = `${prefix}.${id}`
    if (re) {
      result.push(mergeEntityFields(ek, le, re, localTs, remoteTs, localBase, remoteBase))
    } else {
      const remoteTomb = remoteTs[ek] ?? remoteBase
      if (remoteTomb <= entityMaxTs(ek, localTs, localBase)) result.push(le)
    }
  }

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
  if (!isPlainRecord(local) && !isPlainRecord(remote)) return local ?? remote
  if (!isPlainRecord(local)) {
    const localTomb = localTs[prefix] ?? localBase
    return localTomb > entityMaxTs(prefix, remoteTs, remoteBase) ? local : remote
  }
  if (!isPlainRecord(remote)) {
    const remoteTomb = remoteTs[prefix] ?? remoteBase
    return remoteTomb > entityMaxTs(prefix, localTs, localBase) ? remote : local
  }
  return mergeEntityFields(prefix, local, remote, localTs, remoteTs, localBase, remoteBase)
}

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
    if (key === '_ts' || key === 'save' || key === 'cloud') continue
    const lv = local[key]
    const rv = remote[key]
    if (isEntityArr(rv) || isEntityArr(lv)) {
      merged[key] = mergeEntityArrField(key, lv, rv, localTs, remoteTs, localBase, remoteBase)
    } else if (isPlainRecord(rv) || isPlainRecord(lv)) {
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
