import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { ImageSubSchema } from './Image.js';

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true, maxlength: 160 },
    degree: { type: String, required: true, maxlength: 140 },
    field: { type: String, default: '', maxlength: 140 },
    grade: { type: String, default: '', maxlength: 60 },
    startYear: { type: Number, default: null },
    endYear: { type: Number, default: null },
    activities: { type: String, default: '', maxlength: 4000 },
    logo: { type: ImageSubSchema, default: null },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true },
);

EducationSchema.index({ status: 1, order: 1 });

export type EducationDoc = InferSchemaType<typeof EducationSchema>;
export const Education = (mongoose.models.Education ||
  mongoose.model('Education', EducationSchema)) as mongoose.Model<EducationDoc>;
