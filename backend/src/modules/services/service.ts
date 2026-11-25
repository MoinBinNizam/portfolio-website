import type { ServiceInput, ServiceUpdate } from '@portfolio/shared';
import mongoose from 'mongoose';
import { Service } from '../../models/Service.js';
import { httpError } from '../../utils/httpError.js';

export interface ServiceFilter {
  status?: 'draft' | 'published';
  q?: string;
}

export async function list(filter: ServiceFilter = {}) {
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } },
    ];
  }
  return Service.find(query).sort({ order: 1, createdAt: -1 }).lean();
}

export async function get(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Service not found');
  }
  const item = await Service.findById(id).lean();
  if (!item) throw httpError(404, 'NOT_FOUND', 'Service not found');
  return item;
}

export async function create(data: ServiceInput) {
  const doc = await Service.create(data);
  return doc.toObject();
}

export async function update(id: string, data: ServiceUpdate) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Service not found');
  }
  const updated = await Service.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) throw httpError(404, 'NOT_FOUND', 'Service not found');
  return updated;
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Service not found');
  }
  const deleted = await Service.findByIdAndDelete(id).lean();
  if (!deleted) throw httpError(404, 'NOT_FOUND', 'Service not found');
  return deleted;
}

export async function reorder(ids: string[]) {
  const ops = ids.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
  }));
  if (ops.length > 0) await Service.bulkWrite(ops);
  return list();
}
