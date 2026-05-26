/** @deprecated Use nav-logo-controller — kept for Preloader import path. */
export {
  adoptNavLogoHandle,
  initNavLogoController as bootStandaloneNavLogo,
} from './nav-logo-controller';

export function isIntroSkipped(): boolean {
  return !document.documentElement.classList.contains('loading');
}
