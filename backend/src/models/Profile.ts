import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { ImageSubSchema } from './Image.js';

const SocialsSchema = new Schema(
  {
    facebook: { type: String, default: '' },
    x: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    behance: { type: String, default: '' },
    github: { type: String, default: '' },
  },
  { _id: false },
);

const CvReferenceSubSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    title: { type: String, required: true, maxlength: 160 },
    organization: { type: String, default: '', maxlength: 160 },
    email: { type: String, default: '', maxlength: 160 },
    phone: { type: String, default: '', maxlength: 40 },
  },
  { _id: false },
);

const FontSettingsSubSchema = new Schema(
  {
    headingFont: { type: String, default: 'Michroma', maxlength: 80 },
    bodyFont: { type: String, default: 'Michroma', maxlength: 80 },
    h1Font: { type: String, default: 'Michroma', maxlength: 80 },
    h2Font: { type: String, default: 'Michroma', maxlength: 80 },
    h3Font: { type: String, default: 'Michroma', maxlength: 80 },
    h4Font: { type: String, default: 'Michroma', maxlength: 80 },
    h5Font: { type: String, default: 'Michroma', maxlength: 80 },
    h6Font: { type: String, default: 'Michroma', maxlength: 80 },
    paragraphFont: { type: String, default: 'Michroma', maxlength: 80 },
    customFontUrl: { type: String, default: '', maxlength: 500 },
    customFontName: { type: String, default: '', maxlength: 80 },
    sectionFonts: { type: Map, of: String, default: () => ({}) },
  },
  { _id: false },
);

const ProfileSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    headline: { type: String, required: true, maxlength: 160 },
    tagline: { type: String, required: true, maxlength: 200 },
    intro: { type: String, required: true, maxlength: 2000 },
    about: { type: String, required: true, maxlength: 10000 },
    email: { type: String, required: true, maxlength: 160 },
    phone: { type: String, default: null, maxlength: 40 },
    officeAddress: { type: String, default: null, maxlength: 240 },
    location: { type: String, default: null, maxlength: 120 },
    cvPhone: { type: String, default: null, maxlength: 40 },
    currentAddress: { type: String, default: null, maxlength: 240 },
    permanentAddress: { type: String, default: null, maxlength: 240 },
    references: { type: [CvReferenceSubSchema], default: [] },
    resumeUrl: { type: String, default: null },
    avatar: { type: ImageSubSchema, default: null },
    socials: { type: SocialsSchema, default: () => ({}) },
    fonts: { type: FontSettingsSubSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type ProfileDoc = InferSchemaType<typeof ProfileSchema>;
export const Profile = (mongoose.models.Profile ||
  mongoose.model('Profile', ProfileSchema)) as mongoose.Model<ProfileDoc>;
