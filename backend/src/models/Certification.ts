import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { FileAssetSubSchema } from './Image.js';

const CertificationSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 150 },
    issuer: { type: String, required: true, maxlength: 120 },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, default: null },
    credentialId: { type: String, default: '', maxlength: 120 },
    credentialUrl: { type: String, default: null },
    certificateFile: { type: FileAssetSubSchema, default: null },
    skills: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true },
);

CertificationSchema.index({ status: 1, order: 1 });

export type CertificationDoc = InferSchemaType<typeof CertificationSchema>;
export const Certification = mongoose.model('Certification', CertificationSchema);
