import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import { Encounter } from './Encounter'
import { EncounterInstance } from './EncounterInstance'
import {
  serializeSnapshot,
  trySerializeSnapshot,
  snapshot,
  undo,
  redo,
  getUndoMeta,
  clearUndoStack,
  pushCachedSnapshot,
} from './EncounterUndoStack'

let instance: EncounterInstance

const usedIds: string[] = []

const newInstance = () => {
  const pilot = makePilot()
  makeMech(pilot)
  const encounter = new Encounter()
  encounter.Name = 'Ambush'
  const inst = new EncounterInstance(undefined, encounter, [pilot])
  usedIds.push(inst.ID)
  return inst
}

beforeEach(() => {
  while (usedIds.length) clearUndoStack(usedIds.pop()!)
  instance = newInstance()
  clearUndoStack(instance.ID)
})

describe('serializeSnapshot', () => {
  it('captures the instance state', () => {
    expect(serializeSnapshot(instance).id).toBe(instance.ID)
  })

  it('returns null rather than throwing on a broken instance', () => {
    expect(trySerializeSnapshot({} as never)).toBeNull()
  })
})

describe('the undo stack', () => {
  it('starts with nothing to undo or redo', () => {
    const meta = getUndoMeta(instance.ID)

    expect(meta.canUndo).toBe(false)
    expect(meta.canRedo).toBe(false)
  })

  it('offers an undo once a snapshot is taken', () => {
    snapshot(instance, 'damage')

    expect(getUndoMeta(instance.ID).canUndo).toBe(true)
    expect(getUndoMeta(instance.ID).undoLabel).toBe('damage')
  })

  it('restores the snapshot taken before the change', () => {
    snapshot(instance, 'round 1')
    instance.Round = 5

    const restored = undo(instance)

    expect(restored?.round).toBe(1)
    expect(getUndoMeta(instance.ID).canRedo).toBe(true)
  })

  it('redoes what was undone', () => {
    snapshot(instance, 'round 1')
    instance.Round = 5
    undo(instance)

    const redone = redo(instance)

    expect(redone?.round).toBe(5)
  })

  it('is null when there is nothing to undo or redo', () => {
    expect(undo(instance)).toBeNull()
    expect(redo(instance)).toBeNull()
  })

  it('drops the redo branch once a new snapshot is taken', () => {
    snapshot(instance, 'first')
    instance.Round = 5
    undo(instance)

    snapshot(instance, 'second')

    expect(getUndoMeta(instance.ID).canRedo).toBe(false)
  })

  it('accepts a snapshot captured earlier', () => {
    pushCachedSnapshot(instance.ID, serializeSnapshot(instance), 'cached')

    expect(getUndoMeta(instance.ID).undoLabel).toBe('cached')
  })

  it('clears the stack', () => {
    snapshot(instance, 'damage')
    clearUndoStack(instance.ID)

    expect(getUndoMeta(instance.ID).canUndo).toBe(false)
  })

  it('evicts oldest entries once the stack exceeds its byte budget', () => {
    const pad = 'x'.repeat(1024 * 1024)
    for (let i = 0; i < 20; i++) {
      pushCachedSnapshot(instance.ID, { ...serializeSnapshot(instance), pad } as never, `edit ${i}`)
    }

    expect(getUndoMeta(instance.ID).undoLabel).toBe('edit 19')

    let retained = 0
    while (undo(instance)) retained++

    expect(retained).toBeGreaterThan(0)
    expect(retained).toBeLessThan(12)
  })

  it('spends the byte budget across every encounter, oldest first', () => {
    const idle = newInstance()
    clearUndoStack(idle.ID)
    const pad = 'x'.repeat(1024 * 1024)
    const fill = (inst: EncounterInstance, label: string) =>
      pushCachedSnapshot(inst.ID, { ...serializeSnapshot(inst), pad } as never, label)

    for (let i = 0; i < 6; i++) fill(idle, `idle ${i}`)
    expect(getUndoMeta(idle.ID).canUndo).toBe(true)

    for (let i = 0; i < 8; i++) fill(instance, `active ${i}`)

    expect(getUndoMeta(idle.ID).canUndo).toBe(false)
    expect(getUndoMeta(instance.ID).undoLabel).toBe('active 7')

    clearUndoStack(idle.ID)
  })

  it('keeps stacks separate per encounter', () => {
    const other = newInstance()
    clearUndoStack(other.ID)

    snapshot(instance, 'damage')

    expect(getUndoMeta(other.ID).canUndo).toBe(false)
  })
})
