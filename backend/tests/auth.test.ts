import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { User } from '../src/models/User.js';

describe('Auth Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/auth/me returns 401 when anonymous', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/login sets httpOnly cookie on valid credentials', async () => {
    const hash = await bcrypt.hash('secret1234', 4);
    const save = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(User, 'findOne').mockResolvedValue({
      _id: 'owner-1',
      email: 'moinuddinpkt@gmail.com',
      passwordHash: hash,
      failedLogins: 0,
      lockedUntil: null,
      save,
    } as never);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'moinuddinpkt@gmail.com', password: 'secret1234' });

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('moinuddinpkt@gmail.com');
    const cookies = res.headers['set-cookie'] as unknown as string[] | undefined;
    expect(
      cookies?.some((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`) && c.includes('HttpOnly')),
    ).toBe(true);
  });

  it('locks account for 15 minutes after 5 failed password attempts', async () => {
    const hash = await bcrypt.hash('secret1234', 4);
    const save = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(User, 'findOne').mockResolvedValue({
      _id: 'owner-1',
      email: 'moinuddinpkt@gmail.com',
      passwordHash: hash,
      failedLogins: 4,
      lockedUntil: null,
      save,
    } as never);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'moinuddinpkt@gmail.com', password: 'wrongpassword' });

    expect(res.status).toBe(423);
    expect(res.body.error.code).toBe('ACCOUNT_LOCKED');
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('POST /api/auth/logout clears session cookie', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.data.loggedOut).toBe(true);
  });
});
