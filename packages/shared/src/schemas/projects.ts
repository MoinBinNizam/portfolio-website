import { z } from 'zod';
import { ImageSchema, OptionalUrlSchema, StatusSchema } from './common.js';

export const ProjectCategorySchema = z.enum([
  'fullstack',
  'frontend',
  'backend',
  'wordpress',
  'marketing',
]);

export const ProjectInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().trim().min(2).max(150),
  summary: z.string().trim().min(10).max(300),
  category: ProjectCategorySchema.default('fullstack'),
  description: z.string().trim().min(10).max(5000),
  caseStudy: z.string().trim().max(20000).optional().default(''),
  cover: ImageSchema.nullable().optional(),
  gallery: z.array(ImageSchema).max(12).default([]),
  techStack: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  liveUrl: OptionalUrlSchema,
  repoUrl: OptionalUrlSchema,
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: StatusSchema.default('draft'),
});

export const ProjectUpdateSchema = ProjectInputSchema.partial();

export type ProjectCategory = z.infer<typeof ProjectCategorySchema>;
export type ProjectInput = z.infer<typeof ProjectInputSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
