import { z } from 'zod';
import { ImageSchema, OptionalUrlSchema } from './common.js';

export const SocialLinksSchema = z.object({
  facebook: OptionalUrlSchema,
  x: OptionalUrlSchema,
  linkedin: OptionalUrlSchema,
  instagram: OptionalUrlSchema,
  youtube: OptionalUrlSchema,
  behance: OptionalUrlSchema,
  github: OptionalUrlSchema,
});

export const ProfileInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  headline: z.string().trim().min(2).max(160),
  tagline: z.string().trim().min(2).max(200),
  intro: z.string().trim().min(10).max(2000),
  about: z.string().trim().min(10).max(10000),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().nullable(),
  officeAddress: z.string().trim().max(240).optional().nullable(),
  location: z.string().trim().max(120).optional().nullable(),
  resumeUrl: OptionalUrlSchema,
  avatar: ImageSchema.optional().nullable(),
  socials: SocialLinksSchema.default({}),
});

export const ProfileUpdateSchema = ProfileInputSchema.partial();

export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type ProfileInput = z.infer<typeof ProfileInputSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
