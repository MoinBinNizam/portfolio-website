import { z } from 'zod';

export const StatusSchema = z.enum(['draft', 'published']);
export type ContentStatus = z.infer<typeof StatusSchema>;

export const PostStatusSchema = z.enum(['draft', 'published', 'scheduled']);
export type PostStatus = z.infer<typeof PostStatusSchema>;

export const ImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1).max(255),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(100),
});
export type ImageAsset = z.infer<typeof ImageSchema>;

export const FileAssetSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().min(1).max(200),
});
export type FileAsset = z.infer<typeof FileAssetSchema>;

export const IsoDateStringSchema = z
  .string()
  .refine((val) => !Number.isNaN(Date.parse(val)), { message: 'Invalid ISO date string' });

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const ReorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});
export type ReorderInput = z.infer<typeof ReorderSchema>;

export const OptionalUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .or(z.literal(''))
  .optional()
  .nullable();
