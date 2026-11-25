import type { Request, Response } from 'express';
import * as blogService from './service.js';

export async function listPublic(req: Request, res: Response): Promise<void> {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const result = await blogService.listPublic({ page, limit, tag, q });
  res.json({ data: result.items, meta: result.meta });
}

export async function listTags(_req: Request, res: Response): Promise<void> {
  const tags = await blogService.listTags();
  res.json({ data: tags });
}

export async function getPublicBySlug(req: Request, res: Response): Promise<void> {
  const post = await blogService.getBySlugPublic(String(req.params.slug));
  res.json({ data: post });
}

export async function listAdmin(req: Request, res: Response): Promise<void> {
  const status =
    req.query.status === 'draft' ||
    req.query.status === 'published' ||
    req.query.status === 'scheduled'
      ? req.query.status
      : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const items = await blogService.listAdmin({ status, q });
  res.json({ data: items });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const post = await blogService.get(String(req.params.id));
  res.json({ data: post });
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  const created = await blogService.create(req.body);
  res.status(201).json({ data: created });
}

export async function updateAdmin(req: Request, res: Response): Promise<void> {
  const updated = await blogService.update(String(req.params.id), req.body);
  res.json({ data: updated });
}

export async function publishAdmin(req: Request, res: Response): Promise<void> {
  const updated = await blogService.publish(String(req.params.id));
  res.json({ data: updated });
}

export async function unpublishAdmin(req: Request, res: Response): Promise<void> {
  const updated = await blogService.unpublish(String(req.params.id));
  res.json({ data: updated });
}

export async function removeAdmin(req: Request, res: Response): Promise<void> {
  await blogService.remove(String(req.params.id));
  res.json({ data: { deleted: true } });
}
