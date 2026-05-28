import { ref } from 'vue'

const _sharedDragRef = ref(false)
let _sharedTimer: ReturnType<typeof setTimeout> | null = null

export function useDragMode(durationMs = 600, { shared = false } = {}) {
  const dragModeActive = shared ? _sharedDragRef : ref(false)
  let _timer: ReturnType<typeof setTimeout> | null = null

  const timerRef = shared
    ? { get: () => _sharedTimer, set: (v: ReturnType<typeof setTimeout> | null) => { _sharedTimer = v } }
    : { get: () => _timer, set: (v: ReturnType<typeof setTimeout> | null) => { _timer = v } }

  function onPointerDown() {
    if (timerRef.get() !== null) return
    timerRef.set(setTimeout(() => {
      dragModeActive.value = true
      timerRef.set(null)
    }, durationMs))
  }

  function onPointerUp() {
    const t = timerRef.get()
    if (t !== null) { clearTimeout(t); timerRef.set(null) }
  }

  function onPointerCancel() {
    const t = timerRef.get()
    if (t !== null) { clearTimeout(t); timerRef.set(null) }
  }

  function exitDragMode() {
    dragModeActive.value = false
  }

  return { dragModeActive, onPointerDown, onPointerUp, onPointerCancel, exitDragMode }
}
