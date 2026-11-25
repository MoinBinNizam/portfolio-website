import type { PostInput, PostUpdate } from '@portfolio/shared';
import mongoose from 'mongoose';
import { deleteFromCloudinary } from '../../config/cloudinary.js';
import { Post } from '../../models/Post.js';
import { httpError } from '../../utils/httpError.js';
import { calculateReadingTime } from '../../utils/readingTime.js';

export interface BlogListFilter {
  status?: 'draft' | 'published' | 'scheduled';
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export async function listPublic(filter: Omit<BlogListFilter, 'status'> = {}) {
  const page = Math.max(1, filter.page ?? 1);
  const limit = Math.min(50, Math.max(1, filter.limit ?? 9));
  const query: Record<string, unknown> = { status: 'published' };

  if (filter.tag && filter.tag.trim()) {
    query.tags = filter.tag.trim();
  }
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { excerpt: { $regex: escaped, $options: 'i' } },
      { tags: { $regex: escaped, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    Post.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function listTags(): Promise<string[]> {
  return Post.distinct('tags', { status: 'published' });
}

export async function getBySlugPublic(slug: string) {
  const post = await Post.findOne({ slug, status: 'published' }).lean();
  if (!post) throw httpError(404, 'NOT_FOUND', 'Post not found');
  return post;
}

export async function listAdmin(filter: BlogListFilter = {}) {
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.q && filter.q.trim()) {
    const escaped = filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { excerpt: { $regex: escaped, $options: 'i' } },
    ];
  }
  return Post.find(query).sort({ updatedAt: -1, createdAt: -1 }).lean();
}

export async function get(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Post not found');
  }
  const post = await Post.findById(id).lean();
  if (!post) throw httpError(404, 'NOT_FOUND', 'Post not found');
  return post;
}

export async function create(data: PostInput) {
  const existing = await Post.findOne({ slug: data.slug }).lean();
  if (existing) {
    throw httpError(409, 'CONFLICT', 'A post with this slug already exists');
  }
  const readingTime = calculateReadingTime(data.body);
  const publishedAt =
    data.status === 'published'
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : new Date()
      : null;

  const doc = await Post.create({
    ...data,
    readingTime,
    publishedAt,
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
  });
  return doc.toObject();
}

export async function update(id: string, data: PostUpdate) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Post not found');
  }
  if (data.slug) {
    const conflict = await Post.findOne({ slug: data.slug, _id: { $ne: id } }).lean();
    if (conflict) {
      throw httpError(409, 'CONFLICT', 'A post with this slug already exists');
    }
  }
  const patch: Record<string, unknown> = { ...data };
  if (data.body !== undefined) {
    patch.readingTime = calculateReadingTime(data.body);
  }
  if (data.status === 'published' && data.publishedAt === undefined) {
    patch.publishedAt = new Date();
  }
  if (data.scheduledAt !== undefined) {
    patch.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
  }

  const updated = await Post.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) throw httpError(404, 'NOT_FOUND', 'Post not found');
  return updated;
}

export async function publish(id: string) {
  return update(id, { status: 'published', publishedAt: new Date().toISOString() });
}

export async function unpublish(id: string) {
  return update(id, { status: 'draft' });
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Post not found');
  }
  const deleted = await Post.findByIdAndDelete(id).lean();
  if (!deleted) throw httpError(404, 'NOT_FOUND', 'Post not found');
  if (deleted.coverImage?.publicId) {
    await deleteFromCloudinary(deleted.coverImage.publicId);
  }
  return deleted;
}
