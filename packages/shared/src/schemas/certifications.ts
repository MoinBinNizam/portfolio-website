import { z } from 'zod';
import { FileAssetSchema, IsoDateStringSchema, OptionalUrlSchema, StatusSchema } from './common.js';

export const CertificationBaseSchema = z.object({
  title: z.string().trim().min(2).max(150),
  issuer: z.string().trim().min(2).max(120),
  issueDate: IsoDateStringSchema,
  expiryDate: IsoDateStringSchema.nullable().optional(),
  credentialId: z.string().trim().max(120).optional().default(''),
  credentialUrl: OptionalUrlSchema,
  certificateFile: FileAssetSchema.nullable().optional(),
  skills: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  order: z.number().int().min(0).default(0),
  status: StatusSchema.default('draft'),
});

export const CertificationInputSchema = CertificationBaseSchema.superRefine((data, ctx) => {
  if (data.expiryDate && Date.parse(data.expiryDate) <= Date.parse(data.issueDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['expiryDate'],
      message: 'Expiry date must be after issue date',
    });
  }
});

export const CertificationUpdateSchema = CertificationBaseSchema.partial().superRefine(
  (data, ctx) => {
    if (
      data.issueDate &&
      data.expiryDate &&
      Date.parse(data.expiryDate) <= Date.parse(data.issueDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expiryDate'],
        message: 'Expiry date must be after issue date',
      });
    }
  },
);

export type CertificationInput = z.infer<typeof CertificationInputSchema>;
export type CertificationUpdate = z.infer<typeof CertificationUpdateSchema>;
