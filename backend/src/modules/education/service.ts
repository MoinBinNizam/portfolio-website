import type { EducationInput, EducationUpdate } from '@portfolio/shared';
import mongoose from 'mongoose';
import { Education } from '../../models/Education.js';
import { httpError } from '../../utils/httpError.js';

export interface EducationFilter {
  status?: 'draft' | 'published';
  q?: string;
}

export async function list(filter: EducationFilter = {}) {
  const query: Record<string, unknown> = {};
  if (filter.status) {
    query.status = filter.status;
  }
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { institution: { $regex: escaped, $options: 'i' } },
      { degree: { $regex: escaped, $options: 'i' } },
      { field: { $regex: escaped, $options: 'i' } },
    ];
  }
  return Education.find(query).sort({ order: 1, endYear: -1 }).lean();
}

export async function get(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Education entry not found');
  }
  const item = await Education.findById(id).lean();
  if (!item) {
    throw httpError(404, 'NOT_FOUND', 'Education entry not found');
  }
  return item;
}

export async function create(data: EducationInput) {
  const doc = await Education.create(data);
  return doc.toObject();
}

export async function update(id: string, data: EducationUpdate) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Education entry not found');
  }
  const updated = await Education.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) {
    throw httpError(404, 'NOT_FOUND', 'Education entry not found');
  }
  return updated;
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Education entry not found');
  }
  const deleted = await Education.findByIdAndDelete(id).lean();
  if (!deleted) {
    throw httpError(404, 'NOT_FOUND', 'Education entry not found');
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
    await Education.bulkWrite(ops);
  }
  return list();
}
