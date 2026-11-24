import { z } from 'zod';
import { ImageSchema, StatusSchema } from './common.js';

export const TestimonialInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(120),
  company: z.string().trim().max(120).optional().default(''),
  quote: z.string().trim().min(10).max(1500),
  rating: z.number().int().min(1).max(5).default(5),
  avatar: ImageSchema.nullable().optional(),
  verified: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: StatusSchema.default('draft'),
});

export const TestimonialUpdateSchema = TestimonialInputSchema.partial();

export type TestimonialInput = z.infer<typeof TestimonialInputSchema>;
export type TestimonialUpdate = z.infer<typeof TestimonialUpdateSchema>;
