import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('API Health & Error Handling', () => {
  const app = createApp();

  it('GET /api/health returns 200 with standard envelope', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
    expect(typeof res.body.data.timestamp).toBe('string');
  });

  it('GET /api/unknown returns 404 with standard error envelope', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
