export type FieldTimestamps = Record<string, number>

export function mergeTs(a: FieldTimestamps, b: FieldTimestamps): FieldTimestamps {
  const result: FieldTimestamps = { ...a }
  for (const [k, v] of Object.entries(b)) {
    result[k] = result[k] !== undefined ? Math.max(result[k], v) : v
  }
  return result
}

// diff current serialized item against last-synced snapshot
// on first sync (lastSynced === null), all fields are stamped with itemModified.
export function stampChangedFields(
  current: Record<string, any>,
  lastSynced: Record<string, any> | null,
  existingTs: FieldTimestamps,
  itemModified: number
): FieldTimestamps {
  const result: FieldTimestamps = { ...existingTs }
  const now = Date.now()

  for (const key of Object.keys(current)) {
    if (key === '_ts') continue
    const currentStr = JSON.stringify(current[key])
    const syncedStr = lastSynced !== null ? JSON.stringify(lastSynced[key]) : null

    if (syncedStr === null || currentStr !== syncedStr) {
      const prev = result[key] ?? itemModified
      result[key] = Math.max(now, prev + 1)
    }
  }

  // Tombstone: fields removed since last sync get a deletion timestamp
  if (lastSynced) {
    for (const key of Object.keys(lastSynced)) {
      if (key === '_ts') continue
      if (!(key in current)) {
        const prev = result[key] ?? itemModified
        result[key] = Math.max(now, prev + 1)
      }
    }
  }

  return result
}

// later timestamp wins. Falls back to item_modified when a field has no _ts entry
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
    const lt = localTs[key] ?? localBase
    const rt = remoteTs[key] ?? remoteBase
    if (rt > lt) merged[key] = remote[key]
  }

  merged._ts = mergeTs(localTs, remoteTs)
  return merged
}
