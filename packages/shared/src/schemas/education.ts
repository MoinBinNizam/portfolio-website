import { z } from 'zod';
import { ImageSchema, StatusSchema } from './common.js';

export const EducationBaseSchema = z.object({
  institution: z.string().trim().min(2).max(160),
  degree: z.string().trim().min(2).max(140),
  field: z.string().trim().max(140).optional().default(''),
  grade: z.string().trim().max(60).optional().default(''),
  startYear: z.number().int().min(1950).max(2100).nullable().optional(),
  endYear: z.number().int().min(1950).max(2100).nullable().optional(),
  activities: z.string().trim().max(4000).optional().default(''),
  logo: ImageSchema.nullable().optional(),
  order: z.number().int().min(0).default(0),
  status: StatusSchema.default('draft'),
});

export const EducationInputSchema = EducationBaseSchema.superRefine((data, ctx) => {
  if (
    data.startYear !== null &&
    data.startYear !== undefined &&
    data.endYear !== null &&
    data.endYear !== undefined &&
    data.endYear < data.startYear
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endYear'],
      message: 'End year must be greater than or equal to start year',
    });
  }
});

export const EducationUpdateSchema = EducationBaseSchema.partial().superRefine((data, ctx) => {
  if (
    data.startYear !== null &&
    data.startYear !== undefined &&
    data.endYear !== null &&
    data.endYear !== undefined &&
    data.endYear < data.startYear
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endYear'],
      message: 'End year must be greater than or equal to start year',
    });
  }
});

export type EducationInput = z.infer<typeof EducationInputSchema>;
export type EducationUpdate = z.infer<typeof EducationUpdateSchema>;
