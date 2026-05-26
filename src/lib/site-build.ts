/** Set at build time via astro.config.mjs `vite.define`. */
declare const __PREVIEW_BUILD__: boolean;

export const isPreviewBuild = typeof __PREVIEW_BUILD__ !== 'undefined' && __PREVIEW_BUILD__;
