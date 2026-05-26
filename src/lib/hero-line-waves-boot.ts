import type { LineWavesHandle } from '@/lib/line-waves';

const activeHandles = new Set<LineWavesHandle>();

const readOptions = (host: HTMLElement) => ({
  speed: Number(host.dataset.speed),
  innerLineCount: Number(host.dataset.innerLineCount),
  outerLineCount: Number(host.dataset.outerLineCount),
  warpIntensity: Number(host.dataset.warpIntensity),
  rotation: Number(host.dataset.rotation),
  edgeFadeWidth: Number(host.dataset.edgeFadeWidth),
  colorCycleSpeed: Number(host.dataset.colorCycleSpeed),
  brightness: Number(host.dataset.brightness),
  color1: host.dataset.color1,
  color2: host.dataset.color2,
  color3: host.dataset.color3,
  enableMouseInteraction: host.dataset.enableMouse === 'true',
  mouseInfluence: Number(host.dataset.mouseInfluence),
});

const mobileOptions = (options: ReturnType<typeof readOptions>) => ({
  ...options,
  innerLineCount: Math.min(options.innerLineCount, 18),
  outerLineCount: Math.min(options.outerLineCount, 20),
  enableMouseInteraction: false,
  speed: options.speed * 0.75,
  brightness: options.brightness * 0.85,
});

export function disposeHeroLineWaves(): void {
  for (const handle of activeHandles) handle.dispose();
  activeHandles.clear();
}

export async function bootHeroLineWaves(): Promise<void> {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const hosts = document.querySelectorAll<HTMLElement>('[data-line-waves]');
  if (!hosts.length) return;

  disposeHeroLineWaves();

  const { createLineWaves } = await import('@/lib/line-waves');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  hosts.forEach((host) => {
    host.replaceChildren();
    const base = readOptions(host);
    const options = isMobile ? mobileOptions(base) : base;
    const handle = createLineWaves(host, options);
    if (handle) activeHandles.add(handle);
  });
}

let bootSetup = false;

export function setupHeroLineWaves(): void {
  if (bootSetup) return;
  bootSetup = true;

  const run = () => {
    void bootHeroLineWaves();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  document.addEventListener('astro:before-preparation', disposeHeroLineWaves);
  document.addEventListener('astro:page-load', run);
  document.addEventListener('astro:after-swap', run);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) run();
  });
}
