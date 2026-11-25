import type { AchievementInput, AchievementUpdate } from '@portfolio/shared';
import mongoose from 'mongoose';
import { deleteFromCloudinary } from '../../config/cloudinary.js';
import { Achievement } from '../../models/Achievement.js';
import { httpError } from '../../utils/httpError.js';

export interface AchievementFilter {
  status?: 'draft' | 'published';
  category?: string;
  q?: string;
}

export async function list(filter: AchievementFilter = {}) {
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.category && filter.category.trim()) query.category = filter.category.trim();
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { issuer: { $regex: escaped, $options: 'i' } },
    ];
  }
  return Achievement.find(query).sort({ order: 1, date: -1 }).lean();
}

export async function get(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Achievement not found');
  }
  const item = await Achievement.findById(id).lean();
  if (!item) throw httpError(404, 'NOT_FOUND', 'Achievement not found');
  return item;
}

export async function create(data: AchievementInput) {
  const doc = await Achievement.create({
    ...data,
    date: new Date(data.date),
  });
  return doc.toObject();
}

export async function update(id: string, data: AchievementUpdate) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Achievement not found');
  }
  const patch: Record<string, unknown> = { ...data };
  if (data.date !== undefined) patch.date = new Date(data.date);

  const updated = await Achievement.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) throw httpError(404, 'NOT_FOUND', 'Achievement not found');
  return updated;
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Achievement not found');
  }
  const deleted = await Achievement.findByIdAndDelete(id).lean();
  if (!deleted) throw httpError(404, 'NOT_FOUND', 'Achievement not found');
  if (deleted.image?.publicId) {
    await deleteFromCloudinary(deleted.image.publicId);
  }
  return deleted;
}

export async function reorder(ids: string[]) {
  const ops = ids.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
  }));
  if (ops.length > 0) await Achievement.bulkWrite(ops);
  return list();
}
