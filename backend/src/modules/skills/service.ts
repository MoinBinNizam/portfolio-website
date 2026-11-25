import type { SkillInput, SkillUpdate } from '@portfolio/shared';
import mongoose from 'mongoose';
import { Skill } from '../../models/Skill.js';
import { httpError } from '../../utils/httpError.js';

export interface SkillFilter {
  status?: 'draft' | 'published';
  category?: string;
  q?: string;
}

export async function list(filter: SkillFilter = {}) {
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.category && filter.category.trim()) query.category = filter.category.trim();
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.name = { $regex: escaped, $options: 'i' };
  }
  return Skill.find(query).sort({ order: 1, name: 1 }).lean();
}

export async function get(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Skill not found');
  }
  const item = await Skill.findById(id).lean();
  if (!item) throw httpError(404, 'NOT_FOUND', 'Skill not found');
  return item;
}

export async function create(data: SkillInput) {
  const doc = await Skill.create(data);
  return doc.toObject();
}

export async function update(id: string, data: SkillUpdate) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Skill not found');
  }
  const updated = await Skill.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) throw httpError(404, 'NOT_FOUND', 'Skill not found');
  return updated;
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Skill not found');
  }
  const deleted = await Skill.findByIdAndDelete(id).lean();
  if (!deleted) throw httpError(404, 'NOT_FOUND', 'Skill not found');
  return deleted;
}

export async function reorder(ids: string[]) {
  const ops = ids.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
  }));
  if (ops.length > 0) await Skill.bulkWrite(ops);
  return list();
}
