/**
 * Renders /public/images/nav-logo-fallback.png — nav GLB at rotation 0.
 * Requires: npm install -D playwright && npx playwright install chromium
 * Run: node scripts/generate-nav-logo-fallback.mjs
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SIZE = 144;
const MODEL_PATH = path.join(root, 'public/logo-mark.glb');
const OUT_PATH = path.join(root, 'public/images/nav-logo-fallback.png');

const CAPTURE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <script type="importmap">
  {
    "imports": {
      "three": "/three.module.js",
      "three/addons/": "/three/examples/jsm/"
    }
  }
  </script>
</head>
<body style="margin:0;background:transparent">
  <canvas id="c" width="${SIZE}" height="${SIZE}"></canvas>
  <script type="module">
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    const TARGET_SIZE = 1.65;
    const canvas = document.getElementById('c');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(${SIZE}, ${SIZE}, false);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 2.8);

    scene.add(new THREE.HemisphereLight(0xfff0e0, 0x202838, 0.65));
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const key = new THREE.DirectionalLight(0xfff4e0, 2.2);
    key.position.set(2.5, 3, 2);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xff6010, 1.6);
    rim.position.set(-2, -1, -2.5);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0x4060ff, 0.35);
    fill.position.set(0, -2.5, 1.5);
    scene.add(fill);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    function tuneMaterials(root) {
      root.traverse((obj) => {
        if (!obj.isMesh) return;
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const material of materials) {
          if (!material) continue;
          material.side = THREE.DoubleSide;
          if (material.isMeshStandardMaterial) {
            material.envMapIntensity = 0;
            material.roughness = Math.min(Math.max(material.roughness, 0.45), 1);
            material.metalness = Math.min(material.metalness, 0.55);
          }
          material.needsUpdate = true;
        }
      });
    }

    const gltf = await new GLTFLoader().loadAsync('/logo-mark.glb');
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    gltf.scene.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    gltf.scene.scale.setScalar(TARGET_SIZE / maxDim);
    tuneMaterials(gltf.scene);
    modelGroup.add(gltf.scene);
    modelGroup.rotation.y = 0;

    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    window.__navFallbackDone = true;
  </script>
</body>
</html>`;

function resolveAsset(urlPath) {
  if (urlPath === '/three.module.js' || urlPath === '/three.core.js') {
    return path.join(root, 'node_modules/three/build', path.basename(urlPath));
  }
  if (urlPath.startsWith('/three/examples/jsm/')) {
    return path.join(root, 'node_modules', urlPath.slice(1));
  }
  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url ?? '/').split('?')[0];

  if (urlPath === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(CAPTURE_HTML);
    return;
  }

  if (urlPath === '/logo-mark.glb') {
    res.writeHead(200, { 'Content-Type': 'model/gltf-binary' });
    fs.createReadStream(MODEL_PATH).pipe(res);
    return;
  }

  const asset = resolveAsset(urlPath);
  if (asset && fs.existsSync(asset)) {
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    fs.createReadStream(asset).pipe(res);
    return;
  }

  res.writeHead(404).end('Not found');
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});

const { port } = server.address();

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: SIZE, height: SIZE },
    deviceScaleFactor: 1,
  });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__navFallbackDone === true, { timeout: 30_000 });

  const canvas = page.locator('#c');
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  await canvas.screenshot({ path: OUT_PATH, omitBackground: true });
  await browser.close();
  console.log(`Wrote ${OUT_PATH}`);
} finally {
  server.close();
}
