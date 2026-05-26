function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function bindSpotlight(el: HTMLElement): () => void {
  let scheduled = false;
  let lastX = 0;
  let lastY = 0;

  const apply = () => {
    const rect = el.getBoundingClientRect();
    const x = ((lastX - rect.left) / rect.width) * 100;
    const y = ((lastY - rect.top) / rect.height) * 100;
    const clampedX = Math.min(100, Math.max(0, x));
    const clampedY = Math.min(100, Math.max(0, y));
    el.style.setProperty('--spot-x', `${clampedX}%`);
    el.style.setProperty('--spot-y', `${clampedY}%`);
  };

  const onPointerMove = (e: PointerEvent) => {
    lastX = e.clientX;
    lastY = e.clientY;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  };

  const onPointerLeave = () => {
    scheduled = false;
    el.style.removeProperty('--spot-x');
    el.style.removeProperty('--spot-y');
  };

  el.addEventListener('pointermove', onPointerMove, { passive: true });
  el.addEventListener('pointerleave', onPointerLeave);

  return () => {
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerleave', onPointerLeave);
    onPointerLeave();
  };
}

let resizeBound = false;
const activeCleanups: Array<() => void> = [];

function destroyAll(): void {
  while (activeCleanups.length) {
    const fn = activeCleanups.pop();
    fn?.();
  }
}

function bindAll(): void {
  destroyAll();
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((el) => {
    activeCleanups.push(bindSpotlight(el));
  });
}

/**
 * Drive `--spot-x` / `--spot-y` on `[data-spotlight]` for the radial wash in global.css.
 */
export function initSpotlightCards(): void {
  if (typeof window === 'undefined') return;
  if (prefersReducedMotion()) return;

  bindAll();

  if (!resizeBound) {
    resizeBound = true;
    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        bindAll();
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
  }
}
