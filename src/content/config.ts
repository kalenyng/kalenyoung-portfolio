import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    cover: z.string(),
    tags: z.array(z.string()),
    tech: z.array(z.string()),
    url: z.string().optional(),
    repo: z.string().optional(),
    featured: z.boolean().default(false),
    isPrivate: z.boolean().default(false),
  }),
});

export const collections = {
  'case-studies': caseStudies,
};

