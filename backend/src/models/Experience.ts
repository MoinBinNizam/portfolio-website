import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true, maxlength: 120 },
    role: { type: String, required: true, maxlength: 120 },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
    },
    location: { type: String, default: '', maxlength: 120 },
    companyUrl: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: '', maxlength: 5000 },
    achievements: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true },
);

ExperienceSchema.index({ status: 1, order: 1 });

export type ExperienceDoc = InferSchemaType<typeof ExperienceSchema>;
export const Experience = (mongoose.models.Experience ||
  mongoose.model('Experience', ExperienceSchema)) as mongoose.Model<ExperienceDoc>;
