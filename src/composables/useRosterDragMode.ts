import { ref } from 'vue';

const dragModeActive = ref(false);
let _timer: ReturnType<typeof setTimeout> | null = null;

export function useRosterDragMode(durationMs = 600) {
  function onPointerDown() {
    if (_timer !== null) return;
    _timer = setTimeout(() => {
      dragModeActive.value = true;
      _timer = null;
    }, durationMs);
  }
  function onPointerUp() {
    if (_timer !== null) { clearTimeout(_timer); _timer = null; }
  }
  function onPointerCancel() {
    if (_timer !== null) { clearTimeout(_timer); _timer = null; }
  }
  function exitDragMode() {
    dragModeActive.value = false;
  }
  return { dragModeActive, onPointerDown, onPointerUp, onPointerCancel, exitDragMode };
}
