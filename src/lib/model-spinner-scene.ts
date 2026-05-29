import {
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = '/logo-mark.glb';
const DEFAULT_TARGET_SIZE = 1.65;

export interface ModelSpinnerHandle {
  dispose: () => void;
}

export async function createModelSpinnerScene(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  targetSize = DEFAULT_TARGET_SIZE
): Promise<ModelSpinnerHandle | null> {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  canvas.setAttribute('aria-hidden', 'true');

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 2.6;

  scene.add(new AmbientLight(0xffffff, 0.7));
  const key = new DirectionalLight(0xffffff, 0.9);
  key.position.set(2, 2, 3);
  scene.add(key);

  const modelGroup = new Group();
  scene.add(modelGroup);

  let rafId = 0;
  let disposed = false;
  let loadedScene: Group | null = null;
  let startedAt = 0;

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const renderFrame = (time: number) => {
    if (!startedAt) startedAt = time;
    const elapsed = (time - startedAt) / 1000;
    modelGroup.rotation.y = elapsed * Math.PI * 1.2;
    renderer.render(scene, camera);
  };

  const tick = (time: number) => {
    rafId = 0;
    if (document.visibilityState !== 'hidden') renderFrame(time);
    if (!reduced && !disposed) rafId = requestAnimationFrame(tick);
  };

  const startLoop = () => {
    resize();
    renderFrame(performance.now());
    if (!reduced) rafId = requestAnimationFrame(tick);
  };

  resize();

  try {
    const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
    if (disposed) return null;

    const box = new Box3().setFromObject(gltf.scene);
    const center = new Vector3();
    const size = new Vector3();
    box.getCenter(center);
    box.getSize(size);

    gltf.scene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    gltf.scene.scale.setScalar(targetSize / maxDim);

    modelGroup.add(gltf.scene);
    loadedScene = gltf.scene;
    startLoop();
  } catch {
    renderer.dispose();
    return null;
  }

  const ro = new ResizeObserver(resize);
  ro.observe(host);

  return {
    dispose: () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      loadedScene?.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        obj.geometry?.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach((m) => m.dispose());
      });
      renderer.dispose();
    },
  };
}
