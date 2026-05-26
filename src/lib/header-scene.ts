import {
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { cloneLogoModel } from './logo-gltf-cache';
import { attachNavScrollLoop, type NavScrollLogoHandle } from './nav-logo-scroll';

const TARGET_SIZE = 1.65;

export type HeaderSceneHandle = NavScrollLogoHandle;

function tuneMaterials(root: Group) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const material of materials) {
      if (!material) continue;
      material.side = DoubleSide;
      if (material instanceof MeshStandardMaterial) {
        material.envMapIntensity = 0;
        material.roughness = Math.min(Math.max(material.roughness, 0.45), 1);
        material.metalness = Math.min(material.metalness, 0.55);
      }
      material.needsUpdate = true;
    }
  });
}

/** Standalone nav logo (no preloader) — loads its own GLB. */
export async function createHeaderScene(
  canvas: HTMLCanvasElement,
  host: HTMLElement
): Promise<HeaderSceneHandle | null> {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 2.8);

  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.outputColorSpace = SRGBColorSpace;

  scene.add(new HemisphereLight(0xfff0e0, 0x202838, 0.65));
  scene.add(new AmbientLight(0xffffff, 0.35));

  const key = new DirectionalLight(0xfff4e0, 2.2);
  key.position.set(2.5, 3, 2);
  scene.add(key);

  const rim = new DirectionalLight(0xff6010, 1.6);
  rim.position.set(-2, -1, -2.5);
  scene.add(rim);

  const fill = new DirectionalLight(0x4060ff, 0.35);
  fill.position.set(0, -2.5, 1.5);
  scene.add(fill);

  const modelGroup = new Group();
  scene.add(modelGroup);

  let disposed = false;
  let loadedRoot: Group | null = null;

  try {
    const model = await cloneLogoModel(TARGET_SIZE);
    if (disposed || !model) return null;

    tuneMaterials(model);
    modelGroup.add(model);
    loadedRoot = model;
  } catch {
    renderer.dispose();
    return null;
  }

  if (!loadedRoot) return null;

  return attachNavScrollLoop({
    renderer,
    scene,
    camera,
    modelGroup,
    modelRoot: loadedRoot,
    host,
    landingRotationY: 0,
  });
}
