export type FieldTimestamps = Record<string, number>
export type FieldHashMap = Record<string, string>

let _serverTimeOffset = 0

export function setServerTimeOffset(serverTime: number): void {
  _serverTimeOffset = serverTime - Date.now()
}

export function toServerTime(deviceTime: number): number {
  return deviceTime + _serverTimeOffset
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

export const HASH_FORMAT_KEY = '__v'
export const FORCED_KEY = '__forced'

const UI_KEYS = new Set(['ui_state'])
const BOOKKEEPING_KEYS = new Set(['_ts', 'save', 'cloud', ...UI_KEYS])
const PILOT_DERIVED_KEYS = new Set(['data', 'frameData', 'brews', 'sortIndex', ...UI_KEYS])
const GROUP_DERIVED_KEYS = new Set(['expanded', ...UI_KEYS])
const NO_KEYS = new Set<string>()

const DERIVED_KEYS: Record<string, Set<string>> = {
  pilot: PILOT_DERIVED_KEYS,
  pilotgroup: GROUP_DERIVED_KEYS,
}
const SKIP_KEYS: Record<string, Set<string>> = {
  pilot: new Set([...BOOKKEEPING_KEYS, ...PILOT_DERIVED_KEYS]),
  pilotgroup: new Set([...BOOKKEEPING_KEYS, ...GROUP_DERIVED_KEYS]),
}

export function derivedKeysFor(root: any): Set<string> {
  return DERIVED_KEYS[root?.itemType] ?? UI_KEYS
}

function skipKeysFor(root: any): Set<string> {
  return SKIP_KEYS[root?.itemType] ?? BOOKKEEPING_KEYS
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

function entityMaxTs(prefix: string, ts: FieldTimestamps, skip: Set<string>): number {
  const dot = prefix + '.'
  let max = 0
  for (const [k, v] of Object.entries(ts)) {
    if (v <= max || !k.startsWith(dot)) continue
    const parts = k.slice(dot.length).split('.')
    if (!parts.some(part => skip.has(part))) max = v
  }
  return max
}

function stripKeys(val: any, skip: Set<string>): any {
  if (Array.isArray(val)) return val.map(v => stripKeys(v, skip))
  if (!isPlainRecord(val)) return val
  const out: Record<string, any> = {}
  for (const key of Object.keys(val)) {
    if (!skip.has(key)) out[key] = stripKeys(val[key], skip)
  }
  return out
}

function stableHashValue(val: any, skip: Set<string>): string {
  const s = val === undefined ? '\x00' : JSON.stringify(stripKeys(val, skip))
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0
  }
  return h.toString(36)
}

function buildHashMapInto(prefix: string, obj: any, result: FieldHashMap, skip: Set<string>): void {
  if (!obj || typeof obj !== 'object') return
  for (const key of Object.keys(obj)) {
    if (skip.has(key)) continue
    const tsKey = prefix ? `${prefix}.${key}` : key
    const val = obj[key]
    if (isEntityArr(val)) {
      const seen = new Map<string, number>()
      const keys: string[] = []
      for (const e of val) {
        if (!e?.id) continue
        const k = nextEntityKey(e.id, seen)
        keys.push(k)
        buildHashMapInto(`${tsKey}.${k}`, e, result, skip)
      }
      result[`${tsKey}.__order`] = keys.join(',')
      result[`${tsKey}.__ids`] = [...keys].sort().join(',')
    } else if (isPlainRecord(val)) {
      buildHashMapInto(tsKey, val, result, skip)
    } else {
      result[tsKey] = stableHashValue(val, skip)
    }
  }
}

export function buildFieldHashMap(data: Record<string, any>): FieldHashMap {
  const result: FieldHashMap = { [HASH_FORMAT_KEY]: '1' }
  buildHashMapInto('', data, result, skipKeysFor(data))
  return result
}

function stampObjHashed(
  prefix: string,
  current: Record<string, any>,
  hashes: FieldHashMap | null,
  result: FieldTimestamps,
  base: number,
  now: number,
  skip: Set<string>
): void {
  for (const key of Object.keys(current)) {
    if (skip.has(key)) continue
    const tsKey = prefix ? `${prefix}.${key}` : key
    const cv = current[key]
    const prevIdsStr = hashes ? hashes[`${tsKey}.__ids`] : undefined

    if (isEntityArr(cv) || (Array.isArray(cv) && prevIdsStr)) {
      const prevIds = prevIdsStr
        ? new Set(prevIdsStr.split(',').filter(Boolean))
        : new Set<string>()
      const seen = new Map<string, number>()
      const curIds = new Set<string>()
      const curOrder: string[] = []
      for (const e of cv) {
        if (!e?.id) continue
        const k = nextEntityKey(e.id, seen)
        curIds.add(k)
        curOrder.push(k)
        stampObjHashed(`${tsKey}.${k}`, e, hashes, result, base, now, skip)
      }
      const prevOrderStr = hashes ? hashes[`${tsKey}.__order`] : undefined
      if (prevOrderStr !== undefined) {
        const prevCommon = prevOrderStr.split(',').filter(k => curIds.has(k))
        const curCommon = curOrder.filter(k => prevIds.has(k))
        if (prevCommon.join(',') !== curCommon.join(',')) {
          const orderKey = `${tsKey}.__order`
          result[orderKey] = Math.max(now, (result[orderKey] ?? base) + 1)
        }
      }
      for (const id of prevIds) {
        if (!curIds.has(id)) {
          const tombKey = `${tsKey}.${id}`
          result[tombKey] = Math.max(now, (result[tombKey] ?? base) + 1)
        }
      }
    } else if (isPlainRecord(cv)) {
      stampObjHashed(tsKey, cv, hashes, result, base, now, skip)
    } else {
      const prevHash = hashes ? hashes[tsKey] : undefined
      if (cv === undefined && prevHash === undefined) continue
      if (prevHash === stableHashValue(cv, skip) || prevHash === stableHashValue(cv, NO_KEYS))
        continue
      result[tsKey] = Math.max(now, (result[tsKey] ?? base) + 1)
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
  const now = toServerTime(Date.now())
  stampObjHashed('', current, lastHashes, result, itemModified, now, skipKeysFor(current))
  return result
}

function mergeEntityFields(
  prefix: string,
  local: Record<string, any>,
  remote: Record<string, any>,
  localTs: FieldTimestamps,
  remoteTs: FieldTimestamps,
  skip: Set<string>,
  floor: number
): Record<string, any> {
  const merged: Record<string, any> = { ...local }
  for (const key of Object.keys(remote)) {
    if (skip.has(key)) continue
    const fk = `${prefix}.${key}`
    const lv = local[key]
    const rv = remote[key]
    if (isEntityArr(rv) || isEntityArr(lv)) {
      merged[key] = mergeEntityArrField(fk, lv, rv, localTs, remoteTs, skip, floor)
    } else if (isPlainRecord(rv) || isPlainRecord(lv)) {
      merged[key] = mergeEntityObjField(fk, lv, rv, localTs, remoteTs, skip, floor)
    } else if ((remoteTs[fk] ?? 0) >= (localTs[fk] ?? 0)) {
      merged[key] = rv
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
  skip: Set<string>,
  floor: number
): any[] {
  const localMap = keyedEntities(localArr)
  const remoteMap = keyedEntities(remoteArr)

  const result: Array<[string, any]> = []

  for (const [id, le] of localMap) {
    const re = remoteMap.get(id)
    const ek = `${prefix}.${id}`
    if (re) {
      result.push([id, mergeEntityFields(ek, le, re, localTs, remoteTs, skip, floor)])
    } else {
      const remoteTomb = Math.max(remoteTs[ek] ?? 0, floor)
      if (remoteTomb <= entityMaxTs(ek, localTs, skip)) result.push([id, le])
    }
  }

  for (const [id, re] of remoteMap) {
    if (localMap.has(id)) continue
    const ek = `${prefix}.${id}`
    const localTomb = localTs[ek] ?? 0
    if (localTomb <= entityMaxTs(ek, remoteTs, skip)) result.push([id, re])
  }

  const orderKey = `${prefix}.__order`
  if ((remoteTs[orderKey] ?? 0) >= (localTs[orderKey] ?? 0)) {
    const remoteRank = new Map([...remoteMap.keys()].map((k, i) => [k, i]))
    const rank = (k: string) => remoteRank.get(k) ?? Infinity
    result.sort((a, b) => rank(a[0]) - rank(b[0]))
  }

  return result.map(([, e]) => e)
}

function mergeEntityObjField(
  prefix: string,
  local: any,
  remote: any,
  localTs: FieldTimestamps,
  remoteTs: FieldTimestamps,
  skip: Set<string>,
  floor: number
): any {
  if (!isPlainRecord(local) && !isPlainRecord(remote)) return local ?? remote
  if (!isPlainRecord(local)) {
    const localTomb = localTs[prefix] ?? 0
    return localTomb > entityMaxTs(prefix, remoteTs, skip) ? local : remote
  }
  if (!isPlainRecord(remote)) {
    const remoteTomb = Math.max(remoteTs[prefix] ?? 0, floor)
    return remoteTomb > entityMaxTs(prefix, localTs, skip) ? remote : local
  }
  return mergeEntityFields(prefix, local, remote, localTs, remoteTs, skip, floor)
}

export function mergeFields(
  local: Record<string, any>,
  remote: Record<string, any>
): Record<string, any> {
  const remoteTs: FieldTimestamps = remote._ts ?? {}
  const forced = remoteTs[FORCED_KEY] ?? 0
  const floor = forced > (local._ts?.[FORCED_KEY] ?? 0) ? forced : 0
  const localTs: FieldTimestamps = Object.fromEntries(
    Object.entries(local._ts ?? {}).filter(([, v]) => (v as number) >= floor)
  ) as FieldTimestamps

  const skip = skipKeysFor(local.itemType ? local : remote)
  const merged: Record<string, any> = { ...local }

  for (const key of Object.keys(remote)) {
    if (skip.has(key)) continue
    const lv = local[key]
    const rv = remote[key]
    if (isEntityArr(rv) || isEntityArr(lv)) {
      merged[key] = mergeEntityArrField(key, lv, rv, localTs, remoteTs, skip, floor)
    } else if (isPlainRecord(rv) || isPlainRecord(lv)) {
      merged[key] = mergeEntityObjField(key, lv, rv, localTs, remoteTs, skip, floor)
    } else if ((remoteTs[key] ?? 0) >= (localTs[key] ?? 0)) {
      merged[key] = rv
    }
  }

  merged._ts = mergeTs(localTs, remoteTs)
  return merged
}
