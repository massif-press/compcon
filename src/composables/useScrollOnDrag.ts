let scrollInterval: ReturnType<typeof setInterval> | null = null;
let scrollVelocity = 0;

function updateVelocity(y: number) {
  const sensitivity = 100;
  const maxSpeed = 18;
  const vh = window.innerHeight;
  if (y < sensitivity) {
    scrollVelocity = -maxSpeed * (1 - y / sensitivity);
  } else if (y > vh - sensitivity) {
    scrollVelocity = maxSpeed * ((y - (vh - sensitivity)) / sensitivity);
  } else {
    scrollVelocity = 0;
  }
}

function onPointerMove(e: PointerEvent | TouchEvent) {
  const y = 'touches' in e ? e.touches[0].clientY : (e as PointerEvent).clientY;
  updateVelocity(y);
}

function onDragOver(e: DragEvent) {
  updateVelocity(e.clientY);
}

export function startDragScroll() {
  scrollVelocity = 0;
  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('touchmove', onPointerMove, { passive: true });
  document.addEventListener('dragover', onDragOver);
  scrollInterval = setInterval(() => {
    if (scrollVelocity !== 0) window.scrollBy(0, scrollVelocity);
  }, 16);
}

export function stopDragScroll() {
  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('touchmove', onPointerMove);
  document.removeEventListener('dragover', onDragOver);
  if (scrollInterval !== null) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  scrollVelocity = 0;
}
