import { z } from 'zod';
import { StatusSchema } from './common.js';

export const SkillCategorySchema = z.enum([
  'frontend',
  'backend',
  'database',
  'tools',
  'design',
  'cms',
]);

export const SkillInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: SkillCategorySchema.default('frontend'),
  level: z.number().int().min(1).max(5).default(3),
  order: z.number().int().min(0).default(0),
  status: StatusSchema.default('draft'),
});

export const SkillUpdateSchema = SkillInputSchema.partial();

export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type SkillInput = z.infer<typeof SkillInputSchema>;
export type SkillUpdate = z.infer<typeof SkillUpdateSchema>;
