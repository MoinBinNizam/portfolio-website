import { z } from 'zod';
import { StatusSchema } from './common.js';

export const ServiceInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  summary: z.string().trim().min(10).max(300),
  description: z.string().trim().max(4000).optional().default(''),
  deliverables: z.array(z.string().trim().min(1).max(200)).max(15).default([]),
  order: z.number().int().min(0).default(0),
  status: StatusSchema.default('draft'),
});

export const ServiceUpdateSchema = ServiceInputSchema.partial();

export type ServiceInput = z.infer<typeof ServiceInputSchema>;
export type ServiceUpdate = z.infer<typeof ServiceUpdateSchema>;
