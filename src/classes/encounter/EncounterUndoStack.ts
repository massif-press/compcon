import { reactive } from 'vue'
import logger from '@/user/logger'
import { EncounterInstance, IEncounterInstanceData } from './EncounterInstance'

const MAX_ENTRIES_PER_STACK = 30
const MAX_BYTES_ALL_STACKS = 8 * 1024 * 1024

interface UndoEntry {
  label: string
  json: string
}

interface StackState {
  undo: UndoEntry[]
  redo: UndoEntry[]
}

interface UndoMeta {
  canUndo: boolean
  canRedo: boolean
  undoLabel: string
  redoLabel: string
}

const stacks = new Map<string, StackState>()
const meta = reactive<Record<string, UndoMeta>>({})

function getStack(id: string): StackState {
  let s = stacks.get(id)
  if (!s) {
    s = { undo: [], redo: [] }
    stacks.set(id, s)
  }
  return s
}

function refreshMeta(id: string): void {
  const s = getStack(id)
  meta[id] = {
    canUndo: s.undo.length > 0,
    canRedo: s.redo.length > 0,
    undoLabel: s.undo[s.undo.length - 1]?.label ?? '',
    redoLabel: s.redo[s.redo.length - 1]?.label ?? '',
  }
}

function totalBytes(): number {
  let bytes = 0
  for (const s of stacks.values()) {
    for (const e of s.undo) bytes += e.json.length
    for (const e of s.redo) bytes += e.json.length
  }
  return bytes
}

function trim(activeId: string): void {
  for (const s of stacks.values()) {
    while (s.undo.length > MAX_ENTRIES_PER_STACK) s.undo.shift()
  }

  let bytes = totalBytes()
  if (bytes <= MAX_BYTES_ALL_STACKS) return

  for (const [id, s] of leastRecentlyUsedFirst()) {
    const undoEntriesToKeep = id === activeId ? 1 : 0
    while (bytes > MAX_BYTES_ALL_STACKS && s.redo.length) bytes -= s.redo.shift()!.json.length
    while (bytes > MAX_BYTES_ALL_STACKS && s.undo.length > undoEntriesToKeep) {
      bytes -= s.undo.shift()!.json.length
    }
    if (bytes <= MAX_BYTES_ALL_STACKS) break
  }

  for (const id of stacks.keys()) refreshMeta(id)
}

function leastRecentlyUsedFirst(): Iterable<[string, StackState]> {
  return stacks
}

function markMostRecentlyUsed(id: string): StackState {
  const s = getStack(id)
  stacks.delete(id)
  stacks.set(id, s)
  return s
}

function pushEntry(id: string, json: string, label: string): void {
  const s = markMostRecentlyUsed(id)
  s.undo.push({ label, json })
  s.redo = []
  trim(id)
  refreshMeta(id)
}

function serializeJson(instance: EncounterInstance): string {
  return JSON.stringify(EncounterInstance.Serialize(instance))
}

function trySerializeJson(instance: EncounterInstance): string | null {
  try {
    return serializeJson(instance)
  } catch (err) {
    logger.error('Failed to serialize encounter undo snapshot', instance, err)
    return null
  }
}

export function serializeSnapshot(instance: EncounterInstance): IEncounterInstanceData {
  return JSON.parse(serializeJson(instance))
}

export function trySerializeSnapshot(instance: EncounterInstance): IEncounterInstanceData | null {
  const json = trySerializeJson(instance)
  return json === null ? null : JSON.parse(json)
}

export function snapshot(instance: EncounterInstance, label: string): void {
  const json = trySerializeJson(instance)
  if (!json) return
  pushEntry(instance.ID, json, label)
}

export function pushCachedSnapshot(
  id: string,
  data: IEncounterInstanceData | string,
  label: string
): void {
  pushEntry(id, typeof data === 'string' ? data : JSON.stringify(data), label)
}

export function captureSnapshotJson(instance: EncounterInstance): string | null {
  return trySerializeJson(instance)
}

export function undo(instance: EncounterInstance): IEncounterInstanceData | null {
  const s = markMostRecentlyUsed(instance.ID)
  const entry = s.undo.pop()
  if (!entry) return null
  const current = trySerializeJson(instance)
  if (current) s.redo.push({ label: entry.label, json: current })
  trim(instance.ID)
  refreshMeta(instance.ID)
  return JSON.parse(entry.json)
}

export function redo(instance: EncounterInstance): IEncounterInstanceData | null {
  const s = markMostRecentlyUsed(instance.ID)
  const entry = s.redo.pop()
  if (!entry) return null
  const current = trySerializeJson(instance)
  if (current) s.undo.push({ label: entry.label, json: current })
  trim(instance.ID)
  refreshMeta(instance.ID)
  return JSON.parse(entry.json)
}

export function getUndoMeta(id: string): UndoMeta {
  return meta[id] ?? { canUndo: false, canRedo: false, undoLabel: '', redoLabel: '' }
}

export function clearUndoStack(id: string): void {
  stacks.delete(id)
  delete meta[id]
}
