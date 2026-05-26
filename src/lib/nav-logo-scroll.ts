import {
  Group,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

export interface NavScrollLogoInput {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  modelGroup: Group;
  modelRoot: Group;
  host: HTMLElement;
  landingRotationY: number;
}

export interface NavScrollLogoHandle {
  renderOnce: () => void;
  reattach: (host: HTMLElement) => void;
  refresh: () => void;
  getCanvas: () => HTMLCanvasElement;
  dispose: () => void;
}

const ROTATION_STORAGE_KEY = 'portfolio-nav-logo-rotation-y';
const TAU = Math.PI * 2;
const LARGE_ROTATION_DELTA = 0.45;

function readStoredRotationY(): number | null {
  try {
    const raw = sessionStorage.getItem(ROTATION_STORAGE_KEY);
    if (raw == null) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function storeRotationY(value: number): void {
  try {
    sessionStorage.setItem(ROTATION_STORAGE_KEY, String(value));
  } catch {
    /* ignore */
  }
}

function shortestAngleDelta(from: number, to: number): number {
  let delta = to - from;
  delta = ((delta + Math.PI) % TAU + TAU) % TAU - Math.PI;
  return delta;
}

function lerpAngle(from: number, to: number, t: number): number {
  return from + shortestAngleDelta(from, to) * t;
}

function getScrollRotationRange(): number {
  return window.location.pathname.startsWith('/projects/') ? Math.PI : TAU;
}

function targetRotationY(
  baseRotationY: number,
  scrollProgress: number,
  scrollRotationRange = getScrollRotationRange()
): number {
  return baseRotationY + scrollProgress * scrollRotationRange;
}

function rotationSmoothing(delta: number): number {
  return Math.abs(delta) > LARGE_ROTATION_DELTA ? 0.1 : 0.28;
}

export function attachNavScrollLoop(input: NavScrollLogoInput): NavScrollLogoHandle {
  const { renderer, scene, camera, modelGroup, modelRoot, host: initialHost, landingRotationY } =
    input;
  let host = initialHost;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  let baseRotationY = landingRotationY;
  let scrollProgress = 0;
  let rafId = 0;
  let disposed = false;

  const resize = () => {
    const measureEl =
      host.parentElement?.classList.contains('nav-brand__logo-slot') ? host.parentElement : host;
    const rect = measureEl.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const updateScroll = () => {
    const main = document.getElementById('main');
    if (!main) {
      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / docHeight));
      return;
    }

    const rect = main.getBoundingClientRect();
    const scrollable = Math.max(main.offsetHeight - window.innerHeight, 1);
    scrollProgress = Math.min(1, Math.max(0, -rect.top / scrollable));
  };

  updateScroll();
  let currentRotationY =
    readStoredRotationY() ?? targetRotationY(baseRotationY, scrollProgress);

  const renderFrame = () => {
    const targetY = targetRotationY(baseRotationY, scrollProgress);

    if (reduced) {
      currentRotationY = targetY;
    } else {
      const delta = shortestAngleDelta(currentRotationY, targetY);
      currentRotationY = lerpAngle(currentRotationY, targetY, rotationSmoothing(delta));
    }

    modelGroup.rotation.y = currentRotationY;
    renderer.render(scene, camera);
  };

  const tick = () => {
    rafId = 0;
    if (document.visibilityState !== 'hidden') {
      updateScroll();
      renderFrame();
    }
    if (!reduced && !disposed) rafId = requestAnimationFrame(tick);
  };

  const persistRotation = () => {
    storeRotationY(currentRotationY);
  };

  const refresh = () => {
    updateScroll();
    resize();
    renderFrame();
  };

  resize();
  renderFrame();
  if (!reduced) rafId = requestAnimationFrame(tick);

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pagehide', persistRotation);
  document.addEventListener('astro:page-load', refresh);

  const ro = new ResizeObserver(resize);
  ro.observe(host);

  return {
    renderOnce: renderFrame,
    reattach: (newHost: HTMLElement) => {
      if (disposed) return;

      const canvas = renderer.domElement;
      canvas.className = 'nav-brand__canvas';

      if (host === newHost && canvas.parentElement === newHost) {
        resize();
        renderFrame();
        return;
      }

      ro.disconnect();
      host = newHost;

      for (const child of [...newHost.children]) {
        if (child !== canvas) child.remove();
      }

      if (canvas.parentElement !== newHost) newHost.appendChild(canvas);

      ro.observe(host);
      resize();
      renderFrame();
    },
    getCanvas: () => renderer.domElement,
    refresh,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      persistRotation();
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pagehide', persistRotation);
      document.removeEventListener('astro:page-load', refresh);
      modelRoot.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        obj.geometry?.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach((m) => m.dispose());
      });
      renderer.dispose();
    },
  };
}
