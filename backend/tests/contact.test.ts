import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { ContactMessage } from '../src/models/ContactMessage.js';

describe('Contact Endpoint', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin messages with 401', async () => {
    const res = await request(app).get('/api/admin/messages');
    expect(res.status).toBe(401);
  });

  it('returns 422 when contact payload is invalid', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'A',
      email: 'not-an-email',
      message: 'short',
    });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 422 when honeypot is filled', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Bot User',
      email: 'bot@example.com',
      message: 'This is a spam message from a bot.',
      honeypot: 'spam-trap',
    });
    expect(res.status).toBe(422);
  });

  it('saves valid contact message and returns 201', async () => {
    const createSpy = vi
      .spyOn(ContactMessage, 'create')
      .mockResolvedValue({ _id: 'msg-123' } as never);

    const res = await request(app).post('/api/contact').send({
      name: 'Tariq Hasan',
      email: 'tariq@example.com',
      message: 'Hello Moin, we would like to discuss a React and Node.js project.',
      honeypot: '',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.submitted).toBe(true);
    expect(res.body.data.id).toBe('msg-123');
    expect(createSpy).toHaveBeenCalledTimes(1);
  });
});
