import type { ExperienceInput, ExperienceUpdate } from '@portfolio/shared';
import mongoose from 'mongoose';
import { Experience } from '../../models/Experience.js';
import { httpError } from '../../utils/httpError.js';

export interface ExperienceFilter {
  status?: 'draft' | 'published';
  q?: string;
}

export async function list(filter: ExperienceFilter = {}) {
  const query: Record<string, unknown> = {};
  if (filter.status) {
    query.status = filter.status;
  }
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { company: { $regex: escaped, $options: 'i' } },
      { role: { $regex: escaped, $options: 'i' } },
    ];
  }
  return Experience.find(query).sort({ order: 1, startDate: -1 }).lean();
}

export async function get(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Experience entry not found');
  }
  const item = await Experience.findById(id).lean();
  if (!item) {
    throw httpError(404, 'NOT_FOUND', 'Experience entry not found');
  }
  return item;
}

export async function create(data: ExperienceInput) {
  const doc = await Experience.create({
    ...data,
    startDate: new Date(data.startDate),
    endDate: data.isCurrent || !data.endDate ? null : new Date(data.endDate),
  });
  return doc.toObject();
}

export async function update(id: string, data: ExperienceUpdate) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Experience entry not found');
  }
  const patch: Record<string, unknown> = { ...data };
  if (data.startDate !== undefined) {
    patch.startDate = new Date(data.startDate);
  }
  if (data.isCurrent) {
    patch.endDate = null;
  } else if (data.endDate !== undefined) {
    patch.endDate = data.endDate ? new Date(data.endDate) : null;
  }

  const updated = await Experience.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) {
    throw httpError(404, 'NOT_FOUND', 'Experience entry not found');
  }
  return updated;
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Experience entry not found');
  }
  const deleted = await Experience.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw httpError(404, 'NOT_FOUND', 'Experience entry not found');
  }
  return deleted;
}

export async function reorder(ids: string[]) {
  const ops = ids.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }));
  if (ops.length > 0) {
    await Experience.bulkWrite(ops);
  }
  return list();
}
