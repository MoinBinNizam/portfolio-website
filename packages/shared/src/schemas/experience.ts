import { z } from 'zod';
import { IsoDateStringSchema, OptionalUrlSchema, StatusSchema } from './common.js';

export const EmploymentTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'internship']);

export const ExperienceBaseSchema = z.object({
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  employmentType: EmploymentTypeSchema.default('full-time'),
  location: z.string().trim().max(120).optional().default(''),
  companyUrl: OptionalUrlSchema,
  startDate: IsoDateStringSchema,
  endDate: IsoDateStringSchema.nullable().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().max(5000).optional().default(''),
  achievements: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
  techStack: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  order: z.number().int().min(0).default(0),
  status: StatusSchema.default('draft'),
});

export const ExperienceInputSchema = ExperienceBaseSchema.superRefine((data, ctx) => {
  if (!data.isCurrent && data.endDate) {
    if (Date.parse(data.endDate) < Date.parse(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'End date must be on or after start date',
      });
    }
  }
});

export const ExperienceUpdateSchema = ExperienceBaseSchema.partial().superRefine((data, ctx) => {
  if (!data.isCurrent && data.startDate && data.endDate) {
    if (Date.parse(data.endDate) < Date.parse(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'End date must be on or after start date',
      });
    }
  }
});

export type EmploymentType = z.infer<typeof EmploymentTypeSchema>;
export type ExperienceInput = z.infer<typeof ExperienceInputSchema>;
export type ExperienceUpdate = z.infer<typeof ExperienceUpdateSchema>;
