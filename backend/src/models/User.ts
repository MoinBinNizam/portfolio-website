import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    failedLogins: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema>;
export const User = mongoose.model('User', UserSchema);
