import { Box3, Group, Vector3 } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = '/logo-mark.glb';

let gltfPromise: Promise<GLTF> | null = null;

function loadGltf(): Promise<GLTF> {
  if (!gltfPromise) {
    gltfPromise = new GLTFLoader().loadAsync(MODEL_URL);
  }
  return gltfPromise;
}

/** Start fetching the GLB as early as possible (e.g. before the nav slot mounts). */
export function preloadLogoModel(): Promise<void> {
  return loadGltf().then(() => undefined).catch(() => undefined);
}

/** Cached parse; each caller gets a fresh clone for its own scene graph. */
export async function cloneLogoModel(targetSize: number): Promise<Group | null> {
  try {
    const gltf = await loadGltf();
    const root = gltf.scene.clone(true);

    const box = new Box3().setFromObject(root);
    const center = new Vector3();
    const size = new Vector3();
    box.getCenter(center);
    box.getSize(size);

    root.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    root.scale.setScalar(targetSize / maxDim);

    return root;
  } catch {
    return null;
  }
}
