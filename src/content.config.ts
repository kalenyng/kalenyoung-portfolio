import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: () =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      role: z.string(),
      year: z.number(),
      featured: z.boolean().default(false),
      flagship: z.boolean().default(false),
      tech: z.array(z.string()),
      cover: z.string().startsWith('/'),
      coverAlt: z.string().optional(),
      coverPosition: z.string().optional(),
      liveUrl: z.url().optional(),
      repoUrl: z.url().optional(),
    }),
});

export const collections = {
  projects,
};
