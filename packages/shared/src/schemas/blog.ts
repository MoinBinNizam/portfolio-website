import { z } from 'zod';
import { ImageSchema, IsoDateStringSchema, PostStatusSchema } from './common.js';

export const PostSeoSchema = z.object({
  metaTitle: z.string().trim().max(70).optional().default(''),
  metaDescription: z.string().trim().max(160).optional().default(''),
  ogImage: ImageSchema.nullable().optional(),
});

export const PostInputSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().trim().min(10).max(240),
  body: z.string().trim().min(20).max(50000),
  coverImage: ImageSchema.nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  category: z.string().trim().min(1).max(60).default('engineering'),
  status: PostStatusSchema.default('draft'),
  publishedAt: IsoDateStringSchema.nullable().optional(),
  scheduledAt: IsoDateStringSchema.nullable().optional(),
  seo: PostSeoSchema.default({}),
  featured: z.boolean().default(false),
});

export const PostUpdateSchema = PostInputSchema.partial();

export type PostSeo = z.infer<typeof PostSeoSchema>;
export type PostInput = z.infer<typeof PostInputSchema>;
export type PostUpdate = z.infer<typeof PostUpdateSchema>;
