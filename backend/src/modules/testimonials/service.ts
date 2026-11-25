import type { TestimonialInput, TestimonialUpdate } from '@portfolio/shared';
import mongoose from 'mongoose';
import { deleteFromCloudinary } from '../../config/cloudinary.js';
import { Testimonial } from '../../models/Testimonial.js';
import { httpError } from '../../utils/httpError.js';

export interface TestimonialFilter {
  status?: 'draft' | 'published';
  q?: string;
}

export async function list(filter: TestimonialFilter = {}) {
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { company: { $regex: escaped, $options: 'i' } },
      { quote: { $regex: escaped, $options: 'i' } },
    ];
  }
  return Testimonial.find(query).sort({ order: 1, createdAt: -1 }).lean();
}

export async function get(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Testimonial not found');
  }
  const item = await Testimonial.findById(id).lean();
  if (!item) throw httpError(404, 'NOT_FOUND', 'Testimonial not found');
  return item;
}

export async function create(data: TestimonialInput) {
  const doc = await Testimonial.create(data);
  return doc.toObject();
}

export async function update(id: string, data: TestimonialUpdate) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Testimonial not found');
  }
  const updated = await Testimonial.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) throw httpError(404, 'NOT_FOUND', 'Testimonial not found');
  return updated;
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Testimonial not found');
  }
  const deleted = await Testimonial.findByIdAndDelete(id).lean();
  if (!deleted) throw httpError(404, 'NOT_FOUND', 'Testimonial not found');
  if (deleted.avatar?.publicId) {
    await deleteFromCloudinary(deleted.avatar.publicId);
  }
  return deleted;
}

export async function reorder(ids: string[]) {
  const ops = ids.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
  }));
  if (ops.length > 0) await Testimonial.bulkWrite(ops);
  return list();
}
