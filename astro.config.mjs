// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

/** Canonical deploy URL — set SITE_URL in Vercel (e.g. https://kalenyoung.co.uk). Trailing slash is stripped. */
const site =
  process.env.SITE_URL?.replace(/\/$/, '') ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
  site,

  vite: {
    define: {
      __PREVIEW_BUILD__: JSON.stringify(process.env.VERCEL_ENV === 'preview'),
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['sharp'],
    },
    ssr: {
      external: ['sharp'],
    },
  },

  integrations: [react(), sitemap()],
});