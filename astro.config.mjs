// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kalenyoung.co.uk',

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