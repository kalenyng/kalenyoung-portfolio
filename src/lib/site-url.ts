/** Resolved at build time for astro.config and shared SEO constants. */
export function getSiteUrl(): string {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:4321';
}

export const personSchemaLinks = {
  github: 'https://github.com/kalenyng',
  linkedin: 'https://www.linkedin.com/in/kalen-young',
} as const;
