import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'
import { useI18n } from 'vue-i18n'
import {
  undo as undoStack,
  redo as redoStack,
  pushCachedSnapshot,
  captureSnapshotJson,
  getUndoMeta,
} from '@/classes/encounter/EncounterUndoStack'

export interface RunnerUndo {
  undoMeta: ComputedRef<ReturnType<typeof getUndoMeta>>
  versionSignal: ComputedRef<number[]>
  doUndo: () => Promise<void>
  doRedo: () => Promise<void>
  recacheUndoBaseline: () => void
  captureBaseline: () => string | null
  restoreTo: (json: string, label: string) => Promise<void>
}

export const RunnerUndoKey: InjectionKey<RunnerUndo> = Symbol('RunnerUndo')

export function injectRunnerUndo(): RunnerUndo {
  const undo = inject(RunnerUndoKey)
  if (!undo) throw new Error('injectRunnerUndo() called outside a runner.')
  return undo
}

export function useRunnerUndo(
  instance: Ref<any>,
  restore: (data: any) => void | (() => void)
): RunnerUndo {
  const { t } = useI18n()

  const undoMeta = computed(() => getUndoMeta(instance.value?.ID ?? ''))

  let restoring = false
  let cachedSnapshot: string | null = null
  let cachedVersions: number[] = []
  let cachedRound = 0
  let cachedPlayMode = ''

  const controllersOf = (c: any) => [c.actor, c.actor.ActiveMech].map(a => a?.CombatController)

  const versionSignal = computed(() => {
    if (!instance.value) return [] as number[]
    return instance.value.Combatants.flatMap((c: any) =>
      controllersOf(c).map(cc => (cc?.CombatLogVersion as number) ?? 0)
    )
  })

  function recacheUndoBaseline() {
    if (!instance.value) return
    cachedSnapshot = captureSnapshotJson(instance.value)
    cachedVersions = versionSignal.value.slice()
    cachedRound = instance.value.Round
    cachedPlayMode = instance.value.PlayMode
  }

  function labelForAutoCapture(): string {
    if (!instance.value) return ''
    if (instance.value.PlayMode !== cachedPlayMode) return t('active.playMode.undoChange')
    if (instance.value.Round !== cachedRound) return t('active.gmRunner.undoRoundChange')
    const combatants = instance.value.Combatants
    for (let i = 0; i < combatants.length; i++) {
      const changed = controllersOf(combatants[i]).find(
        (_cc, j) => versionSignal.value[i * 2 + j] !== cachedVersions[i * 2 + j]
      )
      if (!changed) continue
      const actor = combatants[i].actor
      const name = actor.Callsign || actor.Name
      const events = changed.CombatLog?.Events || []
      const last = events[events.length - 1]
      return last ? `${name}: ${last.kind}` : name
    }
    return t('active.gmRunner.undoAction')
  }

  watch([versionSignal, () => instance.value?.Round, () => instance.value?.PlayMode], () => {
    if (restoring || !instance.value || !cachedSnapshot) return
    if (versionSignal.value.length !== cachedVersions.length) {
      recacheUndoBaseline()
      return
    }
    pushCachedSnapshot(instance.value.ID, cachedSnapshot, labelForAutoCapture())
    recacheUndoBaseline()
  })

  async function applyRestore(data: any) {
    if (!data) return
    restoring = true
    const after = restore(data)
    await nextTick()
    if (after) after()
    recacheUndoBaseline()
    restoring = false
  }

  async function doUndo() {
    if (!instance.value) return
    await applyRestore(undoStack(instance.value))
  }

  async function doRedo() {
    if (!instance.value) return
    await applyRestore(redoStack(instance.value))
  }

  function captureBaseline(): string | null {
    return instance.value ? captureSnapshotJson(instance.value) : null
  }

  async function restoreTo(json: string, label: string) {
    if (!instance.value) return
    const current = captureSnapshotJson(instance.value)
    if (current) pushCachedSnapshot(instance.value.ID, current, label)
    await applyRestore(JSON.parse(json))
  }

  function handleUndoRedoKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null
    if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
    if (target?.isContentEditable) return
    if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return
    e.preventDefault()
    if (e.shiftKey) doRedo()
    else doUndo()
  }

  onMounted(() => window.addEventListener('keydown', handleUndoRedoKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', handleUndoRedoKeydown))

  const api: RunnerUndo = {
    undoMeta,
    versionSignal,
    doUndo,
    doRedo,
    recacheUndoBaseline,
    captureBaseline,
    restoreTo,
  }
  provide(RunnerUndoKey, api)
  return api
}
