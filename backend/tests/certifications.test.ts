import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import * as cloudinaryConfig from '../src/config/cloudinary.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { Certification } from '../src/models/Certification.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Certifications CRUD Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin routes with 401', async () => {
    const res = await request(app).get('/api/admin/certifications');
    expect(res.status).toBe(401);
  });

  it('returns 422 when expiryDate is not after issueDate', async () => {
    const res = await request(app)
      .post('/api/admin/certifications')
      .set('Cookie', makeAuthCookie())
      .send({
        title: 'AWS Developer',
        issuer: 'AWS',
        issueDate: '2025-05-01',
        expiryDate: '2025-01-01',
      });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('filters public list to published items only', async () => {
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });
    const findSpy = vi.spyOn(Certification, 'find').mockReturnValue({ sort } as never);

    const res = await request(app).get('/api/certifications');
    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ status: 'published' });
  });

  it('deletes Cloudinary certificateFile when certification is removed', async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const lean = vi.fn().mockResolvedValue({
      _id: validId,
      certificateFile: { publicId: 'portfolio/cert-1' },
    });
    vi.spyOn(Certification, 'findByIdAndDelete').mockReturnValue({ lean } as never);
    const deleteSpy = vi.spyOn(cloudinaryConfig, 'deleteFromCloudinary').mockResolvedValue();

    const res = await request(app)
      .delete(`/api/admin/certifications/${validId}`)
      .set('Cookie', makeAuthCookie());

    expect(res.status).toBe(200);
    expect(deleteSpy).toHaveBeenCalledWith('portfolio/cert-1');
  });
});
