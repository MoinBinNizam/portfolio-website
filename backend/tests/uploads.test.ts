import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as cloudinaryConfig from '../src/config/cloudinary.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { createApp } from '../src/app.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Uploads Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous upload with 401', async () => {
    const res = await request(app).post('/api/admin/uploads');
    expect(res.status).toBe(401);
  });

  it('rejects spoofed MIME / invalid magic bytes with 422', async () => {
    const fakePng = Buffer.from('NOT_A_PNG_FILE_CONTENT_12345');
    const res = await request(app)
      .post('/api/admin/uploads')
      .set('Cookie', makeAuthCookie())
      .attach('file', fakePng, { filename: 'bad.png', contentType: 'image/png' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('UPLOAD_ERROR');
  });

  it('uploads valid PNG buffer after magic-byte check', async () => {
    vi.spyOn(cloudinaryConfig, 'uploadBufferToCloudinary').mockResolvedValue({
      url: 'https://res.cloudinary.com/demo/image/upload/v1/cert.webp',
      publicId: 'portfolio/cert',
      width: 1200,
      height: 800,
      mimeType: 'image/webp',
    });

    const validPng = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ]);
    const res = await request(app)
      .post('/api/admin/uploads')
      .set('Cookie', makeAuthCookie())
      .field('alt', 'Certificate scan')
      .attach('file', validPng, { filename: 'cert.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    expect(res.body.data.publicId).toBe('portfolio/cert');
    expect(res.body.data.alt).toBe('Certificate scan');
  });

  it('falls back to local storage and cleans up when Cloudinary is not configured', async () => {
    const validWebp = Buffer.from('RIFF\x00\x00\x00\x00WEBP', 'binary');
    const res = await request(app)
      .post('/api/admin/uploads')
      .set('Cookie', makeAuthCookie())
      .field('alt', 'Portrait')
      .attach('file', validWebp, { filename: 'portrait.webp', contentType: 'image/webp' });

    expect(res.status).toBe(201);
    expect(res.body.data.publicId).toMatch(/^local:/);
    expect(res.body.data.url).toContain('/uploads/');

    await cloudinaryConfig.deleteFromCloudinary(res.body.data.publicId);
  });
});
