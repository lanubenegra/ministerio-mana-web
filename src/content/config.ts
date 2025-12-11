import { defineCollection, z } from 'astro:content';

// 🟣 Eventos: peregrinaciones, congresos, mujeres, campus, etc.
const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(), // usamos string para hacerlo sencillo
    category: z.enum([
      'peregrinacion',
      'evento',
      'mujeres',
      'campus',
      'devocional',
    ]),
    summary: z.string(),
    location: z.string(),
    heroImage: z.string().optional(),
    brochurePdf: z.string().optional(),
    highlight: z.boolean().optional(), // para destacar en home
  }),
});

// 🟣 Noticias / historias para SEO
const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    image: z.string().optional(),
    category: z.enum(['general', 'testimonio', 'mujeres', 'campus']).optional(),
  }),
});

export const collections = {
  events,
  news,
};
