const TILT_MQ = '(min-width: 768px)';

/** Lower = slower, softer follow (exponential smoothing per frame). */
const TILT_SMOOTH = 0.08;

/** Stop the rAF loop when errors & deltas are below this (deg / scale). */
const TILT_EPS = 0.02;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isTiltViewport(): boolean {
  return window.matchMedia(TILT_MQ).matches;
}

function parseDatasetFloat(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') return fallback;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Pointer-driven 3D tilt (rotateX / rotateY + optional scale) on a single element.
 * Skips when `prefers-reduced-motion: reduce` or viewport is below 768px.
 * Rotations and scale ease toward targets each frame (not one-to-one with pointer).
 */
export function initTilt(element: HTMLElement): () => void {
  if (prefersReducedMotion() || !isTiltViewport()) {
    return () => {};
  }

  const max = parseDatasetFloat(element.dataset.tiltMax, 3);
  const scale = parseDatasetFloat(element.dataset.tiltScale, 1.01);
  const perspective = parseDatasetFloat(element.dataset.tiltPerspective, 900);

  let inside = false;
  let targetRx = 0;
  let targetRy = 0;
  let targetScale = 1;

  let currentRx = 0;
  let currentRy = 0;
  let currentScale = 1;

  let rafId = 0;

  const applyTransform = () => {
    element.style.transform = `perspective(${perspective}px) rotateX(${currentRx}deg) rotateY(${currentRy}deg) scale3d(${currentScale}, ${currentScale}, ${currentScale})`;
  };

  const tick = () => {
    rafId = 0;

    currentRx += (targetRx - currentRx) * TILT_SMOOTH;
    currentRy += (targetRy - currentRy) * TILT_SMOOTH;
    currentScale += (targetScale - currentScale) * TILT_SMOOTH;

    const atRest =
      !inside &&
      Math.abs(currentRx) < TILT_EPS &&
      Math.abs(currentRy) < TILT_EPS &&
      Math.abs(currentScale - 1) < TILT_EPS;

    if (atRest) {
      element.style.removeProperty('transform');
      currentRx = 0;
      currentRy = 0;
      currentScale = 1;
      return;
    }

    applyTransform();

    const drift =
      Math.abs(targetRx - currentRx) > TILT_EPS ||
      Math.abs(targetRy - currentRy) > TILT_EPS ||
      Math.abs(targetScale - currentScale) > TILT_EPS;

    if (inside || drift) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const scheduleTick = () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  const updateTargetsFromEvent = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    targetRx = centerY === 0 ? 0 : ((y - centerY) / centerY) * -max;
    targetRy = centerX === 0 ? 0 : ((x - centerX) / centerX) * max;
    targetScale = scale;
  };

  const handleMouseEnter = () => {
    inside = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!inside) return;
    updateTargetsFromEvent(e);
    scheduleTick();
  };

  const handleMouseLeave = () => {
    inside = false;
    targetRx = 0;
    targetRy = 0;
    targetScale = 1;
    scheduleTick();
  };

  element.addEventListener('mouseenter', handleMouseEnter, { passive: true });
  element.addEventListener('mousemove', handleMouseMove, { passive: true });
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    element.style.removeProperty('transform');
  };
}

let resizeBound = false;
const activeCleanups: Array<() => void> = [];

function destroyAllTilts(): void {
  while (activeCleanups.length) {
    const fn = activeCleanups.pop();
    fn?.();
  }
}

function bindAllTilts(): void {
  destroyAllTilts();
  if (prefersReducedMotion() || !isTiltViewport()) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    activeCleanups.push(initTilt(el));
  });
}

/**
 * Initialise tilt for every `[data-tilt]` node. Re-binds on viewport resize (768px breakpoint).
 */
export function initAllTilts(): void {
  if (typeof window === 'undefined') return;
  if (prefersReducedMotion()) return;

  bindAllTilts();

  if (!resizeBound) {
    resizeBound = true;
    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        bindAllTilts();
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
  }
}
