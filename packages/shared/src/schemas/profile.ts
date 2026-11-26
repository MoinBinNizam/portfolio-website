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

export const CvReferenceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(160),
  organization: z.string().trim().max(160).optional().default(''),
  email: z.string().trim().email().max(160).or(z.literal('')).optional().default(''),
  phone: z.string().trim().max(40).optional().default(''),
});

export const FontSettingsSchema = z.object({
  headingFont: z.string().trim().max(80).optional().default('Michroma'),
  bodyFont: z.string().trim().max(80).optional().default('Michroma'),
  h1Font: z.string().trim().max(80).optional().default('Michroma'),
  h2Font: z.string().trim().max(80).optional().default('Michroma'),
  h3Font: z.string().trim().max(80).optional().default('Michroma'),
  h4Font: z.string().trim().max(80).optional().default('Michroma'),
  h5Font: z.string().trim().max(80).optional().default('Michroma'),
  h6Font: z.string().trim().max(80).optional().default('Michroma'),
  paragraphFont: z.string().trim().max(80).optional().default('Michroma'),
  customFontUrl: z.string().trim().max(500).optional().default(''),
  customFontName: z.string().trim().max(80).optional().default(''),
  sectionFonts: z.record(z.string().max(40), z.string().max(80)).optional().default({}),
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
  cvPhone: z.string().trim().max(40).optional().nullable(),
  currentAddress: z.string().trim().max(240).optional().nullable(),
  permanentAddress: z.string().trim().max(240).optional().nullable(),
  references: z.array(CvReferenceSchema).max(5).optional().default([]),
  resumeUrl: OptionalUrlSchema,
  avatar: ImageSchema.optional().nullable(),
  socials: SocialLinksSchema.default({}),
  fonts: FontSettingsSchema.optional(),
});

export const ProfileUpdateSchema = ProfileInputSchema.partial();

export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type CvReference = z.infer<typeof CvReferenceSchema>;
export type FontSettings = z.infer<typeof FontSettingsSchema>;
export type ProfileInput = z.infer<typeof ProfileInputSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
