import type { NavScrollLogoHandle } from './nav-logo-scroll';
import { preloadLogoModel } from './logo-gltf-cache';

declare global {
  interface Window {
    __navLogoHandle?: NavScrollLogoHandle;
    __navLogoBoot?: Promise<NavScrollLogoHandle | null>;
  }
}

const HOST_SELECTOR = '[data-nav-brand-scene]';

function findHost(): HTMLElement | null {
  return document.querySelector<HTMLElement>(HOST_SELECTOR);
}

function setState(host: HTMLElement, state: 'idle' | 'loading' | 'ready' | 'failed') {
  host.dataset.navLogoState = state;
  if (state === 'ready') {
    document.documentElement.classList.add('nav-logo-ready');
  }
}

async function waitForStableSlot(host: HTMLElement): Promise<void> {
  for (let i = 0; i < 60; i++) {
    const slot = host.parentElement?.classList.contains('nav-brand__logo-slot')
      ? host.parentElement
      : host;
    const rect = slot.getBoundingClientRect();
    if (rect.width >= 16 && rect.height >= 16) return;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}

function mountHandle(handle: NavScrollLogoHandle, host: HTMLElement, instant = false): void {
  if (instant) {
    host.dataset.navLogoHandoff = 'true';
  }

  handle.reattach(host);
  handle.renderOnce();
  setState(host, 'ready');

  if (instant) {
    host.style.opacity = '1';
    host.style.visibility = 'visible';
    requestAnimationFrame(() => {
      delete host.dataset.navLogoHandoff;
    });
  }

  window.dispatchEvent(new CustomEvent('nav-logo:ready', { detail: { handle } }));
}

async function createStandalone(host: HTMLElement): Promise<NavScrollLogoHandle | null> {
  if (window.__navLogoHandle) {
    mountHandle(window.__navLogoHandle, host);
    return window.__navLogoHandle;
  }

  if (window.__navLogoBoot) {
    const handle = await window.__navLogoBoot;
    if (handle) mountHandle(handle, host);
    return handle;
  }

  setState(host, 'loading');
  await waitForStableSlot(host);

  window.__navLogoBoot = (async () => {
    const canvas = document.createElement('canvas');
    canvas.className = 'nav-brand__canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    const { createHeaderScene } = await import('./header-scene');
    const handle = await createHeaderScene(canvas, host);
    if (!handle) {
      setState(host, 'failed');
      return null;
    }

    window.__navLogoHandle = handle;
    return handle;
  })();

  const handle = await window.__navLogoBoot;
  if (handle) mountHandle(handle, host);
  return handle;
}

/** Load GLB into the nav slot (intro already seen). */
export async function initNavLogoController(): Promise<NavScrollLogoHandle | null> {
  if (document.documentElement.classList.contains('loading')) return null;

  const host = findHost();
  if (!host) return null;

  if (host.dataset.navLogoState === 'ready' && window.__navLogoHandle) {
    mountHandle(window.__navLogoHandle, host);
    return window.__navLogoHandle;
  }

  return createStandalone(host);
}

/** Preloader handoff — register promoted WebGL context. */
export function adoptNavLogoHandle(handle: NavScrollLogoHandle, host?: HTMLElement): void {
  window.__navLogoHandle = handle;
  window.__navLogoBoot = Promise.resolve(handle);

  const target = host ?? findHost();
  if (!target) return;

  mountHandle(handle, target, true);
}

let controllerSetup = false;

export function setupNavLogoController(): void {
  if (controllerSetup) return;
  controllerSetup = true;

  const run = () => {
    const host = findHost();
    if (host?.dataset.navLogoState === 'ready' && window.__navLogoHandle) return;
    void initNavLogoController();
  };

  if (document.documentElement.classList.contains('preloader-seen')) {
    void preloadLogoModel();
    void import('./header-scene');
  }

  const onPageLoad = () => {
    if (document.documentElement.classList.contains('loading')) return;

    const host = findHost();
    if (!host) return;

    if (window.__navLogoHandle) {
      mountHandle(window.__navLogoHandle, host);
      window.__navLogoHandle.refresh();
      return;
    }

    if (host.dataset.navLogoState === 'failed') {
      host.dataset.navLogoState = 'idle';
      window.__navLogoBoot = undefined;
    }

    void initNavLogoController();
  };

  run();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  }

  document.addEventListener('astro:page-load', onPageLoad);
  window.addEventListener('preloader:landed', run, { once: false });
  window.addEventListener('preloader:handoff', run, { once: false });
}
