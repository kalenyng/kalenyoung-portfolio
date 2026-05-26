import type { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { attachNavScrollLoop, type NavScrollLogoHandle } from './nav-logo-scroll';

const HEADER_TARGET_SIZE = 1.65;
const PRELOADER_TARGET_SIZE = 2;

export interface PromoteLogoInput {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  modelGroup: Group;
  modelRoot: Group;
}

/** Move the live preloader WebGL context into the nav — no second canvas, no flash. */
export function promotePreloaderToNav(
  input: PromoteLogoInput,
  navHost: HTMLElement,
  landingRotationY: number
): NavScrollLogoHandle {
  const { renderer, scene, camera, modelGroup, modelRoot } = input;
  const canvas = renderer.domElement;

  navHost.querySelector('canvas')?.remove();
  navHost.appendChild(canvas);
  canvas.className = 'nav-brand__canvas';
  canvas.removeAttribute('id');

  const meshScale = modelRoot.scale.x;
  modelGroup.scale.set(1, 1, 1);
  modelRoot.scale.setScalar(meshScale * (HEADER_TARGET_SIZE / PRELOADER_TARGET_SIZE));

  camera.fov = 38;
  camera.position.set(0, 0, 2.8);
  camera.near = 0.1;
  camera.far = 100;

  const measureEl =
    navHost.parentElement?.classList.contains('nav-brand__logo-slot')
      ? navHost.parentElement
      : navHost;
  const rect = measureEl.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  modelGroup.position.set(0, 0, 0);
  renderer.render(scene, camera);

  return attachNavScrollLoop({
    renderer,
    scene,
    camera,
    modelGroup,
    modelRoot,
    host: navHost,
    landingRotationY,
  });
}
