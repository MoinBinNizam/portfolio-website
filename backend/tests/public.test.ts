import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { Experience } from '../src/models/Experience.js';
import { Profile } from '../src/models/Profile.js';
import { Project } from '../src/models/Project.js';

function mockLeanChain<T>(result: T) {
  const lean = vi.fn().mockResolvedValue(result);
  const sort = vi.fn().mockReturnValue({ lean });
  return { sort, lean };
}

describe('Public Read Endpoints', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/profile returns published profile in standard envelope', async () => {
    const lean = vi.fn().mockResolvedValue({ name: 'Moin Uddin', headline: 'MERN Developer' });
    vi.spyOn(Profile, 'findOne').mockReturnValue({ lean } as never);

    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Moin Uddin');
  });

  it('GET /api/experience filters strictly to published status', async () => {
    const chain = mockLeanChain([{ company: 'TechVelly', role: 'Developer', status: 'published' }]);
    const findSpy = vi.spyOn(Experience, 'find').mockReturnValue(chain as never);

    const res = await request(app).get('/api/experience');
    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ status: 'published' });
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /api/projects/:slug returns 404 when project is missing or draft', async () => {
    const lean = vi.fn().mockResolvedValue(null);
    const findOneSpy = vi.spyOn(Project, 'findOne').mockReturnValue({ lean } as never);

    const res = await request(app).get('/api/projects/draft-project');
    expect(res.status).toBe(404);
    expect(findOneSpy).toHaveBeenCalledWith({ slug: 'draft-project', status: 'published' });
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
