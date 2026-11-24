import { z } from 'zod';
import { ImageSchema, IsoDateStringSchema, OptionalUrlSchema, StatusSchema } from './common.js';

export const AchievementCategorySchema = z.enum([
  'award',
  'competition',
  'publication',
  'speaking',
  'other',
]);

export const AchievementInputSchema = z.object({
  title: z.string().trim().min(2).max(150),
  category: AchievementCategorySchema.default('other'),
  issuer: z.string().trim().min(2).max(120),
  date: IsoDateStringSchema,
  description: z.string().trim().max(4000).optional().default(''),
  link: OptionalUrlSchema,
  image: ImageSchema.nullable().optional(),
  order: z.number().int().min(0).default(0),
  status: StatusSchema.default('draft'),
});

export const AchievementUpdateSchema = AchievementInputSchema.partial();

export type AchievementCategory = z.infer<typeof AchievementCategorySchema>;
export type AchievementInput = z.infer<typeof AchievementInputSchema>;
export type AchievementUpdate = z.infer<typeof AchievementUpdateSchema>;
