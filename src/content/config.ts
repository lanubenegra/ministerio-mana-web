import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().max(240),
    cover: z.string().optional(), // /images/...
    author: z.string().default('Ministerio Maná'),
    lang: z.enum(['es','en']).default('es'),
    date: z.string(), // ISO
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { news };
