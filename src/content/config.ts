import { defineCollection, z } from 'astro:content';

// Colección de eventos (peregrinaciones, talleres, etc.)
const events = defineCollection({
  type: 'content',
  // De momento aceptamos cualquier frontmatter para no bloquearte
  schema: z.any(),
});

// Colección de devocional / contenido espiritual si la usamos más adelante
const devocional = defineCollection({
  type: 'content',
  schema: z.any(),
});

export const collections = {
  events,
  devocional,
};
