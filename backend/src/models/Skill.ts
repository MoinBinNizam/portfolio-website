import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'ai', 'tools', 'design', 'cms'],
      default: 'frontend',
    },
    level: { type: Number, min: 1, max: 5, default: 3 },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true },
);

SkillSchema.index({ status: 1, order: 1 });

export type SkillDoc = InferSchemaType<typeof SkillSchema>;
export const Skill = (mongoose.models.Skill ||
  mongoose.model('Skill', SkillSchema)) as mongoose.Model<SkillDoc>;
