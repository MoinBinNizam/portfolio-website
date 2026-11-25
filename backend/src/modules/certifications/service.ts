import type { CertificationInput, CertificationUpdate } from '@portfolio/shared';
import mongoose from 'mongoose';
import { deleteFromCloudinary } from '../../config/cloudinary.js';
import { Certification } from '../../models/Certification.js';
import { httpError } from '../../utils/httpError.js';

export interface CertificationFilter {
  status?: 'draft' | 'published';
  q?: string;
}

export async function list(filter: CertificationFilter = {}) {
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { issuer: { $regex: escaped, $options: 'i' } },
    ];
  }
  return Certification.find(query).sort({ order: 1, issueDate: -1 }).lean();
}

export async function get(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Certification not found');
  }
  const item = await Certification.findById(id).lean();
  if (!item) throw httpError(404, 'NOT_FOUND', 'Certification not found');
  return item;
}

export async function create(data: CertificationInput) {
  const doc = await Certification.create({
    ...data,
    issueDate: new Date(data.issueDate),
    expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
  });
  return doc.toObject();
}

export async function update(id: string, data: CertificationUpdate) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Certification not found');
  }
  const patch: Record<string, unknown> = { ...data };
  if (data.issueDate !== undefined) patch.issueDate = new Date(data.issueDate);
  if (data.expiryDate !== undefined) {
    patch.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
  }

  const updated = await Certification.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) throw httpError(404, 'NOT_FOUND', 'Certification not found');
  return updated;
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Certification not found');
  }
  const deleted = await Certification.findByIdAndDelete(id).lean();
  if (!deleted) throw httpError(404, 'NOT_FOUND', 'Certification not found');
  if (deleted.certificateFile?.publicId) {
    await deleteFromCloudinary(deleted.certificateFile.publicId);
  }
  return deleted;
}

export async function reorder(ids: string[]) {
  const ops = ids.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
  }));
  if (ops.length > 0) await Certification.bulkWrite(ops);
  return list();
}
