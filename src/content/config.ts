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

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    location: z.string(),
    category: z.string(),
    excerpt: z.string().max(280),
    image: z.string(),
    ctaLabel: z.string(),
    ctaUrl: z.string(),
    altCtaLabel: z.string().optional(),
    altCtaUrl: z.string().optional(),
  }),
});

export const collections = { news, events };
