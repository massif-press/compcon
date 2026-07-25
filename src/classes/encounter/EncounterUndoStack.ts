import { reactive } from 'vue'
import { EncounterInstance, IEncounterInstanceData } from './EncounterInstance'

const MAX_ENTRIES = 30

interface UndoEntry {
  label: string
  data: IEncounterInstanceData
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

function pushEntry(id: string, data: IEncounterInstanceData, label: string): void {
  const s = getStack(id)
  s.undo.push({ label, data })
  if (s.undo.length > MAX_ENTRIES) s.undo.shift()
  s.redo = []
  refreshMeta(id)
}

export function serializeSnapshot(instance: EncounterInstance): IEncounterInstanceData {
  return JSON.parse(JSON.stringify(EncounterInstance.Serialize(instance)))
}

export function snapshot(instance: EncounterInstance, label: string): void {
  pushEntry(instance.ID, serializeSnapshot(instance), label)
}

export function pushCachedSnapshot(id: string, data: IEncounterInstanceData, label: string): void {
  pushEntry(id, data, label)
}

export function undo(instance: EncounterInstance): IEncounterInstanceData | null {
  const s = getStack(instance.ID)
  const entry = s.undo.pop()
  if (!entry) return null
  s.redo.push({ label: entry.label, data: serializeSnapshot(instance) })
  refreshMeta(instance.ID)
  return entry.data
}

export function redo(instance: EncounterInstance): IEncounterInstanceData | null {
  const s = getStack(instance.ID)
  const entry = s.redo.pop()
  if (!entry) return null
  s.undo.push({ label: entry.label, data: serializeSnapshot(instance) })
  refreshMeta(instance.ID)
  return entry.data
}

export function getUndoMeta(id: string): UndoMeta {
  return meta[id] ?? { canUndo: false, canRedo: false, undoLabel: '', redoLabel: '' }
}

export function clearUndoStack(id: string): void {
  stacks.delete(id)
  delete meta[id]
}
