import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import * as cloudinaryConfig from '../src/config/cloudinary.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { Project } from '../src/models/Project.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Projects CRUD Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin routes with 401', async () => {
    const res = await request(app).get('/api/admin/projects');
    expect(res.status).toBe(401);
  });

  it('returns 422 on invalid slug when creating project', async () => {
    const res = await request(app)
      .post('/api/admin/projects')
      .set('Cookie', makeAuthCookie())
      .send({
        slug: 'Bad Slug!',
        title: 'Test Project',
        summary: 'A summary that is at least ten characters long.',
        description: 'A description that is at least ten characters long.',
      });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('filters public projects to published items only', async () => {
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });
    const findSpy = vi.spyOn(Project, 'find').mockReturnValue({ sort } as never);

    const res = await request(app).get('/api/projects?category=fullstack');
    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ status: 'published', category: 'fullstack' });
  });

  it('deletes cover and gallery images when project is removed', async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const lean = vi.fn().mockResolvedValue({
      _id: validId,
      cover: { publicId: 'local:cover.webp' },
      gallery: [{ publicId: 'local:shot-1.webp' }],
    });
    vi.spyOn(Project, 'findByIdAndDelete').mockReturnValue({ lean } as never);
    const deleteSpy = vi.spyOn(cloudinaryConfig, 'deleteFromCloudinary').mockResolvedValue();

    const res = await request(app)
      .delete(`/api/admin/projects/${validId}`)
      .set('Cookie', makeAuthCookie());

    expect(res.status).toBe(200);
    expect(deleteSpy).toHaveBeenCalledWith('local:cover.webp');
    expect(deleteSpy).toHaveBeenCalledWith('local:shot-1.webp');
  });
});
