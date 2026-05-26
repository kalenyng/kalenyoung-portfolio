const DESKTOP_MQ = '(min-width: 769px)';

/** Hide inactive GlowWidgetShell branch from assistive tech (static vs BorderGlow). */
export function setupGlowWidgetA11y(): void {
  if (typeof window === 'undefined') return;

  const mq = window.matchMedia(DESKTOP_MQ);

  const sync = () => {
    document.querySelectorAll<HTMLElement>('[data-glow-shell]').forEach((shell) => {
      const staticEl = shell.querySelector<HTMLElement>('[data-glow-static]');
      const enhancedEl = shell.querySelector<HTMLElement>('[data-glow-enhanced]');
      if (!staticEl || !enhancedEl) return;

      if (mq.matches) {
        staticEl.setAttribute('aria-hidden', 'true');
        staticEl.setAttribute('inert', '');
        enhancedEl.removeAttribute('aria-hidden');
        enhancedEl.removeAttribute('inert');
      } else {
        enhancedEl.setAttribute('aria-hidden', 'true');
        enhancedEl.setAttribute('inert', '');
        staticEl.removeAttribute('aria-hidden');
        staticEl.removeAttribute('inert');
      }
    });
  };

  sync();
  mq.addEventListener('change', sync);
}
