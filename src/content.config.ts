import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string().optional(),
    project: z.string().optional(),
    interest: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    thumbnail: z.string().optional(),
    // radio-specific
    callsign: z.string().optional(),
    band: z.string().optional(),
    mode: z.string().optional(),
    // flexible extension
    meta: z.record(z.string(), z.unknown()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    status: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    thumbnail: z.string().optional(),
  }),
});

// Non-recursive glob — only top-level .md files, not the dogs/ subdirectory
const interests = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/interests' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
  }),
});

const dogs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/interests/dogs' }),
  schema: z.object({
    name: z.string(),
    status: z.enum(['current', 'past']),
    photos: z.array(z.string()),
    born: z.string().optional(),
    breed: z.string().optional(),
  }),
});

export const collections = { posts, projects, interests, dogs };
