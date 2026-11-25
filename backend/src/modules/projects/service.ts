import type { ProjectInput, ProjectUpdate } from '@portfolio/shared';
import mongoose from 'mongoose';
import { deleteFromCloudinary } from '../../config/cloudinary.js';
import { Project } from '../../models/Project.js';
import { httpError } from '../../utils/httpError.js';

export interface ProjectFilter {
  status?: 'draft' | 'published';
  category?: string;
  featured?: boolean;
  q?: string;
}

export async function list(filter: ProjectFilter = {}) {
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.category && filter.category.trim()) query.category = filter.category.trim();
  if (filter.featured !== undefined) query.featured = filter.featured;
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { summary: { $regex: escaped, $options: 'i' } },
      { techStack: { $regex: escaped, $options: 'i' } },
    ];
  }
  return Project.find(query).sort({ order: 1, createdAt: -1 }).lean();
}

export async function getBySlugPublic(slug: string) {
  const item = await Project.findOne({ slug, status: 'published' }).lean();
  if (!item) throw httpError(404, 'NOT_FOUND', 'Project not found');
  return item;
}

export async function get(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Project not found');
  }
  const item = await Project.findById(id).lean();
  if (!item) throw httpError(404, 'NOT_FOUND', 'Project not found');
  return item;
}

export async function create(data: ProjectInput) {
  const existing = await Project.findOne({ slug: data.slug }).lean();
  if (existing) {
    throw httpError(409, 'CONFLICT', 'A project with this slug already exists');
  }
  const doc = await Project.create(data);
  return doc.toObject();
}

export async function update(id: string, data: ProjectUpdate) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Project not found');
  }
  if (data.slug) {
    const conflict = await Project.findOne({ slug: data.slug, _id: { $ne: id } }).lean();
    if (conflict) {
      throw httpError(409, 'CONFLICT', 'A project with this slug already exists');
    }
  }
  const updated = await Project.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) throw httpError(404, 'NOT_FOUND', 'Project not found');
  return updated;
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Project not found');
  }
  const deleted = await Project.findByIdAndDelete(id).lean();
  if (!deleted) throw httpError(404, 'NOT_FOUND', 'Project not found');

  const idsToDelete: string[] = [];
  if (deleted.cover?.publicId) idsToDelete.push(deleted.cover.publicId);
  for (const img of deleted.gallery ?? []) {
    if (img.publicId) idsToDelete.push(img.publicId);
  }
  await Promise.all(idsToDelete.map((pid) => deleteFromCloudinary(pid)));
  return deleted;
}

export async function reorder(ids: string[]) {
  const ops = ids.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
  }));
  if (ops.length > 0) await Project.bulkWrite(ops);
  return list();
}
