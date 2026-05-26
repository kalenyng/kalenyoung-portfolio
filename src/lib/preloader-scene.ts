import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = '/logo-mark.glb';
const TARGET_SIZE = 2;
/** Original 220px-tall canvas — camera distance scales with viewport to keep logo ~220px on screen. */
const REFERENCE_VIEW_HEIGHT = 220;
const BASE_CAMERA_Z = 3.6;

function applyViewportCalibration(camera: PerspectiveCamera, viewHeight: number) {
  camera.position.z = BASE_CAMERA_Z * (viewHeight / REFERENCE_VIEW_HEIGHT);
}

export interface PreloaderSceneHandle {
  modelGroup: Group;
  modelRoot: Group;
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  renderFrame: () => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

function tuneMaterials(root: Group) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const material of materials) {
      if (!material) continue;
      material.side = DoubleSide;
      material.depthWrite = true;
      material.polygonOffset = true;
      material.polygonOffsetFactor = 1;
      material.polygonOffsetUnits = 1;

      if (material instanceof MeshStandardMaterial) {
        material.envMapIntensity = 0;
        material.roughness = Math.min(Math.max(material.roughness, 0.45), 1);
        material.metalness = Math.min(material.metalness, 0.55);
      }

      material.needsUpdate = true;
    }
  });
}

/** World Y so the model sits fully below the bottom edge of the viewport. */
export function computeRiseStartY(camera: PerspectiveCamera, modelRadius = 1.05): number {
  const vFov = (camera.fov * Math.PI) / 180;
  const halfH = Math.tan(vFov / 2) * camera.position.z;
  return -(halfH + modelRadius);
}

export async function createPreloaderScene(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): Promise<PreloaderSceneHandle | null> {
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
  const camera = new PerspectiveCamera(36, width / height, 0.2, 120);
  applyViewportCalibration(camera, height);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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
  modelGroup.rotation.y = Math.PI * 3;
  scene.add(modelGroup);

  let disposed = false;
  let loadedRoot: Group | null = null;

  const resize = (nextWidth: number, nextHeight: number) => {
    const w = Math.max(1, Math.floor(nextWidth));
    const h = Math.max(1, Math.floor(nextHeight));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    applyViewportCalibration(camera, h);
    camera.updateProjectionMatrix();
  };

  const renderFrame = () => {
    renderer.render(scene, camera);
  };

  resize(width, height);

  try {
    const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
    if (disposed) return null;

    const box = new Box3().setFromObject(gltf.scene);
    const center = new Vector3();
    const size = new Vector3();
    box.getCenter(center);
    box.getSize(size);

    gltf.scene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z, 0.0001);
    gltf.scene.scale.setScalar(TARGET_SIZE / maxDim);

    tuneMaterials(gltf.scene);
    modelGroup.add(gltf.scene);
    loadedRoot = gltf.scene;

    const modelRadius = maxDim > 0 ? (TARGET_SIZE / maxDim) * (maxDim / 2) : 1.05;
    modelGroup.position.y = computeRiseStartY(camera, modelRadius);
    renderFrame();
  } catch {
    renderer.dispose();
    return null;
  }

  return {
    modelGroup,
    modelRoot: loadedRoot!,
    scene,
    camera,
    renderer,
    renderFrame,
    resize,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      loadedRoot?.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        obj.geometry?.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach((m) => m.dispose());
      });
      renderer.dispose();
    },
  };
}
