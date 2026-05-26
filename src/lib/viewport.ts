/** Match CardNav / global.css mobile breakpoint. */
export const MOBILE_MQ = '(max-width: 768px)';

/** Desktop effects: BorderGlow, LineWaves, Three.js nav mark. */
export const DESKTOP_MQ = '(min-width: 769px)';

export const DESKTOP_HOVER_MQ = '(min-width: 769px) and (hover: hover)';

export function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches;
}

export function isDesktopViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(DESKTOP_MQ).matches;
}
