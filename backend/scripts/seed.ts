import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { Achievement } from '../src/models/Achievement.js';
import { Certification } from '../src/models/Certification.js';
import { Education } from '../src/models/Education.js';
import { Experience } from '../src/models/Experience.js';
import { Post } from '../src/models/Post.js';
import { Profile } from '../src/models/Profile.js';
import { Project } from '../src/models/Project.js';
import { Service } from '../src/models/Service.js';
import { Skill } from '../src/models/Skill.js';
import { Testimonial } from '../src/models/Testimonial.js';

function stripUnderscoreKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!key.startsWith('_')) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function normalizeTodo(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toUpperCase().startsWith('TODO:')) {
    return null;
  }
  return trimmed;
}

async function seed(): Promise<void> {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const seedPath = path.resolve(here, '../../content/seed.json');
  const raw = await fs.readFile(seedPath, 'utf-8');
  const data = JSON.parse(raw) as Record<string, unknown>;

  await connectDatabase();

  if (data.profile && typeof data.profile === 'object') {
    const profileData = stripUnderscoreKeys(data.profile as Record<string, unknown>);
    profileData.phone = normalizeTodo(profileData.phone);
    profileData.resumeUrl = normalizeTodo(profileData.resumeUrl);
    await Profile.deleteMany({});
    await Profile.create(profileData);
    console.log('Seeded profile');
  }

  const collections: Array<{
    key: string;
    model: {
      deleteMany: (filter: Record<string, unknown>) => Promise<unknown>;
      insertMany: (docs: Record<string, unknown>[]) => Promise<unknown>;
    };
  }> = [
    { key: 'experience', model: Experience },
    { key: 'education', model: Education },
    { key: 'certifications', model: Certification },
    { key: 'achievements', model: Achievement },
    { key: 'projects', model: Project },
    { key: 'skills', model: Skill },
    { key: 'services', model: Service },
    { key: 'testimonials', model: Testimonial },
    { key: 'posts', model: Post },
  ];

  for (const { key, model } of collections) {
    const rawList = data[key];
    if (!Array.isArray(rawList)) continue;
    await model.deleteMany({});
    const docs = rawList
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
      .map((item) => stripUnderscoreKeys(item));
    if (docs.length > 0) {
      await model.insertMany(docs);
    }
    console.log(`Seeded ${key}: ${docs.length} items`);
  }

  await disconnectDatabase();
}

void seed();
