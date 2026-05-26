import { Vector3, type Group, type PerspectiveCamera } from 'three';

const NAV_SLOT_SELECTOR = '.nav-brand__logo-slot';
const LOGO_SCREEN_PX = 220;

export interface NavScreenTarget {
  centerX: number;
  centerY: number;
  sizePx: number;
}

export interface NavFlightTransform {
  world: { x: number; y: number; z: number };
  scale: number;
  target: NavScreenTarget;
}

/** Read the logo slot position from layout (works at any viewport width). */
export function getNavBrandScreenTarget(): NavScreenTarget | null {
  const slot = document.querySelector<HTMLElement>(NAV_SLOT_SELECTOR);
  if (!slot) return null;

  const rect = slot.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;

  return {
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
    sizePx: rect.width,
  };
}

export function waitForNavBrandTarget(maxMs = 4000): Promise<NavScreenTarget> {
  const immediate = getNavBrandScreenTarget();
  if (immediate) return Promise.resolve(immediate);

  return new Promise((resolve) => {
    const start = performance.now();
    let settled = false;

    const settle = (target: NavScreenTarget) => {
      if (settled) return;
      settled = true;
      window.clearInterval(poll);
      ro.disconnect();
      window.removeEventListener('resize', onWindowResize);
      resolve(target);
    };

    const tryMeasure = () => getNavBrandScreenTarget();

    const poll = window.setInterval(() => {
      const target = tryMeasure();
      if (target) settle(target);
      else if (performance.now() - start > maxMs) {
        settle(tryMeasure() ?? lastResortNavTarget());
      }
    }, 32);

    const ro = new ResizeObserver(() => {
      const target = tryMeasure();
      if (target) settle(target);
    });

    const onWindowResize = () => {
      const target = tryMeasure();
      if (target) settle(target);
    };

    const slot = document.querySelector(NAV_SLOT_SELECTOR);
    const nav = document.querySelector('.card-nav-container');
    if (slot) ro.observe(slot);
    if (nav) ro.observe(nav);
    window.addEventListener('resize', onWindowResize, { passive: true });
  });
}

function lastResortNavTarget(): NavScreenTarget {
  const nav = document.querySelector<HTMLElement>('.card-nav-container');
  if (nav) {
    const rect = nav.getBoundingClientRect();
    if (rect.width > 0) {
      return {
        centerX: rect.left + Math.min(56, rect.width * 0.12),
        centerY: rect.top + rect.height / 2,
        sizePx: 36,
      };
    }
  }

  return {
    centerX: window.innerWidth * 0.5,
    centerY: 56,
    sizePx: 36,
  };
}

/** Map a viewport pixel to world space on the z=0 plane for the current camera. */
export function worldPositionForScreenPoint(
  screenX: number,
  screenY: number,
  camera: PerspectiveCamera,
  viewWidth: number,
  viewHeight: number
): { x: number; y: number; z: number } {
  const ndcX = (screenX / viewWidth) * 2 - 1;
  const ndcY = -(screenY / viewHeight) * 2 + 1;
  const clip = new Vector3(ndcX, ndcY, 0.5);

  camera.updateMatrixWorld(true);
  clip.unproject(camera);

  const dir = clip.sub(camera.position).normalize();
  const epsilon = 1e-5;
  if (Math.abs(dir.z) < epsilon) {
    return { x: clip.x, y: clip.y, z: 0 };
  }

  const distance = (0 - camera.position.z) / dir.z;
  const point = camera.position.clone().add(dir.multiplyScalar(distance));
  return { x: point.x, y: point.y, z: 0 };
}

/** Live nav slot → world position + scale for the current viewport and camera. */
export function resolveNavFlightTransform(
  camera: PerspectiveCamera,
  viewWidth = window.innerWidth,
  viewHeight = window.innerHeight
): NavFlightTransform | null {
  const target = getNavBrandScreenTarget();
  if (!target) return null;

  const world = worldPositionForScreenPoint(
    target.centerX,
    target.centerY,
    camera,
    viewWidth,
    viewHeight
  );

  return {
    world,
    scale: target.sizePx / LOGO_SCREEN_PX,
    target,
  };
}

/** Snap the model to the nav slot immediately (handoff / resize). */
export function snapModelToNavSlot(
  modelGroup: Group,
  camera: PerspectiveCamera,
  viewWidth = window.innerWidth,
  viewHeight = window.innerHeight
): NavFlightTransform | null {
  const resolved = resolveNavFlightTransform(camera, viewWidth, viewHeight);
  if (!resolved) return null;

  const { world, scale } = resolved;
  modelGroup.position.set(world.x, world.y, world.z);
  modelGroup.scale.set(scale, scale, scale);
  return resolved;
}

/** Continue rotating forward (same direction as scroll) to the next flat angle. */
export function forwardFlatRotationY(currentY: number): number {
  const tau = Math.PI * 2;
  const normalized = ((currentY % tau) + tau) % tau;
  if (normalized < 0.04) return currentY;
  return currentY + (tau - normalized);
}
