/**
 * Once per browser tab session (a "visit").
 * - First page load in a new tab → intro plays
 * - Reload / navigate to other pages in the same tab → skipped
 * - Close tab and return later → intro plays again
 */
export const PRELOADER_SEEN_KEY = 'portfolio-intro-v3';

export function hasSeenPreloader(): boolean {
  try {
    return sessionStorage.getItem(PRELOADER_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function markPreloaderSeen(): void {
  try {
    sessionStorage.setItem(PRELOADER_SEEN_KEY, '1');
  } catch {
    // private mode / blocked storage
  }
}

export function shouldShowPreloader(): boolean {
  if (hasSeenPreloader()) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}
