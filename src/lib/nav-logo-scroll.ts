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
  getCanvas: () => HTMLCanvasElement;
  dispose: () => void;
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

  const renderFrame = () => {
    modelGroup.rotation.y = baseRotationY + scrollProgress * Math.PI * 2;
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

  resize();
  updateScroll();
  renderFrame();
  if (!reduced) rafId = requestAnimationFrame(tick);

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', resize, { passive: true });

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
    dispose: () => {
      if (disposed) return;
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', resize);
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
