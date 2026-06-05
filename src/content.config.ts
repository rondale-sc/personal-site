import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    status: z.enum(['active', 'completed', 'archived']),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
  }),
});

const radio = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/interests/radio' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    callsign: z.string().optional(),
    band: z.string().optional(),
    mode: z.string().optional(),
  }),
});

const reading = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/interests/reading' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(['want-to-read', 'reading', 'finished']),
    genre: z.string(),
    year: z.number(),
    rating: z.number().min(1).max(5).optional(),
  }),
});

export const collections = { projects, radio, reading };
