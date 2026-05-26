export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isDesktopMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
