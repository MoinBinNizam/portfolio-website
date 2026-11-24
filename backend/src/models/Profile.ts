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
    resumeUrl: { type: String, default: null },
    avatar: { type: ImageSubSchema, default: null },
    socials: { type: SocialsSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type ProfileDoc = InferSchemaType<typeof ProfileSchema>;
export const Profile = mongoose.model('Profile', ProfileSchema);
