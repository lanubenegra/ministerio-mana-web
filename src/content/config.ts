import { defineCollection, z } from 'astro:content';

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    location: z.string(),
    category: z.enum(['evento','peregrinacion','conferencia','mujeres']).default('evento'),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    ctaLabel: z.string().default('Registrarme'),
    ctaUrl: z.string().url().optional()
  })
});

// si tienes otras colecciones, como devocional/news, déjalas:
const devocional = defineCollection({ /* ... */ });
// …

export const collections = { news };
