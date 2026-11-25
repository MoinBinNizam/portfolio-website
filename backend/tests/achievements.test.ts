import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import * as cloudinaryConfig from '../src/config/cloudinary.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { Achievement } from '../src/models/Achievement.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Achievements CRUD Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin routes with 401', async () => {
    const res = await request(app).get('/api/admin/achievements');
    expect(res.status).toBe(401);
  });

  it('returns 422 when creating invalid achievement', async () => {
    const res = await request(app)
      .post('/api/admin/achievements')
      .set('Cookie', makeAuthCookie())
      .send({
        title: 'A',
        issuer: '',
        date: 'invalid',
      });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('filters public achievements by status and optional category', async () => {
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });
    const findSpy = vi.spyOn(Achievement, 'find').mockReturnValue({ sort } as never);

    const res = await request(app).get('/api/achievements?category=award');
    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ status: 'published', category: 'award' });
  });

  it('deletes Cloudinary image when achievement is removed', async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const lean = vi.fn().mockResolvedValue({
      _id: validId,
      image: { publicId: 'portfolio/ach-1' },
    });
    vi.spyOn(Achievement, 'findByIdAndDelete').mockReturnValue({ lean } as never);
    const deleteSpy = vi.spyOn(cloudinaryConfig, 'deleteFromCloudinary').mockResolvedValue();

    const res = await request(app)
      .delete(`/api/admin/achievements/${validId}`)
      .set('Cookie', makeAuthCookie());

    expect(res.status).toBe(200);
    expect(deleteSpy).toHaveBeenCalledWith('portfolio/ach-1');
  });
});
