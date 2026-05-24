import { ref } from 'vue';

export function useLongPressDragMode(durationMs = 600) {
  const dragModeActive = ref(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  function onPointerDown() {
    timer = setTimeout(() => {
      dragModeActive.value = true;
    }, durationMs);
  }

  function onPointerUp() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function onPointerCancel() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function exitDragMode() {
    dragModeActive.value = false;
  }

  return { dragModeActive, onPointerDown, onPointerUp, onPointerCancel, exitDragMode };
}

export default {
  setup() {
    return useLongPressDragMode();
  },
};
